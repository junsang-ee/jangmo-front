<template>
  <v-app-bar app color="#8c9eff" dark>
    <v-toolbar-title class="logo" @click="navigate('Dashboard')">JangmoFC</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="navigate('Dashboard')">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    
    <v-btn icon v-if="isMobile && isUserDetailPage" @click="handleToggleMenu">
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-btn v-else @click="navigate('UserDetail')">
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useNavigationStore } from "@/store/navigation";

const router = useRouter();
const route = useRoute();
const isMobile = ref(false);
const isUserDetailPage = ref(false);
const $navigation = useNavigationStore();

const handleToggleMenu = () => {
  $navigation.toggleMenu();
};

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

watch(() => route.name, (routeName) => {
  isUserDetailPage.value = routeName === 'UserDetail';
}, { immediate: true });

const navigate = (component) => {
  router.push({ name: component });
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