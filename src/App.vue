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
  </v-app>
</template>

<script setup>

import { onMounted, onBeforeUnmount, ref } from "vue";
import HeaderLayout from '@/views/layouts/HeaderLayout.vue';
import MobileNavigationBar from '@/views/layouts/MobileNavigationBar.vue';
import WebNavigationBar from '@/views/layouts/WebNavigationBar.vue';
import { useNavigationStore } from "@/store/navigation";
import { useTokenStore } from "@/store/auth";
import { useUserInfoStore } from "@/store/user";
import { tokenValidator } from "@/utils/util-auth";
import { storeToRefs } from 'pinia';
import { useRouter} from "vue-router";

const isMobile = ref(false);
const $auth = useTokenStore();
const $userInfo = useUserInfoStore();
const $navigation = useNavigationStore();
const { menuVisible } = storeToRefs($navigation); 
const router = useRouter();

router.beforeEach((to, from, next) => {
  document.title = "JangmoFC";
  if (to?.name?.startsWith("Login")) {
    $auth.reset()
    $userInfo.reset();
    $navigation.closeMenu();
    next();
  } else if (to?.name?.startsWith("Dashboard")) {
    $navigation.closeMenu();
    next();
  } else {
    try {
      if (tokenValidator($auth.getToken())) {
        next();
      }
    } catch(toPath) {
      if (from.name === "Login") {
        next(false);
      } else {
        next({name: toPath});
      }
    }
  }
})

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

// onBeforeUnmount(() => {
//   // 컴포넌트 언마운트 시 이벤트 리스너 제거
//   window.removeEventListener('resize', handleResize);
// });

</script>

<style scope>

.main-container {
  padding-top: 64px; /* HeaderLayout의 높이에 맞추어 상단 패딩 */
}

@media (max-width: 768px) {
  .main-container {
    padding-top: 56px; /* 모바일에서는 더 작은 헤더를 가정 */
  }
}

</style>