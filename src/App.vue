<template>
  <v-app>
    <HeaderLayout />
    <MobileNavigationBar v-show="menuVisible" />
    <WebNavigationBar v-if="menuVisible && !isMobile"/>
    <v-main>
      <v-container fluid class="main-container">
        <router-view />
      </v-container>
    </v-main>
    <v-overlay
        :model-value="$loading.isLoading"
        class="align-center justify-center">
      <v-progress-circular
          color="primary"
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script setup>

import { onMounted, ref } from "vue";
import HeaderLayout from '@/views/layouts/HeaderLayout.vue';
import MobileNavigationBar from '@/views/layouts/MobileNavigationBar.vue';
import WebNavigationBar from '@/views/layouts/WebNavigationBar.vue';
import { useNavigationStore } from "@/store/navigation";
import { useTokenStore } from "@/store/auth";
import { useUserInfoStore } from "@/store/user";
import { tokenValidator } from "@/utils/util-auth";
import { storeToRefs } from 'pinia';
import { useRouter} from "vue-router";
import { useLoadingStore } from "@/store/loading";

const isMobile = ref(false);
const $auth = useTokenStore();
const $userInfo = useUserInfoStore();
const $navigation = useNavigationStore();
const $loading = useLoadingStore();
const { menuVisible } = storeToRefs($navigation); 
const router = useRouter();

router.beforeEach((to, from, next) => {
  document.title = "JangmoFC";

  if (to?.name?.startsWith("Login")) {
    $auth.reset();
    $userInfo.reset();
    $navigation.closeMenu();
    return next();
  } else {
    if (to?.name?.startsWith("Dashboard")) {
      $navigation.closeMenu();
    }
    try {
      if (tokenValidator($auth.getToken())) {
        next();
      }
    } catch (toPath) {
      if (from.name === "Login") {
        next(false);
      } else {
        next({ name : toPath});
      }
    }
  }
});

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

</script>

<style scope>

.main-container {
  padding-top: 64px;
}

@media (max-width: 768px) {
  .main-container {
    padding-top: 56px
  }
}

</style>