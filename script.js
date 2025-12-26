const products = [
  {
    id: 1,
    name: "Neon Pulse Headset",
    price: 129.99,
    category: "wearable",
    image: "images/headset.png",
  },
  {
    id: 2,
    name: "Void Striker Mouse",
    price: 79.99,
    category: "peripheral",
    image: "images/mouse.png",
  },
  {
    id: 3,
    name: "Mech-X RGB Keyboard",
    price: 159.5,
    category: "peripheral",
    image: "images/keyboard.png",
  },
  {
    id: 4,
    name: "Oculus VR System",
    price: 299.0,
    category: "gadget",
    image: "images/visor.png",
  },
  {
    id: 5,
    name: "Titan Smart Watch",
    price: 199.99,
    category: "wearable",
    image: "images/watch.png",
  },
  {
    id: 6,
    name: "Cyber Sneakers",
    price: 89.99,
    category: "wearable",
    image: "images/sneakers.png",
  },
];

const icons = {
  sun: `<img src="https://img.icons8.com/ios-glyphs/30/ffffff/sun--v1.png" alt="Light Mode">`,
  moon: `<img src="https://img.icons8.com/ios-glyphs/30/ffffff/moon-symbol.png" alt="Dark Mode">`,
  cart: `<img src="https://img.icons8.com/ios-glyphs/30/ffffff/shopping-cart.png" alt="Cart">`,
};

// State
let cart = JSON.parse(localStorage.getItem("myCart")) || [];
let theme = localStorage.getItem("ddw_theme") || "light";

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  updateThemeIcon();

  // Render Products if on Shop Page
  if (document.getElementById("productsGrid")) {
    renderProducts(products);
  }

  updateCartIcon();
  setupListeners();
});

function toggleTheme() {
  theme = theme === "light" ? "dark" : "light";
  localStorage.setItem("ddw_theme", theme);
  document.body.classList.toggle("dark-mode");
  updateThemeIcon();
}

function updateThemeIcon() {
  const iconSpan = document.getElementById("themeIcon");
  if (iconSpan) {
    iconSpan.innerHTML = theme === "light" ? icons.moon : icons.sun;
  }
}

// Mobile Nav
function toggleMobileMenu() {
  const mobileNav = document.getElementById("mobileNav");
  mobileNav.classList.toggle("open");
}

//  Shop Logic
function renderProducts(list) {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = '<p class="no-products">No products found.</p>';
    return;
  }

  list.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.animationDelay = `${index * 0.1}s`;
    card.innerHTML = `
            <img src="${product.image}" alt="${
      product.name
    }" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-btn" onclick="addToCart(${
                  product.id
                })">Add to Cart</button>
            </div>
        `;
    grid.appendChild(card);
  });
}

function filterProducts(category) {
  if (category === "all") {
    renderProducts(products);
  } else {
    const filtered = products.filter((p) => p.category === category);
    renderProducts(filtered);
  }
}

//  Cart Logic
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartIcon();
  showToast(`${product.name} added!`);
}

function increaseQty(id) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.qty++;
    saveCart();
    updateCartIcon();
    renderCartItems();
  }
}

function decreaseQty(id) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    if (item.qty > 1) {
      item.qty--;
    } else {
      cart = cart.filter((i) => i.id !== id);
    }
    saveCart();
    updateCartIcon();
    renderCartItems();
  }
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  updateCartIcon();
  renderCartItems();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartIcon();
  renderCartItems();
  showToast("Cart cleared");
}

function checkout() {
  if (cart.length === 0) {
    showToast("Cart is empty!");
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  if (confirm(`Checkout for $${total.toFixed(2)}?`)) {
    cart = [];
    saveCart();
    updateCartIcon();
    toggleCart();
    showToast("Order placed successfully!");
  }
}

function saveCart() {
  localStorage.setItem("myCart", JSON.stringify(cart));
}

// UI Updates
function updateCartIcon() {
  const btn = document.getElementById("cartBtn");
  if (btn) {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const badgeDisplay = count > 0 ? "flex" : "none";
    btn.innerHTML = `${icons.cart} <span id="cartCount" class="badge" style="display:${badgeDisplay}">${count}</span>`;
  }
}

function renderCartItems() {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!container) return;

  container.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML =
      '<p style="text-align:center; color: var(--text-color);">Cart is empty.</p>';
  } else {
    cart.forEach((item) => {
      total += item.price * item.qty;
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-controls">
                        <button class="qty-btn" onclick="decreaseQty(${
                          item.id
                        })">-</button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="qty-btn" onclick="increaseQty(${
                          item.id
                        })">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${
                  item.id
                })" class="remove-item-btn" title="Remove Item">×</button>
            `;
      container.appendChild(div);
    });
  }

  if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
}

// --- Sidebar Toggles ---
function toggleCart() {
  const sidebar = document.getElementById("cartSidebar");
  if (sidebar) {
    sidebar.classList.toggle("open");
    if (sidebar.classList.contains("open")) {
      renderCartItems();
    }
  }
}

// --- Event Listeners ---
function setupListeners() {
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.removeEventListener("click", toggleTheme);
    themeToggle.addEventListener("click", toggleTheme);
  }

  document
    .getElementById("hamburger")
    ?.addEventListener("click", toggleMobileMenu);

  const cartBtn = document.getElementById("cartBtn");
  if (cartBtn) {
    cartBtn.removeEventListener("click", toggleCart);
    cartBtn.addEventListener("click", toggleCart);
  }

  document.getElementById("closeCart")?.addEventListener("click", toggleCart);

  document.getElementById("searchInput")?.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(term)
    );
    renderProducts(filtered);
  });
}

function handleContact(e) {
  e.preventDefault();
  showToast("Message Sent!");
  e.target.reset();
}

function showToast(msg) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
