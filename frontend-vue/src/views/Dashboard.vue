<script setup>
import { ref } from "vue";
// Ubah dari "../components/menu/MenuList.vue" menjadi:
import MenuList from "../components/MenuList.vue";

// Ubah dari "../components/cart/Cart.vue" menjadi:
import Cart from "../components/Cart.vue";

const cart = ref([]);

function add(menu) {
  const item = cart.value.find(i => i.menu_id === menu.id);

  if (item) item.quantity++;
  else {
    cart.value.push({
      menu_id: menu.id,
      name: menu.name,
      price: menu.price,
      quantity: 1,
    });
  }
}

function inc(id) {
  const item = cart.value.find(i => i.menu_id === id);
  item.quantity++;
}

function dec(id) {
  const item = cart.value.find(i => i.menu_id === id);

  if (item.quantity > 1) item.quantity--;
  else cart.value = cart.value.filter(i => i.menu_id !== id);
}

function clear() {
  cart.value = [];
}
</script>

<template>
  <div class="container">
    <MenuList @add="add" />
    
    <Cart 
      :cart="cart"
      @inc="inc"
      @dec="dec"
      @clear="clear"
    />
  </div>
</template>

<style>
.container {
  display: flex;
  gap: 20px;
  padding: 20px;
}
</style>