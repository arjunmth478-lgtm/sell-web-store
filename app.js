const DEFAULT_PRODUCTS = [
 {id:1,name:"Wireless Earbuds",price:1299,category:"Electronics",emoji:"🎧",details:"Compact wireless earbuds for everyday listening."},
 {id:2,name:"Smart Watch",price:1999,category:"Accessories",emoji:"⌚",details:"A stylish smartwatch for your daily routine."},
 {id:3,name:"Everyday Backpack",price:899,category:"Fashion",emoji:"🎒",details:"A lightweight bag for work, college and travel."},
 {id:4,name:"Sport Shoes",price:1499,category:"Footwear",emoji:"👟",details:"Comfortable shoes for daily use."},
 {id:5,name:"Classic T-Shirt",price:499,category:"Fashion",emoji:"👕",details:"A versatile casual T-shirt."},
 {id:6,name:"Kitchen Set",price:799,category:"Kitchen",emoji:"🍳",details:"Useful kitchen essentials for your home."}
];
const $ = id => document.getElementById(id);
const read = (key, fallback) => { try { const v=localStorage.getItem(key); return v?JSON.parse(v):fallback; } catch { return fallback; } };
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
let products = read("ys_products", DEFAULT_PRODUCTS);
let orders = read("ys_orders", []);
let users = read("ys_demo_users", []);
let currentFilter = "";
let authMode = "login";
let pageViews = Number(localStorage.getItem("ys_demo_views") || "0") + 1;
localStorage.setItem("ys_demo_views", String(pageViews));
$("year").textContent = new Date().getFullYear();

function renderProducts() {
  const q = $("searchInput").value.trim().toLowerCase();
  const filtered = products.filter(p => (!currentFilter || p.category===currentFilter) && (!q || (p.name+" "+p.category+" "+(p.details||"")).toLowerCase().includes(q)));
  $("productCount").textContent = `${filtered.length} products`;
  $("productGrid").innerHTML = filtered.length ? filtered.map(p => `
    <article class="product-card">
      <div class="product-image">${p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" onerror="this.remove()">` : `<span>${p.emoji||"📦"}</span>`}</div>
      <div class="product-info"><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.details||p.category||"Product")}</p><div class="price">₹${Number(p.price).toLocaleString("en-IN")}</div>
      <button class="primary" data-order="${p.id}">Order on WhatsApp</button></div>
    </article>`).join("") : `<div class="empty">No products found. Try another search.</div>`;
  document.querySelectorAll("[data-order]").forEach(b => b.addEventListener("click", () => orderProduct(Number(b.dataset.order))));
}
function escapeHtml(s="") { return String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function orderProduct(id) {
  const p = products.find(x=>x.id===id); if(!p) return;
  const record={id:Date.now(),product:p.name,price:p.price,created:new Date().toISOString()};
  orders.push(record); save("ys_orders",orders); updateStats();
  const phone = ""; // Add your WhatsApp business number here, country code without +.
  const msg = `Hi, I want to order ${p.name} for ₹${p.price}. Please share availability and delivery details.`;
  if(phone) window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,"_blank");
  else { alert("Demo order recorded in this browser. Add your WhatsApp number in app.js to enable WhatsApp ordering."); }
}
function openAuth(mode) { authMode=mode; $("authTitle").textContent=mode==="login"?"Login":"Create account"; $("authSubmit").textContent=mode==="login"?"Login":"Sign Up"; $("authName").style.display=mode==="login"?"none":"block"; $("authMessage").textContent=""; $("authDialog").showModal(); }
$("loginOpen").addEventListener("click",()=>openAuth("login"));
$("signupOpen").addEventListener("click",()=>openAuth("signup"));
$("authForm").addEventListener("submit",e=>{
  e.preventDefault();
  const email=$("authEmail").value.trim().toLowerCase(), password=$("authPassword").value;
  if(authMode==="signup") {
    if(users.some(u=>u.email===email)) { $("authMessage").textContent="An account with this email already exists in this demo."; return; }
    users.push({name:$("authName").value.trim(),email,password}); save("ys_demo_users",users);
    $("authMessage").textContent="Demo account created on this browser. Real secure accounts need a backend.";
  } else {
    const user=users.find(u=>u.email===email && u.password===password);
    $("authMessage").textContent=user?`Welcome, ${user.name||user.email}! This is a local demo login.`:"No demo account found. Try Sign Up first.";
  }
});
$("adminOpen").addEventListener("click",()=>{ $("adminDialog").showModal(); updateStats(); renderAdminProducts(); });
$("productForm").addEventListener("submit",e=>{
  e.preventDefault();
  const p={id:Date.now(),name:$("pName").value.trim(),price:Number($("pPrice").value),category:$("pCategory").value,details:$("pDetails").value.trim(),image:$("pImage").value.trim(),emoji:"📦"};
  products.unshift(p); save("ys_products",products); e.target.reset(); renderProducts(); renderAdminProducts(); updateStats();
});
function renderAdminProducts() {
  $("adminProductList").innerHTML=products.length?products.map(p=>`<div class="admin-product"><span>${escapeHtml(p.name)} · ₹${Number(p.price).toLocaleString("en-IN")}</span><button class="danger" data-delete="${p.id}">Delete</button></div>`).join(""):`<div class="empty">No products yet.</div>`;
  document.querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>{products=products.filter(p=>p.id!==Number(b.dataset.delete));save("ys_products",products);renderProducts();renderAdminProducts();updateStats();}));
}
function updateStats() { $("statProducts").textContent=products.length; $("statOrders").textContent=orders.length; $("statViews").textContent=pageViews; }
$("resetProducts").addEventListener("click",()=>{if(confirm("Reset product list to starter products?")){products=[...DEFAULT_PRODUCTS];save("ys_products",products);renderProducts();renderAdminProducts();updateStats();}});
$("searchBtn").addEventListener("click",renderProducts);
$("searchInput").addEventListener("input",renderProducts);
document.querySelectorAll("[data-category]").forEach(el=>el.addEventListener("click",()=>{currentFilter=el.dataset.category;renderProducts();$("products").scrollIntoView({behavior:"smooth"});}));
renderProducts();