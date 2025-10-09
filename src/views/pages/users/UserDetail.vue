<template>
  <v-container fluid>
    <v-row justify="center" class="mb-4">
      <v-col cols="12" sm="10" md="8">
        <v-card class="pa-4 elevation-2 d-flex align-center title-card">
          <v-icon size="32" color="primary" class="mr-3">mdi-account-circle</v-icon>
          <v-card-title class="text-h5 font-weight-bold mb-0">계정 관리</v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card class="pa-4 elevation-1 rounded-lg section-card">
          <v-row dense>
            <v-col cols="12">
              <div class="label">이름</div>
              <v-card class="value-card">
                <v-card-text class="value-text">{{ name }}</v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12">
              <div class="label">생년월일</div>
              <v-card class="value-card">
                <v-card-text class="value-text">{{ birth }}</v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12">
              <div class="label">전화번호</div>
              <v-card class="value-card">
                <v-card-text class="value-text">{{ mobile }}</v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12">
              <div class="label">주소</div>
              <v-card class="value-card value-card-with-action">
                <v-card-text class="value-text">{{ address }}</v-card-text>
                <v-btn 
                  class="modify-address-btn" 
                  @click="openModifyAddressDialog" 
                  color="primary" 
                  variant="outlined"
                  text="주소 변경"
                />
              </v-card>
            </v-col>

            <v-col cols="12">
              <div class="label">생성 날짜</div>
              <v-card class="value-card">
                <v-card-text class="value-text">{{ createdAt }}</v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>
          <v-row dense>
            <v-col cols="12" class="d-flex justify-center mb-2">
              <update-password-pop />
            </v-col>
            <v-col cols="12" class="d-flex justify-center mb-2">
              <v-btn class="logout-btn" @click="confirmLogout" color="warning" variant="outlined">
                로그아웃
              </v-btn>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <v-btn class="retire-btn" @click="confirmAccountDelete" color="error" variant="outlined">
                회원 탈퇴
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
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
import { read, update, remove } from "@/utils/util-axios.js";
import { useRouter } from "vue-router";
import { useUserInfoStore } from "@/store/user";
import { useTokenStore } from "@/store/auth";
import { convertDateOnlyDay } from "@/utils/util-dateConverter.js";
import UpdatePasswordPop from "@/views/pages/users/pop/UserUpdatePasswordPop.vue";
import { autoMobileHyphen, replaceBirthHyphen } from "@/utils/util-unit";

const router = useRouter();
const $userInfo = useUserInfoStore();
const $auth = useTokenStore();

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

const isShowModifyAddress = ref(false);
const isLoading = ref(false);

const cityRule = [v => !!v || "시/도를 선택해주세요."];
const districtRule = [v => !!v || "시/군/구를 선택해주세요."];

const openModifyAddressDialog = async() => {
  isShowModifyAddress.value = true;
  await getCities();
  await getDistricts(memberDetail.value.cityId);
  selectedCity.value = findCity(memberDetail.value.cityId);
  selectedDistrict.value = findDistrict(memberDetail.value.districtId);
}
const closeModifyAddressDialog = () => isShowModifyAddress.value = false;

const findCity = (cityId) => cities.value.find(city => city.cityId === cityId);
const findDistrict = (districtId) => districts.value.find(district => district.districtId === districtId);

const confirmAccountDelete = async() => {
  if (confirm("회원 탈퇴를 할 경우, 즉시 모든 데이터가 삭제됩니다. 그래도 회원 탈퇴를 하시겠습니까?")) {
    try {
      await remove("/api/users/members/retire");
    } catch(e) {
      alert(e.message);
    }
  }
};

const confirmLogout = () => {
  if (confirm("로그아웃 하시겠습니까?")) {
    $auth.reset();
    $userInfo.reset();
    router.replace("Login");
  }
  
}

const getIsEnabledModifyAddress = () => {
  if (!selectedCity.value || !selectedDistrict.value) return false;
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
  const valid = await isAddressValid.value.validate(); 
  try {
    if (valid) {
      if (confirm(`${selectedCity.value.name} ${selectedDistrict.value.name}(으)로 주소를 변경하시겠습니까?`)) {
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
  if (val) {
    selectedDistrict.value = null;
    getDistricts(val.cityId);
  }
});

onMounted(() => {
  loadInfo();
});
</script>

<style scoped>
.title-card {
  background-color: #f5f7fa;
  border-radius: 16px;
}

.section-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
}

.label {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 6px;
  color: #222;
}

.value-text {
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.value-card {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 10px 14px;
  box-shadow: none;
}

.value-card-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modify-address-btn {
  margin-left: 12px;
}

.title-text {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.address-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.logout-btn, .retire-btn {
  min-width: 200px;
}

.v-col {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .label {
    font-size: 15px;
  }
  .value-text {
    font-size: 14px;
  }
  .v-col {
    margin-bottom: 16px;
  }
}
</style>

