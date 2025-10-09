<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card class="pa-6 rounded-xl">
      <v-card-title class="text-h5 font-weight-bold mb-2">투표 생성</v-card-title>
      <v-card-text>
        <v-form 
          ref="isValid"
          fast-fail
          lazy-validation
        >
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
            inset
            color="primary"
          />
          <v-menu v-model="menuEnd" :close-on-content-click="false" transition="scale-transition" offset-y>
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="voteEndDate"
                class="mb-3"
                label="투표 마감일"
                type="date"
                v-bind="attrs"
                v-on="on"
                outlined
                dense
              />
            </template>
            <v-date-picker 
              v-model="voteEndDate" 
              @input="menuEnd = false" 
            >
              <template #day="{ date }">
                <div
                  :class="{
                    'selected-start-date': date === props.startDate,
                    'default-day': true
                  }"
                >
                  {{ new Date(date).getDate() }}
                </div>
              </template>
            </v-date-picker>
          </v-menu>

          <v-text-field
            v-if="isMatchVote"
            v-model="matchDate"
            class="mb-3"
            label="매치일"
            type="date"
            outlined
            dense
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end mt-4">
        <v-btn color="grey lighten-1" @click="closeDialog">취소</v-btn>
        <v-btn color="primary" @click="createVote">생성</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, computed, onMounted } from "vue";
import { write } from "@/utils/util-axios.js";

const props = defineProps({
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["close"]);

const isValid = ref(null);
const dialog = ref(true);
const title = ref("");
const voteType = ref("매치 투표");
const isMatchVote = computed(() => voteType.value === "매치 투표");

const matchType = ref("FUTSAL");
const voteEndDate = ref(props.endDate);
const matchDate = ref(null);
const menuEnd = ref(false);
const allowDuplicate = ref(false);

const matchTypeRule = [
  v => !!v || "매치 타입을 선택해주세요."
];

const closeDialog = () => emit("close");

const createVote = async () => {
  const valid = await isValid.value.validate();
  try {
    if (valid) {
      if (isMatchVote.value) {
        await write("/api/managers/votes/matches", null, {
          title: title.value,
          matchType: matchType.value,
          matchAt: matchDate.value,
          endAt: voteEndDate.value,
          modeType: allowDuplicate.value ? "MULTIPLE" : "SINGLE"
        });
        alert("매치 투표가 정상적으로 생성되었습니다.");
        closeDialog();
      } else {
        await write("/api/managers/votes/general", null, {
          title: title.value,
          endAt: voteEndDate.value,
          modeType: allowDuplicate.value ? "MULTIPLE" : "SINGLE"
        });
        alert("일반 투표가 정상적으로 생성되었습니다.");
        closeDialog();
      }
    }
  } catch (e) {
    alert(e.message);
  }
};

const convertDateToString = (matchDate) => {
  let dateStr = JSON.stringify(matchDate);
  dateStr = dateStr.replaceAll("\"","");
  const [year, month, day] = dateStr.split("-");
  return `${year}년 ${month}월 ${day}일 `;
};

watch(() => voteType.value, () => {
  voteEndDate.value = null;
});

watch([voteEndDate, matchDate], () => {
  if (voteEndDate.value && matchDate.value && voteEndDate.value >= matchDate.value) {
    alert("투표 마감일은 매치일 이전이어야 합니다.");
    matchDate.value = null;
    return;
  }
  const today = new Date();
  const voteEndAt = new Date(voteEndDate.value);
  const matchAt = new Date(matchDate.value);
  if (voteEndDate.value && voteEndAt <= today) {
    alert("투표 마감일은 현재 날짜보다 이후여야 합니다.");
    voteEndDate.value = null;
    return;
  }
  if (matchDate.value && matchAt <= today) {
    alert("매치일은 현재 날짜보다 이후여야 합니다.");
    matchDate.value = null;
    return;
  }
});

watch([matchDate, voteType, matchType], () => {
  if (matchDate.value && isMatchVote.value) {
    const matchTypeName = matchType.value === "FUTSAL" ? "풋살" : "축구";
    title.value = convertDateToString(matchDate.value) + matchTypeName + " 경기 투표";
  } else title.value = "";
});

watch(voteType, (newType, oldType) => {
  if (oldType !== newType) {
    matchDate.value = null;
    voteEndDate.value = null;
  }
});

onMounted(() => {
  console.log("startAt :: ", props.startDate);
  console.log("endAt :: ", props.endDate);
});
</script>

<style scoped>
.v-card {
  border-radius: 16px;
  background-color: #ffffff;
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
