import { defineStore } from "pinia";
import { ref } from "vue";

export const useNavigationStore = defineStore('navigation', () => {
  const menuVisible = ref(false);

  const toggleMenu = () => {
    menuVisible.value = !menuVisible.value;
  };

  const closeMenu = () => {
    menuVisible.value = false;
  };

  const openMenu = () => {
    menuVisible.value = true;
  };

  return { menuVisible, toggleMenu, closeMenu, openMenu };
}, { persist: true });