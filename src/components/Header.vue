<template>
  <v-app-bar app color="#8c9eff" dark>
    <v-toolbar-title class="logo" @click="navigate('Dashboard')">JangmoFC</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="navigate('Dashboard')">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    
    <v-btn v-if="!isMenuVisible" icon @click="navigate('UserDetail')">
      <v-icon>mdi-account</v-icon>
    </v-btn>
    <v-btn v-else icon @click="openMenu">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isMenuVisible = ref(false);
const isMobile = ref(false);

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName === 'UserDetail' && isMobile.value) {
      isMenuVisible.value = true;
    } else {
      isMenuVisible.value = false;
    }
  },
  { immediate: true }
);

const navigate = (component) => {
  router.push({ name: component });
}

const openMenu = () => {
  console.log('Mobile menu opened');
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
  });
});

</script>
  
<style scoped>
.v-app-bar {
  z-index: 1000;
}

.logo {
  cursor: pointer;
}

</style>