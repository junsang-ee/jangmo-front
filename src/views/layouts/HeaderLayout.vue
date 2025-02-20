<template>
  <v-app-bar app color="#8c9eff" dark>
    <v-toolbar-title 
      :class="{ logo: !isLoggedOut()}"
      @click="navigate('Dashboard')"
    >
      <span>JangmoFC</span>
    </v-toolbar-title>
    <div v-if="!isLoggedOut()">
      <v-spacer></v-spacer>
      <v-btn icon @click="navigate('Dashboard')">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn icon @click="handleToggleMenu">
        <v-icon v-if="isMobile">mdi-menu</v-icon>
        <v-icon v-else>mdi-account</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useNavigationStore } from "@/store/navigation";
import { useTokenStore } from "@/store/auth";
import { useUserInfoStore } from "@/store/user";

const router = useRouter();
const $auth = useTokenStore();
const $userInfo = useUserInfoStore();
const $navigation = useNavigationStore();
const isMobile = ref(false);

const isLoggedOut = () => $auth.isNullable() && $userInfo.isNullable();

const handleToggleMenu = () => {
  if ($navigation.getMenuVisible() && !isMobile.value)
    return;

  $navigation.toggleMenu();
};

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

const navigate = (component) => {
  if (isLoggedOut) return;
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
