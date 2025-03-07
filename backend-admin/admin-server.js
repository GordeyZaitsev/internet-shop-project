const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8080;

// ✅ Исправленный путь к products.json
const PRODUCTS_FILE = path.join(__dirname, "../backend-user/products.json");

app.use(cors());
app.use(bodyParser.json());

// Функция чтения товаров
const readProducts = () => {
    if (!fs.existsSync(PRODUCTS_FILE)) return []; // ✅ Если файла нет, возвращаем пустой массив
    try {
        const data = fs.readFileSync(PRODUCTS_FILE, "utf-8");
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Ошибка чтения файла:", error);
        return [];
    }
};

// Функция записи товаров
const writeProducts = (products) => {
    try {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    } catch (error) {
        console.error("Ошибка записи файла:", error);
    }
};

// Получение списка товаров
app.get("/products", (req, res) => {
    res.json(readProducts());
});

// Добавление нового товара
app.post("/products", (req, res) => {
    const products = readProducts();
    const newProduct = { id: Date.now(), ...req.body };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

// Редактирование товара по ID
app.put("/products/:id", (req, res) => {
    const products = readProducts();
    const productIndex = products.findIndex(p => p.id == req.params.id);
    
    if (productIndex === -1) {
        return res.status(404).json({ error: "Товар не найден" });
    }

    products[productIndex] = { ...products[productIndex], ...req.body };
    writeProducts(products);
    res.json(products[productIndex]);
});

// Удаление товара по ID
app.delete("/products/:id", (req, res) => {
    let products = readProducts();
    const newProducts = products.filter(p => p.id != req.params.id);

    if (products.length === newProducts.length) {
        return res.status(404).json({ error: "Товар не найден" });
    }

    writeProducts(newProducts);
    res.status(204).send();
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Админ-сервер запущен на http://localhost:${PORT}`);
});
