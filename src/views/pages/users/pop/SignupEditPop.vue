<template>
  <div class="text-xs-center">
    <v-dialog v-model="dialog" max-width="500px" persistent :click-outside="false">
      <v-card>
        <v-card-title 
          class="text-h5 text-center headline grey lighten-2"
          primary-title
        >
          회원가입
        </v-card-title>
        <v-card-text>
          <v-form ref="isValid">
            <div v-if="currentStep !== SignupState.ENTER_DETAIL">
              <div class="mobile-wrap">
                <v-text-field
                  :readonly="isDisabledMobile"
                  v-model="mobile"
                  class="phone-width"
                  type="tel" 
                  placeholder="휴대전화번호 11자리('-' 제외)"
                  :rules="mobileRule"
                  @input="validateNumericInput"
                  maxlength="11"
                  counter
                  required 
                  outlined
                >
                  <template v-if="isDisabledMobile" #append>
                    <v-btn 
                      class="mobile-modify-btn" 
                      text small 
                      @click="modifyMobile"
                    >
                      수정하기
                    </v-btn>
                  </template>
                </v-text-field>
              </div>
              <div class="code-wrap">
                <v-text-field 
                  v-if="isShowVerificationField" 
                  v-model="verificationCode" 
                  type="text" 
                  placeholder="인증번호 6자리(숫자)"
                  :rules="codeRule"
                  class="phone-width"
                  maxlength="6"
                  @input="validateNumericInput"
                  counter
                  outlined 
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
              </div>
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
              <div class="name-wrap">
                <label class="name-label">이름</label>
                  <v-text-field 
                    v-model="name" 
                    type="text"
                    placeholder="이름(공백 제외)"
                    :rules="nameRule"
                    required 
                    outlined
                  />
              </div>
              <div class="gender-wrap">
                <label class="gender-label">성별</label>
                <v-radio-group inline
                  v-model="gender"
                  :mandatory="true"
                  :rules="genderRule"
                  row
                >
                  <v-radio label="남자" value="MALE" />
                  <v-radio label="여자" value="FEMALE" />
                </v-radio-group>
              </div>
              <div v-if="props.signupType === 'MEMBER'">
                <div class="birthday-wrap">
                  <label class="birthday-label" for="birthday">생년월일</label>
                  <v-text-field 
                      v-model="birthDay"
                      type="text"
                      placeholder="생년월일 8자리(YYYY/MM/DD)"
                      :rules="birthRule"
                      maxlength="11"
                      @input="validateNumericInput"
                      required 
                      outlined
                    />
                </div>
                <div class="address-wrap">
                  <label class="address-label">주소</label>
                  <v-select
                    v-model="selectedCity"
                    :items="cities"
                    :rules="cityRule"
                    item-title="name"
                    item-value="cityId"
                    placeholder="시/도"
                    class="half-width"
                    outlined
                    required
                    return-object
                  />
                  <v-select
                    v-model="selectedDistrict"
                    :items="districts"
                    :rules="districtRule"
                    item-title="name"
                    item-value="districtId"
                    placeholder="시/군/구"
                    class="half-width"
                    :disabled="!selectedCity"
                    return-object
                    outlined
                    required
                  />
                </div>
                <div class="password-wrap">
                  <label class="password-label">비밀번호</label>
                  <v-text-field 
                    v-model="password" 
                    :type="isShowPassword ? 'text' : 'password'"
                    placeholder="비밀번호"
                    :rules="passwordRule"
                    class="password-field"
                    required 
                    outlined
                    full-width
                  >
                    <template #append>
                      <v-btn icon @click="togglePasswordVisibility">
                        <v-icon>{{ isShowPassword ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </div>
              </div>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions class="button-actions">
          <v-row class="d-flex justify-center">
            <v-col cols="12" class="d-flex justify-center">
              <v-btn
                :disabled="isButtonDisabled()" 
                @click="executeButtonAction" 
                class="action-btn signup-btn"
                :class="{ active: !isButtonDisabled() }"
                flat
              >
                {{ nextButtonText }}
              </v-btn>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <v-btn 
                @click="closeDialog" 
                class="action-btn cancel-btn"
                color="primary"
                text="닫기"
              />
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

      <div class="text-center pa-4">
        <v-dialog
          v-model="isShowRetentionDialog"
          max-width="400"
          persistent
        >
          <v-card
            prepend-icon="mdi-account"
            class="mercenary-retention-notice"
            text="매칭된 매치 종료 후 개인정보가 영구 삭제됩니다. 이에 동의하십니까?
            (예 선택 시, 매칭된 매치 종료 후 개인정보(휴대폰 번호)삭제.)
            (아니오 선택 시, 매칭된 매치 종료 후에도 개인정보 삭제되지 않음.)
            "
            title="개인 정보 삭제 및 유지 여부"
          >
            <template v-slot:actions>
              <v-spacer></v-spacer>
              <v-btn @click="retentionOnCancel()">
                아니오
              </v-btn>
              <v-btn @click="retentionOnConfirm()">
                예
              </v-btn>
            </template>
          </v-card>
        </v-dialog>
      </div>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, ref, watch, defineEmits, defineProps, onMounted } from 'vue';
import { read, write } from "@/utils/util-axios.js";
import { SignupState, SignupMessage } from "@/constants/signup-state.js";
import { valid } from "@/utils/util-regex";

const dialog = ref(true);
const mobile = ref("");
const verificationCode = ref("");
const password = ref("");
const selectedCity = ref(null);
const selectedDistrict = ref(null);
const cities = ref([]);
const districts = ref([]);
const retentionStatus = ref("DELETE");
const allAgree = ref(false);
const isAgreePersonalInfo = ref(false);
const isAgreeTermsOfService = ref(false);

const dialogContent = ref(false);
const dialogTitle = ref("");
const dialogText = ref("");
const currentStep = ref(SignupState.ENTER_MOBILE);
const isShowVerificationField = ref(false);
const isShowPassword = ref(false);
const nextButtonText = computed(() => {
  if (currentStep.value === "ENTER_DETAIL" && props.signupType === "MERCENARY")
    return "용병등록 요청";
  return SignupMessage[currentStep.value];
});
const isDisabledMobile = ref(false);
const gender = ref(null);
const isValid = ref(false);
const name = ref("");
const birthDay = ref(null);

const isShowRetentionDialog = ref(false);
const props = defineProps({
  signupType: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close']);

const nameRule = [
  v => valid("NAME", v) || "이름은 2글자 이상의 한글로 입력해주세요."
]

const codeRule = [
  v => valid("VALID_CODE", v) || "인증코드는 6자리 숫자로 입력해주세요."
];

const mobileRule = [
  v => valid("MOBILE", v) || "휴대전화번호는 '010'을 포함한 11자리의 숫자여야만 합니다."
];

const genderRule = [
  v => !!v || "성별을 선택해주세요."
];

const cityRule = [
  v => !!v || "시/도를 선택해주세요."
];

const districtRule = [
  v => !!v || "시/군/구를 선택해주세요."
];

const birthRule = [
  v => valid("BIRTH", v) || "생년월일은 8자리의 숫자로 입력해주세요.",
  v => validateDate(v) || "유효하지 않은 날짜입니다."
];

const passwordRule = [
  v => valid("PASSWORD", v) || 
    "▪️ 2가지 이상 조합(영문/숫자/특수문자)\n▪️ 8자리 이상"
];

const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

const calculateDays = (year, month) => {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  } else if ([4, 6, 9, 11].includes(month)) {
    return 30;
  } else {
    return 31;
  }
};

const validateDate = (birthDate) => {
  const year = birthDate.substring(0, 4);
  const month = birthDate.substring(4, 6);
  const day = birthDate.substring(6, 8);
  if (month > 12 || calculateDays(year, month) < day) {
    return false;
  }
  const date = new Date(year, month-1, day);
  const today = new Date();
  if (date > today) {
    return false;
  }
  return true;
}

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

const isButtonDisabled = () => {
  switch(currentStep.value) {
    case SignupState.ENTER_MOBILE:
      return !isFormValid.value;
    case SignupState.ENTER_CODE:
      return !(isFormValid.value && isValidCode.value);
    case SignupState.ENTER_DETAIL:
      if (props.signupType === "MEMBER")
        return !isValidSignUp.value;
      else 
        return !isValidRegister.value;
    default: break;
  }
}

const agreementTexts = {
  privacy: {
    title: "[필수] 개인정보 수집 및 이용 동의",
    text: 
    `
      1. 수집 항목: 성명, 휴대폰 번호, 생년월일<br>
      2. 수집 목적: 회원가입 및 서비스 이용<br>
      3. 보유 기간: 회원 탈퇴 시까지<br>
    `
      ,
  },
  terms: {
    title: "[필수] 서비스 이용약관 동의",
    text: 
      `
        1. 고유식별정보: 휴대폰 번호<br>
        2. 처리 목적: 본인 확인 및 서비스 제공<br>
      `
      ,
  }
};

const openMercenaryRetentionDialog = async() => {
  isShowRetentionDialog.value = true;
}

const retentionOnConfirm = () => {
  handleRetentionResponse(true);
};

const retentionOnCancel = () => {
  handleRetentionResponse(false);
};

const handleRetentionResponse = async(status) => {
  isShowRetentionDialog.value = false;
  retentionStatus.value = status;
  if (!isShowRetentionDialog.value) {
    setTimeout(() => {
      registerMercenary();
    }, 350);
  }
}

const isValidCode = computed(() => {
  return valid("VALID_CODE", verificationCode.value);
})

const isFormValid = computed(() => {
  return mobile.value.length === 11 && 
      isAgreePersonalInfo.value && 
      isAgreeTermsOfService.value;
});

const isValidRegister = computed(() => {
  return valid("NAME", name.value) && gender.value
});

const isValidSignUp = computed(() => {
  return (valid("NAME", name.value) && 
          gender.value &&
          valid("BIRTH", birthDay.value) && validateDate(birthDay.value) &&
          selectedCity.value && selectedDistrict.value &&
          valid("PASSWORD", password.value));
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

const togglePasswordVisibility = () => {
  isShowPassword.value = !isShowPassword.value;
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
      if (props.signupType === "MEMBER") {
        await signupMember();
      } else {
        await openMercenaryRetentionDialog();
      }
      break;
  }
}

const sendVerificationCode = async() => {
  try {
    await write("/api/auth/signup/mobile/send-code", null, {
      mobile: mobile.value
    });
    isShowVerificationField.value = true;
    currentStep.value = SignupState.ENTER_CODE;
    isDisabledMobile.value = true;
    startTimer();
    alert("인증번호가 전송되었습니다.");
  } catch(e) {
    isShowVerificationField.value = false;
    alert(e.message);
  }
};

const getCities = async() => {
  try {
    const response = await read("/api/auth/signup/cities");
    cities.value = response;
  } catch (e) {
    alert(e.message);
  }
}

const getDistricts = async(cityId) => {
  try {
    const response = await read(`/api/auth/signup/cities/${cityId}/districts`);
    districts.value = response;
  } catch(e) {
    alert(e.message);
  }
}

const resendVerificationCode = async() => {
  await sendVerificationCode();
};

const modifyMobile = () => {
  if (confirm("휴대폰 번호를 수정하시겠습니까?")) {
    currentStep.value = SignupState.ENTER_MOBILE;
    isDisabledMobile.value = false;
    isShowVerificationField.value = false;
    isAgreePersonalInfo.value = false;
    isAgreeTermsOfService.value = false;
    verificationCode.value = "";
  }
}

const verifyCode = async() => {
  try {
    await write("/api/auth/signup/mobile/verify-code", null, {
      code: verificationCode.value,
      mobile: mobile.value
    });
    alert("정상적으로 인증되었습니다.");
    stopTimer();
    currentStep.value = SignupState.ENTER_DETAIL;
    getCities();
  } catch(e) {
    alert(e.message);
  }
}
const validateNumericInput = () => {
  if (verificationCode.value) {
    verificationCode.value = verificationCode.value.replace(/\D/g, '');
    if (verificationCode.value.length > 6) {
      verificationCode.value = verificationCode.value.slice(0, 6);
    }
  }

  if (mobile.value) {
    mobile.value = mobile.value.replace(/\D/g, '');
    if (mobile.value.length > 11) {
      mobile.value = mobile.value.slice(0, 11);
    }
  }
  
  if (birthDay.value) {
    birthDay.value = birthDay.value.replace(/\D/g, '');
    if (birthDay.value.length > 8) {
      birthDay.value = birthDay.value.slice(0, 8);
    }
  }

};

const closeDialog = () => {
  if (confirm("작성한 사항이 저장되지 않을 수 있습니다. 계속하시겠습니까?")) {
    dialog.value = false;
    emit("close");
  }
};

const closeContentDialog = () => {
  dialogContent.value = false;
};

const registerMercenary = async() => {
  const {valid} = await isValid.value.validate();
  try {
    if (valid) {
      const payload = {
        name: name.value,
        mobile: mobile.value,
        gender: gender.value,
        retentionStatus: retentionStatus.value
      };
      await write("/api/auth/register/mercenary", null, payload);
      alert("용병 등록 요청이 완료되었습니다. 관리자 승인 후에 로그인하실 수 있습니다.");
      emit("close");
    }
  } catch(e) {
    alert(e.message);
  }
}

const signupMember = async() => {
  const {valid} = await isValid.value.validate();
  try {
    if (valid) {
      const payload = {
        name: name.value,
        mobile: mobile.value,
        password: password.value,
        birth: convertToDate(),
        gender: gender.value,
        cityId: selectedCity.value.cityId,
        districtId: selectedDistrict.value.districtId,
      };
      await write("/api/auth/signup/member", null, payload);
      alert("회원가입 요청이 완료되었습니다. 관리자 승인 후에 로그인하실 수 있습니다.");
      emit("close");
    }
  } catch(e) {
    alert(e.message);
  }
}

const convertToDate = () => {
  const year = birthDay.value.substring(0,4);
  const month = birthDay.value.substring(4,6);
  const day = birthDay.value.substring(6,8);
  const formattedDate = 
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return formattedDate;
}

watch([isAgreePersonalInfo, isAgreeTermsOfService], ([newPersonalInfo, newTerms]) => {
  allAgree.value = newPersonalInfo && newTerms;
});

watch(() => selectedCity.value, (val) => {
  selectedDistrict.value = null;
  getDistricts(val.cityId);
});

onMounted(() => {
});

</script>

<style scoped>

.phone-width {
  width: 100%;
}

.address-wrap {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.half-width {
  width: 90%;
}

.birthday-selects {
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
}

.birth-select {
  width: 100%;
}


.password-wrap, .address-wrap,
.name-wrap, .birthday-wrap {
  padding-left: 10px;
  padding-right: 10px;
  font-size: 0.8rem; 
  white-space: pre-wrap;
}

.password-wrap .v-messages__message {
  white-space: pre-wrap !important;
  word-wrap: break-word !important;
  line-height: 1.2 !important;
  font-size: 0.9rem !important;
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

.signup-btn, .cancel-btn {
  width: 80%;
}

.mercenary-retention-notice {
  white-space: pre-line;
}

.signup-btn.active {
  background-color: #90caf9;
  color: white;
}

.password-field {
  white-space: pre;
}

.gender-wrap {
  padding-bottom: 12px;
}

.signup-btn:disabled {
  background-color: #e0e0e0 !important;
  color: #757575 !important;
}

.v-btn.resend-btn,
.v-btn.mobile-modify-btn {
  text-align: center; 
  min-width: 80px;
  color: #1e88e5;
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
  padding: 4px 8px;
  border: 1px solid #1e88e5;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.v-btn.resend-btn:hover,
.v-btn.mobile-modify-btn:hover {
  background-color: #1e88e5;
  color: #ffffff;
}

.birthday-label,.password-label,
.address-label,.gender-label,
.name-label {
  font-size: 14px;
  color: #757575;
  margin-bottom: 8px;
  display: block;
}

.v-btn {
  display: inline-flex;
}

</style>