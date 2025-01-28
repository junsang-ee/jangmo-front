<template>
    <v-container class="user-detail-container" fluid>
    <h2 class="title">계정 관리</h2>
    <v-row class="info-row">
      <v-col cols="12">
        <div class="info-label">
          <span class="label">이름</span>
          <span class="value">{{ name }}</span>
        </div>
      </v-col>
      <v-col cols="12">
        <div class="info-label">
          <span class="label">전화번호</span>
          <span class="value">{{ mobile }}</span>
        </div>
      </v-col>
      <v-col cols="12">
        <div class="info-label">
          <span class="label">생성 날짜</span>
          <span class="value">{{ createdAt }}</span>
        </div>
      </v-col>
      <v-col cols="12" class="actions">
        <v-col cols="12" class="action-item">
          <update-password-pop />
        </v-col>
        <v-col cols="12" class="action-item">
          <v-btn class="action-btn" @click="confirmAccountDelete" color="error" outlined>회원 탈퇴</v-btn>
        </v-col>
      </v-col>
    </v-row>
  </v-container>

        <!-- <v-dialog v-model="passwordDialog" max-width="400">
            <div class="dialog-card">
                <h3 class="dialog-title">비밀번호 변경</h3>
                <div class="dialog-content">
                    <v-form>
                        <v-text-field
                            v-model="currentPassword"
                            label="현재 비밀번호"
                            type="password"
                            placeholder="현재 비밀번호를 입력하세요"
                        />
                        <v-text-field
                            v-model="newPassword"
                            label="새 비밀번호"
                            type="password"
                            placeholder="새 비밀번호를 입력하세요"
                        />
                        <v-text-field
                            v-model="confirmPassword"
                            label="비밀번호 확인"
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                        />
                    </v-form>
                </div>
                <div class="dialog-actions">
                    <v-btn @click="closePasswordDialog" text>취소</v-btn>
                    <v-btn @click="confirmPasswordChange" color="primary">확인</v-btn>
                </div>
            </div>
        </v-dialog>


        <v-dialog v-model="dialog" max-width="400">
            <div class="dialog-card">
                <h3 class="dialog-title">휴대폰번호 변경</h3>
                <div class="dialog-content">
                    <v-form>
                        <v-text-field
                            v-model="newMobile"
                            label="새 전화번호"
                            type="tel"
                            placeholder="전화번호를 입력하세요"
                        />
                        <v-btn @click="sendVerificationCode" color="primary">
                            인증번호 발송
                        </v-btn>
                        <v-text-field
                            v-if="verificationSent"
                            v-model="verificationCode"
                            label="인증번호 입력"
                            placeholder="인증번호를 입력하세요"
                        />
                    </v-form>
                </div>
                <div class="dialog-actions">
                    <v-btn @click="closeDialog" text>취소</v-btn>
                    <v-btn @click="confirmPhoneChange" color="primary">확인</v-btn>
                </div>
            </div>
        </v-dialog>
    </v-container> -->
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserInfoStore } from "@/store/user";
import { convertDateOnlyDay } from "@/utils/util-dateConverter.js";
import UpdatePasswordPop from '@/views/pages/pop/UserUpdatePasswordPop.vue';

const $userInfo = useUserInfoStore(); 
const name = ref("");
const mobile = ref("");
const createdAt = ref(null);

const dialog = ref(false);
const newMobile = ref("");
const verificationCode = ref("");
const verificationSent = ref(false);

const openDialog = () => {
    dialog.value = true;
};

const closeDialog = () => {
    dialog.value = false;
    newMobile.value = "";
    verificationCode.value = "";
    verificationSent.value = false;
};

const sendVerificationCode = () => {
    verificationSent.value = true;
};

const confirmPhoneChange = () => {
    mobile.value = newMobile.value;
    closeDialog();
};

const openPasswordChange = () => {
    // 비밀번호 변경 로직
};

const confirmAccountDelete = () => {
    if (confirm("정말로 회원 탈퇴하시겠습니까?")) {
        // 회원 탈퇴 처리 로직
    }
};

const setUserDetail = () => {
    name.value = $userInfo.getInfo().name;
    mobile.value = $userInfo.getInfo().mobile;
    createdAt.value = convertDateOnlyDay($userInfo.getInfo().createdAt);
};

onMounted(() => {
    setUserDetail();
});
</script>

<style scoped>
.user-detail-container {
    padding: 30px;
    max-width: 600px;
    margin: 0 auto;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 25px;
    text-align: center;
    color: #333;
}

.info-row {
    margin-bottom: 16px;
}

.info-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 10px 0;
    border-bottom: 1px solid #e0e0e0;
}

.label {
    font-size: 1rem;
    font-weight: 500;
    color: #555;
    flex: 0.4;
    text-align: center;
}

.value {
    font-size: 1rem;
    color: #333;
    flex: 0.6;
    text-align: center;
}

.action-item {
    margin-bottom: 16px;
    display: flex;
    justify-content: center;
}

.action-btn {
    font-size: 1rem;
    padding: 12px 12px;
    font-weight: 500;
    min-width: 250px;
}

.dialog-card {
    padding: 16px;
    background-color: white;
    box-shadow: none;
}

.dialog-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 16px;
    text-align: center;
}

.dialog-content {
    margin-bottom: 24px;
}

.dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}
</style>