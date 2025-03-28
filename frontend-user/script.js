const getProductsQuery = `
  query {
    products {
      id
      name
      price
      description
    }
  }
`;

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  setupChat();
});

async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:3000/graphql', {  // Убедись, что URL правильный
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: getProductsQuery }),
    });
    const data = await response.json();
    renderProducts(data.data.products);  // Проверим, что приходит правильный ответ
  } catch (error) {
    console.error("Ошибка загрузки товаров:", error);
  }
}

// Функция рендеринга товаров
function renderProducts(products) {
  const productContainer = document.getElementById("products-container");
  productContainer.innerHTML = '';
  products.forEach((product) => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>Цена:</strong> ${product.price} ₽</p>
    `;
    productContainer.appendChild(productCard);
  });
}

// Функция для настройки чата
let socket;

function setupChat() {
  // Устанавливаем WebSocket соединение
  socket = new WebSocket('ws://localhost:5000'); // Подключение к серверу WebSocket

  // Обработка входящих сообщений
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);  // Парсим JSON
    const message = data.text;  // Получаем текст сообщения
    displayMessage(message, "admin");  // Показываем сообщение
};


  // Обработка ошибок
  socket.onerror = (error) => {
    console.error('WebSocket Error: ', error);
  };

  // Отправка сообщений через WebSocket
  const messageInput = document.getElementById('chat-message-input');
  const sendButton = document.getElementById('send-message-button');

  sendButton.addEventListener("click", () => {
    const message = messageInput.value;
    if (message.trim()) {
      socket.send(message);  // Отправляем сообщение
      //displayMessage("Пользователь: ", "user");  // Показать сообщение от пользователя
      messageInput.value = "";  // Очищаем поле ввода
    }
  });
}

// Функция для отображения сообщений
function displayMessage(message, sender) {
  const chatContainer = document.getElementById("chat-messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add(sender === "user" ? "user-message" : "admin-message");
  messageElement.textContent = message;
  chatContainer.appendChild(messageElement);
}
