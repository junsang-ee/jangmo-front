<template>
  <v-container fluid>
    <v-row>

      <v-col v-if="!isMobile" cols="3">
        <v-list>
          <v-list-item class="category-title">
            <v-list-item-content>
              <v-list-item-title>내 계정</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-for="(item, index) in categories"
            :key="index"
            @click="selectCategory(item)"
            @mouseover="hoveredCategory = index"
            @mouseleave="hoveredCategory = null"
            :class="{
              hovered: hoveredCategory === index,
              active: selectedCategory === item
            }"
          >
            <v-list-item-content>
              <v-list-item-title class="list-item">{{ item }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>

      <v-navigation-drawer v-if="isMobile" v-model="menuVisible" right temporary>
        <v-list>
          <v-list-item class="category-title">
            <v-list-item-content>
              <v-list-item-title>내 계정</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            v-for="(item, index) in categories"
            :key="index"
            @click="selectCategory(item)"
            @mouseover="hoveredCategory = index"
            @mouseleave="hoveredCategory = null"
            :class="{
              hovered: hoveredCategory === index,
              active: selectedCategory === item
            }"
          >
            <v-list-item-content>
              <v-list-item-title class="list-item">{{ item }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-col :cols="isMobile ? 12 : 9">
        <h2>{{ selectedCategory }} 페이지</h2>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const categories = ['계정관리', '스케쥴관리'];
const selectedCategory = ref('계정관리');
const isMobile = ref(false);
const menuVisible = ref(false);
const hoveredCategory = ref(null);

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

window.addEventListener('resize', handleResize);

const selectCategory = (category) => {
  selectedCategory.value = category;
  if (isMobile.value) {
    menuVisible.value = false;
  }
}

watch(
  () => route.name,
  (newRouteName) => {
    if (newRouteName === 'UserDetail') {
    }
  }
);


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
  background-color: #e0e0e0;
}

@media (max-width: 768px) {
  .category-title .v-list-item-title {
    font-size: 1rem;
    pointer-events: none;
  }

  .list-item {
    font-size: 1rem;
  }

  .v-list-item {
    width: 100%;
  }
}

.v-container {
  padding-top: 50px;
}

@media (max-width: 768px) {
  .v-container {
    padding-top: 20px;
  }
}

</style>