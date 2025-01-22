<template>
  <v-app>
    <HeaderLayout />
    <NavigationLayout v-show="menuVisible" />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>

import HeaderLayout from '@/views/layouts/HeaderLayout.vue';
import NavigationLayout from '@/views/layouts/NavigationLayout.vue';
import { useNavigationStore } from "@/store/navigation";
import { useTokenStore } from "@/store/auth";
import { useUserInfoStore } from "@/store/user";
import { tokenValidator } from "@/utils/util-auth";
import { storeToRefs } from 'pinia';
import { useRouter} from "vue-router";

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
</script>

<style scope>

.v-main {
  padding-top: 64px;
}

@media (max-width: 768px) {
  .v-main {
    padding: 16px;
  }
}

</style>