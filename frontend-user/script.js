document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/products")
        .then(response => response.json())
        .then(products => renderProducts(products))
        .catch(error => console.error("Ошибка загрузки товаров:", error));
});

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
        `;

        container.appendChild(card);
    });
}

