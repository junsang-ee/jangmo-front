<template>
  <h1>UserDetail</h1>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isMobileView = ref(false);

onMounted(() => {

  const handleResize = () => {
    isMobileView.value = window.innerWidth <= 768;
  };

  window.addEventListener('resize', handleResize);
  handleResize();

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
  });
});


</script>

<style scoped>
.my-info-container {
  margin-top: 80px;
}

@media (max-width: 768px) {
  .my-info-container {
    margin-top: 16px;
  }
}
</style>
