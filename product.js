// PRODUCT.JS
// ---------------------------------------------

// Get product ID from the URL
function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get("id"));
}

const productId = getProductId();

// Get product data from the global list (products.js must load BEFORE product.js)
function getProductData(id) {
    if (!window.products) return null;
    return window.products.find(p => Number(p.id) === Number(id));
}

const product = getProductData(productId);

// Render product into the page
function renderProduct() {
    if (!product) {
        document.getElementById("productContainer").innerHTML =
            `<p class="text-center text-red-500">Product not found.</p>`;
        return;
    }

    // Product info
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productPrice").textContent = "#" + product.priceVal.toLocaleString();
    document.getElementById("productDescription").textContent = product.description;

    // Main image
    document.getElementById("mainImage").src = product.imgs[0];

    // Thumbnails
    const thumbs = document.getElementById("thumbnailRow");
    thumbs.innerHTML = "";

    product.imgs.forEach(img => {
        const thumb = document.createElement("img");
        thumb.src = img;
        thumb.className = "thumb-img";
        thumb.onclick = () => {
            document.getElementById("mainImage").src = img;
        };
        thumbs.appendChild(thumb);
    });
}

// Call the renderer
renderProduct();


// ADD TO CART ACTION
document.getElementById("addToCartBtn").addEventListener("click", () => {
    if (typeof window.addToCart !== "function") {
        alert("Cart system not loaded.");
        return;
    }

    window.addToCart(productId);

    // Small toast
    const toast = document.createElement("div");
    toast.textContent = "Added to cart!";
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "#000";
    toast.style.color = "#fff";
    toast.style.padding = "10px 16px";
    toast.style.borderRadius = "6px";
    toast.style.zIndex = "9999";

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1500);
});
