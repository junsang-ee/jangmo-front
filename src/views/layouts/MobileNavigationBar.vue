<template>
    <v-navigation-drawer 
      v-if="isMobile"
      v-model="menuVisible"
      right 
      temporary 
      app
    >
    <v-list>
      <v-list-item class="category-title">
        <v-list-item-title>
          내 계정
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        v-for="(item, index) in categories"
        :key="index"
        @click="selectCategory(item.component)"
        @mouseover="hoveredCategory = index"
        @mouseleave="hoveredCategory = null"
        :class="{ hovered: hoveredCategory === index, active: selectedCategory === item.component }"
      >
        <v-list-item-title class="list-item">
          {{ item.name }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
  
<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useNavigationStore } from "@/store/navigation";
import { useTokenStore } from "@/store/auth";
import { useUserInfoStore } from "@/store/user";
import { storeToRefs } from "pinia";
  
const router = useRouter();
const route = useRoute();

const $auth = useTokenStore();
const $userInfo = useUserInfoStore();
const categories = [
  { name: "계정관리", component: "UserDetail" },
  { name: "스케쥴관리", component: "NotFound" },
  { name: "로그아웃", component: "Login" }
];
const selectedCategory = ref("");
const hoveredCategory = ref(null);
const isMobile = ref(window.innerWidth <= 768);

const $navigation = useNavigationStore();
const { menuVisible } = storeToRefs($navigation);
  
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 768;
});

const resetCategory = () => {
  selectedCategory.value = "";
  hoveredCategory.value = null;
}
const selectCategory = (component) => {
  if (component === "Login") {
    if (confirm("로그아웃 하시겠습니까?")) {
      $auth.reset();
      $userInfo.reset();
    } else return;
  } else {
    selectedCategory.value = component;
  }
  closeMenu();
  router.push({name: component})
};
  
const closeMenu = () => {
  $navigation.closeMenu();
}

watch(() => route.name, (routeName) => {
  if (routeName === "Dashboard")
    resetCategory();
}, {immediate : true});
</script>
  
<style scoped>
  
.category-title .v-list-item-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 16px;
}
  
.hovered {
  background-color: lightgray;
}

.active {
  background-color: darkgray;
}
</style>
  