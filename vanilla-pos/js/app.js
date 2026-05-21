import api from './api.js';

let daftarMenu = [];
let daftarMeja = [];
let daftarPesanan = [];
let keranjang = [];

const BASE_URL = 'https://app-cafe-manegement.vercel.app';

// === 1. NAVIGASI & KONTROL AKSES ===
function aturNavigasi() {
  try {
    let user = null;
    try { user = JSON.parse(localStorage.getItem('userLogin')); } catch (e) {}

    // Jika belum login, paksa masuk ke layar login
    if (!user) {
      window.location.hash = '#login';
      document.querySelectorAll('.view-section').forEach(bagian => {
        bagian.classList.remove('active');
        bagian.style.setProperty('display', 'none', 'important');
      });
      const loginPage = document.getElementById('login');
      if (loginPage) {
        loginPage.classList.add('active');
        loginPage.style.setProperty('display', 'block', 'important');
      }
      const sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.style.setProperty('display', 'none', 'important');
      return;
    }

    // Jika URL kosong atau masih di #login padahal sudah sukses autentikasi
    let hashURL = window.location.hash;
    if (!hashURL || hashURL === '#login') {
      window.location.hash = (user.role === 'admin') ? '#dashboard' : '#menu';
      return;
    }

    let idTarget = hashURL.replace('#', '');

    // 🔒 BENTENG PROTEKSI HAK AKSES URL
    if (user.role !== 'admin' && (idTarget === 'dashboard' || idTarget === 'tables')) {
      alert("Akses ditolak! Halaman ini hanya untuk Pegawai/Kasir Cafe.");
      window.location.hash = '#menu';
      return;
    }

    // Bersihkan layar dari tumpukan halaman lama
    document.querySelectorAll('.view-section').forEach(bagian => {
      bagian.classList.remove('active');
      bagian.style.setProperty('display', 'none', 'important');
    });

    // Tampilkan halaman target utama
    const bagianTarget = document.getElementById(idTarget);
    if (bagianTarget) {
      bagianTarget.classList.add('active');
      bagianTarget.style.setProperty('display', 'block', 'important');
    }

    // Atur visibilitas container utama
    const sidebar = document.getElementById('sidebar');
    const btnCart = document.getElementById('btnOpenCart');
    const btnCartMobile = document.getElementById('btnCartMobile');

    // Sinkronisasi class master .is-admin pada body HTML
    document.body.classList.toggle('is-admin', user.role === 'admin');
    
    if (sidebar) sidebar.style.setProperty('display', 'flex', 'important');
    if (btnCart) btnCart.style.setProperty('display', 'block', 'important');
    // ✅ PERBAIKAN 3: Memperbaiki typo properti display pada tombol mobile
    if (btnCartMobile) btnCartMobile.style.setProperty('display', 'block', 'important');

    // 🔒 PERBAIKAN: Menyembunyikan tombol navigasi fisik di Sidebar secara Realtime
    const navDashboard = document.getElementById('nav-dashboard');
    const navTables = document.getElementById('nav-tables');
    
    if (user.role === 'admin') {
      if (navDashboard) navDashboard.style.setProperty('display', 'block', 'important');
      if (navTables) navTables.style.setProperty('display', 'block', 'important');
    } else {
      if (navDashboard) navDashboard.style.setProperty('display', 'none', 'important');
      if (navTables) navTables.style.setProperty('display', 'none', 'important');
    }

    // Perbarui teks info nama pengguna di sidebar
    const userInfo = document.getElementById('user-info');
    const labelTipe = user.role === 'admin' ? 'PEGAWAI' : 'PELANGGAN';
    if (userInfo) userInfo.innerText = `Halo, ${user.username} (${labelTipe})`;

    // Beri indikator warna aktif (kuning) pada menu sidebar yang sedang dibuka
    document.querySelectorAll('.nav-link').forEach(tautan => tautan.classList.remove('active'));
    document.getElementById(`nav-${idTarget}`)?.classList.add('active');

    // Tarik data parsial dari server
    if (idTarget === 'dashboard' && user.role === 'admin') perbaruiStatistikDashboard();
    if (idTarget === 'menu') ambilDataMenu();
    if (idTarget === 'tables' && user.role === 'admin') ambilDataMeja();
    if (idTarget === 'orders') ambilDataPesanan();

  } catch (error) { console.error("Navigasi Error:", error); }
}

window.addEventListener('hashchange', aturNavigasi);
window.addEventListener('DOMContentLoaded', aturNavigasi);

// === 2. DASHBOARD (Hanya Pegawai) ===
async function perbaruiStatistikDashboard() {
  try {
    const [dataMenu, dataMeja, dataPesanan] = await Promise.all([
      api.get('/menu'), api.get('/tables'), api.get('/orders')
    ]);
    if(document.getElementById('total-menu')) document.getElementById('total-menu').innerText = dataMenu ? dataMenu.length : 0;
    if(document.getElementById('total-tables')) document.getElementById('total-tables').innerText = dataMeja ? dataMeja.length : 0;
    if(document.getElementById('active-orders')) document.getElementById('active-orders').innerText = dataPesanan ? dataPesanan.filter(p => p.status === 'pending').length : 0;
  } catch (err) { console.warn("Dashboard error:", err); }
}

// === 3. MENU (Bisa Diakses Semua) ===
async function ambilDataMenu() { 
  const data = await api.get('/menu');
  if (data) { daftarMenu = data; tampilkanKartuMenu(); }
}

function tampilkanKartuMenu() {
  const kisiMenu = document.getElementById('menu-grid');
  if (!kisiMenu) return;
  kisiMenu.innerHTML = '';

  daftarMenu.forEach(item => {
    // ✅ PERBAIKAN 1: Mengubah http://localhost:5000 menjadi BASE_URL (Vercel)
    let sumberGambar = item.image ? `${BASE_URL}${item.image.startsWith('/') ? item.image : '/' + item.image}` : '';
    
    kisiMenu.innerHTML += `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card menu-card shadow-sm h-100 border-0 rounded-4">
          <div class="img-container position-relative d-flex align-items-center justify-content-center" style="height: 160px; background: #f8f9fa;">
            <img src="${sumberGambar}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='https://via.placeholder.com/150?text=Menu'">
            <div class="position-absolute top-0 end-0 p-2 admin-only">
              <button class="btn btn-light btn-sm rounded-circle shadow-sm me-1 btn-edit-menu" data-id="${item.id}"><i class="bi bi-pencil-fill text-primary"></i></button>
              <button class="btn btn-light btn-sm rounded-circle shadow-sm btn-delete-menu" data-id="${item.id}"><i class="bi bi-trash-fill text-danger"></i></button>
            </div>
          </div>
          <div class="card-body p-3 d-flex flex-column">
            <h6 class="fw-bold mb-1 text-truncate">${item.name}</h6>
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

// === 4. PESANAN ===
async function ambilDataPesanan() {
  try {
    const data = await api.get('/orders');
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    let user = null; try { user = JSON.parse(localStorage.getItem('userLogin')); } catch(e) {}

    data?.forEach(p => {
      let detail = p.OrderItems?.map(i => `<span class="badge bg-secondary me-1">${i.quantity}x ${daftarMenu.find(m => m.id === i.menu_id)?.name || 'Item'}</span>`).join('') || '-';

      let kolomAksi = '';
      if (user && user.role === 'admin') {
        kolomAksi = `<td class="text-center">
          ${p.status === 'pending' ? `<button class="btn btn-sm btn-success btn-finish-order me-1" data-id="${p.id}">Selesai</button>` : ''}
          <button class="btn btn-sm btn-outline-danger btn-delete-order" data-id="${p.id}"><i class="bi bi-trash"></i></button>
        </td>`;
      } else {
        kolomAksi = `<td class="text-center">
          ${p.status === 'pending' 
             ? `<span class="badge bg-light text-muted border"><i class="bi bi-clock-history"></i> Diproses Dapur</span>` 
             : `<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-20"><i class="bi bi-check2-circle"></i> Sudah Hidangkan</span>`}
        </td>`;
      }

      tbody.innerHTML += `
        <tr>
          <td class="ps-4 fw-bold">#ORD-${p.id}</td>
          <td>Meja ${p.Table?.table_number || '??'}</td>
          <td>Rp ${p.total_price.toLocaleString('id-ID')}</td>
          <td style="max-width: 250px;">${detail}</td>
          <td><span class="badge ${p.status === 'pending' ? 'bg-warning text-dark' : 'bg-success'}">${p.status}</span></td>
          ${kolomAksi}
        </tr>`;
    });
  } catch (err) { console.error(err); }
}

// === 5. MEJA ===
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
            <span class="badge ${m.status === 'kosong' ? 'bg-success' : 'bg-danger'}">${m.status}</span>
            <button class="btn btn-sm btn-outline-danger btn-delete-table admin-only mt-2" data-id="${m.id}">Hapus</button>
          </div>
        </div>`;
    });
  }
}

// === 6. LOGIN ===
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const user = await api.post('/login', { username, password });
    const unameStr = username.toLowerCase();
    
    if (unameStr.includes('admin') || unameStr.includes('kasir')) {
        user.role = 'admin'; 
    } else {
        user.role = 'user'; 
    }

    localStorage.setItem('userLogin', JSON.stringify(user)); 
    alert(`Berhasil masuk sebagai: ${user.role === 'admin' ? 'PEGAWAI CAFE' : 'PELANGGAN'}`);
    
    window.location.hash = (user.role === 'admin') ? '#dashboard' : '#menu';
    aturNavigasi();
  } catch (err) { 
    alert('Username atau Password salah!'); 
  }
});

// === 7. LOGOUT ===
document.getElementById('btnLogout')?.addEventListener('click', () => {
  if(confirm('Akhiri sesi ini?')) {
    localStorage.removeItem('userLogin');
    window.location.hash = '#login';
    aturNavigasi(); 
  }
});

// === 8. KERANJANG & SUBMIT ===
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
    tableSelect.innerHTML = '<option value="" disabled selected>Pilih Meja Anda...</option>';
    if(data) data.filter(m => m.status === 'kosong').forEach(m => {
      tableSelect.innerHTML += `<option value="${m.id}">Meja ${m.table_number}</option>`;
    });
  });
  
  document.getElementById('cartTotalLabel').innerText = `Rp ${totalHarga.toLocaleString('id-ID')}`;
  new bootstrap.Modal(document.getElementById('cartModal')).show();
});

document.addEventListener('click', async (e) => {
  const target = e.target;
  let user = null; try { user = JSON.parse(localStorage.getItem('userLogin')); } catch(e) {}

  if (target.closest('.btn-add-cart')) {
    const id = parseInt(target.closest('.btn-add-cart').dataset.id);
    const item = daftarMenu.find(m => m.id === id);
    const ada = keranjang.find(k => k.menu_id === id);
    if (ada) ada.quantity++; else keranjang.push({ menu_id: id, name: item.name, price: item.price, quantity: 1 });
    perbaruiJumlahKeranjang();
  }
  if (target.closest('.btn-plus-qty')) {
    keranjang[target.closest('.btn-plus-qty').dataset.index].quantity++;
    perbaruiJumlahKeranjang(); document.getElementById('btnOpenCart').click();
  }
  if (target.closest('.btn-minus-qty')) {
    const idx = target.closest('.btn-minus-qty').dataset.index;
    if (keranjang[idx].quantity > 1) keranjang[idx].quantity--; else keranjang.splice(idx, 1);
    perbaruiJumlahKeranjang(); document.getElementById('btnOpenCart').click();
  }
  if (target.closest('.btn-remove-cart')) {
    keranjang.splice(target.closest('.btn-remove-cart').dataset.index, 1);
    perbaruiJumlahKeranjang(); document.getElementById('btnOpenCart').click();
  }

  // --- API Operator Pegawai ---
  if (target.closest('.btn-edit-menu') && user?.role === 'admin') {
    const id = parseInt(target.closest('.btn-edit-menu').dataset.id);
    const menu = daftarMenu.find(m => m.id === id);
    document.getElementById('editMenuId').value = menu.id;
    document.getElementById('editMenuName').value = menu.name;
    document.getElementById('editMenuPrice').value = menu.price;
    new bootstrap.Modal(document.getElementById('editMenuModal')).show();
  }

  if (target.closest('.btn-delete-menu') && user?.role === 'admin') {
    if(confirm('Hapus menu ini?')) await api.delete(`/menu/${target.closest('.btn-delete-menu').dataset.id}`).then(ambilDataMenu);
  }
  
  if (target.closest('.btn-delete-order') && user?.role === 'admin') {
    if(confirm('Hapus pesanan dari riwayat?')) await api.delete(`/orders/${target.closest('.btn-delete-order').dataset.id}`).then(ambilDataPesanan);
  }
  
  if (target.closest('.btn-delete-table') && user?.role === 'admin') {
    if(confirm('Hapus meja?')) await api.delete(`/tables/${target.closest('.btn-delete-table').dataset.id}`).then(ambilDataMeja);
  }

  if (target.closest('.btn-finish-order') && user?.role === 'admin') {
    if(confirm('Tandai pesanan ini sudah selesai dibuat?')) {
      const id = target.closest('.btn-finish-order').dataset.id;
      // ✅ PERBAIKAN 2: Mengubah http://localhost:5000 menjadi BASE_URL (Vercel)
      const res = await fetch(`${BASE_URL}/orders/${id}/finish`, { method: 'PATCH' });
      if (res.ok) { ambilDataPesanan(); ambilDataMeja(); alert('Pesanan diselesaikan!'); }
    }
  }
});

// Submit Forms
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
  ambilDataPesanan(); ambilDataMeja(); alert('Pesanan terkirim ke kasir!');
});

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
    await api.put(`/menu/${id}`, fd); ambilDataMenu();
    bootstrap.Modal.getInstance(document.getElementById('editMenuModal')).hide(); alert('Menu diperbarui!');
  } catch (err) { console.error(err); }
});

document.getElementById('addTableForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  await api.post('/tables', { table_number: document.getElementById('tableNumber').value });
  ambilDataMeja(); e.target.reset();
  bootstrap.Modal.getInstance(document.getElementById('addTableModal')).hide();
});