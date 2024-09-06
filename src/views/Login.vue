<template>
<v-container class="fill-height d-flex justify-center align-center">
    <v-row class="d-flex justify-center align-center" style="height: 100vh;">
        <v-col cols="12" md="8" lg="6" xl="4" class="d-flex flex-column justify-center">
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
                    />
                    <v-text-field
                        v-model="password"
                        label="비밀번호"
                        type="password"
                        required
                        outlined
                    />
                    <v-btn color="primary" class="mt-4" block @click="login">
                        휴대폰 번호로 시작하기
                    </v-btn>
                    <div class="text-center mt-4">
                        회원이 아니신가요? 
                        <span class="signup-link" @click="showSignup = true">
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
const showSignup = ref(false);

const login = () => {
    alert("login");
}

</script>


<style scope>
.login-form {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: none;
}

.v-card-title {
  font-weight: bold;
}

@media (min-width: 1200px) {
  .login-form {
    max-width: 500px;
  }
}

.signup-link {
  color: #4269f5;
  cursor: pointer;
}

.signup-link:hover {
  color: #020518; /* 회원가입 링크의 호버 시 색상 변경 */
}
</style>
