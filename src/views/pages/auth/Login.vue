<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row class="d-flex justify-center align-center" style="height: 100vh; margin: 0;">
      <v-col cols="12" md="8" lg="6" xl="4" class="d-flex flex-column mx-auto">
        <div class="login-form">
          <v-card-title class="text-h5 text-center mb-4">
            로그인
          </v-card-title>
          <v-form fast-fail ref="isValid">
            <div class="login-wrap">
              <v-text-field
                v-model="mobile"
                label="휴대폰 번호"
                placeholder="휴대폰 번호 11자리('-' 제외)"
                type="tel"
                :rules="mobileRules"
                required
                outlined
                class="mobile-field"
              />
              <div v-if="isShowVerifyInput">
                <v-text-field 
                  v-if="isLoginMember"
                  v-model="password"
                  label="비밀번호"
                  placeholder="비밀번호"
                  type="password"
                  required
                  outlined
                  class="password-field"
                />
                <v-text-field
                  v-else
                  v-model="mercenaryCode"
                  class="mercenary-code-field"
                  label="용병코드"
                  placeholder="용병코드"
                  type="password"
                  counter
                  required
                  outlined
                />
              </div>
            </div>

            <v-btn color="primary" class="mt-4" block @click="executeButtonAction">
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
              <span class="signup-link" @click="showSignup('MEMBER')">
                회원 가입
              </span>
            </div>
            <div class="text-center mt-4">
              Jangmo 용병을 원한다면?
              <span class="signup-link" @click="showSignup('MERCENARY')">
                용병 등록 요청
              </span>
            </div>
            <div class="text-center mt-4">
              <span class="signup-link" @click="showResetCredentials('MEMBER')">
                회원 비밀번호 찾기
              </span>
            </div>
            <div class="text-center mt-4">
              <span class="signup-link" @click="showResetCredentials('MERCENARY')">
                용병코드 재발급
              </span>
            </div>
          </v-form>
        </div>
        <SignupEditPop 
          v-if="isShowSignup" 
          @close="hideSignup" 
          :signupType="signupUserType"
        />
        <ResetCredentialsPop
          v-if="isShowResetCredentials"
          @close="hideResetCredentials"
          :userType="resetUserType"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from "vue-router";
import { read, write } from "@/utils/util-axios.js";
import { tokenValidator } from "@/utils/util-auth";
import { useTokenStore } from "@/store/auth";
import { useUserInfoStore } from "@/store/user";
import SignupEditPop from '@/views/pages/users/pop/SignupEditPop.vue';
import ResetCredentialsPop from "@/views/pages/auth/pop/ResetCredentialsPop.vue";

const router = useRouter();
const $token = useTokenStore();
const $userInfo = useUserInfoStore();
const mobile = ref("");
const password = ref("");
const resetUserType = ref("MEMBER");
const signupUserType = ref("MEMBER");
const isShowSignup = ref(false);
const isShowResetCredentials = ref(false);
const isShowVerifyInput = ref(false);
const mercenaryCode = ref("");
const isValid = ref(null);
const isLoginMember = ref(true);
const mobileRuleConfig = /^010\d{8}$/;

const buttonText = computed(() => {
  if (isShowVerifyInput.value) {
    if (isLoginMember.value) 
      return "회원으로 로그인";
    else 
      return "용병으로 로그인";
  } else {
    return "휴대폰 번호로 시작하기";
  }
});

const mobileRules = [
  v => mobileRuleConfig.test(v) || "휴대전화번호는 '010'을 포함한 11자리의 숫자여야만 합니다."
];

const hideSignup = () => {
  isShowSignup.value = false;
}

const showSignup = (type) => {
  isShowSignup.value = true;
  signupUserType.value = type;
}

const showResetCredentials = (role) => {
  resetUserType.value = role;
  isShowResetCredentials.value = true;
}

const hideResetCredentials = () => {
  isShowResetCredentials.value = false;
}

const executeButtonAction = () => {
  if (!isShowVerifyInput.value) {
    isShowVerifyInput.value = true;
    return;
  } 
  if (isLoginMember.value) memberLogin();
  else mercenaryLogin();

}

const convertLoginType = (type) => {
  password.value = "";
  mercenaryCode.value = "";
  if (type === "member") {
    isLoginMember.value = true;
  } else {
    isLoginMember.value = false;
  }
}

const memberLogin = async() => {
  const valid = await isValid.value.validate();
  try {
    if (valid) {
      const url = "/api/auth/login/member";
      const login = {
        mobile: mobile.value,
        password: password.value
      };
      const result = await write(url, null, login);
      setUserDetail(result);
      alert("회원 권한으로 정상 로그인 되었습니다.");
      router.replace({name: "Dashboard"});
    }
  } catch(e) {
    alert(e.message);
  }

}

const mercenaryLogin = async() => {
  const valid = await isValid.value.validate();
  try {
    if (valid) {
      const url = "/api/auth/login/mercenary";
      const loginPayload = {
        mobile: mobile.value,
        mercenaryCode: mercenaryCode.value
      };
      const result = await write(url, null, loginPayload);
      setUserDetail(result);
      alert("용병 권한으로 정상 로그인 되었습니다.");
      router.replace({name: "Dashboard"});
    }
  } catch(e) {
    alert(e.message);
  }
}

const setUserDetail = async(result) => {
  const token = tokenValidator(result?.jwt);
  $token.setToken(token);
  const myInfo = await read("/api/users/me");
  $userInfo.setInfo(myInfo);
}

</script>

<style scoped>

.mobile-field,
.password-field,
.mercenary-code-field {
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
