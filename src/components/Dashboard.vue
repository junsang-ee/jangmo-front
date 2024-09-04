<template>
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Card 1</v-card-title>
            <v-card-text>
              Schedule Area
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Card 2</v-card-title>
            <v-card-text>
              Schedule Area
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  const isMobile = ref(false);
  
  onMounted(() => {
    const handleResize = () => {
      isMobile.value = window.innerWidth <= 768;
    };
  
    window.addEventListener('resize', handleResize);
    handleResize();
  
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
    });
  });
  </script>
  
  <style scoped>
  .v-container {
    margin-top: 80px;
  }
  
  /* 모바일 화면에서 카드 간격 조정 */
  @media (max-width: 768px) {
    .v-col {
      margin-bottom: 16px;
    }
  }
  </style>