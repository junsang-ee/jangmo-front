<template>
  <v-container class="user-detail-container" fluid>
    <h2 class="title">계정 관리</h2>
    <v-row class="info-row">
      <v-col cols="12">
        <div class="field-container">
          <div class="label">이름</div>
            <v-card class="value-card">
              <v-card-text>{{ name }}</v-card-text>
            </v-card>
          </div>
      </v-col>
      <v-col cols="12">
        <div class="field-container">
          <div class="label">생년월일</div>
            <v-card class="value-card">
              <v-card-text>{{ birth }}</v-card-text>
            </v-card>
          </div>
      </v-col>
      <v-col cols="12">
        <div class="field-container">
          <div class="label">전화번호</div>
          <v-card class="value-card">
            <v-card-text>{{ mobile }}</v-card-text>
          </v-card>
        </div>
      </v-col>

      <v-col cols="12">
        <div class="field-container">
          <div class="label">주소</div>
          <v-card class="value-card value-card-with-action">
            <v-card-text>{{ address }}</v-card-text>
            <v-btn 
              class="modify-address-btn" 
              @click="openModifyAddressDialog" 
              color="primary" outlined>주소 변경</v-btn>
          </v-card>
        </div>
      </v-col>
      <v-col cols="12">
        <div class="field-container">
          <div class="label">생성 날짜</div>
          <v-card class="value-card">
            <v-card-text>{{ createdAt }}</v-card-text>
          </v-card>
        </div>
      </v-col>

      <v-col cols="12" class="actions">
        <div class="action-item">
          <update-password-pop />
        </div>
        <div class="action-item">
          <v-btn class="retire-btn" @click="confirmAccountDelete" color="error" outlined>회원 탈퇴</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { read } from "@/utils/util-axios.js";
import { useUserInfoStore } from "@/store/user";
import { convertDateOnlyDay } from "@/utils/util-dateConverter.js";
import UpdatePasswordPop from '@/views/pages/users/pop/UserUpdatePasswordPop.vue';
import {autoMobileHyphen, replaceBirthHyphen} from "@/utils/util-unit";

const $userInfo = useUserInfoStore(); 
const name = ref("");
const mobile = ref("");
const createdAt = ref(null);
const address = ref("");
const birth = ref("");
const memberDetail = ref({
  name: "",
  mobile: "",
  createdAt: "",
  address: "",
  city: null,
  district: null
});

const dialog = ref(false);
const isShowModifyAddress = ref(false);
const newMobile = ref("");
const verificationCode = ref("");
const verificationSent = ref(false);

const openDialog = () => {
  dialog.value = true;
};

const openModifyAddressDialog = () => isShowModifyAddress.value = true;

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

const _loadInfo = async() => {
  if ($userInfo.getInfo().role !== "MERCENARY") {
    await getMemberDetail();
    name.value = memberDetail.value.name;
    mobile.value = autoMobileHyphen(memberDetail.value.mobile);
    birth.value = replaceBirthHyphen(memberDetail.value.birth);
    createdAt.value = convertDateOnlyDay(memberDetail.value.createdAt);
    address.value = memberDetail.value.city.name + " " + memberDetail.value.district.name;
  } else {
    name.value = $userInfo.getInfo().name;
    mobile.value = $userInfo.getInfo().mobile;
    createdAt.value = convertDateOnlyDay($userInfo.getInfo().createdAt);
  }
}

const getMemberDetail = async() => {
  try {
    const response = await read("/api/user/member/detail");
    memberDetail.value = response.data.data;
  }catch(e) {
    alert(e.message);
  }
}

onMounted(() => {
    _loadInfo();
});
</script>

<style scoped>
.user-detail-container {
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
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

.field-container {
  margin-bottom: 20px;
}

.label {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.value-card {
  background-color: #f2f2f2;
  padding: 16px;
  border-radius: 12px;
  box-shadow: none;
}

.value-card-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.value-card-with-action .modify-address-btn {
  margin-left: 20px;
  font-size: 0.9rem;
}

.action-item {
  margin-top: 16px;
  text-align: center;
}

.modify-address-btn {
  font-size: 1rem;
  padding: 12px 12px;
  font-weight: 500;
  min-width: 100px;
}

.retire-btn {
  font-size: 1rem;
  padding: 12px 12px;
  font-weight: 500;
  min-width: 250px;
}
</style>