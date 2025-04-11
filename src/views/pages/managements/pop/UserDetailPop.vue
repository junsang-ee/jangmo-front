<template>
  <v-container class="user-detail-container" fluid>
    <v-dialog v-model="isDialogOpen" max-width="600px" persistent :click-outside="false">
      <v-card>
        <v-card-title class="title">{{ titleRole }} 상세 정보</v-card-title>
        <v-card-text>
          <v-row class="info-row">
            <v-col cols="12">
              <div class="field-container">
                <div class="label">이름</div>
                <v-card class="value-card">
                  <v-card-text>{{ props.userDetail.name }}</v-card-text>
                </v-card>
              </div>
            </v-col>
            <v-col v-if="isMember" cols="12">
              <div class="field-container">
                <div class="label">생년월일</div>
                <v-card class="value-card">
                  <v-card-text>{{ replaceBirthHyphen(props.userDetail.birth) }}</v-card-text>
                </v-card>
              </div>
            </v-col>
            <v-col v-if="isMember" cols="12">
              <div class="field-container">
                <div class="label">전화번호</div>
                <v-card class="value-card">
                  <v-card-text>{{ autoMobileHyphen(props.userDetail.mobile) }}</v-card-text>
                </v-card>
              </div>
            </v-col>
            <v-col v-if="isMember" cols="12">
              <div class="field-container">
                <div class="label">주소</div>
                <v-card class="value-card">
                  <v-card-text>{{ getAddressName() }}</v-card-text>
                </v-card>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="field-container">
                <div class="label">유저 권한</div>
                <v-card class="value-card">
                  <v-card-text>{{ translateUserRole(props.userDetail.role) }}</v-card-text>
                </v-card>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="field-container">
                <div class="label">유저 상태</div>
                <v-card class="value-card value-card-with-action">
                  <v-card-text v-if="props.userDetail.role === 'MERCENARY'">
                    {{ translateMercenaryStatus(props.userDetail.status) }}
                  </v-card-text>
                  <v-card-text v-else>
                    {{ translateMemberStatus(props.userDetail.status) }}
                  </v-card-text>
                  <v-btn
                    v-if="props.userDetail.status === 'PENDING'" 
                    class="approve-btn"
                    @click="approve"
                    color="primary" 
                    outlined
                    text="가입 승인"
                  />
                </v-card>
              </div>
            </v-col>
            <v-col cols="12">
              <div class="field-container">
                <div class="label">생성 날짜</div>
                <v-card class="value-card">
                  <v-card-text>{{ convertDateOnlyDay(props.userDetail.createdAt) }}</v-card-text>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="closeDialog">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted, defineEmits, defineProps } from 'vue';
import { read, update } from "@/utils/util-axios.js";
import { convertDateOnlyDay } from "@/utils/util-dateConverter.js";
import { autoMobileHyphen, replaceBirthHyphen } from "@/utils/util-unit";
import { translateMemberStatus, translateMercenaryStatus } from "@/constants/user-status.js"
import { translateUserRole } from "@/constants/role.js";

const memberDetail = ref();
const mercenaryDetail = ref();
const isDialogOpen = ref(true);

const props = defineProps({
  userDetail: {
    type: Object,
    required: true
  }
});
const isMember = ref(props.userDetail.role !== "MERCENARY");
const titleRole = ref(isMember.value ? "회원" : "용병");
const emit = defineEmits(['close']);

const closeDialog = () => {
  isDialogOpen.value = false;
  emit("close");
};

const getMember = async() => {
  try {
    const response = await read(`/api/managers/members/${props.userId}`);
    userDetail.value = response.data.data;

  } catch(e) { alert(e.message); }
}

const getMercenary = async() => {
  try {
    const response = await read(`/api/managers/mercenaries/${props.userId}`);
    userDetail.value = response.data.data;
  } catch(e) {alert(e.message);}
}

const getAddressName = () => props.userDetail.cityName + " " + props.userDetail.districtName;

const approve = async() => {
  try {
    let roleName = isMember.value ? "회원" : "용병";
    if (confirm("해당 " + roleName + "의 가입 요청을 승인하시겠습니까?")) {
      let url = "/api/managers";
      if (isMember) {
        await update(`${url}/members/${props.userDetail.id}/approve`);
      } else {
        await update(`${url}/mercenary/${props.userDetail.id}/approve`);
      }
      alert("가입 승인이 완료되었습니다.");
      closeDialog();
    }
  } catch(e) {
    alert(e.message);
  }
}

</script>

<style scoped>
.user-detail-container {
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
}

.title {
  font-size: 1.5rem;
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
  width: 100%;
}

.label {
  font-size: 1.1rem;
  font-weight: bold;
  color: #555;
  margin-bottom: 8px;
}

.value-card {
  background-color: #f7f7f7;
  padding: 12px;
  border-radius: 8px;
  box-shadow: none;
}

.v-btn {
  min-width: 100px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
}

.value-card-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.value-card-with-action .approve-btn {
  margin-left: 20px;
  font-size: 0.9rem;
  align-items: center;
  justify-content: center;
  height: 100%;
  line-height: normal;
  padding: 12px 12px;
  min-width: 100px;
  text-align: center; 
  color: #1e88e5;
  text-transform: uppercase;
  padding: 4px 8px;
  border: 1px solid #1e88e5;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.header {
  font-weight: 900;
}
</style>
