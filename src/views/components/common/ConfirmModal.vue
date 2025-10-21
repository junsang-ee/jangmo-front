<template>
  <v-dialog v-model="visible" persistent max-width="400px">
    <v-card class="pa-6 rounded-xl text-center">
      <v-card-title class="text-h6 font-weight-bold">{{ title }}</v-card-title>
      <v-card-text class="py-4 text-body-1">
        {{ message }}
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn color="grey" variant="text" @click="handleCancel">취소</v-btn>
        <v-btn color="primary" variant="flat" @click="handleConfirm">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false);
const message = ref('');
const title = ref('확인');

let resolveFn = null;

const open = (msg, customTitle = '확인') => {
  message.value = msg;
  title.value = customTitle;
  visible.value = true;

  return new Promise((resolve) => {
    resolveFn = resolve;
  });
}

const handleConfirm = () => {
  visible.value = false;
  resolveFn?.(true);
}

const handleCancel = () => {
  visible.value = false;
  resolveFn?.(false);
}

defineExpose({ open });
</script>
