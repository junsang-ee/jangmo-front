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
              color="primary" 
              outlined
              text="주소 변경"
            />
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
    <v-dialog v-model="isShowModifyAddress" max-width="500px" persistent :click-outside="false">
      <v-card>
        <v-card-title class="title-text">주소 변경</v-card-title>
        <v-card-text>
          <v-form ref="isAddressValid">
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
                :loading="isLoading"
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
                :loading="isLoading"
                :disabled="!selectedCity"
                outlined
                required
                return-object
              />
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn 
            @click="modifyAddress"
            :disabled="!getIsEnabledModifyAddress()"
            class="confirm-modify-address-btn"
            color="primary"
            text="변경"
            flat
          />
          <v-btn
            @click="closeModifyAddressDialog" 
            class="close-address-btn"
            color="primary"
            text="닫기"
            flat
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { read, update } from "@/utils/util-axios.js";
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
const cities = ref([]);
const districts = ref([]);
const selectedCity = ref(null);
const selectedDistrict = ref(null);
const isAddressValid = ref(false);
const memberDetail = ref({
  name: "",
  mobile: "",
  createdAt: "",
  address: "",
  cityId: 0,
  cityName: "",
  districtId: 0,
  districtName: ""
});

const dialog = ref(false);
const isShowModifyAddress = ref(false);
const newMobile = ref("");
const verificationCode = ref("");
const verificationSent = ref(false);
const isValid = ref(false);
const isLoading = ref(false);
const cityRule = [
  v => !!v || "시/도를 선택해주세요."
];

const districtRule = [
  v => !!v || "시/군/구를 선택해주세요."
];

const openDialog = () => {
  dialog.value = true;
};

const openModifyAddressDialog = async() => {
  isShowModifyAddress.value = true;
  await getCities();
  await getDistricts(memberDetail.value.cityId);
  selectedCity.value = findCity(memberDetail.value.cityId);
  selectedDistrict.value = findDistrict(memberDetail.value.districtId);
}
const closeModifyAddressDialog = () => isShowModifyAddress.value = false;

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

const findCity = (cityId) => {
  return cities.value.find(city => city.cityId === cityId);
}

const findDistrict = (districtId) => {
  return districts.value.find(district => district.districtId === districtId);
}

const confirmAccountDelete = async() => {
  if (confirm("회원 탈퇴를 할 경우, 즉시 모든 데이터가 삭제됩니다. 그래도 회원 탈퇴를 하시겠습니까?")) {
    try {
      await remove("/api/users/members/retire");
    } catch(e) {
      alert(e.message);
    }
  }
};

const getIsEnabledModifyAddress = () => {
  if (!selectedCity.value || !selectedDistrict.value) {
    return false;
  }
  return !(memberDetail.value.cityId === selectedCity.value.cityId &&
      memberDetail.value.districtId === selectedDistrict.value.districtId);
}

const loadInfo = async() => {
  if ($userInfo.getInfo().role === "MERCENARY") {
    name.value = $userInfo.getInfo().name;
    mobile.value = $userInfo.getInfo().mobile;
    createdAt.value = convertDateOnlyDay($userInfo.getInfo().createdAt);
  } else {
    await getMemberDetail();
    name.value = memberDetail.value.name;
    mobile.value = autoMobileHyphen(memberDetail.value.mobile);
    birth.value = replaceBirthHyphen(memberDetail.value.birth);
    createdAt.value = convertDateOnlyDay(memberDetail.value.createdAt);
    address.value = memberDetail.value.cityName + " " + memberDetail.value.districtName;
  }
}

const getCities = async() => {
  isLoading.value = true;
  try {
    const response = await read("/api/locations/cities");
    cities.value = response;
    selectedCity.value = findCity(memberDetail.value.cityId);
    isLoading.value = false;
  } catch(e) {
    alert(e.message);
  }
}

const getDistricts = async(cityId) => {
  isLoading.value = true;
  try {
    const response = await read(`/api/locations/cities/${cityId}/districts`);
    districts.value = response;
    if (selectedCity.value === findCity(memberDetail.value.cityId)) {
      selectedDistrict.value = findDistrict(memberDetail.value.districtId);
    }
  } catch(e) {
    alert(e.message);
  } finally {
    isLoading.value = false;
  }
}

const modifyAddress = async() => {
  const {valid} = await isAddressValid.value.validate(); 
  try {
    if (valid) {
      if (confirm(selectedCity.value.name + " " + 
                  selectedDistrict.value.name + 
                  " (으)로 주소를 변경하시겠습니까?")) {
        await update("/api/users/members/address", null, {
          cityId: selectedCity.value.cityId,
          districtId: selectedDistrict.value.districtId
        });
        alert("주소가 정상적으로 변경되었습니다.");
        loadInfo();
        closeModifyAddressDialog();
      }
    }
  } catch(e) {
    alert(e.message);
  }

}

const getMemberDetail = async() => {
  try {
    const response = await read("/api/users/members/me");
    memberDetail.value = response;
  }catch(e) {
    alert(e.message);
  }
}

watch(() => selectedCity.value, (val) => {
  selectedDistrict.value = null;
  getDistricts(val.cityId);
});

onMounted(() => {
  loadInfo();
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

.action-item {
  margin-top: 16px;
  text-align: center;
}

.retire-btn {
  font-size: 1rem;
  padding: 12px 12px;
  font-weight: 500;
  min-width: 250px;
}

.title-text {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.address-wrap {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.confirm-modify-address-btn, .close-address-btn {
  text-align: center; 
  min-width: 80px;
  font-size: 14px;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.v-btn {
  display: inline-flex;
}

</style>