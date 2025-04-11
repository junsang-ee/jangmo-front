<template>
  <v-container fluid>
    <v-row justify="center" class="mb-4">
      <v-col cols="12" sm="10" md="8">
        <v-card class="pa-4 elevation-2 d-flex align-center justify-space-between title-card">
          <div class="d-flex align-center">
            <v-icon size="32" color="primary" class="mr-3">mdi-soccer</v-icon>
            <v-card-title class="text-h5 font-weight-bold mb-0">매치 관리</v-card-title>
          </div>
          <v-btn color="primary" @click="onCreateMatchVote" class="match-vote-create-btn">
            <v-icon start>mdi-plus</v-icon>
            투표 생성
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card class="pa-4 elevation-1 rounded-lg calendar-card">
          <v-date-picker
            v-model="selectedDate"
            :events="isMatchDay"
            :event-color="getEventColor()"
            color="primary"
            show-adjacent-months
            elevation="2"
            class="rounded-lg match-calendar compact-calendar"
          >
            <template #title>
              <div class="">
                test
              </div>
            </template>
          </v-date-picker>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const matchDates = ref([
  '2025-04-09',
  '2025-04-12',
  '2025-04-15',
  '2025-04-20'
])
const today = new Date();
const selectedDate = ref(today);

const isMatchDay = (date) => {
  const target = new Date(date).toISOString().split('T')[0]
  return matchDates.value.includes(target)
}

// 매치가 있는 날은 초록색 점 표시
const getEventColor = (date) => {
  return isMatchDay(date) ? 'green' : ''
}

const onCreateMatchVote = () => {
  alert("투표 생성");
}

</script>

<style scoped>
.title-card {
  background-color: #f5f7fa;
  border-radius: 16px;
}

.calendar-card {
  white-space: nowrap;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
}

.match-calendar {
  width: 100%;
  border-radius: 12px;
  max-width: 100%;
  overflow-x: auto;
}

.match-create-btn, .match-vote-create-btn {
  white-space: nowrap;
  min-width: 100px;
}

.compact-calendar {
  font-size: 13px;
  --v-date-picker-header-height: 36px;
  --v-date-picker-day-cell-height: 36px;
  --v-date-picker-day-cell-width: 36px;
}

@media (max-width: 768px) {
  .v-btn {
    font-size: 13px;
    min-width: 36px;
    height: 36px;
    padding: 0 8px;
  }

  .v-card-title {
    font-size: 16px;
  }

  .compact-calendar {
    font-size: 12px;
    --v-date-picker-header-height: 30px;
    --v-date-picker-day-cell-height: 32px;
    --v-date-picker-day-cell-width: 32px;
  }
}
</style>
