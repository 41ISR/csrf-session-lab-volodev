const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const cors = require('cors');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true для HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 часа
    }
}));

// CSRF protection
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

// База данных
let db;

async function initDB() {
    db = await sqlite.open({
        filename: './database.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            balance INTEGER DEFAULT 1000,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('Database initialized');
}

// Проверка авторизации
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Не авторизован' });
    }
    next();
};

// Эндпоинты
app.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.get('/api/auth/check', requireAuth, (req, res) => {
    res.json({ authenticated: true });
});

app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    
    // Валидация
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Все поля обязательны' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ error: 'Пароль должен быть не менее 6 символов' });
    }
    
    try {
        const result = await db.run(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, password] // В реальном приложении хэшируйте пароль!
        );
        
        req.session.userId = result.lastID;
        res.status(201).json({ message: 'Успешная регистрация' });
    } catch (error) {
        if (error.message.includes('UNIQUE')) {
            res.status(400).json({ error: 'Пользователь с таким именем или email уже существует' });
        } else {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const user = await db.get(
            'SELECT id FROM users WHERE username = ? AND password = ?',
            [username, password]
        );
        
        if (user) {
            req.session.userId = user.id;
            res.json({ message: 'Успешный вход' });
        } else {
            res.status(401).json({ error: 'Неверные учетные данные' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Выход выполнен' });
});

const PAYOUTS = {
    '💯💯💯': 100,
    '🎓🎓🎓': 50,
    '🔥🔥🔥': 25,
    '🧠🧠🧠': 15,
    '📚📚📚': 10,
    '✏️✏️✏️': 8,
    '❌❌❌': 0,
};

const SYMBOLS = ['📚', '✏️', '🧠', '🎓', '🔥', '💯', '❌'];

function getCombinationMultiplier(symbols) {
    const combo = symbols.join('');
    return PAYOUTS[combo] || 0;
}

app.post('/api/spin', requireAuth, csrfProtection, async (req, res) => {
    const { bet, csrfToken } = req.body;
    
    if (![10, 50, 100].includes(bet)) {
        return res.status(400).json({ error: 'Недопустимая ставка' });
    }
    
    try {
        const user = await db.get(
            'SELECT balance FROM users WHERE id = ?',
            [req.session.userId]
        );
        
        if (!user || user.balance < bet) {
            return res.status(400).json({ error: 'Недостаточно баллов' });
        }
        
        const resultSymbols = Array.from(
            { length: 3 },
            () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        );
        
        const multiplier = getCombinationMultiplier(resultSymbols);
        const winAmount = multiplier * bet;
        const newBalance = user.balance - bet + winAmount;
        
        await db.run(
            'UPDATE users SET balance = ? WHERE id = ?',
            [newBalance, req.session.userId]
        );
        
        res.json({
            symbols: resultSymbols,
            winAmount,
            isWin: winAmount > 0,
            newBalance
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.get('/api/leaderboard', requireAuth, async (req, res) => {
    try {
        const leaders = await db.all(
            'SELECT username, balance FROM users ORDER BY balance DESC LIMIT 10'
        );
        res.json(leaders);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.get('/api/user', requireAuth, async (req, res) => {
    try {
        const user = await db.get(
            'SELECT username, balance FROM users WHERE id = ?',
            [req.session.userId]
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Инициализация и запуск
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});