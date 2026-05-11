import api from './api.js';

// --- VARIABEL GLOBAL (PENAMPUNG DATA) ---
let daftarMenu = [];      // Menyimpan daftar menu dari server
let daftarMeja = [];      // Menyimpan daftar meja dari server
let daftarPesanan = [];   // Menyimpan riwayat pesanan dari server
let keranjang = [];       // Menyimpan item yang dipilih pelanggan untuk dipesan

// === 1. ROUTING & NAVIGASI ===
function aturNavigasi() {
  const hashURL = window.location.hash || '#dashboard';
  const idTarget = hashURL.replace('#', '');

  // Sembunyikan semua bagian section dan hapus status active pada menu navigasi
  document.querySelectorAll('.view-section').forEach(bagian => bagian.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(tautan => tautan.classList.remove('active'));
  
  // Tampilkan bagian yang dipilih dan tandai menu navigasi sebagai active
  const bagianTarget = document.getElementById(idTarget);
  if (bagianTarget) bagianTarget.classList.add('active');
  document.getElementById(`nav-${idTarget}`)?.classList.add('active');

  // Eksekusi fungsi pengambilan data sesuai halaman yang sedang dibuka
  if (idTarget === 'dashboard') perbaruiStatistikDashboard();
  if (idTarget === 'menu') ambilDataMenu();
  if (idTarget === 'tables') ambilDataMeja();
  if (idTarget === 'orders') ambilDataPesanan();
}

window.addEventListener('hashchange', aturNavigasi);
window.addEventListener('DOMContentLoaded', aturNavigasi);

// === 2. FUNGSI UPDATE STATISTIK DASHBOARD ===
async function perbaruiStatistikDashboard() {
  try {
    const [dataMenu, dataMeja, dataPesanan] = await Promise.all([
      api.get('/menu'),
      api.get('/tables'),
      api.get('/orders')
    ]);

    if(document.getElementById('total-menu')) 
      document.getElementById('total-menu').innerText = dataMenu ? dataMenu.length : 0;
    
    if(document.getElementById('total-tables')) 
      document.getElementById('total-tables').innerText = dataMeja ? dataMeja.length : 0;
    
    if(document.getElementById('active-orders')) {
      const jumlahAktif = dataPesanan ? dataPesanan.filter(p => p.status === 'pending').length : 0;
      document.getElementById('active-orders').innerText = jumlahAktif;
    }
  } catch (err) {
    console.error("Gagal update dashboard:", err);
  }
}

// === 3. MANAJEMEN KATALOG MENU ===
async function ambilDataMenu() { 
  const data = await api.get('/menu');
  if (data) { 
    daftarMenu = data; 
    tampilkanKartuMenu(); 
  }
}

function tampilkanKartuMenu() {
  const kisiMenu = document.getElementById('menu-grid');
  if (!kisiMenu) return;
  kisiMenu.innerHTML = '';

  if (daftarMenu.length === 0) {
    kisiMenu.innerHTML = `<div class="col-12 text-center py-5 text-muted">Belum ada menu.</div>`;
    return;
  }
  
  daftarMenu.forEach(item => {
    let sumberGambar = item.image ? `http://localhost:5000${item.image.startsWith('/') ? item.image : '/' + item.image}` : '';
    kisiMenu.innerHTML += `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card menu-card shadow-sm h-100 border-0 rounded-4">
          <div class="img-container position-relative d-flex flex-column align-items-center justify-content-center" style="height: 160px; background-color: #e9ecef;">
            <img src="${sumberGambar}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div style="display:none; color:#6c757d;"><i class="bi bi-image fs-2"></i></div> 
            <div class="position-absolute top-0 end-0 p-2">
              <button class="btn btn-light btn-sm rounded-circle shadow-sm me-1 btn-edit-menu" data-id="${item.id}"><i class="bi bi-pencil-fill text-primary"></i></button>
              <button class="btn btn-light btn-sm rounded-circle shadow-sm btn-delete-menu" data-id="${item.id}"><i class="bi bi-trash-fill text-danger"></i></button>
            </div>
          </div>
          <div class="card-body p-3 d-flex flex-column">
            <h6 class="fw-bold mb-1">${item.name}</h6>
            <p class="text-muted small mb-2">${item.category}</p>
            <div class="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
              <span class="fw-bold text-success small">Rp ${Number(item.price).toLocaleString('id-ID')}</span>
              <button class="btn btn-warning btn-sm rounded-circle btn-add-cart" data-id="${item.id}"><i class="bi bi-plus-lg"></i></button>
            </div>
          </div>
        </div>
      </div>`;
  });
}

// === 4. LOGIKA KERANJANG BELANJA ===
function perbaruiJumlahKeranjang() {
  const total = keranjang.reduce((acc, curr) => acc + curr.quantity, 0);
  const badge = document.getElementById('cart-count');
  const badgeMobile = document.getElementById('cart-count-mobile');
  if (badge) badge.innerText = total;
  if (badgeMobile) badgeMobile.innerText = total;
}

document.getElementById('btnOpenCart')?.addEventListener('click', () => {
  const list = document.getElementById('cart-items-list');
  const tableSelect = document.getElementById('cartTableId');
  let totalHarga = 0;
  
  list.innerHTML = keranjang.length === 0 ? '<p class="text-center text-muted">Keranjang kosong</p>' : '';
  
  keranjang.forEach((item, idx) => {
    const subtotal = item.price * item.quantity;
    totalHarga += subtotal;
    list.innerHTML += `
      <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
        <div><div class="fw-bold text-truncate" style="max-width:150px;">${item.name}</div><small class="text-muted">Rp ${item.price.toLocaleString('id-ID')}</small></div>
        <div class="d-flex align-items-center">
          <button class="btn btn-sm btn-outline-dark px-2 py-0 btn-minus-qty" data-index="${idx}">-</button>
          <span class="mx-2 fw-bold">${item.quantity}</span>
          <button class="btn btn-sm btn-outline-dark px-2 py-0 btn-plus-qty" data-index="${idx}">+</button>
          <div class="ms-3 fw-bold text-end" style="min-width: 80px;">Rp ${subtotal.toLocaleString('id-ID')}</div>
          <button class="btn btn-sm text-danger ms-2 btn-remove-cart" data-index="${idx}"><i class="bi bi-trash"></i></button>
        </div>
      </div>`;
  });
  
  api.get('/tables').then(data => {
    tableSelect.innerHTML = '<option value="" disabled selected>Pilih Meja...</option>';
    if(data) data.filter(m => m.status === 'kosong').forEach(m => {
      tableSelect.innerHTML += `<option value="${m.id}">Meja ${m.table_number}</option>`;
    });
  });
  
  document.getElementById('cartTotalLabel').innerText = `Rp ${totalHarga.toLocaleString('id-ID')}`;
  new bootstrap.Modal(document.getElementById('cartModal')).show();
});

// === 5. EVENT LISTENER GLOBAL ===
document.addEventListener('click', async (e) => {
  const target = e.target;

  // Add to Cart
  if (target.closest('.btn-add-cart')) {
    const id = parseInt(target.closest('.btn-add-cart').dataset.id);
    const item = daftarMenu.find(m => m.id === id);
    const ada = keranjang.find(k => k.menu_id === id);
    if (ada) ada.quantity++;
    else keranjang.push({ menu_id: id, name: item.name, price: item.price, quantity: 1 });
    perbaruiJumlahKeranjang();
  }

  // Qty Control
  if (target.closest('.btn-plus-qty')) {
    keranjang[target.closest('.btn-plus-qty').dataset.index].quantity++;
    perbaruiJumlahKeranjang(); document.getElementById('btnOpenCart').click();
  }
  if (target.closest('.btn-minus-qty')) {
    const idx = target.closest('.btn-minus-qty').dataset.index;
    if (keranjang[idx].quantity > 1) keranjang[idx].quantity--;
    else keranjang.splice(idx, 1);
    perbaruiJumlahKeranjang(); document.getElementById('btnOpenCart').click();
  }
  if (target.closest('.btn-remove-cart')) {
    keranjang.splice(target.closest('.btn-remove-cart').dataset.index, 1);
    perbaruiJumlahKeranjang(); document.getElementById('btnOpenCart').click();
  }

  // Edit Menu (Fill Data)
  if (target.closest('.btn-edit-menu')) {
    const id = parseInt(target.closest('.btn-edit-menu').dataset.id);
    const menu = daftarMenu.find(m => m.id === id);
    document.getElementById('editMenuId').value = menu.id;
    document.getElementById('editMenuName').value = menu.name;
    document.getElementById('editMenuPrice').value = menu.price;
    new bootstrap.Modal(document.getElementById('editMenuModal')).show();
  }

  // Delete Menu
  if (target.closest('.btn-delete-menu')) {
    if(confirm('Hapus menu ini?')) await api.delete(`/menu/${target.closest('.btn-delete-menu').dataset.id}`).then(ambilDataMenu);
  }

  // Finish Order (Logic: Meja tetap terisi)
  if (target.closest('.btn-finish-order')) {
    if(confirm('Selesaikan pesanan? (Meja tetap terisi hingga reset harian)')) {
      const id = target.closest('.btn-finish-order').dataset.id;
      const res = await fetch(`http://localhost:5000/orders/${id}/finish`, { method: 'PATCH' });
      if (res.ok) { ambilDataPesanan(); ambilDataMeja(); alert('Pesanan diselesaikan!'); }
    }
  }

  // Delete Order
  if (target.closest('.btn-delete-order')) {
    if(confirm('Hapus riwayat pesanan?')) await api.delete(`/orders/${target.closest('.btn-delete-order').dataset.id}`).then(ambilDataPesanan);
  }
});

// === 6. FORM SUBMIT ===

// Create Order
document.getElementById('btnSubmitOrder')?.addEventListener('click', async () => {
  const tableId = document.getElementById('cartTableId').value;
  if (!tableId || keranjang.length === 0) return alert('Pilih meja dan menu!');
  
  await api.post('/orders', {
    table_id: parseInt(tableId),
    total_price: keranjang.reduce((acc, k) => acc + (k.price * k.quantity), 0),
    items: keranjang.map(k => ({ menu_id: k.menu_id, quantity: k.quantity, price: k.price }))
  });
  
  keranjang = []; perbaruiJumlahKeranjang();
  bootstrap.Modal.getInstance(document.getElementById('cartModal')).hide();
  ambilDataPesanan(); ambilDataMeja(); alert('Pesanan terkirim!');
});

// Add Menu
document.getElementById('addMenuForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData();
  fd.append('name', document.getElementById('menuName').value);
  fd.append('category', document.getElementById('menuCategory').value);
  fd.append('price', document.getElementById('menuPrice').value);
  if (document.getElementById('menuImage').files[0]) fd.append('image', document.getElementById('menuImage').files[0]);
  
  await api.post('/menu', fd);
  ambilDataMenu(); e.target.reset();
  bootstrap.Modal.getInstance(document.getElementById('addMenuModal')).hide();
});

// Edit Menu Submit
document.getElementById('editMenuForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('editMenuId').value;
  const fd = new FormData();
  fd.append('name', document.getElementById('editMenuName').value);
  fd.append('category', document.getElementById('editMenuCategory').value);
  fd.append('price', document.getElementById('editMenuPrice').value);
  
  const fileInput = document.getElementById('editMenuImage');
  if (fileInput.files[0]) fd.append('image', fileInput.files[0]);

  try {
    await api.put(`/menu/${id}`, fd);
    ambilDataMenu();
    bootstrap.Modal.getInstance(document.getElementById('editMenuModal')).hide();
    alert('Menu diperbarui!');
  } catch (err) { console.error(err); }
});

// Add Table
document.getElementById('addTableForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  await api.post('/tables', { table_number: document.getElementById('tableNumber').value });
  ambilDataMeja(); e.target.reset();
  bootstrap.Modal.getInstance(document.getElementById('addTableModal')).hide();
});

// === 7. ADMIN DATA FETCH ===
async function ambilDataMeja() {
  const data = await api.get('/tables');
  if (data) {
    const container = document.getElementById('table-container');
    if (!container) return;
    container.innerHTML = '';
    data.forEach(m => {
      container.innerHTML += `
        <div class="col-6 col-md-3">
          <div class="card shadow-sm border-0 rounded-4 text-center p-4">
            <h1>${m.table_number}</h1>
            <span class="badge ${m.status === 'kosong' ? 'bg-success' : 'bg-danger'} mb-3">${m.status}</span>
            <button class="btn btn-sm btn-outline-danger btn-delete-table" data-id="${m.id}">Hapus</button>
          </div>
        </div>`;
    });
  }
}

// === 7. ADMIN DATA FETCH ===
// ... (biarkan fungsi ambilDataMeja di atasnya tetap ada) ...

async function ambilDataPesanan() {
  try {
    const data = await api.get('/orders');
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;
    
    // Pastikan colspan 6 karena ada 6 kolom
    tbody.innerHTML = data?.length ? '' : '<tr><td colspan="6" class="text-center py-3">Kosong</td></tr>';

    data?.forEach(p => {
      // 1. Susun daftar menu yang dipesan (Badge abu-abu)
      let detailMenu = '';
      if (p.OrderItems && p.OrderItems.length > 0) {
        detailMenu = p.OrderItems.map(item => {
          const menuTerkait = daftarMenu.find(m => m.id === item.menu_id);
          const namaMenu = menuTerkait ? menuTerkait.name : 'Item Dihapus';
          return `<span class="badge bg-secondary mb-1 me-1">${item.quantity}x ${namaMenu}</span>`;
        }).join('');
      } else {
        detailMenu = '<span class="text-muted small">-</span>'; // Jika data lama tidak punya detail
      }

      // 2. Cetak baris tabel sesuai URUTAN SCREENSHOT ANDA
      tbody.innerHTML += `
        <tr>
          <td class="ps-4 fw-bold">#ORD-${p.id}</td>
          
          <td>Meja ${p.Table?.table_number || '??'}</td>
          
          <td>Rp ${p.total_price.toLocaleString('id-ID')}</td>
          
          <td style="max-width: 250px; line-height: 1.8;">${detailMenu}</td>
          
          <td><span class="badge ${p.status === 'pending' ? 'bg-warning text-dark' : 'bg-success'}">${p.status}</span></td>
          
          <td class="text-center">
            ${p.status === 'pending' ? `<button class="btn btn-sm btn-success btn-finish-order me-1" data-id="${p.id}">Selesai</button>` : ''}
            <button class="btn btn-sm btn-outline-danger btn-delete-order" data-id="${p.id}"><i class="bi bi-trash"></i></button>
          </td>
        </tr>`;
    });
  } catch (err) { 
    console.error("Error ambil pesanan:", err); 
  }
}