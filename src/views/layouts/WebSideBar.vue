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
        :class="{ active: selectedCategory === item.component }"
      >
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const categories = [
  { name: "계정관리", component: "UserDetail" },
  { name: "스케쥴관리", component: "Schedule" },
  { name: "로그아웃", component: "Login" }
];
const selectedCategory = ref("UserDetail");

const selectCategory = (component) => {
  selectedCategory.value = component;
  router.push({ name: component });
};
</script>

<style scoped>
.v-list-item--active {
  background-color: transparent !important;
}

.v-list-item {
  font-size: .875rem;
  transition: background-color 0.3s ease;
}

.category-title .v-list-item-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 16px;
}

.list-item {
  font-size: 1rem;
  padding-left: 8px;
}

.v-list-item.hovered {
  background-color: #e0e0e0;
}

.v-list-item.active .v-list-item-title {
  color: black !important;
  font-weight: bold !important;
}

.v-list-item.active {
  background-color: #d3d3d3; /* 클릭된 카테고리의 배경색 */
}

.v-container {
  padding-top: 50px;
}

.custom-drawer {
  margin-left: 20px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .category-title .v-list-item-title {
    font-size: 1rem;
    pointer-events: none;
  }

  .list-item {
    font-size: 1rem;
    width: 100%;
  }
}
</style>
