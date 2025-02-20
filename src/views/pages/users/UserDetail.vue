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
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserInfoStore } from "@/store/user";
import { convertDateOnlyDay } from "@/utils/util-dateConverter.js";
import UpdatePasswordPop from '@/views/pages/users/pop/UserUpdatePasswordPop.vue';

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