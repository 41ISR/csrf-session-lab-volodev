const db = require("./db")
const csrf = require("csurf")
const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const session = require("express-session")

const app = express()

app.set("trust proxy", 1) 

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: true, 
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    exposedHeaders: ["set-cookie"]
}))
app.use(session({
    secret: "asdasdasdasdasdasd",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        name: "sessionId",
        sameSite: "none", 
        secure: true, 
        domain: undefined 
    }
}))

const csrfMiddleware = csrf({
    cookie:{
        httpOnly: false,
        sameSite: "none",
        secure: true
    }
})

app.get("/auth/check", (req, res) => {
    console.log(req.session)
    const escore = db.prepare("SELECT escore FROM users where id = ?").get(req.session.userId)?.escore || 0
    console.log(escore)
    if (req.session.userId) {
        return res.status(200).json({logged: true, user: {
            userId: req.session.userId,
            username: req.session.username,
            escore: escore || 0
        }})
    }

    return res.status(401).json({logged: false})
})

app.post("/auth/signup", (req, res) => {
    try {
        const hashed = bcrypt.hashSync(req.body.password, 10)
        const newUser = db
            .prepare(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`)
            .run(req.body.username, req.body.email, hashed);
        const createdUser = db
            .prepare(`SELECT * FROM users WHERE id = ?`)
            .get(newUser.lastInsertRowid);

            console.log(createdUser)
        req.session.userId = createdUser.id
        req.session.email = createdUser.email
        req.session.username = createdUser.username
        req.session.escore = createdUser.escore

        res.status(201).json(createdUser)
    } catch (error) {
        console.error(error)
        res.status(400).json(error.code)
    }
})

app.post("/auth/signin", (req, res) => {
    try{
        const { username, password } = req.body
        const user = db
            .prepare(`SELECT * FROM users WHERE username = ?`)
            .get(username)
        if (!user) 
            res
                .status(401)
                .json({ error: "Неправильные данные" })
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) 
            res
                .status(401)
                .json({ error: "Неправильные данные" })

        req.session.username = user.username
        req.session.userId = user.id
        req.session.escore = user.escore

        res.status(200).json(user)
    }catch (error){
        console.error(error)
        res.status(400).json(error)
    }
})

app.post("/auth/logout", (req, res) => {
    req.session.destroy((err) => {
        err && res.status(500).json({error: "Не получилось выйти"})
        res.clearCookie("sessionId")
        res.status(200).json({message: "Выход успешен"})
    })
})

const PAYOUTS = {
    '💯💯💯': 100,
    '🍇🍇🍇': 50,
    '🍌🍌🍌': 25,
    '🍒🍒🍒': 15,
    '🍑🍑🍑': 10,
    '🍏🍏🍏': 8,
    '❌❌❌': 0,
}

const SYMBOLS = ['🍑', '🍏', '🍒', '🍇', '🍌', '💯', '❌']

const SYMBOLS_CHANCE = {
    '🍑':35,
    '🍏': 25,
    '🍒': 15,
    '🍇': 10,
    '🍌': 8,
    '💯':5,
     '❌':2,}

function getCombinationMultiplier(symbols) {
    return PAYOUTS[symbols.join('')] || 0
}

function getRandomSymbols() {
    const entries=Object.entries(SYMBOLS_CHANCE)
    const total= entries.reduce((s, [, w]) => s+w, 0)

    let r = Math.random()*total

    for (const [sym, weight] of entries){
        if (r < weight) return sym
        r -=weight
    }

}


app.post("/api/spin", csrfMiddleware, (req, res) => {
    const { bet } = req.body

    if (![10, 50, 100].includes(bet)) {
        return res.status(400).json({ error: "Недопустимая ставка" })
    }

    try {
        const user = db.prepare("SELECT escore FROM users WHERE id = ?").get(req.session.userId)
        if (!user || user.escore < bet) {
            return res.status(400).json({ error: "Недостаточно баллов" })
        }

        const resultSymbols = Array.from({length: 3}, () => getRandomSymbols())


        const multiplier = getCombinationMultiplier(resultSymbols)
        const winAmount = multiplier * bet
        const newBalance = user.escore - bet + winAmount

        db.prepare("UPDATE users SET escore = ? WHERE id = ?").run(newBalance, req.session.userId)

        res.json({
            symbols: resultSymbols,
            winAmount,
            isWin: winAmount > 0,
            newBalance,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Ошибка сервера" })
    }
})

app.get("/api/leaderboard", (req, res) =>{
    const users = db.prepare("SELECT * FROM users ORDER BY escore DESC LIMIT 10").all()
    const sanitizedUsers = users.map((el) => {
        const {createdAt, password, ...newUser} = el
        return newUser
    })
    res.status(200).json(sanitizedUsers)
})

app.get("/csrf-token", csrfMiddleware, (req, res) =>{
    res.json({token: req.csrfToken()})
})

app.listen("3000", () => {
    console.log("Порт3000")
})