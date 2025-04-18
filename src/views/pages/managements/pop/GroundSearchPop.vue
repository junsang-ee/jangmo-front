<template>
  <v-dialog v-model="internalDialog" max-width="700px" persistent>
    <v-card class="pa-4 rounded-xl">
      <v-card-title class="d-flex justify-space-between align-center">
        구장 검색
        <v-btn icon @click="closeDialog" class="close-btn">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- 검색 필드 -->
        <v-text-field
          v-model="keyword"
          label="장소 검색"
          variant="outlined"
          density="compact"
          color="primary"
          hide-details
          append-inner-icon="mdi-magnify"
          @click:append-inner="searchPlace"
          @keydown.enter="searchPlace"
          clearable
          class="search-input"
        />
        
        <!-- 지도 영역 -->
        <div id="map" class="map"></div>

        <!-- 상세 정보 영역 -->
        <v-divider v-if="selectedPlace"></v-divider>
        <div v-if="selectedPlace" class="details mt-4">
          <div class="place-info">
            <p><strong>구장명:</strong> {{ selectedPlace.place_name }}</p>
            <p><strong>주소:</strong> {{ selectedPlace.road_address_name || selectedPlace.address_name }}</p>
          </div>

          <v-btn @click="addGround" color="primary" block class="add-btn">구장 추가</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { read } from "@/utils/util-axios.js";

const props = defineProps({
  dialog: Boolean
})

const emit = defineEmits(['close', 'add-ground'])

const internalDialog = ref(props.dialog)
watch(() => props.dialog, (val) => {
  internalDialog.value = val
})

watch(internalDialog, (val) => {
  emit('update:dialog', val)  // 부모에게 상태를 업데이트함
})

const keyword = ref('')
const selectedPlace = ref(null)  // 선택된 장소의 상세정보를 저장하는 변수
const appKey = import.meta.env.VITE_KAKAO_APP_KEY
let map = null;
let markers = [];

const initMap = () => {
  const container = document.getElementById('map')
  if (!container) return

  const options = {
    center: new window.kakao.maps.LatLng(37.5665, 126.9780),
    level: 4
  }

  map = new window.kakao.maps.Map(container, options)
}

const loadKakaoMapScript = () => {
  if (document.getElementById('kakao-map-script')) return

  const script = document.createElement('script')
  script.id = 'kakao-map-script'
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${appKey}&libraries=services`
  script.onload = () => {
    window.kakao.maps.load(() => {
      nextTick(() => {
        initMap()
      })
    })
  }
  script.onerror = () => {
    console.error('❌ Failed to load Kakao Maps script')
  }
  document.head.appendChild(script)
}

const searchPlace = async() => {
  if (!keyword.value.trim()) return;

  try {

    const response = await read(`/api/managers/members/${keyword.value}`);
      
    })
    
    if (response.data && response.data.places) {
      clearMarkers()
      const bounds = new window.kakao.maps.LatLngBounds()

      response.data.places.forEach(place => {
        const position = new window.kakao.maps.LatLng(place.latitude, place.longitude)
        const marker = new window.kakao.maps.Marker({ map, position })
        markers.push(marker)
        bounds.extend(position)

        window.kakao.maps.event.addListener(marker, 'click', () => {
          selectedPlace.value = place;
        })
      })

      map.setBounds(bounds)
    }
  } catch (error) {
    console.error("❌ API 호출 실패:", error)
  }
}

const clearMarkers = () => {
  markers.forEach(marker => marker.setMap(null))
  markers = []
}

const closeDialog = () => {
  emit("close");
  clearMarkers();
  keyword.value = ""
  selectedPlace.value = null;
}

const addGround = () => {
  if (selectedPlace.value) {
    emit("add-ground", selectedPlace.value);
    closeDialog();
  }
}

watch(internalDialog, async (val) => {
  if (val) {
    await nextTick()
    if (!window.kakao || !window.kakao.maps) {
      loadKakaoMapScript()
    } else {
      window.kakao.maps.load(() => {
        nextTick(() => {
          initMap()
        })
      })
    }
  }
})
</script>

<style scoped>
.map {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  margin-top: 12px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .map {
    height: 300px;
    width: 100vw;
    margin-left: -16px;
    margin-right: -16px;
  }
}

.search-input .v-input__control {
  background-color: #f0f4f8;
  border-radius: 8px;
}

.search-input .v-input__control input {
  padding: 12px;
}

.details {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.details .place-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #333;
}

.details .place-info strong {
  font-weight: 600;
  color: #444;
}

.add-btn {
  border-radius: 24px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  text-transform: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.add-btn:hover {
  background-color: #1e88e5;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.close-btn {
  color: #888;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #333;
}

@media (max-width: 600px) {
  .details {
    padding: 12px;
  }
  .add-btn {
    font-size: 12px;
    padding: 8px 16px;
  }
}
</style>
