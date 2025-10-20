<template>
  <v-dialog v-model="visible" max-width='400'>
    <v-card class='rounded-xl'>
      <v-card-title class="text-h6 font-weight-bold text-center">
        알림
      </v-card-title>
      <v-card-text class="text-center text-body-1 py-6">
        {{ message }}
      </v-card-text>
      <v-card-actions class="justify-center pb-4">
        <v-btn color="primary" @click="confirm">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const visible = ref(false);
const message = ref("");
let resolver = null;

function open(msg) {
  message.value = msg;
  visible.value = true;

  return new Promise((resolve) => {
    resolver = resolve;
  });
}

const confirm = () => {
  visible.value = false;
  resolver?.();
}

const handleKeydown = (e) => {
  if (visible.value && (e.key === 'Enter' || e.keyCode === 13)) {
    confirm();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

defineExpose({ open });
</script>
