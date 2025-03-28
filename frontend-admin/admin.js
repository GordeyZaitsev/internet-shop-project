let socket;

document.addEventListener("DOMContentLoaded", () => {
    // Загружаем список товаров
    fetchProducts();
    setupChat(); // Настроим чат

    // Обработка формы добавления товара
    const addProductForm = document.getElementById("add-product-form");
    addProductForm.addEventListener("submit", (e) => {
        e.preventDefault();
        addProduct();
    });
});

// Функция для получения всех товаров
function fetchProducts() {
    fetch("http://localhost:8080/products")
        .then(response => response.json())
        .then(products => renderProducts(products))
        .catch(error => console.error("Ошибка загрузки товаров:", error));
}

// Функция для рендеринга списка товаров
function renderProducts(products) {
    const container = document.getElementById("products-container");
    container.innerHTML = ""; // Очищаем перед рендером

    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <h3>${product.name}</h3>
            <p><strong>Цена:</strong> ${product.price} ₽</p>
            <p>${product.description}</p>
            <p><strong>Категория:</strong> ${product.category.join(', ')}</p>
            <button class="edit-btn" onclick="editProduct(${product.id})">Редактировать</button>
            <button class="delete-btn" onclick="deleteProduct(${product.id})">Удалить</button>
        `;

        container.appendChild(card);
    });
}

// Функция для добавления товара
function addProduct() {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const category = document.getElementById("category").value.split(',');

    const newProduct = { name, price, description, category };

    fetch("http://localhost:8080/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newProduct)
    })
    .then(response => response.json())
    .then(product => {
        alert("Товар добавлен!");
        fetchProducts(); // Перезагружаем список товаров
        document.getElementById("add-product-form").reset(); // Очищаем форму
    })
    .catch(error => console.error("Ошибка добавления товара:", error));
}

// Функция для редактирования товара
function editProduct(id) {
    const name = prompt("Введите новое название товара:");
    const price = prompt("Введите новую цену товара:");
    const description = prompt("Введите новое описание товара:");
    const category = prompt("Введите новые категории товара (через запятую):").split(',');

    const updatedProduct = { name, price, description, category };

    fetch(`http://localhost:8080/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedProduct)
    })
    .then(response => response.json())
    .then(product => {
        alert("Товар обновлён!");
        fetchProducts(); // Перезагружаем список товаров
    })
    .catch(error => console.error("Ошибка редактирования товара:", error));
}

// Функция для удаления товара
function deleteProduct(id) {
    if (confirm("Вы уверены, что хотите удалить товар?")) {
        fetch(`http://localhost:8080/products/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            alert("Товар удалён!");
            fetchProducts(); // Перезагружаем список товаров
        })
        .catch(error => console.error("Ошибка удаления товара:", error));
    }
}

// === ЧАТ ===
function setupChat() {
    // Устанавливаем WebSocket соединение
    socket = new WebSocket("ws://localhost:5000");

    // Обработка входящих сообщений
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);  // Парсим JSON
        const message = data.text;  // Получаем текст сообщения
        displayMessage(message, "user");  // Показываем сообщение
    };
    

    // Отправка сообщений через WebSocket
    const messageInput = document.getElementById("chat-message-input");
    const sendButton = document.getElementById("send-message-button");

    sendButton.addEventListener("click", () => {
        const message = messageInput.value;
        if (message.trim()) {
            socket.send(message); // Отправляем сообщение
            //displayMessage("Админ: ", "admin"); // Показать сообщение от администратора
            messageInput.value = ""; // Очищаем поле ввода
        }
    });
}

// Функция для отображения сообщений в чате
function displayMessage(message, sender) {
    const chatContainer = document.getElementById("chat-messages");
    const messageElement = document.createElement("div");
    messageElement.classList.add(sender === "user" ? "user-message" : "admin-message");
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
}
