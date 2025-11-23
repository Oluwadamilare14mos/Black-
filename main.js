/* =======================================================
   MAIN.JS  — Controls sidebar, navigation, cart, profile
======================================================= */

/* -----------------------------
   SIDEBAR OPEN / CLOSE
----------------------------- */
const openSidebarBtn = document.getElementById("openSidebar");
const closeSidebarBtn = document.getElementById("closeSidebar");
const sidebar = document.getElementById("sidebar");

if (openSidebarBtn) {
  openSidebarBtn.addEventListener("click", () => {
    sidebar.classList.remove("sidebar-hidden");
    sidebar.classList.add("sidebar-shown");
  });
}

if (closeSidebarBtn) {
  closeSidebarBtn.addEventListener("click", () => {
    sidebar.classList.add("sidebar-hidden");
    sidebar.classList.remove("sidebar-shown");
  });
}

/* -----------------------------
   ACCORDION (Contact, About, Help)
----------------------------- */
function setupAccordion(toggleId, blockId, arrowId) {
  const toggle = document.getElementById(toggleId);
  const block = document.getElementById(blockId);
  const arrow = document.getElementById(arrowId);

  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const open = block.classList.contains("show-block");

    document.querySelectorAll(".hidden-block").forEach(div => div.classList.remove("show-block"));
    document.querySelectorAll(".accordion-btn span:last-child").forEach(a => a.textContent = "▼");

    if (!open) {
      block.classList.add("show-block");
      arrow.textContent = "▲";
    }
  });
}

setupAccordion("contactToggle", "contactBlock", "contactArrow");
setupAccordion("aboutToggle", "aboutBlock", "aboutArrow");
setupAccordion("helpToggle", "helpBlock", "helpArrow");


/* -----------------------------
   PROFILE DROPDOWN  
----------------------------- */
const profileBtn = document.getElementById("profileToggle");
const profileOptions = document.getElementById("profileOptions");

if (profileBtn) {
  profileBtn.addEventListener("click", () => {
    const isHidden = profileOptions.style.display === "none" || profileOptions.style.display === "";
    profileOptions.style.display = isHidden ? "block" : "none";
  });
}


/* -----------------------------
   BOTTOM NAVIGATION
----------------------------- */
document.getElementById("navHome")?.addEventListener("click", () => {
  window.location.href = "index.html";
});

document.getElementById("navCategory")?.addEventListener("click", () => {
  window.location.href = "category.html";
});

document.getElementById("navCart")?.addEventListener("click", () => {
  window.location.href = "cart.html";
});

document.getElementById("navAccount")?.addEventListener("click", () => {
  window.location.href = "account.html";
});


/* -----------------------------
   SIDEBAR QUICK LINKS
----------------------------- */
document.getElementById('settingsBtn')?.addEventListener('click', () => window.location.href = 'settings.html');
document.getElementById('notificationsBtn')?.addEventListener('click', () => window.location.href = 'notifications.html');
document.getElementById('cartBtn')?.addEventListener('click', () => window.location.href = 'cart.html');
document.getElementById('wishlistBtn')?.addEventListener('click', () => window.location.href = 'wishlist.html');
document.getElementById('deliveryBtn')?.addEventListener('click', () => window.location.href = 'deliverytracking.html');
document.getElementById('supportBtn')?.addEventListener('click', () => window.location.href = 'support.html');
document.getElementById('signinBtn')?.addEventListener('click', () => window.location.href = 'signin.html');


/* -----------------------------
   CART COUNT (LocalStorage)
----------------------------- */
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const bubble = document.getElementById("cartCount");
  if (!bubble) return;

  bubble.textContent = cart.length;
}

updateCartCount();

window.addEventListener("storage", (e) => {
  if (e.key === "cart") updateCartCount();
});


/* -----------------------------
   ADD TO CART
----------------------------- */
window.addToCart = function(id) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();

  alert("Item added to cart!");
};
