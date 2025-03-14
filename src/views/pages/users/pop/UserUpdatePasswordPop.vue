<template>
  <v-dialog width="400" v-model="isShowModal" persistent :click-outside="false">
    <template v-slot:activator="{ props }">
      <v-btn
        class="action-btn"
        v-bind="props"
        color="primary"
        text="비밀번호 변경"
        outlined
      />
    </template>
    <v-card>
      <v-container>
        <v-row>
          <v-col>
            <v-card-title class="title-text">
              비밀번호 변경
            </v-card-title>
          </v-col>
        </v-row>
        <v-card-text class="my-4">
          <v-form ref="isValid">
            <v-text-field
              variant="solo"
              label="현재 비밀번호"
              v-model="currentPassword"
              type="password"
              :rules="passwordRule"
            />
            <v-text-field
              variant="solo"
              label="새 비밀번호"
              v-model="newPassword"
              type="password"
              :rules="passwordRule"
            />    
            <v-text-field
              variant="solo"
              label="새 비밀번호 확인"
              v-model="confirmPassword"
              type="password"
              :rules="passwordConfirmRule"
            />  
          </v-form>
          <v-btn 
            class="w-100 mt-4 text-white"
            size="x-large"
            color="#317aa9"
            @click="updatePassword"
            :disabled="!isFormValid()"
            :loading="isLoading"
            text="비밀번호 변경"
          />
          <v-btn 
            class="w-100 mt-4 text-white"
            text="닫기"
            size="x-large"
            color="#317aa9"
            @click="close"
            :disabled="isLoading"
          />
        </v-card-text>
      </v-container>
    </v-card>
  </v-dialog>
</template>
  
<script setup>
import { ref } from "vue";
import { valid } from "@/utils/util-regex";
import { update } from "@/utils/util-axios.js";

const isShowModal = ref(false);
const isLoading = ref(false);
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const isValid = ref(false);

const passwordRule = [
  v => valid("PASSWORD", v) || 
  "▪️ 2가지 이상 조합(영문/숫자/특수문자)\n▪️ 8자리 이상"
];
  
const passwordConfirmRule = [
  v => v === newPassword.value || "비밀번호가 일치하지 않습니다."
];
  
const isFormValid = () => {
  return (
    valid("PASSWORD", currentPassword.value) &&
    valid("PASSWORD", newPassword.value) && 
    newPassword.value === confirmPassword.value
  );
};
  
const updatePassword = async () => {
  const {valid} = await isValid.value.validate();  
  try {
    isLoading.value = true;
    if (valid) {
      await update("/api/users/members/password", null, {
          oldPassword: currentPassword.value,
          newPassword: newPassword.value
      });
    }
    isLoading.value = false;
    alert("비밀번호가 정상적으로 변경되었습니다.");
    close();
  } catch (e) {
    isLoading.value = false;
    alert(e.message);
  }
};

const open = () => {
  isShowModal.value = true;
};
  
const close = () => {
  isShowModal.value = false;
  currentPassword.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
  isLoading.value = false;
};

</script>

<style scoped>
.title-text {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.action-btn {
  display: inline-flex;
  font-size: 1rem;
  padding: 12px 12px;
  font-weight: 500;
  min-width: 250px;
}

</style>