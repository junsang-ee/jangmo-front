<template>
  <v-app>
    <Header />
    <NavigationDrawer v-show="menuVisible" />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>

import Header from '@/components/Header.vue';
import NavigationDrawer from '@/components/NavigationDrawer.vue';
import { useNavigationStore } from "@/store/navigation";
import { storeToRefs } from 'pinia';

const $navigation = useNavigationStore();
const { menuVisible } = storeToRefs($navigation); 

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