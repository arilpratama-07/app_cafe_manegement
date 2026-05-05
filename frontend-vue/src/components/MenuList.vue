<script setup>
import { ref, onMounted } from "vue";
import { api } from "../services/api";

// 1. Deklarasikan variabel reaktif 'menus' agar bisa digunakan di template
const menus = ref([]);

// 2. Deklarasikan event 'add' untuk dikirim ke Dashboard.vue
const emit = defineEmits(["add"]);

// 3. Ambil data dari backend saat komponen dimuat (onMounted)
onMounted(async () => {
  try {
    // Memanggil API GET http://localhost:5000/menu
    const response = await api.get("/menu");
    // Masukkan data dari database ke dalam variabel menus
    menus.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil data menu:", error);
  }
});
</script>

<template>
  <div class="menu">
    <h2>🍽️ Menu</h2>

    <!-- Tampilkan pesan jika data masih kosong -->
    <div v-if="menus.length === 0" style="padding: 20px; color: #888;">
      Menghubungkan ke server atau menu kosong...
    </div>

    <div class="grid">
      <div
        v-for="m in menus"
        :key="m.id"
        class="card"
        @click="$emit('add', m)"
      >
        <h3>{{ m.name }}</h3>
        <p>Rp {{ m.price.toLocaleString('id-ID') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu {
  flex: 2;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.card {
  padding: 15px;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.card:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

h3 {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
}

p {
  margin: 0;
  font-weight: bold;
  color: #2c3e50;
}
</style>