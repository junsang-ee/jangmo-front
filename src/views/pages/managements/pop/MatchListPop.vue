<template>
  <v-dialog v-model="internalDialog" max-width="500px" persistent>
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        {{ selectedDate }} 매치 정보
      </v-card-title>

      <v-card-text>
        <div v-if="matches.length">
          <v-list dense>
            <v-list-item v-for="(match, index) in matches" :key="index">
              <v-list-item-content>
                <v-list-item-title class="font-weight-medium">{{ match.title }}</v-list-item-title>
                <v-list-item-subtitle>일자: {{ match.date }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
        <div v-else class="no-match">
          <v-icon color="grey" class="mb-2">mdi-calendar-remove</v-icon>
          <p>선택한 날짜에 등록된 매치가 없습니다.</p>
        </div>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="onCreateMatch">매치 생성</v-btn>
        <v-btn text @click="closeDialog">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { watch, ref } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  selectedDate: String,
  matches: Array,
})

const emits = defineEmits(['update:modelValue', 'create'])

const internalDialog = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  internalDialog.value = val
})

watch(internalDialog, (val) => {
  emits('update:modelValue', val)
})

const closeDialog = () => {
  internalDialog.value = false
}

const onCreateMatch = () => {
  emits('create')
}
</script>

<style scoped>
.no-match {
  text-align: center;
  padding: 20px 0;
  color: #757575;
}
</style>
