import api from './api.js';

// --- DATA STATE GLOBAL ---
let menus = [];
let tables = [];
let orders = [];

// ==========================================
// LOGIKA NAVIGASI (ROUTING)
// ==========================================
function handleRouting() {
  const hash = window.location.hash || '#dashboard';
  const targetId = hash.replace('#', '');

  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

  const targetSection = document.getElementById(targetId);
  const targetNav = document.getElementById(`nav-${targetId}`);
  
  if (targetSection) targetSection.classList.add('active');
  if (targetNav) targetNav.classList.add('active');

  // Load data sesuai halaman
  if (targetId === 'menu') fetchMenus();
  if (targetId === 'tables') fetchTables();
  if (targetId === 'orders') {
    fetchOrders();
    fetchMenus(); // Diperlukan untuk modal buat pesanan
    fetchTables(); // Diperlukan untuk modal buat pesanan
  }
}

window.addEventListener('hashchange', handleRouting);
window.addEventListener('DOMContentLoaded', handleRouting);


// ==========================================
// 1. FITUR MANAJEMEN MENU
// ==========================================
const menuTableBody = document.getElementById('menu-table-body');
const addMenuForm = document.getElementById('addMenuForm');
const editMenuForm = document.getElementById('editMenuForm');

async function fetchMenus() {
  const data = await api.get('/menu'); 
  if (data) {
    menus = data;
    renderMenuTable();
  }
}

function renderMenuTable() {
  if (!menuTableBody) return;
  menuTableBody.innerHTML = ''; 
  if (!menus || menus.length === 0) {
    menuTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">Belum ada menu.</td></tr>`;
    document.getElementById('stat-total-menu').textContent = 0;
    return;
  }

  menus.forEach((item, index) => {
    menuTableBody.innerHTML += `
      <tr>
        <td class="ps-4">${index + 1}</td>
        <td class="fw-bold">${item.name}</td>
        <td><span class="badge bg-secondary">${item.category}</span></td>
        <td>Rp ${Number(item.price).toLocaleString('id-ID')}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-outline-warning me-2 btn-edit" data-id="${item.id}" title="Edit"><i class="bi bi-pencil-square pointer-events-none"></i></button>
          <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${item.id}" title="Hapus"><i class="bi bi-trash pointer-events-none"></i></button>
        </td>
      </tr>
    `;
  });
  const statMenu = document.getElementById('stat-total-menu');
  if(statMenu) statMenu.textContent = menus.length;
}

addMenuForm?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const newMenu = {
    name: document.getElementById('menuName').value,
    category: document.getElementById('menuCategory').value,
    price: parseInt(document.getElementById('menuPrice').value)
  };
  await api.post('/menu', newMenu);
  fetchMenus(); 
  addMenuForm.reset();
  bootstrap.Modal.getInstance(document.getElementById('addMenuModal')).hide();
});

menuTableBody?.addEventListener('click', async function(e) {
  const editBtn = e.target.closest('.btn-edit');
  const deleteBtn = e.target.closest('.btn-delete');

  if (deleteBtn) {
    const id = parseInt(deleteBtn.getAttribute('data-id'));
    if (confirm('Hapus menu ini?')) {
      await api.delete(`/menu/${id}`);
      fetchMenus(); 
    }
  }

  if (editBtn) {
    const id = parseInt(editBtn.getAttribute('data-id'));
    const menuToEdit = menus.find(m => m.id === id);
    if (menuToEdit) {
      document.getElementById('editMenuId').value = menuToEdit.id;
      document.getElementById('editMenuName').value = menuToEdit.name;
      document.getElementById('editMenuCategory').value = menuToEdit.category;
      document.getElementById('editMenuPrice').value = menuToEdit.price;
      new bootstrap.Modal(document.getElementById('editMenuModal')).show();
    }
  }
});

editMenuForm?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const idToUpdate = document.getElementById('editMenuId').value;
  const updatedData = {
    name: document.getElementById('editMenuName').value,
    category: document.getElementById('editMenuCategory').value,
    price: parseInt(document.getElementById('editMenuPrice').value)
  };
  await api.put(`/menu/${idToUpdate}`, updatedData);
  fetchMenus();
  bootstrap.Modal.getInstance(document.getElementById('editMenuModal')).hide();
});


// ==========================================
// 2. FITUR MANAJEMEN MEJA
// ==========================================
const tableContainer = document.getElementById('table-container');
const addTableForm = document.getElementById('addTableForm');

async function fetchTables() {
  const data = await api.get('/tables'); 
  if (data) {
    tables = data;
    renderTables();
  }
}

function renderTables() {
  if (!tableContainer) return;
  tableContainer.innerHTML = '';
  if (!tables || tables.length === 0) {
    tableContainer.innerHTML = `<div class="col-12"><div class="alert alert-light border shadow-sm text-center py-4">Belum ada meja.</div></div>`;
    return;
  }

  tables.forEach(table => {
    const badgeColor = table.status === 'kosong' ? 'bg-success' : 'bg-danger';
    tableContainer.innerHTML += `
      <div class="col-md-3 col-sm-6">
        <div class="card shadow-sm border-0 rounded-4 text-center p-4">
          <h1 class="display-3 fw-bold mb-0 text-dark">${table.table_number}</h1>
          <p class="text-muted fw-bold mb-2">Meja</p>
          <span class="badge ${badgeColor} mb-3 p-2 fs-6 rounded-pill">${table.status.toUpperCase()}</span>
          <button class="btn btn-sm btn-outline-danger btn-delete-table w-100 fw-bold" data-id="${table.id}">Hapus</button>
        </div>
      </div>
    `;
  });
}

addTableForm?.addEventListener('submit', async function(e) {
  e.preventDefault();
  await api.post('/tables', { table_number: parseInt(document.getElementById('tableNumber').value) });
  fetchTables();
  addTableForm.reset();
  bootstrap.Modal.getInstance(document.getElementById('addTableModal')).hide();
});

tableContainer?.addEventListener('click', async function(e) {
  if (e.target.classList.contains('btn-delete-table')) {
    const id = e.target.getAttribute('data-id');
    if (confirm('Hapus meja ini?')) {
      await api.delete(`/tables/${id}`);
      fetchTables();
    }
  }
});


// ==========================================
// 3. FITUR DAFTAR PESANAN
// ==========================================
const ordersTableBody = document.getElementById('orders-table-body');

async function fetchOrders() {
  const data = await api.get('/orders'); 
  if (data) {
    orders = data;
    renderOrders();
  }
}

function renderOrders() {
  if (!ordersTableBody) return;
  ordersTableBody.innerHTML = '';
  if (!orders || orders.length === 0) {
    ordersTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">Belum ada pesanan aktif.</td></tr>`;
    return;
  }

  orders.forEach(order => {
    const date = new Date(order.createdAt).toLocaleString('id-ID');
    const tableNum = order.Table ? order.Table.table_number : '-'; 
    const badgeColor = order.status === 'pending' ? 'bg-warning text-dark' : 'bg-success';

    ordersTableBody.innerHTML += `
      <tr>
        <td class="ps-4 fw-bold text-primary">#ORD-${order.id}</td>
        <td class="fw-bold">Meja ${tableNum}</td>
        <td>Rp ${Number(order.total_price || 0).toLocaleString('id-ID')}</td>
        <td><span class="badge ${badgeColor}">${order.status.toUpperCase()}</span></td>
        <td>${date}</td>
      </tr>
    `;
  });
}


// ==========================================
// 4. FITUR BUAT PESANAN BARU (KASIR)
// ==========================================
const btnOpenOrderModal = document.getElementById('btnOpenOrderModal');
const btnAddOrderItem = document.getElementById('btnAddOrderItem');
const orderItemsContainer = document.getElementById('orderItemsContainer');
const orderTotalPriceEl = document.getElementById('orderTotalPrice');
const addOrderForm = document.getElementById('addOrderForm');

btnOpenOrderModal?.addEventListener('click', () => {
  const tableSelect = document.getElementById('orderTableId');
  tableSelect.innerHTML = '<option value="" disabled selected>Pilih Meja...</option>';
  
  tables.forEach(t => {
    tableSelect.innerHTML += `<option value="${t.id}">Meja ${t.table_number} (${t.status})</option>`;
  });

  orderItemsContainer.innerHTML = '';
  addOrderItemRow();
  calculateOrderTotal();
  new bootstrap.Modal(document.getElementById('addOrderModal')).show();
});

function addOrderItemRow() {
  let menuOptions = '<option value="" disabled selected>Pilih Menu...</option>';
  menus.forEach(m => {
    menuOptions += `<option value="${m.id}" data-price="${m.price}">${m.name} - Rp ${m.price}</option>`;
  });

  const rowHtml = `
    <div class="row g-2 mb-2 order-item-row">
      <div class="col-7">
        <select class="form-select menu-select" required>${menuOptions}</select>
      </div>
      <div class="col-3">
        <input type="number" class="form-control qty-input" placeholder="Qty" min="1" value="1" required>
      </div>
      <div class="col-2">
        <button type="button" class="btn btn-danger w-100 btn-remove-row"><i class="bi bi-trash pointer-events-none"></i></button>
      </div>
    </div>
  `;
  orderItemsContainer.insertAdjacentHTML('beforeend', rowHtml);
}

btnAddOrderItem?.addEventListener('click', addOrderItemRow);

orderItemsContainer?.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-remove-row')) {
    e.target.closest('.order-item-row').remove();
    calculateOrderTotal();
  }
});

orderItemsContainer?.addEventListener('change', calculateOrderTotal);
orderItemsContainer?.addEventListener('keyup', calculateOrderTotal);

function calculateOrderTotal() {
  let total = 0;
  document.querySelectorAll('.order-item-row').forEach(row => {
    const select = row.querySelector('.menu-select');
    const qty = row.querySelector('.qty-input').value;
    if (select.value && qty) {
      const price = select.options[select.selectedIndex].getAttribute('data-price');
      total += (parseInt(price) * parseInt(qty));
    }
  });
  orderTotalPriceEl.innerText = `Rp ${total.toLocaleString('id-ID')}`;
  return total;
}

addOrderForm?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const table_id = document.getElementById('orderTableId').value;
  const items = [];
  
  document.querySelectorAll('.order-item-row').forEach(row => {
    const select = row.querySelector('.menu-select');
    const qty = row.querySelector('.qty-input').value;
    if (select.value && qty > 0) {
      items.push({
        menu_id: parseInt(select.value),
        quantity: parseInt(qty),
        price: parseFloat(select.options[select.selectedIndex].getAttribute('data-price'))
      });
    }
  });

  if (items.length === 0) {
    alert('Pilih minimal 1 menu.');
    return;
  }

  const payload = {
    table_id: parseInt(table_id),
    total_price: calculateOrderTotal(),
    status: 'pending',
    items: items
  };

  try {
    await api.post('/orders', payload);
    fetchOrders(); 
    bootstrap.Modal.getInstance(document.getElementById('addOrderModal')).hide();
  } catch (error) {
    alert('Terjadi kesalahan saat membuat pesanan.');
  }
});