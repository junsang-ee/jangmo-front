<template>
  <v-dialog v-model="dialog" persistent max-width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2 text-center">
        <span v-if="isMember">회원 비밀번호 재설정</span>
        <span v-else>용병코드 재발급</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="isValid" lazy-validation>
          <v-text-field
            v-model="mobile"
            label="휴대폰 번호"
            placeholder="휴대폰 번호 11자리('-' 제외)"
            :rules="mobileRules"
            maxlength="11"
            @input="validateNumericInput"
            outlined
            required
          />

          <v-text-field
            v-if="isCodeSent"
            v-model="verificationCode"
            label="인증번호 6자리(숫자)"
            type="text"
            :rules="codeRules"
            maxlength="6"
            @input="validateNumericInput"
            counter
            outlined
            required
          >
            <template #append>
              <v-btn text small @click="resendCode">재전송</v-btn>
            </template>
          </v-text-field>
          <div v-if="isCodeSent && !isVerified" class="timer-wrap">
            <span class="timer">{{ minutes }}:{{ seconds < 10 ? "0" + seconds : seconds }}</span>
          </div>
          <div v-if="isVerified && isMember" class="password-wrap">
            <v-text-field
              v-model="newPassword"
              :type="isShowPassword ? 'text' : 'password'"
              label="새 비밀번호"
              :rules="passwordRules"
              outlined
              required
              full-width
            >
              <template #append>
                <v-icon @click="togglePasswordVisibility(false)">
                  {{ isShowPassword ? "mdi-eye" : "mdi-eye-off" }}
                </v-icon>
              </template>
            </v-text-field>
            <v-text-field
              v-model="confirmPassword"
              :type="isShowConfirmPassword ? 'text' : 'password'"
              label="비밀번호 확인"
              :rules="confirmPasswordRules"
              outlined
              required
            >
              <template #append>
                <v-icon @click="togglePasswordVisibility(true)">
                  {{ isShowConfirmPassword ? "mdi-eye" : "mdi-eye-off" }}
                </v-icon>
              </template>
            </v-text-field>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn :disabled="isButtonDisabled" @click="handleAction" color="primary" class="ma-2">
          {{ buttonText }}
        </v-btn>
        <v-btn
          @click="closeDialog"
          color="primary"
          text="닫기"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, defineProps, onMounted } from 'vue';
import { write, update } from '@/utils/util-axios.js';
import { valid } from "@/utils/util-regex";

const dialog = ref(true);
const isValid = ref(false);
const mobile = ref("");
const verificationCode = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const isShowPassword = ref(false);
const isShowConfirmPassword = ref(false);
const isCodeSent = ref(false);
const isVerified = ref(false);

const timer = ref(180); 
let interval = null;
const minutes = computed(() => Math.floor(timer.value / 60));
const seconds = computed(() => timer.value % 60);

const codeRules = [
  v => valid("VALID_CODE", v) || "인증코드는 6자리 숫자로 입력해주세요."
];

const passwordRules = [
  v => valid("PASSWORD", v) || 
    "▪️ 2가지 이상 조합(영문/숫자/특수문자)\n▪️ 8자리 이상"
];

const confirmPasswordRules = [
  v => v === newPassword.value || "비밀번호가 일치하지 않습니다."
];;

const mobileRules = [
  v => valid("MOBILE", v) || "휴대전화번호는 '010'을 포함한 11자리의 숫자여야만 합니다."
];

const isValidCode = computed(() => {
  return valid("VALID_CODE", verificationCode.value); 
});

const isValidMobile = computed(() => {
  return valid("MOBILE", mobile.value);
})

const props = defineProps({
  userType: {
    type: String,
    required: true
  }
});
const isMember = ref(false);
const authPurposeType = ref("RESET_MERCENARY_CODE");
const emit = defineEmits(["close"]);

const startTimer = () => {
  if (interval) clearInterval(interval);
  timer.value = 180;
  interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(interval);
      interval = null;
    }
  }, 1000);
};

const stopTimer = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}

const isButtonDisabled = computed(() => {
  if (!isCodeSent.value) {
    return !isValidMobile.value;
  }
  if (!isVerified.value) {
    return !isValidCode.value;
  }
  return !(newPassword.value && confirmPassword.value && newPassword.value === confirmPassword.value);
});

const buttonText = computed(() => {
  if (!isCodeSent.value) return "인증번호 요청";
  if (!isVerified.value) return "인증번호 확인";
  return isMember.value ? "비밀번호 재설정" : "용병코드 재발급";
});

const handleAction = async() => {
  if (!isCodeSent.value) {
    await requestCode();
  } else if (!isVerified.value) {
    await verifyCode();
  } else {
    if (isMember.value)
      await resetPassword();
    else await resetMercenaryCode();
  }
};

const requestCode = async() => {
  try {
    await write("/api/auth/verification-codes", null, { 
      mobile: mobile.value,
      authPurposeType: authPurposeType.value
    });
    await $alert("인증번호가 전송되었습니다.");
    isCodeSent.value = true;
    startTimer();
  } catch (e) {
    await $alert(e.message || "인증번호 전송 실패");
  }
};

const verifyCode = async() => {
  try {
    await write("/api/auth/verification-codes/verify", null, {
      mobile: mobile.value,
      code: verificationCode.value,
      authPurposeType: authPurposeType.value
    });
    await $alert("정상적으로 인증 되었습니다.");
    isVerified.value = true;
    stopTimer();
  } catch (e) {
    await $alert(e.message || "인증 실패");
  }
};

const resetMercenaryCode = async() => {
  try {
    if (await confirm('용병코드를 재발급 받으시겠습니까?', '용병코드 재발급')) {
      await update("/api/auth/mercenaries/code", null, {
        mobile: mobile.value
      });
      await $alert("용병 코드가 정상적으로 전송되었습니다. 전송된 코드로 로그인 해주세요.");
      closeDialog();
    }
  } catch(e) {
    await $alert(e.message);
  }
}

const resetPassword = async() => {
  const valid = await isValid.value.validate();
  try {
    if (valid) {
      if (await $confirm('입력하신 새로운 비밀번호로 재설정 하시겠습니까?', '비밀번호 재설정')) {
        await update("/api/auth/members/password", null, {
          mobile: mobile.value,
          password: newPassword.value,
        });
        await $alert("비밀번호가 성공적으로 재설정되었습니다.");
        closeDialog();
      }
    }
  } catch (e) {
    await $alert(e.message || "비밀번호 재설정 실패");
  }
};

const resendCode = () => {
  requestCode();
};

const togglePasswordVisibility = (isConfirm) => {
  if (isConfirm)
    isShowConfirmPassword.value = !isShowConfirmPassword.value;
  else 
    isShowPassword.value = !isShowPassword.value;
};

const validateNumericInput = () => {
  mobile.value = mobile.value.replace(/\D/g, "").slice(0, 11);
  verificationCode.value = verificationCode.value.replace(/\D/g, "").slice(0, 6);
};

const closeDialog = () => {
  dialog.value = false;
  emit("close");
};

const onload = () => {
  if (props.userType === "MEMBER") {
    isMember.value = true;
    authPurposeType.value = "RESET_PASSWORD";
  }
}

onMounted(onload);
</script>

<style scoped>

.timer-wrap {
  margin-top: 1px;
  margin-bottom: 10px;
  text-align: start;
}

.timer {
  font-size: 14px;
  color: #757575;
}

</style>
