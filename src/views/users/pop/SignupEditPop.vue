<template>
  <v-dialog v-model="dialog" max-width="500px" persistent :click-outside="false">
    <v-card>
      <v-card-title class="text-h5">회원가입</v-card-title>
      <v-card-text>
        <v-form>
          <div class="carrier-phone">
            <v-select
              v-model="selectedCarrier"
              :items="carriers"
              label="이동통신사"
              outlined
              required
              class="carrier-width"
            />
            <v-text-field 
              v-model="phoneNumber" 
              label="휴대폰 번호" 
              type="tel" 
              required outlined 
              class="phone-width" 
            />
          </div>
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
              required outlined 
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="signup">회원가입</v-btn>
        <v-btn text @click="closeDialog">취소</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, defineEmits, onMounted, watch } from 'vue';
import { read } from "@/utils/util-axios.js";

const dialog = ref(true);
const phoneNumber = ref("");
const password = ref("");
const selectedCarrier = ref(null);
const selectedCity = ref(null);
const selectedDistrict = ref(null);

const carriers = ref(["KT", "SKT", "LG", "알뜰폰"]);
const cities = ref([]);
const districts = ref([]);
const isLoading = ref(false);

const emit = defineEmits(['close']);

const signup = () => {
  alert("회원가입 완료!");
}

const closeDialog = () => {
  dialog.value = false;
  emit("close");
}

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

watch(() => selectedCity.value, (val) => {
  selectedDistrict.value = null;
  getDistricts(val);
});

onMounted(getCities);

</script>

<style scoped>
.carrier-phone {
  display: flex;
  justify-content: space-between;
}

.carrier-width {
  width: 30%;
}

.phone-width {
  width: 68%;
}

.address-fields {
  display: flex;
  justify-content: space-between;
}

.half-width {
  width: 48%;
}
</style>
