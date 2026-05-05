<script setup>
import { computed, ref } from "vue";
import { api } from "../services/api";
import TableSelect from "./TableSelect.vue";

const props = defineProps(["cart"]);
const emit = defineEmits(["inc", "dec", "clear"]);

const table_id = ref("");

const total = computed(() =>
  props.cart.reduce((t, i) => t + i.price * i.quantity, 0)
);
async function checkout() {
  if (!table_id.value) return alert("Pilih meja dulu!");

  try {
    // Ubah formatnya menjadi .post(url, data)
    await api.post("/orders", {
      table_id: table_id.value,
      items: props.cart,
    });
    
    alert("Pesanan berhasil dikirim!");
    emit("clear");
  } catch (error) {
    console.error("Gagal checkout:", error);
    alert("Terjadi kesalahan saat mengirim pesanan.");
  }
}
</script>

<template>
  <div class="cart">
    <h2>🛒 Cart</h2>

    <TableSelect v-model="table_id" />

    <div v-if="cart.length === 0">Cart kosong</div>

    <div v-for="item in cart" :key="item.menu_id" class="item">
      <div>
        <strong>{{ item.name }}</strong>
        <p>Rp {{ item.price }}</p>
      </div>

      <div class="qty">
        <button @click="emit('dec', item.menu_id)">-</button>
        <span>{{ item.quantity }}</span>
        <button @click="emit('inc', item.menu_id)">+</button>
      </div>
    </div>

    <h3>Total: Rp {{ total }}</h3>

    <button class="checkout" @click="checkout">
      Checkout
    </button>
  </div>
</template>

<style scoped>
.cart {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
}

.item {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.qty button {
  margin: 0 5px;
}

.checkout {
  width: 100%;
  padding: 10px;
  background: green;
  color: white;
  border: none;
  margin-top: 10px;
}
</style>