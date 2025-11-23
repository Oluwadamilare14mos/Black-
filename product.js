// product.js
// Responsible for generating products and rendering product grid.
// Exports nothing; it attaches `window.products` and functions used by main.js.

const sampleAdjectives = ["Classic","Modern","Stylish","Comfort","Premium","Urban","Luxury","Casual","Elite","Cozy","Vintage","Sport","Slim","Relaxed","Smart"];
const sampleItems = ["Polo Shirt","Summer Dress","Sneakers","Heels","Chain Necklace","Gold Ring","Boxer Briefs","Underwear Set","Round Neck Tee","Jumper","Bedsheet Set","Pilot Cap","Wall Cutter","Leather Jacket","Socks Pack","Hoodie","Cargo Pants","Denim Jacket","Wallet","Handbag"];

function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

export const categories = [
  "Men wears","Women wears","Kids wears","Wristwatch","Shoes","Women Heels",
  "Chain","Ring","Boxers","Underwears","Bet","Round neck","Jugers","Bedsheets",
  "Pilo","Wall Cutting","Accessories","Hats","Bags","Socks","Jackets"
];

// create product list
const products = [];
for(let i=1;i<=200;i++){
  const cat = categories[i % categories.length];
  const name = `${sampleAdjectives[i % sampleAdjectives.length]} ${sampleItems[i % sampleItems.length]} ${i}`;
  let minP = 7500, maxP = 45000;
  if (name.toLowerCase().includes('socks') || name.toLowerCase().includes('boxer') || name.toLowerCase().includes('underwear')) { minP = 2500; maxP = 9000; }
  if (name.toLowerCase().includes('rings') || name.toLowerCase().includes('chain') || name.toLowerCase().includes('handbag')) { minP = 7000; maxP = 55000; }
  const priceVal = rand(minP, maxP);
  const price = '#' + priceVal.toLocaleString();
  const img = `https://picsum.photos/seed/prod${i}/600/600`;
  const imgs = [
    `https://picsum.photos/seed/prod${i}a/800/800`,
    `https://picsum.photos/seed/prod${i}b/800/800`,
    `https://picsum.photos/seed/prod${i}c/800/800`
  ];
  products.push({ id:i, name, category:cat, priceVal, price, img, imgs, description: `High-quality ${cat} — ${name}. Perfect for everyday wear and special occasions.` });
}

// expose for other scripts
window.products = products;
window.categories = categories;

// Rendering logic
let perPage = 24, currentMax = perPage;
export function renderProducts(limit = currentMax) {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;
  productGrid.innerHTML = '';
  const list = products.slice(0, limit);
  list.forEach(p => {
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
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) loadMoreBtn.style.display = (limit >= products.length) ? 'none' : 'inline-block';
}

export function filterByCategory(cat) {
  const productGrid = document.getElementById('productGrid');
  if (!productGrid) return;
  productGrid.innerHTML = '';
  const filtered = products.filter(p => p.category === cat);
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

// expose render control
window.renderProducts = renderProducts;
window.filterByCategory = filterByCategory;

// initial render when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // categories list in layout
  const categoryList = document.getElementById('categoryList');
  if (categoryList) {
    categories.forEach(cat => {
      const wrapper = document.createElement('div');
      wrapper.className = 'flex justify-center';
      const btn = document.createElement('button');
      btn.className = 'px-3 py-2 rounded bg-white/80 border hover:border-brand text-sm';
      btn.textContent = cat;
      btn.onclick = () => filterByCategory(cat);
      wrapper.appendChild(btn);
      categoryList.appendChild(wrapper);
    });
  }
  // initial products
  renderProducts();
  // load more handling
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  loadMoreBtn?.addEventListener('click', () => { currentMax += perPage; renderProducts(currentMax); });
});
