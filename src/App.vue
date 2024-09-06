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
import { useRouter } from 'vue-router';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const router = useRouter();
const isMobile = ref(false);

const navigate = (routeName) => {
  router.push({ name: routeName });
};

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