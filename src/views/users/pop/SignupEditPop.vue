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
                class="half-width"
                @change="updateDistricts"
              />
              <v-select
                v-model="selectedDistrict"
                :items="districts"
                label="시/군/구"
                outlined
                required
                class="half-width"
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
  import { ref, defineEmits } from 'vue';
  
  const dialog = ref(true);
  const phoneNumber = ref("");
  const password = ref("");
  const selectedCarrier = ref(null);
  const selectedCity = ref(null);
  const selectedDistrict = ref(null);
  
  const carriers = ref(["KT", "SKT", "LG", "알뜰폰"]);
  
  const cities = ref([
    "서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시",
    "대전광역시", "울산광역시", "세종특별자치시", "경기도", "강원도", 
    "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도"
  ]);
  
  const districts = ref([]);
  
  const updateDistricts = () => {
    const city = selectedCity.value;
  
    if (city === "서울특별시") {
      districts.value = ["강남구", "강동구", "강북구", "강서구", "관악구"];
    } else if (city === "부산광역시") {
      districts.value = ["해운대구", "수영구", "사하구", "금정구"];
    } else if (city === "경기도") {
      districts.value = ["수원시", "성남시", "고양시", "용인시"];
    } else {
      districts.value = ["해당 지역의 구/군/동 없음"]; // 기본 값
    }
    selectedDistrict.value = null; // 시/도가 바뀌면 구/군/동 초기화
  };
  
  const emit = defineEmits(['close']);
  
  const signup = () => {
    alert("회원가입 완료!");
  }
  
  const closeDialog = () => {
    dialog.value = false;
    emit("close");
  }
  
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
  