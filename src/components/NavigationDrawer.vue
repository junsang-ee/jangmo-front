<template>
  <v-navigation-drawer 
    v-if="isMobile"
    :model-value="menuVisible"
    @update:model-value="menuVisible = $event"
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
        @click="selectCategory(item)"
        @mouseover="hoveredCategory = index"
        @mouseleave="hoveredCategory = null"
        :class="{ hovered: hoveredCategory === index, active: selectedCategory === item }"
      >
        <v-list-item-title class="list-item">
          {{ item }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useNavigationStore } from "@/store/navigation";
import { storeToRefs } from "pinia";

const router = useRouter();
const categories = ["계정관리", "스케쥴관리", "로그아웃"];
const selectedCategory = ref("계정관리");
const hoveredCategory = ref(null);
const isMobile = ref(window.innerWidth <= 768);

const $navigation = useNavigationStore();
const { menuVisible } = storeToRefs($navigation);

window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth <= 768;
});

const selectCategory = (category) => {
  selectedCategory.value = category;
  if (category === "계정관리") {
    router.replace("Login");
  } else if (category === "로그아웃") {
    if (confirm("로그아웃 하시겠습니까?")) {
      router.replace("Login");
    }
  } else alert("스케쥴관리");
  closeMenu();
};

const closeMenu = () => {
  $navigation.closeMenu();
}

</script>

<style scoped>

.category-title {
    font-weight: 900;
}

.hovered {
    background-color: lightgray;
}

.active {
    background-color: darkgray;
}
</style>
