<template>
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item class="category-title">
          <v-list-item-title>내 계정</v-list-item-title>
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

const router = useRouter();
const $auth = useTokenStore();
const $userInfo = useUserInfoStore();

const categories = [
  { name: "계정관리", component: "UserDetail" },
  { name: "스케쥴관리", component: "Test" },
  { name: "로그아웃", component: "Login" }
];

const selectedCategory = ref("");

const selectCategory = (component) => {
  selectedCategory.value = component;
  if (component === "Login") {
    if (confirm("로그아웃 하시겠습니까?")) {
      $auth.reset();
      $userInfo.reset();
      router.push({ name: "Login" });
    }
    return;
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
