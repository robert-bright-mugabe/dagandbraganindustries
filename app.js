document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('active');
    });
    // Optional: close sidebar when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('active');
  });

  // --- Add to Cart functionality (if needed for your UI) ---
  let cartCount = 0;
  const cartCountElem = document.getElementById('cart-count');
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      cartCount++;
      cartCountElem.textContent = cartCount;
    });
  });

  // Newsletter form (prevent default submit for demo)
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      if (emailInput.value) {
        alert('Thank you for subscribing!');
        emailInput.value = '';
      }
    });
  }
});

// --- 1. PRODUCT DATA STRUCTURE ---
const products = [
  {
    id: "liquid-detergent",
    name: "Liquid Detergent",
    description: "Powerful plant-based formula for spotless laundry. Gentle on fabrics, tough on stains.",
    price: 18000,
    image: "./images/liquid-detergent.jpg",
    stock: 15
  },
  {
    id: "toilet-bowl-cleaner",
    name: "Toilet Bowl Cleaner",
    description: "Eco-safe cleaner that removes tough stains and deodorizes, leaving your bathroom fresh.",
    price: 12000,
    image: "./images/toilet-bowl-cleaner.jpg",
    stock: 20
  },
  {
    id: "disinfectant-spray",
    name: "Disinfectant Spray",
    description: "Natural disinfectant spray kills 99.9% of germs. Safe for your family and the environment.",
    price: 15000,
    image: "./images/disinfectant-spray.jpg",
    stock: 10
  },
  {
    id: "glass-cleaner",
    name: "Glass Cleaner",
    description: "Streak-free shine for windows and mirrors. Ammonia-free and eco-friendly.",
    price: 10000,
    image: "./images/glass-cleaner.jpg",
    stock: 18
  },
  {
    id: "floor-cleaner",
    name: "Floor Cleaner",
    description: "Concentrated formula for sparkling clean floors. Safe for kids and pets.",
    price: 14000,
    image: "./images/floor-cleaner.jpg",
    stock: 22
  },
  {
    id: "multi-surface-cleaner",
    name: "Multi-Surface Cleaner",
    description: "Versatile cleaner for kitchens, bathrooms, and more. Leaves a fresh scent.",
    price: 13000,
    image: "./images/multi-surface-cleaner.jpg",
    stock: 25
  },
  {
    id: "fabric-softener",
    name: "Fabric Softener",
    description: "Keeps clothes soft and static-free with a gentle, natural fragrance.",
    price: 11000,
    image: "./images/fabric-softener.jpg",
    stock: 17
  },
  {
    id: "dishwashing-liquid",
    name: "Dishwashing Liquid",
    description: "Cuts through grease for sparkling dishes. Gentle on hands, tough on grime.",
    price: 9000,
    image: "./images/dishwashing-liquid.jpg",
    stock: 30
  },
  {
    id: "air-freshener",
    name: "Air Freshener",
    description: "Natural essential oil blend for a long-lasting, fresh-smelling home.",
    price: 8000,
    image: "./images/air-freshener.jpg",
    stock: 28
  },
  {
    id: "hand-sanitizer",
    name: "Hand Sanitizer",
    description: "Alcohol-based sanitizer kills 99.9% of germs. Moisturizes as it cleans.",
    price: 7000,
    image: "./images/hand-sanitizer.jpg",
    stock: 40
  }
];

// --- 2. DYNAMIC PRODUCT LISTING ---
function renderProducts() {
  const productsContainer = document.querySelector('.products');
  if (!productsContainer) return;
  productsContainer.innerHTML = products.map(product => `
    <div class="product-card" data-id="${product.id}">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="product-price">UGX ${product.price.toLocaleString()}</div>
      <button class="btn primary add-to-cart" data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
        ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  `).join('');
}
renderProducts();

// --- 3. SHOPPING CART LOGIC ---
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}
function setCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartCountElem = document.getElementById('cart-count');
  if (cartCountElem) cartCountElem.textContent = count;
}
function addToCart(productId) {
  let cart = getCart();
  const product = products.find(p => p.id === productId);
  if (!product || product.stock === 0) return;
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    if (cartItem.qty < product.stock) cartItem.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  setCart(cart);
  updateCartCount();
}
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('add-to-cart')) {
    const id = e.target.getAttribute('data-id');
    addToCart(id);
  }
});
updateCartCount();

// --- 3b. CART MODAL (BASIC) ---
function renderCartModal() {
  let modal = document.getElementById('cart-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cart-modal';
    modal.className = 'cart-modal';
    document.body.appendChild(modal);
  }
  const cart = getCart();
  if (cart.length === 0) {
    modal.innerHTML = `
      <div class="cart-modal-content">
        <span class="cart-modal-close">&times;</span>
        <h3>Your Cart</h3>
        <p>Your cart is empty.</p>
      </div>
    `;
    return;
  }
  let total = 0;
  const itemsHtml = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return '';
    const subtotal = product.price * item.qty;
    total += subtotal;
    return `
      <div class="cart-item">
        <span>${product.name}</span>
        <span>UGX ${product.price.toLocaleString()}</span>
        <div class="cart-qty">
          <button class="cart-qty-btn" data-action="decrease" data-id="${item.id}">-</button>
          <span>${item.qty}</span>
          <button class="cart-qty-btn" data-action="increase" data-id="${item.id}">+</button>
        </div>
        <span>UGX ${(subtotal).toLocaleString()}</span>
        <button class="cart-remove-btn" data-id="${item.id}">&times;</button>
      </div>
    `;
  }).join('');
  modal.innerHTML = `
    <div class="cart-modal-content">
      <span class="cart-modal-close">&times;</span>
      <h3>Your Cart</h3>
      <div class="cart-items">${itemsHtml}</div>
      <div class="cart-total">
        <strong>Total:</strong> UGX ${total.toLocaleString()}
      </div>
      <button class="btn primary cart-checkout-btn">Checkout</button>
    </div>
  `;
}
document.addEventListener('click', function(e) {
  if (e.target.closest('.cart-link')) {
    renderCartModal();
    document.getElementById('cart-modal').style.display = 'flex';
  }
  if (e.target.classList.contains('cart-modal-close')) {
    document.getElementById('cart-modal').style.display = 'none';
  }
  if (e.target.classList.contains('cart-qty-btn')) {
    const id = e.target.getAttribute('data-id');
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    const product = products.find(p => p.id === id);
    if (!item || !product) return;
    if (e.target.getAttribute('data-action') === 'increase' && item.qty < product.stock) item.qty++;
    if (e.target.getAttribute('data-action') === 'decrease' && item.qty > 1) item.qty--;
    setCart(cart);
    renderCartModal();
    updateCartCount();
  }
  if (e.target.classList.contains('cart-remove-btn')) {
    const id = e.target.getAttribute('data-id');
    let cart = getCart().filter(i => i.id !== id);
    setCart(cart);
    renderCartModal();
    updateCartCount();
  }
  if (e.target.classList.contains('cart-checkout-btn')) {
    document.getElementById('cart-modal').style.display = 'none';
    renderCheckoutModal();
  }
});

// --- 4. CHECKOUT FORM ---
function renderCheckoutModal() {
  let modal = document.getElementById('checkout-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'checkout-modal';
    modal.className = 'cart-modal';
    document.body.appendChild(modal);
  }
  const cart = getCart();
  if (cart.length === 0) return;
  let total = 0;
  const itemsHtml = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return '';
    const subtotal = product.price * item.qty;
    total += subtotal;
    return `<li>${product.name} x${item.qty} - UGX ${(subtotal).toLocaleString()}</li>`;
  }).join('');
  modal.innerHTML = `
    <div class="cart-modal-content">
      <span class="cart-modal-close">&times;</span>
      <h3>Checkout</h3>
      <ul class="checkout-items">${itemsHtml}</ul>
      <div class="cart-total">
        <strong>Total:</strong> UGX ${total.toLocaleString()}
      </div>
      <form id="checkout-form">
        <input type="text" name="name" placeholder="Full Name" required>
        <input type="email" name="email" placeholder="Email Address" required>
        <input type="tel" name="phone" placeholder="Phone Number" required>
        <input type="text" name="address" placeholder="Delivery Address" required>
        <button type="submit" class="btn primary">Place Order</button>
      </form>
    </div>
  `;
  modal.style.display = 'flex';
  modal.querySelector('.cart-modal-close').onclick = () => modal.style.display = 'none';
  modal.querySelector('#checkout-form').onsubmit = function(e) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(this));
    const cart = getCart();
    let total = 0;
    const items = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return '';
      total += product.price * item.qty;
      return `${product.name} x${item.qty}`;
    }).join(', ');

    // --- 1. Send order email via EmailJS ---
    if (window.emailjs) {
      emailjs.send("service_5hzh70v", "template_7vuwogu", {
        user_name: formData.name,
        user_email: formData.email,
        user_phone: formData.phone,
        user_address: formData.address,
        order_items: items,
        order_total: total.toLocaleString(),
        order_date: new Date().toLocaleString()
      }).then(function() {
        alert('Order placed and email sent!');
      }, function(error) {
        alert('Order has been placed but failed to send email.\n' + (error.text || ''));
        console.error('EmailJS error:', error);
      });
    }

    // --- 2. Log order to Google Sheets via SheetDB ---
    fetch("https://sheetdb.io/api/v1/mw5m4u6j60pgj", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: [{
          Name: formData.name,
          Email: formData.email,
          Phone: formData.phone,
          Address: formData.address,
          Items: items,
          Total: total,
          Date: new Date().toLocaleString()
        }]
      })
    });

    // Replace with your actual Apps Script Web App URL
    const SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxUL12NvLgtuXWkB3D9MXKoDtCJ1SvNVKN4V3dZVrJckXji8MEcGmmPI6OxbEGI_sOM/exec";

    // After EmailJS send (inside the checkout form submission handler)
    fetch(SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          items: items,
          total: total,
        }
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Order logged to Google Sheets:", data);
    })
    .catch(err => {
      console.error("Failed to log order to Google Sheets:", err);
    });

    renderOrderConfirmation(formData, cart, total);
    setCart([]);
    updateCartCount();
    modal.style.display = 'none';
  };
}

// --- 6. ORDER CONFIRMATION PAGE ---
function renderOrderConfirmation(formData, cart, total) {
  let modal = document.getElementById('order-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'order-modal';
    modal.className = 'cart-modal';
    document.body.appendChild(modal);
  }
  const orderNumber = 'DBI' + Math.floor(Math.random() * 1000000);
  const itemsHtml = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return '';
    return `<li>${product.name} x${item.qty}</li>`;
  }).join('');
  modal.innerHTML = `
    <div class="cart-modal-content">
      <span class="cart-modal-close">&times;</span>
      <h3>Order Confirmed!</h3>
      <p>Thank you, <strong>${formData.name}</strong>.<br>
      Your order <strong>#${orderNumber}</strong> has been placed.</p>
      <ul>${itemsHtml}</ul>
      <div class="cart-total">
        <strong>Total Bill:</strong> UGX ${total.toLocaleString()}
      </div>
      <p>
        <strong>Delivery Address:</strong><br>
        ${formData.address}
      </p>
      <p>Estimated delivery: 2-3 business days.<br>We’ll contact you soon!</p>
    </div>
  `;
  modal.style.display = 'flex';
  modal.querySelector('.cart-modal-close').onclick = () => modal.style.display = 'none';
}

// --- 9. RESPONSIVE DESIGN (already handled in CSS) ---

// --- 10. CONTACT FORM FUNCTIONALITY (log to console for now) ---
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this));
    alert('Thank you for contacting us!');
    console.log('Contact form submitted:', data);
    this.reset();
  });
}

// --- 11. NEWSLETTER FORM FUNCTIONALITY (log to console for now) ---
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    alert('Thank you for subscribing!');
    console.log('Newsletter signup:', email);
    this.reset();
  });
}

// --- NAVBAR MOBILE TOGGLE ---
document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('active');
    });
  }
});

// --- CART MODAL STYLES (inject if not present) ---
if (!document.getElementById('cart-modal-style')) {
  const style = document.createElement('style');
  style.id = 'cart-modal-style';
  style.innerHTML = `
  .cart-modal {
    position: fixed; z-index: 9999; left: 0; top: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.25); display: none; align-items: center; justify-content: center;
  }
  .cart-modal-content {
    background: #fff; border-radius: 18px; max-width: 400px; width: 95%; padding: 2em 1.5em;
    box-shadow: 0 8px 32px rgba(0,100,0,0.13); position: relative; animation: fadeIn 0.2s;
  }
  .cart-modal-close {
    position: absolute; top: 18px; right: 18px; font-size: 1.5rem; color: #006400; cursor: pointer;
  }
  .cart-item {
    display: flex; align-items: center; justify-content: space-between; gap: 0.5em; margin-bottom: 1em;
    font-size: 1rem;
  }
  .cart-qty {
    display: flex; align-items: center; gap: 0.5em;
  }
  .cart-qty-btn {
    background: #e0f7fa; border: none; border-radius: 50%; width: 28px; height: 28px; font-size: 1.1rem; cursor: pointer;
    color: #006400; font-weight: bold; transition: background 0.2s;
  }
  .cart-qty-btn:hover { background: #32cd32; color: #fff; }
  .cart-remove-btn {
    background: none; border: none; color: #c00; font-size: 1.2rem; cursor: pointer;
  }
  .cart-total { margin: 1.2em 0 1em 0; font-size: 1.1rem; }
  .checkout-items { margin: 1em 0; padding-left: 1.2em; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `;
  document.head.appendChild(style);
}

// EmailJS integration for contact form
document.addEventListener('DOMContentLoaded', function () {
  // Initialize EmailJS
  if (window.emailjs) {
    emailjs.init("B69DilXFMdTl_nv2D");
  }
  
});

function sendMail() {
    let params = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
}
    emailjs.send("service_5hzh70v", "template_7bbt6ke", params)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert('Message sent successfully!');
        }, function(error) {
            console.log('FAILED...', error);
            alert('Failed to send message. Please try again.');
        });
}