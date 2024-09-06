<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title class="logo" @click="goDashboard">JangmoFC</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon @click="navigate('Dashboard')">
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn icon @click="navigate('UserDetail')">
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-app-bar>
</template>
  
<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const navigate = (component) => {
  router.push({name: component});
}

const goDashboard = () => {
  router.push({name: "Dashboard"});
}
</script>
  
<style scoped>
.v-app-bar {
  z-index: 1000;
}

.logo {
  cursor: pointer;
}

</style>