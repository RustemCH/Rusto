const cartItemsContainer = document.getElementById("cart-items");
const subtotalEl = document.getElementById("subtotal");
const cartTotalEl = document.getElementById("cart-total");
const clearCartBtn = document.querySelector(".btn-clear-cart");
const checkoutBtn = document.querySelector(".btn-checkout");

// Sepeti localStorage'dan al
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Sepeti localStorage'a kaydet
function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartIcon();
  renderCart();
}

// Sepet ikonundaki sayıyı güncelle
function updateCartIcon() {
  const cartIcon = document.getElementById("cart");
  const cart = getCart();
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (count > 0) {
    cartIcon.setAttribute("data-count", count);
  } else {
    cartIcon.removeAttribute("data-count");
  }
}

// Sepeti DOM'a render et
function renderCart() {
  const cart = getCart();
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Ihr Warenkorb ist leer.</p>";
    subtotalEl.textContent = "0.00 CHF";
    cartTotalEl.textContent = "0.00 CHF";
    return;
  }

  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${item.price.toFixed(2)} CHF x ${item.quantity}</p>
        <div class="cart-item-controls">
          <button class="btn-decrease">-</button>
          <span>${item.quantity}</span>
          <button class="btn-increase">+</button>
          <button class="btn-remove"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `;

    // Miktar artır
    cartItem.querySelector(".btn-increase").addEventListener("click", () => {
      item.quantity += 1;
      setCart(cart);
    });

    // Miktar azalt
    cartItem.querySelector(".btn-decrease").addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        cart.splice(index, 1); // miktar 1 ise sil
      }
      setCart(cart);
    });

    // Ürünü sil
    cartItem.querySelector(".btn-remove").addEventListener("click", () => {
      cart.splice(index, 1);
      setCart(cart);
    });

    cartItemsContainer.appendChild(cartItem);
  });

  subtotalEl.textContent = subtotal.toFixed(2) + " CHF";
  cartTotalEl.textContent = subtotal.toFixed(2) + " CHF";
}

// Sepeti temizle
clearCartBtn.addEventListener("click", () => {
  localStorage.removeItem("cart");
  updateCartIcon();
  renderCart();
});

// Satın al butonu
checkoutBtn.addEventListener("click", () => {
  alert("Der Kaufvorgang wurde abgeschlossen!");
  localStorage.removeItem("cart");
  updateCartIcon();
  renderCart();
});

// Sayfa açılınca
updateCartIcon();
renderCart();
