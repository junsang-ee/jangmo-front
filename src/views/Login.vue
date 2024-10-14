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
                required
                outlined
                class="phone-number-field"
            />
            <v-text-field
                v-model="password"
                label="비밀번호"
                type="password"
                required
                outlined
                class="password-field"
            />
            <v-btn color="primary" class="mt-4" block @click="login">
                휴대폰 번호로 시작하기
            </v-btn>
            <div class="text-center mt-4">
                회원이 아니신가요? 
              <span class="signup-link" @click="showSignup">
                회원가입
              </span>
            </div>
          </v-form>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const phoneNumber = ref("");
const password = ref("");
const isShowSignup = ref(false);

const login = () => {
  alert("login");
}

const showSignup = () => {
  isShowSignup.value = true;
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
