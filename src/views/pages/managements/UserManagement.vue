<template>
  <v-container fluid>
    <v-row justify="center" class="mb-4">
      <v-col cols="12" sm="10" md="8">
        <v-card class="pa-4 elevation-2 d-flex align-center title-card">
          <v-icon size="32" color="primary" class="mr-3">mdi-account-cog</v-icon>
          <v-card-title class="text-h5 font-weight-bold mb-0">유저 관리</v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card class="pa-4 elevation-1 rounded-lg section-card">
          <v-row class="search-section mb-4" dense>
            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="selectedUserType"
                :items="userTypes"
                item-title="name"
                item-text="value"
                label="유저 타입"
                return-object
                hide-details
                dense
              />
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="selectedUserStatus"
                :items="userStatuses"
                item-title="name"
                item-text="value"
                label="유저 상태"
                return-object
                hide-details
                dense
              />
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="searchKeyword"
                label="이름 검색"
                clearable
                append-inner-icon="mdi-magnify"
                @click:append-inner="getUsers"
                @keydown.enter="getUsers"
                hide-details
                dense
              />
            </v-col>
          </v-row>
          <v-row class="mb-2">
            <v-col cols="12" class="d-flex justify-space-between align-center">
              <div class="d-flex align-center text-subtitle-1 font-weight-medium">
                <v-icon class="mr-2" color="primary">mdi-account-multiple</v-icon>
                <span>
                  <strong>검색결과</strong> {{ totalCount }}
                </span>
              </div>
              <div class="text-caption text-grey-darken-1">
                {{ totalCount }}건 중 {{ currentPage }}페이지
              </div>
            </v-col>
          </v-row>
          <v-data-table-server
            v-model:items-per-page="pageSize"
            :headers="userTableHeaders"
            :items="userList"
            :items-length="totalCount"
            :loading="isLoading"
            :page.sync="currentPage"
            item-key="userId"
            class="elevation-1 data-table"
            @update:options="getUsers"
            hide-default-footer
          >
            <template v-slot:item.userName="{ item }">
              <span class="name-field">{{ item.userName }}</span>
            </template>
            <template v-slot:item.role="{ item }">
              <span class="role-field">{{ translateUserRole(item.role) }}</span>
            </template>
            <template v-slot:item.status="{ item }">
              <span class="status-field">
                {{ getStatus(item.role, item.status) }}
              </span>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn 
                class="user-detail-btn" 
                @click="openUserDetailDialog(item)" 
                color="primary" 
                variant="outlined"
                text="상세보기"
              />
            </template>
          </v-data-table-server>

          <v-row class="text-center mt-4" justify="center">
            <v-col cols="auto">
              <v-pagination
                v-model="currentPage"
                :length="getPageCount"
                :total-visible="7"
                next-icon="mdi-menu-right"
                prev-icon="mdi-menu-left"
              />
            </v-col>
          </v-row>

        </v-card>
      </v-col>
    </v-row>

    <UserDetailPop
      v-if="isOpenUserDetail"
      :userDetail="userDetail"
      @close="closeDetailPop"
    />
  </v-container>
</template>
<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { read } from "@/utils/util-axios.js";
import { translateUserRole } from "@/constants/role.js";
import { USER_COMMON_STATUSES, MEMBER_STATUSES, MERCENARY_STATUSES} from "@/constants/user-status.js"
import { translateMemberStatus, translateMercenaryStatus } from "@/constants/user-status.js"
import UserDetailPop from "@/views/pages/managements/pop/UserDetailPop.vue";

const userTypes = ref([
  { name: "전체", value: "" },
  { name: "회원", value: "MEMBER" },
  { name: "용병", value: "MERCENARY" },
]);

const userStatuses = ref(USER_COMMON_STATUSES);
const memberStatuses = ref(MEMBER_STATUSES);
const mercenaryStatuses = ref(MERCENARY_STATUSES);

const selectedUserType = ref(userTypes.value[0]);
const selectedUserStatus = ref(userStatuses.value[0]);
const searchKeyword = ref("");
const isLoading = ref(false);
const userList = ref([]);
const currentPage = ref(1);
const totalCount = ref(0);
const pageSize = ref(10);
const currentUserId = ref(1);
const userDetail = ref({});
const isOpenUserDetail = ref(false);
const userTableHeaders = ref([
  { title: "이름", align: "start", value: "userName", sortable: false, class:"header" },
  { title: "유저타입", align: "start", value: "role", sortable: false, class:"header" },
  { title: "유저상태", align: "start", value: "status", sortable: false, class:"header" },
  { title: "유저상세", align: "start", value: "actions", sortable: false, class:"header" },
]);

const openUserDetailDialog = async(user) => {
  if (user.role === "MEMBER")
    userDetail.value = await getMember(user.userId);
  else userDetail.value = await getMercenary(user.userId);
  isOpenUserDetail.value = true;
};

const getPageCount = computed(() => {
    return Math.floor(((totalCount.value-1) / pageSize.value) + 1);
});

const closeDetailPop = () => {
  isOpenUserDetail.value = false;
  getUsers();
}
const getStatus = (role, status) => {
  if (role === "MERCENARY")
    return translateMercenaryStatus(status.mercenaryStatus);
  else return translateMemberStatus(status.memberStatus);
}
const getMember = async(userId) => {
  try {
    const response = await read(`/api/managers/members/${userId}`);
    return response;
  } catch(e) { alert(e.message); }
}

const getMercenary = async(userId) => {
  try {
    const response = await read(`/api/managers/mercenaries/${userId}`);
    return response;
  } catch(e) {
    alert(e.message);
  }
}

const getUsers = async() => {
  isLoading.value = true;
  try {
    const response = await read("/api/managers/users", {
      page: currentPage.value - 1,
      size: pageSize.value,
      role: selectedUserType.value.value,
      memberStatus: getMemberStatus(),
      mercenaryStatus: getMercenaryStatus(),
      searchKeyword: searchKeyword.value
    });
    userList.value = response.list;
    totalCount.value = response.totalCount;
  } catch(e) {
    alert(e.message);
  } finally {isLoading.value = false;}
}

const getMemberStatus = () => {
  const isInclude = memberStatuses.value.some(
    (status) => status.value === selectedUserStatus.value.value
  );
  if (isInclude)
    return selectedUserStatus.value.value;
  return null;
}

const getMercenaryStatus = () => {
  const isInclude = mercenaryStatuses.value.some(
    (status) => status.value === selectedUserStatus.value.value
  );
  if (isInclude)
    return selectedUserStatus.value.value;
  return null;
}

onMounted(() => {
  getUsers();
});

watch([selectedUserType, selectedUserStatus], () => {
  getUsers();
})

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

.search-section {
  row-gap: 8px;
}

.name-field,
.role-field,
.status-field,
.user-detail-btn {
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-width: 120px;
}

.data-table {
  white-space: nowrap;
}


@media (max-width: 768px) {
  .v-select {
    font-size: 14px;
  }

  .v-btn {
    min-width: 36px;
    height: 36px;
  }

  .name-field,
  .role-field,
  .status-field {
    max-width: 90px;
  }

  .v-data-table-server {
    font-size: 13px;
  }

  .v-card-title {
    font-size: 16px;
  }
}
</style>

