<template>
  <v-dialog v-model="dialog" max-width="500px" persistent :click-outside="false">
    <v-card>
      <v-card-title class="text-h5 text-center">회원가입</v-card-title>
      <v-card-text>
        <v-form>
          <div v-if="currentStep === 'verifyStep'">
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
              type="number" 
              outlined 
              class="phone-width"
            />
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
              @click="sendVerificationCode" 
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
import { write } from "@/utils/util-axios.js";

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
const currentStep = ref("verifyStep");
const isShowVerificationField = ref(false); 
const nextButtonText = ref("인증번호 발송");

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

const sendVerificationCode = () => {
  isShowVerificationField.value = true;
  sendAuthCode();
};

const sendAuthCode = async () => {
  try {
    await write("/api/auth/signup/mobile-code", null, {
      mobile: phoneNumber.value
    });
    alert("인증번호가 전송되었습니다.");
  } catch(e) {
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
</style>
