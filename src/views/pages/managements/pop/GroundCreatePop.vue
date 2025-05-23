<template>
  <v-dialog v-model="isShowCreatePop" max-width="600px" persistent>
    <v-card class="pa-4 rounded-xl">
      <v-card-title class="text-h6">구장 정보 추가</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="groundInfo.placeName"
          label="구장명"
          variant="solo"
          readonly
        />
        <v-text-field
          v-model="groundInfo.roadAddressName"
          label="도로명 주소"
          variant="solo"
          readonly
        />
        <v-text-field
          v-model="groundInfo.addressName"
          label="지번 주소"
          variant="solo"
          readonly
        />
        <v-radio-group 
          inline
          v-model="groundType" 
          :mandatory="true"
          :rules="typeRule"
          row
        >
          <v-radio label="풋살장" value="FUTSAL" />
          <v-radio label="축구장" value="FOOTBALL" />
        </v-radio-group>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="grey" text @click="closeDialog">취소</v-btn>
        <v-btn color="primary" @click="addGround">추가하기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps, onMounted } from "vue";

const isShowCreatePop = ref(true);

const props = defineProps({
  selectedPlace: Object,
});
const groundType = ref("");

const groundInfo = ref({
  placeId: "",
  placeName: "",
  roadAddressName: "",
  addressName: "",
  longitude: "",
  latitude: "",
  cityId: null,
  districtId: null,
  groundType: "",
});

const emit = defineEmits(["close", "add-ground"]);

const closeDialog = () => {
  isShowCreatePop.value = false;
  emit("close");
};

const typeRule = [
  v => !!v || "구장 타입을 선택해주세요."
];


watch(() => props.selectedPlace, (val) => {
  if (val) 
    setGroundInfo(val);
});

const setGroundInfo = (val) => {
  groundInfo.value.placeId = val.placeId || "";
  groundInfo.value.placeName = val.placeName || "";
  groundInfo.value.roadAddressName = val.roadAddressName || "";
  groundInfo.value.addressName = val.addressName || "";
  groundInfo.value.longitude = val.longitude || "";
  groundInfo.value.latitude = val.latitude || "";
  groundInfo.value.cityId = val.cityId || null;
  groundInfo.value.districtId = val.districtId || null;
}

const addGround = () => {
  if (!groundInfo.groundType) {
    alert("구장 타입을 선택하세요");
    return;
  }
  if (confirm(groundInfo.value.placeName + " (를)을 추가하시겠습니까?")) {
    groundInfo.value.groundType = groundType.value;
    emit("add-ground", groundInfo.value);
    closeDialog();
  }
}

onMounted(
  () => setGroundInfo(props.selectedPlace)
);

</script>

<style scoped>
.v-card-text {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
