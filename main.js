// Elemanları seç
const productList = document.getElementById("product-list");
const cartIcon = document.getElementById("cart");
const categorySelect = document.querySelector("select");
const searchInput = document.getElementById("input");

let products = [];
let filteredProducts = [];

// Sepet ikonunu güncelle
function updateCartIcon() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (count > 0) {
    cartIcon.classList.add("has-items");
    cartIcon.setAttribute("data-count", count);
  } else {
    cartIcon.classList.remove("has-items");
    cartIcon.removeAttribute("data-count");
  }
}

// Ürünleri JSON'dan yükle
async function loadProducts() {
  try {
    const res = await fetch("products.json"); // products.json dosyan olmalı
    products = await res.json();
    filteredProducts = [...products];
    renderProducts(filteredProducts);
  } catch (error) {
    console.error("Produkte konnten nicht geladen werden:", error);
    productList.innerHTML = "<p>Produkte konnten nicht geladen werden.</p>";
  }
}

// Ürünleri DOM'a render et
function renderProducts(list) {
  productList.innerHTML = "";

  if (list.length === 0) {
    productList.innerHTML = "<p>Keine Produkte gefunden..</p>";
    return;
  }
  list.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-img">
      <h3>${product.name}</h3>
      <p>${product.price.toFixed(2)} CHF</p>
      <button class="btn-add">In den Warenkorb</button>
    `;

    // Sepete ekleme
    card.querySelector(".btn-add").addEventListener("click", (e) => {
      e.stopPropagation(); // detay yerine sadece sepete eklesin
      addToCart(product);
    });

    // Ürün detayına gitme (resim veya isme tıklayınca)
    card.querySelector(".product-img").addEventListener("click", () => showProductDetail(product));
    card.querySelector("h3").addEventListener("click", () => showProductDetail(product));

    productList.appendChild(card);
  });
}

// Ürün detayını göster
function showProductDetail(product) {
  productList.innerHTML = `
    <div class="product-detail">
      <img src="${product.image}" alt="${product.name}" class="detail-img">
      <div class="detail-info">
        <h2>${product.name}</h2>
        <p class="detail-price">${product.price.toFixed(2)} CHF</p>
        <p class="detail-desc">${product.description || "Für dieses Produkt sind keine detaillierten Informationen verfügbar."}</p>
        <button class="btn-add">In den Warenkorb</button>
        <button class="btn-back">← Züruck</button>
      </div>
    </div>
  `;

  // Sepete ekleme
  document.querySelector(".btn-add").addEventListener("click", () => addToCart(product));

  // Geri dön
  document.querySelector(".btn-back").addEventListener("click", () => {
    renderProducts(filteredProducts);
  });
}

// Sepete ekleme
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartIcon();
  animateCartIcon();
}

// Sepet ikonuna animasyon ekle
function animateCartIcon() {
  cartIcon.classList.add("shake");
  setTimeout(() => cartIcon.classList.remove("shake"), 300);
}

// Filtreleme
function applyFilters() {
  const category = categorySelect.value;
  const search = searchInput.value.toLowerCase();

  filteredProducts = products.filter(p => {
    const matchesCategory = category === "all" || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });

  renderProducts(filteredProducts);
}

// Eventler
categorySelect.addEventListener("change", applyFilters);
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") applyFilters();
});

// Sayfa yüklendiğinde
updateCartIcon();
loadProducts();
