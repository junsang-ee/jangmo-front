<template>
  <v-dialog v-model="dialog" max-width="500px" persistent :click-outside="false">
    <v-card>
      <v-card-title class="text-h5 text-center">회원가입</v-card-title>
      <v-card-text>
        <v-form>
          <div v-if="currentStep !== SignupState.ENTER_DETAIL">
            <div class="mobile-wrap">
              <v-text-field 
                v-model="phoneNumber" 
                label="휴대폰 번호" 
                type="tel" 
                required 
                outlined 
                class="phone-width" 
                maxlength="11"
                counter
              />
            </div>
            <v-text-field 
              v-if="isShowVerificationField" 
              v-model="verificationCode" 
              label="인증번호" 
              type="text" 
              outlined 
              class="phone-width"
              maxlength="6"
              @input="validateNumericInput"
            >
              <template #append>
                <v-btn 
                  class="resend-btn" 
                  text small 
                  @click="resendVerificationCode"
                >
                  재전송
                </v-btn>
              </template>
            </v-text-field>
            <div v-if="isShowVerificationField" class="timer-wrap">
              <span class="timer">{{ minutes }}:{{ seconds < 10 ? '0' + seconds : seconds }}</span>
            </div>



            <v-card class="agreement-box">
              <v-checkbox
                @click="toggleAllAgree"
                v-model="allAgree"
                label="모두 동의"
              />
              <v-divider class="my-3"></v-divider>
              <div>
                <v-row class="align-center">
                  <v-col cols="8">
                    <v-checkbox
                      v-model="isAgreePersonalInfo"
                      label="[필수] 개인정보 수집/이용 동의"
                    />
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <v-btn text small @click="openDialog('privacy')">보기</v-btn>
                  </v-col>
                </v-row>
                <v-row class="align-center">
                  <v-col cols="8">
                    <v-checkbox
                      v-model="isAgreeTermsOfService"
                      label="[필수] 이용약관 동의"
                    />   
                  </v-col>
                  <v-col cols="4" class="text-right">
                    <v-btn text small @click="openDialog('terms')">보기</v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </div>

          <div v-else>
            <div class="address-fields">
              <v-select
                v-model="selectedCity"
                :items="cities"
                label="시/도"
                outlined
                required
                :loading="isLoading"
                class="half-width"
              />
              <v-select
                v-model="selectedDistrict"
                :items="districts"
                label="시/군/구"
                outlined
                required
                class="half-width"
                :loading="isLoading"
                :disabled="!selectedCity"
              />
            </div>
            <v-text-field 
              v-model="password" 
              label="비밀번호" 
              type="password" 
              required 
              outlined 
            />
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="button-actions">
        <v-row class="d-flex justify-center">
          <v-col cols="12" class="d-flex justify-center">
            <v-btn 
              :disabled="!isFormValid" 
              @click="executeButtonAction" 
              class="action-btn signup-btn"
              :class="{ active: isFormValid }"
            >
              {{ nextButtonText }}
            </v-btn>
          </v-col>
          <v-col cols="12" class="d-flex justify-center">
            <v-btn @click="closeDialog" class="action-btn cancel-btn">닫기</v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="dialogContent" max-width="400px">
      <v-card>
        <v-card-title>{{ dialogTitle }}</v-card-title>
        <v-card-text>
          <div v-html="dialogText"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="closeContentDialog">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script setup>
import { computed, ref, watch, defineEmits } from 'vue';
import { read, write } from "@/utils/util-axios.js";
import { SignupState, SignupMessage } from "@/constants/signup-state.js";

const dialog = ref(true);
const phoneNumber = ref("");
const verificationCode = ref("");
const password = ref("");

const selectedCity = ref(null);
const selectedDistrict = ref(null);
const cities = ref([]);
const districts = ref([]);
const isLoading = ref(false);

const allAgree = ref(false);
const isAgreePersonalInfo = ref(false);
const isAgreeTermsOfService = ref(false);

const dialogContent = ref(false);
const dialogTitle = ref("");
const dialogText = ref("");
const currentStep = ref(SignupState.ENTER_MOBILE);
const isShowVerificationField = ref(false);

const nextButtonText = computed(() => SignupMessage[currentStep.value]);

const emit = defineEmits(['close']);

const toggleAllAgree = () => {
  const state = !allAgree.value;
  isAgreePersonalInfo.value = state;
  isAgreeTermsOfService.value = state;
  allAgree.value = state;
};

const openDialog = (type) => {
  const content = agreementTexts[type];
  dialogTitle.value = content.title;
  dialogText.value = content.text;
  dialogContent.value = true;
};

const agreementTexts = {
  privacy: {
    title: "[필수] 개인정보 수집 및 이용 동의",
    text: 
    `
      1. 수집 항목: 성명, 휴대폰 번호<br>
      2. 수집 목적: 회원가입 및 서비스 이용<br>
      3. 보유 기간: 회원 탈퇴 시까지<br>
    `
      ,
  },
  terms: {
    title: "[필수] 서비스 이용약관 동의",
    text: 
      `
        1. 고유식별정보: 주민등록번호, 외국인등록번호 등록<br>
        2. 처리 목적: 본인 확인 및 서비스 제공<br>
      `
      ,
  }
};

const isFormValid = computed(() => {
  return phoneNumber.value.length === 11 && 
      isAgreePersonalInfo.value && 
      isAgreeTermsOfService.value;
});

const timer = ref(180); 
let interval = null;

const minutes = computed(() => Math.floor(timer.value / 60));
const seconds = computed(() => timer.value % 60);


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

const executeButtonAction = async() => {
  switch(currentStep.value) {
    case SignupState.ENTER_MOBILE:
      await sendVerificationCode();
      break;
    case SignupState.ENTER_CODE:
      await verifyCode();
      break;
    case SignupState.ENTER_DETAIL:
      break;
  }
}

const sendVerificationCode = async() => {
  isLoading.value = true;
  try {
    await write("/api/auth/signup/mobile/send-code", null, {
      mobile: phoneNumber.value
    });
    isShowVerificationField.value = true;
    currentStep.value = SignupState.ENTER_CODE;
    startTimer();
    isLoading.value = false;
    alert("인증번호가 전송되었습니다.");
  } catch(e) {
    isLoading.value = false;
    isShowVerificationField.value = false;
    alert(e.message);
  }
};

const getCities = async() => {
  isLoading.value = true;
  try {
    const response = await read("/api/auth/signup/cities");
    const cityList = response.data.data;
    cities.value = cityList.map(city => city.name);
    isLoading.value = false;
  } catch (e) {
    isLoading.value = false;
    alert(e.message);
  }
}

const getDistricts = async(cityName) => {
  isLoading.value = true;
  try {
    const response = await read(`/api/auth/signup/cities/${cityName}/districts`);
    const districtList = response.data.data;
    districts.value = districtList.map(district => district.name);
    isLoading.value = false;
  } catch(e) {
    isLoading.value = false;
    alert(e.message);
  }
}


const resendVerificationCode = async() => {
  await sendVerificationCode();
};

const verifyCode = async() => {
  isLoading.value = true;
  try {
    await write("/api/auth/signup/mobile/verify-code", null, {
      code: verificationCode.value,
      mobile: phoneNumber.value
    });
    alert("정상적으로 인증되었습니다.");
    stopTimer();
    currentStep.value = SignupState.ENTER_DETAIL;
    getCities();
    isLoading.value = false;
  } catch(e) {
    isLoading.value = false;
    alert(e.message);
  }
}

const closeDialog = () => {
  dialog.value = false;
  emit("close");
};

const closeContentDialog = () => {
  dialogContent.value = false;
};

watch([isAgreePersonalInfo, isAgreeTermsOfService], ([newPersonalInfo, newTerms]) => {
  allAgree.value = newPersonalInfo && newTerms;
});

watch(() => selectedCity.value, (val) => {
  selectedDistrict.value = null;
  getDistricts(val);
});

</script>

<style scoped>
.mobile-wrap {
  display: flex;
  justify-content: space-between;
}

.phone-width {
  width: 100%;
}

.address-fields {
  display: flex;
  justify-content: space-between;
}

.half-width {
  width: 48%;
}

.agreement-box {
  background-color: #f5f5f5;
  padding: 10px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.agreement-item {
  margin-bottom: 8px;
}

.v-card-title {
  font-weight: bold;
  text-align: center;
}

.timer-wrap {
  margin-top: 1px;
  margin-bottom: 10px;
  text-align: start;
}

.timer {
  font-size: 14px;
  color: #757575;
}

.action-btn {
  width: 80%;
  font-size: 16px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid transparent;
}

.signup-btn {
  width: 80%;
}

.signup-btn.active {
  background-color: #90caf9;
  color: white;
}

.cancel-btn {
  width: 80%;
}

.signup-btn:disabled {
  background-color: #e0e0e0 !important;
  color: #757575 !important;
}

.v-btn.resend-btn {
  color: #1e88e5; /* 버튼 텍스트 색상 (파란색 계열) */
  font-weight: bold; /* 텍스트 굵게 */
  text-transform: uppercase; /* 텍스트 대문자 */
  padding: 4px 8px; /* 패딩을 추가해 버튼 크기 조절 */
  border: 1px solid #1e88e5; /* 파란색 테두리 */
  border-radius: 4px; /* 약간 둥근 모서리 */
  transition: background-color 0.3s ease, color 0.3s ease; /* 부드러운 전환 효과 */
}

.v-btn.resend-btn:hover {
  background-color: #1e88e5; /* 호버 시 배경색 변경 */
  color: #ffffff; /* 호버 시 텍스트 색상 변경 */
}
</style>
