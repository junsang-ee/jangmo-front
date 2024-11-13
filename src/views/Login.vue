<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row class="d-flex justify-center align-center" style="height: 100vh; margin: 0;">
      <v-col cols="12" md="8" lg="6" xl="4" class="d-flex flex-column mx-auto">
        <div class="login-form">
          <v-card-title class="text-h5 text-center mb-4">
            로그인
          </v-card-title>
          <v-form>
            <v-text-field
                v-model="phoneNumber"
                label="휴대폰 번호"
                type="tel"
                :rules="mobileRule"
                required
                outlined
                class="phone-number-field"
            />
            <v-text-field
                v-if="isShowVerifyInput"
                v-model="password"
                label="비밀번호"
                type="password"
                required
                outlined
                class="password-field"
            />

            <v-btn color="primary" class="mt-4" block @click="showVerifyInput">
                <span>{{ buttonText }}</span>
            </v-btn>

            <div class="text-center mt-4"> 
              <span v-if="isLoginMember" class="signup-link" @click="convertLoginType('mercenary')">
                용병코드로 로그인하기
              </span>
              <span v-else class="signup-link" @click="convertLoginType('member')">
                회원으로 로그인하기
              </span>
            </div>
            <div class="text-center mt-4">
                Jangmo 회원이 아니신가요? 
              <span class="signup-link" @click="showSignup">
                회원 가입
              </span>
            </div>
            <div class="text-center signup-link">
              <span>
                용병 등록 요청
              </span>
            </div>
          </v-form>
        </div>
        <SignupEditPop v-if="isShowSignup" @close="hideSignup"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import SignupEditPop from '@/views/users/pop/SignupEditPop.vue';

const phoneNumber = ref("");
const password = ref("");
const isShowSignup = ref(false);
const isShowVerifyInput = ref(false);

const isShowMercenaryCode = ref(false);
const buttonText = ref("회원으로 시작하기");
const isLoginMember = ref(true);
const mobileRuleConfig = /^010\d{8}$/;

const mobileRule = [
  v => mobileRuleConfig.test(v) || "휴대폰 번호는 11자리의 숫자여야만 합니다."
];

const login = () => {
  alert("login");
}

const hideSignup = () => {
  isShowSignup.value = false;
}

const showSignup = () => {
  isShowSignup.value = true;
}

const showVerifyInput = () => {
  isShowVerifyInput.value = true;
}

const convertLoginType = (type) => {
  if(type === "member") {
    isLoginMember.value = true;
  } else isLoginMember.value = false;
}

const showCodeInput = () => {
  isShowMercenaryCode.value = true;
}

</script>

<style scoped>

.phone-number-field,
.password-field {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

.v-card-title {
  font-weight: bold;
}

@media (max-width: 600px) {
  html, body {
    overflow-x: hidden;
    height: 100%;
  }

  .v-container {
    height: 100vh;
  }

  .v-row {
    height: 100vh;
  }

  .login-form {
    max-width: 100%;
    height: auto;
  }
}

.signup-link {
  color: #4269f5;
  cursor: pointer;
}

.signup-link:hover {
  color: #020518;
}
</style>
