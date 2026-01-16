#!/bin/bash

echo "🚀 Установка проекта в Codespace..."

# Установка зависимостей бэкенда
cd /workspaces/$REPO_NAME/backend
echo "📦 Устанавливаю зависимости бэкенда..."
npm install

# Установка зависимостей фронтенда
cd /workspaces/$REPO_NAME/frontend
echo "📦 Устанавливаю зависимости фронтенда..."
npm install

# Создайте базу данных
cd /workspaces/$REPO_NAME/backend
echo "🗄️ Инициализирую базу данных..."
node -e "
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
db.close();
console.log('База данных создана');
"

# Создайте тестового пользователя
cat > /workspaces/$REPO_NAME/backend/init-db.js << 'EOF'
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

async function init() {
    const db = await sqlite.open({
        filename: './database.db',
        driver: sqlite3.Database
    });

    await db.exec(\`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            balance INTEGER DEFAULT 1000,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    \`);

    // Тестовый пользователь
    try {
        await db.run(
            "INSERT OR IGNORE INTO users (username, email, password, balance) VALUES (?, ?, ?, ?)",
            ['test', 'test@test.com', 'test123', 1000]
        );
        console.log('✅ Тестовый пользователь создан: test/test123');
    } catch (e) {
        console.log('Тестовый пользователь уже существует');
    }

    await db.close();
}

init().catch(console.error);
EOF

node init-db.js

echo "✅ Установка завершена!"
echo "📁 Структура проекта:"
ls -la