<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card class="pa-4">
      <v-card-title class="headline font-weight-bold">매치 선택</v-card-title>
      <v-divider class="my-2" />
      <v-card-text>
        <v-list>
          <template v-if="matchList.length > 0">
            <v-list-item
              v-for="match in matchList"
              :key="match.id"
              class="match-item mb-2"
            >
              <v-list-item-content>
                <div class="text-subtitle-1 font-weight-medium">
                  {{ formatDate(match.date) }}
                </div>
                <div class="text-body-2 text-grey">{{ match.location }}</div>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn color="primary" @click="handleMatch(match.id)">
                  매칭하기
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </template>

          <template v-else>
            <v-list-item>
              <v-list-item-content class="text-center">
                <v-list-item-title class="text-grey mb-6">
                  매치가 없습니다.
                </v-list-item-title>
                <div class="d-flex justify-center">
                  <v-btn
                    color="primary"
                    class="create-match-btn"
                    @click="createMatch"
                    text="매치 생성하기"
                  />
                </div>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import { read, update } from "@/utils/util-axios.js";
import { convertDateOnlyDay } from "@/utils/util-dateConverter.js";

const props = defineProps({
  mercenaryId: String,
});
const emit = defineEmits(["close", "approved"]);

const dialog = ref(true);
const matchList = ref([]);

const close = () => {
  dialog.value = false;
  emit("close");
};

const formatDate = (dateStr) => {
  return convertDateOnlyDay(dateStr);
};

const handleMatch = async (matchId) => {
  const confirmed = confirm("해당 매치에 이 용병을 매칭시키겠습니까?");
  if (!confirmed) return;

  try {
    await update(`/api/managers/mercenaries/${props.mercenaryId}/approve`, {
      matchId: matchId,
    });
    alert("용병 매칭 및 가입 승인이 완료되었습니다.");
    dialog.value = false;
    emit("approved");
  } catch (e) {
    alert(e.message);
  }
};

onMounted(() => {

});
</script>

<style scoped>
.match-item {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 12px 16px;
}

.create-match-btn {
  min-width: 160px;
  border-radius: 8px;
  font-weight: bold;
}
</style>
