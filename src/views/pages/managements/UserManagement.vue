<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-2 mb-3">
          <v-card-title>유저 관리</v-card-title>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card class="pa-2">
          <v-row class="search-section" dense>
            <v-col cols="12" sm="6" md="4">
              <v-select
                v-model="selectedUserType"
                :items="userTypes"
                item-title="name"
                item-text="value"
                label="유저 타입"
                return-object
                dense
                hide-details
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
                dense
                hide-details
              />
            </v-col>
          </v-row>
          <div class="table-container">
            <v-data-table-server
              v-model:items-per-page="pageSize"
              :headers="userTableHeaders"
              :items="userList"
              :items-length="totalCount"
              :loading="isLoading"
              :page.sync="currentPage"
              item-key="userId"
              class="elevation-1"
              @update:options="getUsers"
              hide-default-footer
            >
              <template v-slot:item.userName="{ item }">
                <span class="name-field">{{ item.userName}}</span>
              </template>
              <template v-slot:item.role="{ item }">
                <span class="role-field">{{ translateUserRole(item.role)}}</span>
              </template>
              <template v-slot:item.status="{ item }">
                <span class="status-field">
                  {{ getStatus(item.role, item.status) }}
                </span>
              </template>
              <template v-slot:item.actions="{ item }">
                <div>
                  <v-btn 
                    class="user-detail-btn" 
                    @click="openUserDetailDialog(item)" 
                    color="primary" 
                    outlined
                  >
                    상세보기
                  </v-btn>
                </div>
              </template>

            </v-data-table-server>
            <v-row class="text-center px-4 align-center" wrap>
              <v-col>
                <v-pagination
                  v-model="currentPage"
                  :length="getPageCount"
                />
              </v-col>
            </v-row>
          </div>
        </v-card>
        <UserDetailPop
          v-if="isOpenUserDetail"
          :userDetail="userDetail"
          @close="hideUserDetailDialog"
        />
      </v-col>
    </v-row>
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

const hideUserDetailDialog = () => {
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
    return response.data.data;
  } catch(e) { alert(e.message); }
}

const getMercenary = async(userId) => {
  try {
    const response = await read(`/api/managers/mercenaries/${userId}`);
    return response.data.data;
  } catch(e) {alert(e.message);}
}

const getUsers = async() => {
  isLoading.value = true;
  try {
    const response = await read("/api/managers/users", {
      page: currentPage.value - 1,
      size: pageSize.value,
      role: selectedUserType.value.value,
      memberStatus: getMemberStatus(),
      mercenaryStatus: getMercenaryStatus()
    });
    userList.value = response.data.data.list;
    totalCount.value = response.data.data.totalCount;
  } catch(e) {
    alert(e.message);
  } finally { isLoading.value = false; }
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
.pa-2 {
  padding: 8px;
}
.mb-3 {
  margin-bottom: 12px;
}
.elevation-1 {
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.table-container {
  overflow-x: auto;
  max-width: 100%;
  white-space: nowrap;
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

.search-section {
  margin-bottom: 8px;
  row-gap: 4px;
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

  .table-container {
    overflow-x: auto;
  }

  .v-data-table-server {
    font-size: 13px;
  }

  .v-card-title {
    font-size: 16px;
  }
}
table.v-table thead th {
  font-weight: 700px;
}
</style>

