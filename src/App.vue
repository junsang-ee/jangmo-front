<template>
  <v-app>
    <Header />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>

import Header from '@/components/Header.vue';

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