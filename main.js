// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase config (same as your existing)
const firebaseConfig = {
  apiKey: "AIzaSyDsrL5UHWeFtQAX5XCI1hX7As91PWz59Cs",
  authDomain: "black-1108.firebaseapp.com",
  projectId: "black-1108",
  storageBucket: "black-1108.appspot.com",
  messagingSenderId: "639439190327",
  appId: "1:639439190327:web:b08b640aba7e8f7d76c2b2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
window.auth = auth; // expose for modules that check auth

// Initialize EmailJS if available
window.emailjs && emailjs.init && emailjs.init('Cp84jtP5v8VnUc0SQ');

// SMALL UTILS
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((s, it) => s + (it.qty || 0), 0);
  const el = document.getElementById("cartCount");
  if (el) el.textContent = count;
}

// localStorage cart helpers
function getCart() {
  try { return JSON.parse(localStorage.getItem('cart')) || []; } catch(e){ return []; }
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}
window.addToCart = function(productId) {
  if (!window.products || !Array.isArray(window.products)) { console.error('Products list not found.'); return; }
  const prod = window.products.find(p => Number(p.id) === Number(productId));
  if (!prod) { console.error('Product not found for id', productId); return; }

  // require logged-in user - if you want to allow guest cart, remove this block
  if (window.auth && !window.auth.currentUser) {
    window.location.href = 'login.html';
    return;
  }

  const cart = getCart();
  const existing = cart.find(i => Number(i.id) === Number(prod.id));
  if (existing) {
    existing.qty = (existing.qty || 0) + 1;
  } else {
    cart.push({
      id: prod.id,
      productId: prod.id,
      name: prod.name,
      priceVal: prod.priceVal || 0,
      priceText: prod.price || ('#' + (prod.priceVal || 0)),
      img: prod.img,
      qty: 1,
      options: {}
    });
  }
  saveCart(cart);

  // mini toast
  try {
    const t = document.createElement('div');
    t.textContent = `${prod.name} added to cart`;
    t.style.position = 'fixed';
    t.style.right = '16px';
    t.style.bottom = '16px';
    t.style.background = '#111';
    t.style.color = '#fff';
    t.style.padding = '10px 14px';
    t.style.borderRadius = '8px';
    t.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
    document.body.appendChild(t);
    setTimeout(()=> t.remove(), 1600);
  } catch(e){}
};

// delegated handler for add-to-cart (works after render)
document.addEventListener('click', function(e){
  const btn = e.target.closest('.add-to-cart');
  if (!btn) return;
  e.preventDefault();
  const id = btn.getAttribute('data-id');
  if (!id) return;
  const authObj = window.auth || (window.firebase && firebase.auth && firebase.auth());
  if (authObj && !authObj.currentUser) {
    window.location.href = 'login.html';
    return;
  }
  if (typeof window.addToCart === 'function') window.addToCart(Number(id));
});

// sidebar open/close and UI wiring (will find sidebar after it's injected)
async function wireSidebar() {
  // wait for sidebar to exist
  const waitFor = (selector, timeout = 3000) => new Promise((res, rej) => {
    const t0 = Date.now();
    (function check(){ const el = document.querySelector(selector); if (el) return res(el); if (Date.now()-t0 > timeout) return rej(); setTimeout(check, 50); })();
  });

  try {
    const sidebar = await waitFor('#sidebar', 3000);
    const menuBtn = document.getElementById('menuBtn');
    const overlay = document.getElementById('overlay');
    const closeSidebar = document.getElementById('closeSidebar');
    const signinBtn = document.getElementById('signinBtn');
    const signoutBtn = document.getElementById('signoutBtn');
    const profileToggle = document.getElementById('profileToggle');
    const profileOptions = document.getElementById('profileOptions');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const viewOrdersBtn = document.getElementById('viewOrdersBtn');

    function openSidebar(){ sidebar.classList.remove('sidebar-hidden'); sidebar.classList.add('sidebar-visible'); overlay.classList.remove('hidden'); }
    function closeMenu(){ sidebar.classList.remove('sidebar-visible'); sidebar.classList.add('sidebar-hidden'); overlay.classList.add('hidden'); }

    menuBtn?.addEventListener('click', openSidebar);
    closeSidebar?.addEventListener('click', closeMenu);
    overlay?.addEventListener('click', closeMenu);

    signinBtn?.addEventListener('click', ()=> window.location.href = 'login.html');
    signoutBtn?.addEventListener('click', async ()=> {
      try { await signOut(auth); window.location.href = 'login.html'; } catch(e){ alert(e.message); }
    });

    profileToggle?.addEventListener('click', ()=> {
      if (!profileOptions) return;
      profileOptions.style.display = (profileOptions.style.display === 'block') ? 'none' : 'block';
    });

    // small quick links
    document.getElementById('settingsBtn')?.addEventListener('click', ()=> window.location.href = 'sittings.html');
    document.getElementById('notificationsBtn')?.addEventListener('click', ()=> window.location.href = 'notifications.html');
    document.getElementById('cartBtn')?.addEventListener('click', ()=> window.location.href = 'cart.html');
    document.getElementById('wishlistBtn')?.addEventListener('click', ()=> window.location.href = 'wishlist.html');
    document.getElementById('deliveryBtn')?.addEventListener('click', ()=> window.location.href = 'deliverytracking.html');
    document.getElementById('supportBtn')?.addEventListener('click', ()=> window.location.href = 'support.html');

    // contact/about/help accordions & form wiring
    const contactToggle = document.getElementById('contactToggle');
    const contactBlock = document.getElementById('contactBlock');
    const contactArrow = document.getElementById('contactArrow');
    contactToggle?.addEventListener('click', ()=> {
      if (!contactBlock) return;
      if (contactBlock.style.display === 'block') { contactBlock.style.display = 'none'; contactArrow.textContent = '▼'; } else { contactBlock.style.display = 'block'; contactArrow.textContent = '▲'; }
    });

    const aboutToggle = document.getElementById('aboutToggle');
    const aboutBlock = document.getElementById('aboutBlock');
    const aboutArrow = document.getElementById('aboutArrow');
    aboutToggle?.addEventListener('click', ()=> {
      if (!aboutBlock) return;
      if (aboutBlock.style.display === 'block') { aboutBlock.style.display = 'none'; aboutArrow.textContent = '▼'; } else { aboutBlock.style.display = 'block'; aboutArrow.textContent = '▲'; }
    });

    const helpToggle = document.getElementById('helpToggle');
    const helpBlock = document.getElementById('helpBlock');
    const helpArrow = document.getElementById('helpArrow');
    helpToggle?.addEventListener('click', ()=> {
      if (!helpBlock) return;
      if (helpBlock.style.display === 'block') { helpBlock.style.display = 'none'; helpArrow.textContent = '▼'; } else { helpBlock.style.display = 'block'; helpArrow.textContent = '▲'; }
    });

    const sendHelpBtn = document.getElementById('sendHelpBtn');
    const clearHelpBtn = document.getElementById('clearHelpBtn');
    const helpForm = document.getElementById('helpForm');
    const helpStatus = document.getElementById('helpStatus');

    sendHelpBtn?.addEventListener('click', ()=>{
      if (!helpForm) return;
      const name = document.getElementById('helpName').value.trim();
      const email = document.getElementById('helpEmail').value.trim();
      const message = document.getElementById('helpMessage').value.trim();
      if (!name || !email || !message) { helpStatus.textContent = 'Please fill out all fields.'; helpStatus.style.color = '#ffcc00'; return; }
      helpStatus.textContent = 'Sending...'; helpStatus.style.color = '#fff';
      const templateParams = { from_name: name, reply_to: email, message: message };
      if (window.emailjs && emailjs.send) {
        emailjs.send('service_rg6m82u','template_n9i0263', templateParams)
          .then(() => { helpStatus.textContent = 'Message sent — we will contact you soon.'; helpStatus.style.color = '#7fff7f'; helpForm.reset(); })
          .catch((err) => { helpStatus.textContent = 'Failed to send. Try again later.'; helpStatus.style.color = '#ff7f7f'; console.error(err); });
      } else {
        console.warn('EmailJS not loaded');
        helpStatus.textContent = 'Email service unavailable.';
        helpStatus.style.color = '#ffcc00';
      }
    });
    clearHelpBtn?.addEventListener('click', ()=> { helpForm.reset(); helpStatus.textContent = ''; });

    // top nav quick buttons
    editProfileBtn?.addEventListener('click', ()=> window.location.href = 'editprofile.html');
    viewOrdersBtn?.addEventListener('click', ()=> window.location.href = 'order.html');

    // search enter handler (wired here)
    const searchInput = document.getElementById('searchInput');
    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = searchInput.value.trim().toLowerCase();
        if (!q) { window.renderProducts?.(); return; }
        const filtered = (window.products || []).filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
        const productGrid = document.getElementById('productGrid');
        if (!productGrid) return;
        productGrid.innerHTML = '';
        filtered.forEach(p => {
          const div = document.createElement('div');
          div.className = 'card overflow-hidden';
          div.innerHTML = `
            <img src="${p.img}" alt="${p.name}" class="prod-img" />
            <div class="p-3">
              <h4 class="font-semibold text-sm mb-1">${p.name}</h4>
              <p class="text-xs text-gray-600 mb-2">${p.category}</p>
              <p class="text-lg font-bold text-brand">${p.price}</p>
              <div class="mt-3 flex gap-2">
                <a href="product.html?id=${p.id}" class="flex-1 px-3 py-2 border rounded text-sm text-center">Open</a>
                <button data-id="${p.id}" class="add-to-cart flex-1 px-3 py-2 bg-brand text-white rounded text-sm">Add to Cart</button>
              </div>
            </div>
          `;
          productGrid.appendChild(div);
        });
      }
    });

  } catch (err) {
    console.warn('Sidebar wiring timed out or not present yet.', err);
  }
}

// Wait for layout and sidebar to be injected then wire
document.addEventListener('DOMContentLoaded', () => {
  // attempt wiring after a slight delay to let layout and sidebar fetch finish
  setTimeout(() => {
    wireSidebar();
    // change banner rotation
    const bannerSeeds = ['banner1','banner2','banner3','banner4'];
    const randomProduct = document.getElementById('randomProduct');
    function changeBanner(){ if (randomProduct) randomProduct.src = `https://picsum.photos/seed/${bannerSeeds[Math.floor(Math.random()*bannerSeeds.length)]}/1500/300`; }
    changeBanner(); setInterval(changeBanner, 6000);

    // close modal
    document.getElementById('closeModal')?.addEventListener('click', ()=> { document.getElementById('productModal')?.classList.add('hidden'); });

    // keep cart count updated
    updateCartCount();
    window.addEventListener('storage', function(e){ if (e.key === 'cart') updateCartCount(); });

  }, 300); // small delay
});

// Protect index (if you want automatic redirect for unauthenticated users)
onAuthStateChanged(auth, (user) => {
  // If you want the index to be guarded, uncomment next lines:
  // if (!user) { window.location.href = "login.html"; }
  // For now we keep guest access allowed but UI will update below.

  // update UI for sidebar profile (if present)
  const profileNameEl = document.getElementById('profileName');
  const profilePicEl = document.getElementById('profilePic');
  const profileOptions = document.getElementById('profileOptions');
  const signoutBtn = document.getElementById('signoutBtn');
  const signinBtn = document.getElementById('signinBtn');

  if (!user) {
    if (profileNameEl) profileNameEl.textContent = 'Guest';
    if (profilePicEl) profilePicEl.src = 'https://img.icons8.com/ios-filled/100/ffffff/user-male-circle.png';
    if (profileOptions) profileOptions.style.display = 'none';
    if (signoutBtn) signoutBtn.style.display = 'none';
    if (signinBtn) signinBtn.style.display = 'inline-block';
    return;
  }

  const name = user.displayName || (user.email ? user.email.split('@')[0] : 'User');
  if (profileNameEl) profileNameEl.textContent = name.split(' ')[0];
  if (profilePicEl) profilePicEl.src = user.photoURL || `https://picsum.photos/seed/avatar${user.uid}/200/200`;
  if (profileOptions) profileOptions.style.display = 'block';
  if (signoutBtn) signoutBtn.style.display = 'inline-block';
  if (signinBtn) signinBtn.style.display = 'none';
});
