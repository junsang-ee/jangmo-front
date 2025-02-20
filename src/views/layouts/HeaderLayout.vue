<template>
  <v-app-bar app color="#8c9eff" dark>
    <v-toolbar-title class="logo" @click="navigate('Dashboard')">JangmoFC</v-toolbar-title>
    <div v-if="!isLoggedOut()">
      <v-spacer></v-spacer>
      <v-btn icon @click="navigate('Dashboard')">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn icon v-if="isMobile" @click="handleToggleMenu">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <v-btn v-else @click="handleToggleMenu">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useNavigationStore } from "@/store/navigation";
import { useTokenStore } from "@/store/auth";
import { useUserInfoStore } from "@/store/user";

const router = useRouter();
const route = useRoute();
const $auth = useTokenStore();
const $userInfo = useUserInfoStore();
const isMobile = ref(false);
const isUserInfoPage = ref(false);
const $navigation = useNavigationStore();

const isLoggedOut = () => $auth.isNullable() && $userInfo.isNullable();

const handleToggleMenu = () => {
  if ($navigation.getMenuVisible() && !isMobile.value)
    return;

  $navigation.toggleMenu();
};

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

watch(() => route.name, (routeName) => {
  isUserInfoPage.value = routeName === 'UserInfo';
}, { immediate: true });

const navigate = (component) => {
  if (component === "Dashboard") {
    $navigation.closeMenu();
  }
  router.push({ name: component });
};

onMounted(async () => {
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
