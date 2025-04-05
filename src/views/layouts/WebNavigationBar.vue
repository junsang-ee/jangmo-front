<template>
  <v-navigation-drawer app permanent>
    <v-list>
      <v-list-item class="category-title">
        <v-list-item-title>
          <span>{{ $userInfo.getInfo().name }}({{ translateUserRole($userInfo.getInfo().role) }})</span> 
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        v-for="(item, index) in categories"
        :key="index"
        @click="selectCategory(item.component)"
        @mouseover="hoveredCategory = index"
        @mouseleave="hoveredCategory = null"
        :class="{ hovered: hoveredCategory === index, 
                  active: selectedCategory === item.component }"
      >
        <v-list-item-title>
          {{ item.name }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useTokenStore } from "@/store/auth";
import { useUserInfoStore } from "@/store/user";
import { translateUserRole } from "@/constants/role.js";
import { getCategories } from "@/constants/category.js";

const router = useRouter();
const $auth = useTokenStore();
const $userInfo = useUserInfoStore();
const selectedCategory = ref("");

const categories = getCategories($userInfo.getInfo().role);

const selectCategory = (component) => {
  if (component === "Login") {
    if (confirm("로그아웃 하시겠습니까?")) {
      $auth.reset();
      $userInfo.reset();
    } else return;
  } else {
    selectedCategory.value = component;
  }
  router.push({ name: component });
};

onMounted(() => {
  selectCategory("UserDetail");
});
</script>

<style scoped>
.v-navigation-drawer {
  width: 240px;
}

.v-list-item--active {
  background-color: transparent !important;
}

.v-list-item {
  font-size: 0.875rem;
  transition: background-color 0.3s ease;
}

.category-title .v-list-item-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 16px;
}

.v-list-item.active .v-list-item-title {
  color: black !important;
  font-weight: bold !important;
}

.v-list-item.active {
  background-color: #d3d3d3;
}
</style>
