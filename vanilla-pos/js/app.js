import api from './api.js';

let menus = [];
let tables = [];
let orders = [];
let cart = []; 

// === 1. ROUTING & NAVIGASI ===
function handleRouting() {
  const hash = window.location.hash || '#dashboard';
  const targetId = hash.replace('#', '');
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  const targetSection = document.getElementById(targetId);
  if (targetSection) targetSection.classList.add('active');
  document.getElementById(`nav-${targetId}`)?.classList.add('active');

  if (targetId === 'menu') fetchMenus();
  if (targetId === 'tables') fetchTables();
  if (targetId === 'orders') fetchOrders();
}
window.addEventListener('hashchange', handleRouting);
window.addEventListener('DOMContentLoaded', handleRouting);

// === 2. MANAJEMEN KATALOG MENU ===
async function fetchMenus() {
  const data = await api.get('/menu');
  if (data) { menus = data; renderMenuCards(); }
}

function renderMenuCards() {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;
  grid.innerHTML = '';
  if (menus.length === 0) {
    grid.innerHTML = `<div class="col-12 text-center py-5 text-muted">Belum ada menu.</div>`;
    return;
  }
  menus.forEach(item => {
    let imgSrc = item.image ? `http://localhost:5000${item.image.startsWith('/') ? item.image : '/' + item.image}` : '';
    grid.innerHTML += `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card menu-card shadow-sm h-100 border-0 rounded-4">
          <div class="img-container position-relative d-flex flex-column align-items-center justify-content-center" style="height: 160px; background-color: #e9ecef;">
            <img src="${imgSrc}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div style="display:none; color:#6c757d; text-align:center;"><i class="bi bi-image fs-2"></i></div>
            <div class="position-absolute top-0 end-0 p-2">
              <button class="btn btn-light btn-sm rounded-circle shadow-sm me-1 btn-edit-menu" data-id="${item.id}"><i class="bi bi-pencil-fill text-primary pointer-events-none"></i></button>
              <button class="btn btn-light btn-sm rounded-circle shadow-sm btn-delete-menu" data-id="${item.id}"><i class="bi bi-trash-fill text-danger pointer-events-none"></i></button>
            </div>
          </div>
          <div class="card-body p-3 d-flex flex-column">
            <h6 class="fw-bold mb-1">${item.name}</h6>
            <p class="text-muted small mb-2">${item.category}</p>
            <div class="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
              <span class="fw-bold text-success small">Rp ${Number(item.price).toLocaleString('id-ID')}</span>
              <button class="btn btn-warning btn-sm rounded-circle btn-add-cart" data-id="${item.id}"><i class="bi bi-plus-lg pointer-events-none"></i></button>
            </div>
          </div>
        </div>
      </div>`;
  });
}

// === 3. LOGIKA KERANJANG BELANJA ===
function updateCartCount() {
  const count = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const badge = document.getElementById('cart-count');
  if (badge) badge.innerText = count;
}

document.getElementById('btnOpenCart')?.addEventListener('click', () => {
  const list = document.getElementById('cart-items-list');
  const tableSelect = document.getElementById('cartTableId');
  let total = 0;
  list.innerHTML = cart.length === 0 ? '<p class="text-center text-muted">Keranjang kosong</p>' : '';
  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    list.innerHTML += `
      <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <div><div class="fw-bold text-truncate" style="max-width:150px;">${item.name}</div><small class="text-muted">Rp ${item.price.toLocaleString('id-ID')}</small></div>
        <div class="d-flex align-items-center">
          <button class="btn btn-sm btn-outline-dark px-2 py-0 btn-minus-qty" data-index="${index}">-</button>
          <span class="mx-2 fw-bold">${item.quantity}</span>
          <button class="btn btn-sm btn-outline-dark px-2 py-0 btn-plus-qty" data-index="${index}">+</button>
          <div class="ms-3 fw-bold text-end" style="min-width: 80px;">Rp ${subtotal.toLocaleString('id-ID')}</div>
          <button class="btn btn-sm text-danger ms-2 btn-remove-cart" data-index="${index}"><i class="bi bi-trash pointer-events-none"></i></button>
        </div>
      </div>`;
  });
  api.get('/tables').then(data => {
    tableSelect.innerHTML = '<option value="" disabled selected>Pilih Meja...</option>';
    if(data) data.filter(t => t.status === 'kosong').forEach(t => {
      tableSelect.innerHTML += `<option value="${t.id}">Meja ${t.table_number}</option>`;
    });
  });
  document.getElementById('cartTotalLabel').innerText = `Rp ${total.toLocaleString('id-ID')}`;
  new bootstrap.Modal(document.getElementById('cartModal')).show();
});

// === 4. EVENT LISTENER GLOBAL ===
document.addEventListener('click', async (e) => {
  const btnAdd = e.target.closest('.btn-add-cart');
  if (btnAdd) {
    const id = parseInt(btnAdd.getAttribute('data-id'));
    const item = menus.find(m => m.id === id);
    const existing = cart.find(c => c.menu_id === id);
    if (existing) existing.quantity++;
    else cart.push({ menu_id: id, name: item.name, price: item.price, quantity: 1 });
    updateCartCount();
  }
  const btnPlus = e.target.closest('.btn-plus-qty');
  if (btnPlus) { cart[btnPlus.getAttribute('data-index')].quantity++; updateCartCount(); document.getElementById('btnOpenCart').click(); }
  const btnMinus = e.target.closest('.btn-minus-qty');
  if (btnMinus) {
    const idx = btnMinus.getAttribute('data-index');
    if (cart[idx].quantity > 1) cart[idx].quantity--;
    else cart.splice(idx, 1);
    updateCartCount(); document.getElementById('btnOpenCart').click();
  }
  const btnRemCart = e.target.closest('.btn-remove-cart');
  if (btnRemCart) { cart.splice(btnRemCart.getAttribute('data-index'), 1); updateCartCount(); document.getElementById('btnOpenCart').click(); }

  const btnEdit = e.target.closest('.btn-edit-menu');
  if (btnEdit) {
    const menu = menus.find(m => m.id === parseInt(btnEdit.getAttribute('data-id')));
    document.getElementById('editMenuId').value = menu.id;
    document.getElementById('editMenuName').value = menu.name;
    document.getElementById('editMenuPrice').value = menu.price;
    new bootstrap.Modal(document.getElementById('editMenuModal')).show();
  }
  const btnDelMenu = e.target.closest('.btn-delete-menu');
  if (btnDelMenu) { if(confirm('Hapus menu?')) await api.delete(`/menu/${btnDelMenu.getAttribute('data-id')}`).then(fetchMenus); }

  if (e.target.classList.contains('btn-delete-table')) {
    if(confirm('Hapus meja?')) await api.delete(`/tables/${e.target.getAttribute('data-id')}`).then(fetchTables);
  }

  // --- LOGIKA PESANAN SELESAI (SUDAH DIPERBAIKI) ---
  const btnFinish = e.target.closest('.btn-finish-order');
  if (btnFinish) {
    if(confirm('Selesaikan pesanan & kosongkan meja?')) {
      const res = await fetch(`http://localhost:5000/orders/${btnFinish.getAttribute('data-id')}/finish`, { method: 'PATCH' });
      if (res.ok) {
        // Refresh kedua data agar UI Sinkron
        fetchOrders(); 
        fetchTables(); 
        alert('Pesanan selesai, meja otomatis kosong!');
      }
    }
  }

  const btnDelOrder = e.target.closest('.btn-delete-order');
  if (btnDelOrder) {
    if(confirm('Hapus riwayat pesanan?')) {
      await api.delete(`/orders/${btnDelOrder.getAttribute('data-id')}`);
      fetchOrders();
      fetchTables();
    }
  }
});

// === 5. FORM SUBMIT ===
document.getElementById('btnSubmitOrder')?.addEventListener('click', async () => {
  const table_id = document.getElementById('cartTableId').value;
  if (!table_id || cart.length === 0) return alert('Pilih meja!');
  await api.post('/orders', {
    table_id: parseInt(table_id),
    total_price: cart.reduce((acc, i) => acc + (i.price * i.quantity), 0),
    items: cart.map(c => ({ menu_id: c.menu_id, quantity: c.quantity, price: c.price }))
  });
  cart = []; updateCartCount();
  bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
  fetchOrders();
  fetchTables(); // Refresh meja agar merah (terisi)
  alert('Pesanan dikirim!');
});

document.getElementById('addMenuForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('name', document.getElementById('menuName').value);
  formData.append('category', document.getElementById('menuCategory').value);
  formData.append('price', document.getElementById('menuPrice').value);
  if (document.getElementById('menuImage').files[0]) formData.append('image', document.getElementById('menuImage').files[0]);
  await api.post('/menu', formData);
  fetchMenus(); e.target.reset();
  bootstrap.Modal.getInstance(document.getElementById('addMenuModal')).hide();
});

document.getElementById('addTableForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  await api.post('/tables', { table_number: document.getElementById('tableNumber').value });
  fetchTables(); e.target.reset();
  bootstrap.Modal.getInstance(document.getElementById('addTableModal')).hide();
});

// === 6. FETCH DATA ADMIN ===
async function fetchTables() {
  const data = await api.get('/tables');
  if (data) {
    const container = document.getElementById('table-container');
    if (!container) return;
    container.innerHTML = '';
    data.forEach(t => {
      container.innerHTML += `<div class="col-md-3 col-sm-6"><div class="card shadow-sm border-0 rounded-4 text-center p-4"><h1>${t.table_number}</h1><span class="badge ${t.status === 'kosong' ? 'bg-success' : 'bg-danger'} mb-3">${t.status}</span><button class="btn btn-sm btn-outline-danger btn-delete-table" data-id="${t.id}">Hapus</button></div></div>`;
    });
  }
}

async function fetchOrders() {
  const data = await api.get('/orders');
  if (data) {
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    data.forEach(o => {
      tbody.innerHTML += `
        <tr>
          <td class="ps-4 fw-bold">#ORD-${o.id}</td>
          <td>Meja ${o.Table ? o.Table.table_number : '-'}</td>
          <td>Rp ${o.total_price.toLocaleString('id-ID')}</td>
          <td><span class="badge ${o.status === 'pending' ? 'bg-warning text-dark' : 'bg-success'}">${o.status}</span></td>
          <td class="text-center">
            ${o.status === 'pending' ? `<button class="btn btn-sm btn-success btn-finish-order me-1" data-id="${o.id}">Selesai</button>` : ''}
            <button class="btn btn-sm btn-outline-danger btn-delete-order" data-id="${o.id}"><i class="bi bi-trash"></i></button>
          </td>
        </tr>`;
    });
  }
}