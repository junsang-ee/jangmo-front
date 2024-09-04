<template>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Jangmo FC</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-settings</v-icon>
      </v-btn>
    </v-app-bar>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .v-app-bar {
    position: fixed;
    top: 0;
    z-index: 1000;
  }
  </style>