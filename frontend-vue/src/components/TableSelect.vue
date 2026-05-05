<script setup>
import { ref, onMounted } from "vue";
import { api } from "../services/api";

// Menangkap data dari parent (Cart.vue) agar bisa dua arah (v-model)
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const tables = ref([]);

onMounted(async () => {
  try {
    // Mencoba ambil data meja asli dari database
    const response = await api.get("/tables"); 
    tables.value = response.data;
  } catch (error) {
    // Fallback: Kalau tabel di DB belum ada/error, buat data pura-pura dulu
    tables.value = [
      { id: 1, name: "Meja 1" },
      { id: 2, name: "Meja 2" },
      { id: 3, name: "Meja 3" },
      { id: 4, name: "Meja 4" },
      { id: 5, name: "Meja 5" }
    ];
  }
});
</script>

<template>
  <select 
    :value="modelValue" 
    @change="$emit('update:modelValue', $event.target.value)"
    class="select-meja"
  >
    <option value="" disabled>Pilih Meja</option>
    
    <!-- Bagian yang bikin meja jadi berurutan -->
    <option v-for="t in tables" :key="t.id" :value="t.id">
      {{ t.name || 'Meja ' + t.id }}
    </option>
  </select>
</template>

<style scoped>
.select-meja {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.select-meja:focus {
  outline: none;
  border-color: #4CAF50; /* Biar senada dengan tombol checkout */
}
</style>