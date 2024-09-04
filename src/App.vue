<template>
  <v-app>
    <Header />
    <v-main>
      <Dashboard />
    </v-main>
  </v-app>
</template>

<script setup>
import Header from './components/Header.vue';
import Dashboard from './components/Dashboard.vue';
</script>

<style>
/* 전역 스타일 설정 */
#app {
  font-family: 'Roboto', sans-serif;
}
</style>