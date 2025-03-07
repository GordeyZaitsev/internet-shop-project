const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Путь к products.json (он теперь общий для backend-user и backend-admin)
const PRODUCTS_FILE = path.join(__dirname, "products.json");

app.use(cors());

// API: Получить список товаров
app.get("/products", (req, res) => {
    fs.readFile(PRODUCTS_FILE, "utf8", (err, data) => {
        if (err) {
            console.error("Ошибка чтения файла:", err);
            return res.status(500).json({ message: "Ошибка сервера" });
        }

        try {
            const products = JSON.parse(data);
            res.json(products);
        } catch (parseError) {
            console.error("Ошибка парсинга JSON:", parseError);
            res.status(500).json({ message: "Ошибка обработки данных" });
        }
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер пользователя запущен на http://localhost:${PORT}`);
});
