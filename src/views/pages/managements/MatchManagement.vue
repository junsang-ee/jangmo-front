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
        <v-card class="pa-4 elevation-1 calendar-card">
          <FullCalendar 
            :options="calendarOptions" 
            class="full-calendar"
            :selectable="true"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import DayGridPlugin from '@fullcalendar/daygrid'
import TimeGridPlugin from '@fullcalendar/timegrid'
import InteractionPlugin from '@fullcalendar/interaction'
import ListPlugin from '@fullcalendar/list'

const selectedDate = ref(null)

const matchDates = ref([
  '2025-04-09',
  '2025-04-12',
  '2025-04-15',
  '2025-04-20'
]);

const calendarOptions = ref({
  locale: 'ko',
  plugins: [DayGridPlugin, TimeGridPlugin, InteractionPlugin],
  initialView: 'dayGridMonth',
  events: matchDates.value.map(date => ({
    title: '매치',
    date: date,
    color: 'green',
  })),
  eventClick: (info) => {
    alert("test");
  },
  dateClick: (info) => {
    selectedDate.value = info.dateStr
    alert(`선택된 날짜: ${info.dateStr}`)
  },
  eventMouseover: {
  },
  headerToolbar: {
    left: 'prev',
    center: 'title',
    right: 'next',
  },
  height: 'auto',
  contentHeight: 'auto',
  expandRows: true,
});



const test = (e) => {
  alert("test");
}
const onCreateMatchVote = () => {
  alert("투표 생성")
}
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

.match-create-btn,
.match-vote-create-btn {
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
