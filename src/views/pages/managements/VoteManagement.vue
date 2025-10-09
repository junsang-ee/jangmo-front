<template>
  <v-container fluid>
    <v-row justify="center" class="mb-4">
      <v-col cols="12" sm="10" md="8">
        <v-card class="pa-4 elevation-2 d-flex align-center justify-space-between title-card">
          <div class="d-flex align-center">
            <v-icon size="32" color="primary" class="mr-3">mdi-vote</v-icon>
            <v-card-title class="text-h5 font-weight-bold mb-0">투표 관리</v-card-title>
          </div>
          <v-btn
            color="primary"
            @click="toggleCreateMode"
            class="vote-create-btn"
            :variant="isCreatingVote ? 'tonal' : 'elevated'"
          >
            <v-icon start>mdi-plus</v-icon>
            {{ isCreatingVote ? "투표 생성 중..." : "투표 생성" }}
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card class="pa-4 elevation-1 calendar-card">
          <FullCalendar
            ref="calendarRef"
            :options="calendarOptions"
            class="full-calendar"
          />
        </v-card>
      </v-col>
    </v-row>
    <VoteCreatePop 
      v-if="isShowCreateVotePop"
      @close="closeVoteCreatePop"
      :startDate="voteStartAt"
      :endDate="voteEndAt"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import DayGridPlugin from "@fullcalendar/daygrid";
import TimeGridPlugin from "@fullcalendar/timegrid";
import InteractionPlugin from "@fullcalendar/interaction";
import VoteCreatePop from "./pop/VoteCreatePop.vue";

const today = new Date();
const selectYear = ref(null);
const selectMonth = ref(null);
const isShowCreateVotePop = ref(false);
const voteStartAt = ref(null);
const voteEndAt = ref(null);
const calendarRef = ref(null);
const isCreatingVote = ref(false);

const colorPalette = [
  "green", "red", "blue", "orange", 
  "purple", "teal", "indigo", "pink"
];

//dummy
const votes = [
  { title: "매칭투표", start: "2025-08-25", end: "2025-08-27" },
  { title: "매칭투표", start: "2025-08-21", end: "2025-08-26" },
  { title: "일반투표", start: "2025-08-28", end: "2025-08-29" },
  { title: "이벤트투표", start: "2025-08-10", end: "2025-08-11" },
  { title: "정기투표", start: "2025-08-14", end: "2025-08-15" },
  { title: "특별투표", start: "2025-08-17", end: "2025-08-19" },
  { title: "매칭투표", start: "2025-08-03", end: "2025-08-05" },
  { title: "일반투표", start: "2025-08-07", end: "2025-08-09" },
];

const voteEvents = ref(
  votes.map((vote, index) => ({
    ...vote,
    color: colorPalette[index % colorPalette.length]
  }))
);

const calendarOptions = ref({
  locale: "ko",
  plugins: [DayGridPlugin, TimeGridPlugin, InteractionPlugin],
  initialView: "dayGridMonth",
  selectable: true,
  selectMirror: true,
  events: voteEvents.value,
  headerToolbar: {
    left: "prev",
    center: "title",
    right: "next",
  },
  height: "auto",
  expandRows: true,

  dateClick: (info) => {
    if (!isCreatingVote.value) {
      const event = voteEvents.value.find(
        (e) => info.dateStr >= e.start && info.dateStr <= e.end
      );
      if (event) {
        alert(`투표 상세: ${event.title}\n기간: ${event.start} ~ ${event.end}`);
      }
    }
  },

  select: (selectionInfo) => {
    if (!isCreatingVote.value) return;

    const startDate = new Date(selectionInfo.start);
    if (formatDate(startDate) !== formatDate(today)) {
      alert("투표 시작일은 현재 날짜여야 합니다.");
      return;
    }
    const endDate = new Date(selectionInfo.end);
    endDate.setDate(endDate.getDate() - 1);
    
    if (confirm(`${formatDate(startDate)} ~ ${formatDate(endDate)}\n투표를 생성 하시겠습니까?`)) {
      voteStartAt.value = formatDate(startDate);
      voteEndAt.value = formatDate(endDate);
      isShowCreateVotePop.value = true;
    } else {
      const calendarApi = calendarRef.value.getApi();
      calendarApi.unselect();
      isCreatingVote.value = false;
    }
  },

  datesSet: () => {
    const calendarApi = calendarRef.value.getApi();
    const currentDate = calendarApi.view.currentStart;
    selectYear.value = currentDate.getFullYear();
    selectMonth.value = currentDate.getMonth() + 1;
  },
});

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toggleCreateMode = () => {
  if (!isCreatingVote.value) {
    alert("투표를 생성할 날짜를 선택해주세요.(투표 시작날부터 마감날까지 드래그하여 선택 가능)");
  }
  isCreatingVote.value = !isCreatingVote.value;
};

const closeVoteCreatePop = () => {
  isShowCreateVotePop.value = false;
  isCreatingVote.value = false;
}

onMounted(() => {
  selectYear.value = today.getFullYear();
  selectMonth.value = today.getMonth() + 1;
});
</script>

<style scoped>
.title-card {
  background-color: #f5f7fa;
  border-radius: 16px;
}

.calendar-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  width: 100%;
  overflow-x: auto;
}

.vote-create-btn {
  white-space: nowrap;
  min-width: 100px;
}

.full-calendar {
  width: 100% !important;
  height: auto !important;
  overflow-x: auto;
}

.fc {
  font-size: 14px;
  width: 100%;
}

.fc .fc-toolbar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.fc .fc-toolbar > div {
  display: flex;
  justify-content: center;
  align-items: center;
}

.fc .fc-button {
  background-color: #1976d2;
  border-color: #1976d2;
  color: white;
  font-size: 13px;
}

.fc .fc-button:hover {
  background-color: #1565c0;
}

.fc .fc-daygrid-day-frame {
  padding: 6px;
}

.fc .fc-daygrid-event {
  background-color: #4caf50;
  font-size: 13px;
  border: none;
  padding: 2px 4px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fc-daygrid-day-frame {
  cursor: pointer;
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

  .calendar-card {
    padding: 8px !important;
  }

  .fc {
    font-size: 12px;
  }

  .fc .fc-toolbar {
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }

  .fc .fc-daygrid-day-frame {
    padding: 4px;
  }

  .fc .fc-daygrid-event {
    font-size: 11px;
  }
}
</style>

<style>
.fc .fc-daygrid-day {
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.fc .fc-daygrid-day:hover {
  background-color: rgba(25, 118, 210, 0.1);
}

@media (max-width: 768px) {
  .fc .fc-daygrid-day {
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  .fc .fc-daygrid-day:hover {
    background-color: rgba(25, 118, 20, 0.1);
  }
}
</style>
