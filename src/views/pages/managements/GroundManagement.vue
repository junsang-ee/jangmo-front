<template>
  <v-container fluid>
    <v-row justify="center" class="mb-4">
      <v-col cols="12" sm="10" md="8">
        <v-card class="title-card d-flex align-center justify-space-between pa-4 elevation-3">
          <div class="d-flex align-center">
            <v-icon size="36" color="primary" class="mr-3">mdi-map-marker-radius</v-icon>
            <v-card-title class="text-h5 font-weight-bold mb-0">구장 관리</v-card-title>
          </div>
          <v-btn color="primary" variant="flat" @click="openSearchPop" size="small">구장 추가</v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card class="pa-4 elevation-1">
          <h3 class="text-subtitle-1 font-weight-bold mb-4">등록된 구장 리스트</h3>

          <v-data-table
            :headers="headers"
            :items="groundList"
            item-value="name"
            class="elevation-1 rounded-xl"
            dense
          >
            <template #item.actions="{ item }">
              <v-btn size="small" variant="outlined" color="primary" @click="viewDetail(item)">
                상세보기
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <GroundSearchPop
      v-if="isShowSearchPop"
      @close="closeSearchPop"
    />
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { write, read } from "@/utils/util-axios.js";
import GroundSearchPop from "@/views/pages/managements/pop/GroundSearchPop.vue";

const isShowSearchPop = ref(false);

const groundList = ref([
  { name: "서울 월드컵 경기장", address: "서울특별시 마포구 성산동" },
  { name: "잠실 종합 운동장", address: "서울특별시 송파구 잠실동" }
]);

const headers = [
  { title: "구장명", key: "name" },
  { title: "도로명 주소", key: "address" },
  { title: "구장 상세", key: "actions", sortable: false }
];

const openSearchPop = () => {
  isShowSearchPop.value = true;
}

const closeSearchPop = () => {
  isShowSearchPop.value = false;
}

const viewDetail = async(item) => {
  await $alert(`📍 ${item.name}\n📌 ${item.address}`);
};

const addGround = async(groundInfo) => {
  try {
    await write("/api/managers/", null, groundInfo);
    
  }catch(e) {
    await $alert(e.message);
  }
  groundList.value.push(ground);
};
</script>

<style scoped>
.title-card {
  background-color: #f0f4f8;
  border-radius: 16px;
}
</style>
