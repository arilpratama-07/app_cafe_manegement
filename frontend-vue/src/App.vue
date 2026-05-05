<script setup>
import { ref } from "vue";
import MenuList from "./components/MenuList.vue";
import Cart from "./components/Cart.vue";


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

function update(action) {
  if (action.type === "inc") {
    const item = cart.value.find(i => i.menu_id === action.id);
    item.quantity++;
  }

  if (action.type === "dec") {
    const item = cart.value.find(i => i.menu_id === action.id);
    if (item.quantity > 1) item.quantity--;
    else cart.value = cart.value.filter(i => i.menu_id !== action.id);
  }

  if (action.type === "clear") {
    cart.value = [];
  }
}
</script>

<template>
  <div style="display:flex; gap:20px;">
    <MenuList @add="add" />
    <Cart :cart="cart" @update="update" />
  </div>
  
</template>