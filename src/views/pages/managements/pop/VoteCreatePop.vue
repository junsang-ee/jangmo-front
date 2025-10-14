<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card class="pa-6 rounded-xl">
      <v-card-title class="text-h5 font-weight-bold mb-2">투표 생성</v-card-title>
      <v-card-text>
        <v-form ref="isValid" fast-fail lazy-validation>
          <v-text-field 
            v-model="title"
            class="mb-3"
            label="제목" 
            outlined 
            dense
          />
          <v-select 
            v-model="voteType" 
            :items="['매치 투표', '일반 투표']"
            class="mb-3"
            label="투표 유형" 
            outlined 
            dense 
          />
          <v-radio-group
            v-if="isMatchVote"
            inline
            v-model="matchType" 
            :mandatory="true"
            :rules="matchTypeRule"
            row
            class="mb-3"
          >
            <v-radio label="풋살" value="FUTSAL" />
            <v-radio label="축구" value="FOOTBALL" />
          </v-radio-group>
          <v-switch
            v-model="allowDuplicate"
            class="mb-3"
            label="중복 투표 허용"
            color="primary"
            inset
          />
          <v-menu
            v-model="isSelectVoteEndAt"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
            :position-strategy="isMobile ? 'fixed' : 'connected'"
            location="bottom right"
          >
            <template #activator="{ props }">
              <v-text-field
                v-bind="props"
                v-model="formattedVoteEndDate"
                label="투표 마감일"
                placeholder="날짜를 선택하세요"
                class="mb-3 date-field"
                outlined
                density="comfortable"
                readonly
                hide-details="auto"
                persistent-placeholder
                clearable
                @click:clear="clearVoteEnd"
              />
            </template>
            <v-date-picker
              v-model="voteEndDate"
              @update:model-value="handleVoteEndSelect"
              class="custom-date-picker"
            />
          </v-menu>

          <v-menu
            v-if="isMatchVote"
            v-model="isSelectMatchAt"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
            :position-strategy="isMobile ? 'fixed' : 'connected'"
            location="bottom right"
          >
            <template #activator="{ props }">
              <v-text-field
                v-bind="props"
                v-model="formattedMatchDate"
                label="매치일"
                placeholder="날짜를 선택하세요"
                class="mb-3 date-field"
                outlined
                density="comfortable"
                readonly
                hide-details="auto"
                persistent-placeholder
                clearable
                @click:clear="clearMatchDate"
              />
            </template>
            <v-date-picker
              v-model="matchDate"
              @update:model-value="handleMatchSelect"
              class="custom-date-picker"
            />
          </v-menu>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end mt-4">
        <v-btn color="grey-lighten-1" @click="closeDialog">취소</v-btn>
        <v-btn color="primary" @click="createVote">생성</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, computed, onMounted } from "vue";
import { write } from "@/utils/util-axios.js";

const props = defineProps({
  initialVoteEndDate: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["close"]);

const dialog = ref(true);
const isValid = ref(null);
const title = ref("");
const voteType = ref("매치 투표");
const isMatchVote = computed(() => voteType.value === "매치 투표");
const matchType = ref("FUTSAL");
const allowDuplicate = ref(false);
const matchTypeRule = [v => !!v || "매치 타입을 선택해주세요."];

const voteEndDate = ref(null);
const matchDate = ref(null);
const isSelectVoteEndAt = ref(false);
const isSelectMatchAt = ref(false);

const isMobile = computed(() => {
  return typeof window !== 'undefined' && window.innerWidth < 600;
});

const formattedVoteEndDate = computed({
  get: () => (voteEndDate.value ? formatDate(voteEndDate.value) : ""),
  set: (val) => {
    if (val instanceof Date || (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}$/))) {
      voteEndDate.value = val;
    } else {
      voteEndDate.value = null;
    }
  }
});

const formattedMatchDate = computed({
  get: () => (matchDate.value ? formatDate(matchDate.value) : ""),
  set: (val) => {
    if (val instanceof Date || (typeof val === 'string' && val.match(/^\d{4}-\d{2}-\d{2}$/))) {
      matchDate.value = val;
    } else matchDate.value = null;
  
  }
});

const formatDate = (date) => {
  if (!date) return "";

  let d = date;
  if (!(date instanceof Date)) 
    d = new Date(date);

  if (isNaN(d.getTime())) return "";

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
};

const clearVoteEnd = () => {
  voteEndDate.value = null;
  isSelectVoteEndAt.value = false;
};

const clearMatchDate = () => {
  matchDate.value = null;
  isSelectMatchAt.value = false;
};

const handleVoteEndSelect = (val) => {
  voteEndDate.value = val;
  isSelectVoteEndAt.value = false;
};

const handleMatchSelect = (val) => {
  matchDate.value = val;
  isSelectMatchAt.value = false;
};

const closeDialog = () => emit("close");

const createVote = async () => {
  const { valid } = await isValid.value.validate();
  try {
    if (valid) {
      const formattedVoteEndAt = voteEndDate.value ? 
        new Date(voteEndDate.value).toISOString().split('T')[0] : null;

      const formattedMatchAt = matchDate.value ? 
        new Date(matchDate.value).toISOString().split('T')[0] : null;

      if (isMatchVote.value) {
        if (!matchType.value) {
          alert("매치 타입을 선택해주세요.");
          return;
        }
        if (!formattedMatchAt) {
          alert("매치일을 선택해주세요.");
          return;
        }
        await write("/api/managers/votes/matches", null, {
          title: title.value,
          matchType: matchType.value,
          matchAt: formattedMatchAt,
          endAt: formattedVoteEndAt,
          modeType: allowDuplicate.value ? "MULTIPLE" : "SINGLE"
        });
        alert("매치 투표가 정상적으로 생성되었습니다.");
      } else {
        await write("/api/managers/votes/general", null, {
          title: title.value,
          endAt: formattedVoteEndAt,
          modeType: allowDuplicate.value ? "MULTIPLE" : "SINGLE"
        });
        alert("일반 투표가 정상적으로 생성되었습니다.");
      }

      closeDialog();
    } else {
      alert("입력값을 확인해주세요.");
    }
  } catch (e) {
    console.error("투표 생성 오류:", e);
    alert(`투표 생성 중 오류가 발생했습니다: ${e.message || e}`);
  }
};

const toSimpleDateFormat = (date) => {
  if (!date) return "";
  let d = date;
  if (!(date instanceof Date)) {
    d = new Date(date);
  }
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}.${month}.${day} `;
};

watch([voteEndDate, matchDate], ([newVoteEndDate, newMatchDate]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (newVoteEndDate) {
    const voteEndAt = new Date(newVoteEndDate);
    voteEndAt.setHours(0, 0, 0, 0);
    if (voteEndAt < today) {
      alert("투표 마감일은 현재 날짜보다 이후여야 합니다.");
      voteEndDate.value = null;
      isSelectVoteEndAt.value = true;
      return;
    }
  }

  if (newMatchDate) {
    const matchAt = new Date(newMatchDate);
    matchAt.setHours(0, 0, 0, 0);
    if (matchAt < today) {
      alert("매치일은 현재 날짜보다 이후여야 합니다.");
      matchDate.value = null;
      isSelectMatchAt.value = true;
      return;
    }
  }

  if (isMatchVote.value && newVoteEndDate && newMatchDate) {
    const voteEndAt = new Date(newVoteEndDate);
    const matchAt = new Date(newMatchDate);
    if (voteEndAt >= matchAt) {
      alert("투표 마감일은 매치일 이전이어야 합니다.");
      voteEndDate.value = null;
      isSelectVoteEndAt.value = true;
      return;
    }
  }
});

watch(() => voteType.value, (newType) => {

  voteEndDate.value = null;
  matchDate.value = null;
  title.value = "";

  isSelectVoteEndAt.value = false;
  isSelectMatchAt.value = false;
});

watch([matchDate, voteType, matchType], () => {
  if (matchDate.value && isMatchVote.value) {
    const matchTypeName = matchType.value === "FUTSAL" ? "풋살" : "축구";
    title.value = `${toSimpleDateFormat(matchDate.value)} ${matchTypeName} 경기 투표`;
  } else if (!isMatchVote.value) {
    title.value = "";
  } else {
    title.value = "";
  }
}, { immediate: true });

onMounted(() => {
  if (props.initialVoteEndDate) {
    const initialDate = new Date(props.initialVoteEndDate);
    if (!isNaN(initialDate.getTime())) {
      voteEndDate.value = initialDate;
    } else {
      console.warn("endDate가 유효한 날짜 형식이 아닙니다:", props.initialVoteEndDate);
      voteEndDate.value = null;
    }
  }
});
</script>

<style scoped>
.v-card {
  border-radius: 16px;
  background-color: #ffffff;
}

.v-text-field {
  background-color: #fafafa;
}

.v-menu .v-overlay__content {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-radius: 18px;
  overflow: hidden;
}

.custom-date-picker.v-date-picker {
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #ffffff;
  border-radius: 18px;
  box-shadow: none;
  padding: 10px;
}

.custom-date-picker .v-date-picker-header {
  padding: 10px 16px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eeeeee;
  border-radius: 14px 14px 0 0;
  margin-bottom: 8px;
  font-weight: 500;
  color: #444;
}

.custom-date-picker .v-date-picker-header .v-btn {
  color: #666;
  background-color: transparent !important;
  box-shadow: none !important;
  transition: background-color 0.2s ease-in-out;
  border-radius: 8px;
}

.custom-date-picker .v-date-picker-header .v-btn:hover {
  background-color: #e0e0e0 !important;
}

.custom-date-picker .v-date-picker-month__weekday {
  color: #888;
  font-size: 0.85rem;
  font-weight: 500;
}

.custom-date-picker .v-date-picker-month__day {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  font-size: 0.95rem;
  font-weight: 400;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.custom-date-picker .v-date-picker-month__day--excluded {
  color: #cccccc !important;
}

.custom-date-picker .v-date-picker-month__day--today {
  color: #1976d2;
  font-weight: 600;
  border: 1px solid #bbdefb;
}

.custom-date-picker .v-date-picker-month__day:hover:not(.v-date-picker-month__day--selected) {
  background-color: #f0f0f0;
  border-radius: 50%;
}

.custom-date-picker .v-date-picker-month__day--selected {
  background-color: #618264 !important;
  color: #ffffff !important;
  font-weight: 600;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(97, 130, 100, 0.4);
  transform: scale(1.05);
}

.custom-date-picker .v-date-picker-controls__btn,
.custom-date-picker .v-date-picker-years__year {
  color: #444;
  font-weight: 500;
}
.custom-date-picker .v-date-picker-controls__btn--active,
.custom-date-picker .v-date-picker-years__year--active {
  color: #618264 !important;
  background-color: rgba(97, 130, 100, 0.1);
  border-radius: 8px;
}

.custom-date-picker .v-date-picker__title::before {
  content: "날짜 선택";
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #555;
}

.custom-date-picker .v-date-picker__title {
  color: transparent;
  position: relative;
}

.v-btn {
  border-radius: 8px;
}

.selected-start-date {
  background-color: #e3f2fd;
  border-radius: 50%;
  color: #1976d2;
  font-weight: bold;
}

.default-day {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>