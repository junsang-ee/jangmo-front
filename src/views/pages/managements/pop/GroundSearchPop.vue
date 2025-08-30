<template>
  <v-dialog v-model="isShowSearchPop" max-width="700px" persistent>
    <v-card class="pa-4 rounded-xl">
      <v-card-title class="d-flex justify-space-between align-center">
        구장 검색
        <v-btn icon @click="closeSearchPop" class="close-btn">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
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

        <div id="map" class="map"></div>

        <v-divider v-if="selectedPlace"></v-divider>
        <div v-if="selectedPlace" class="details mt-4">
          <div class="place-info">
            <p><strong>구장명: </strong> {{ selectedPlace.placeName || "구장명 없음" }}</p>
            <p><strong>주소: </strong> {{ selectedPlace.roadAddressName || selectedPlace.addressName }}</p>
          </div>

          <v-btn @click="openCreatePop" color="primary" class="add-btn">구장 추가</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
  <GroundCreatePop
    v-if="isShowCreatePop"
    :selectedPlace="selectedPlace"
    @add-ground="addGround"
    @close="closeCreatePop"
  />
</template>
<script setup>
import { ref, watch, nextTick, onMounted } from "vue";
import { read } from "@/utils/util-axios.js";
import GroundCreatePop from "@/views/pages/managements/pop/GroundCreatePop.vue"

const props = defineProps({ dialog: Boolean });
const emit = defineEmits(["close", "addGround"]);

const isShowSearchPop = ref(true);
const isShowCreatePop = ref(false);
const keyword = ref("");
const selectedPlace = ref(null);

let map = null;
const markers = ref([]);
const selectedMarker = ref(null);
const selectedCircle = ref(null);

const appKey = import.meta.env.VITE_KAKAO_APP_KEY;

const initMap = () => {
  const container = document.getElementById("map");
  if (!container) return;

  const options = {
    center: new window.kakao.maps.LatLng(37.5665, 126.9780),
    level: 4
  }

  map = new window.kakao.maps.Map(container, options);
}

const loadKakaoMapScript = () => {
  if (document.getElementById('kakao-map-script')) return;

  const script = document.createElement('script')
  script.id = "kakao-map-script";
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${appKey}&libraries=services`;
  script.onload = () => {
    window.kakao.maps.load(() => {
      nextTick(() => {
        initMap();
      })
    })
  }
  document.head.appendChild(script);
}

const searchPlace = async () => {
  if (!keyword.value.trim()) return;

  try {
    const response = await read(`/api/managers/ground/${keyword.value}`)
    const places = response;
    if (places && places.length > 0) {
      clearMarkers()
      const bounds = new window.kakao.maps.LatLngBounds()

      places.forEach((place, index) => {
        const position = new window.kakao.maps.LatLng(place.latitude, place.longitude)

        const marker = new window.kakao.maps.Marker({
          map,
          position,
          zIndex: 1
        });

        marker.__id = index;
        marker.__place = place;

        window.kakao.maps.event.addListener(marker, 'click', () => {
          selectedPlace.value = place;

          markers.value.forEach(m => {
            m.setZIndex(1)
            m.setOpacity(0.5)
          });
          marker.setZIndex(10);
          marker.setOpacity(1);
          selectedMarker.value = marker;

          if (selectedCircle.value)
            selectedCircle.value.setMap(null);

          selectedCircle.value = new window.kakao.maps.Circle({
            map,
            center: position,
            radius: 60,
            strokeWeight: 2,
            strokeColor: '#1E88E5',
            strokeOpacity: 0.9,
            fillColor: '#90CAF9',
            fillOpacity: 0.4
          })
        });

        markers.value.push(marker);
        bounds.extend(position);
      })

      map.setBounds(bounds);
    }
  } catch (e) {
    console.error(e);
  }
};

const clearMarkers = () => {
  markers.value.forEach(m => m.setMap(null));
  markers.value = [];
  selectedMarker.value = null;

  if (selectedCircle.value) {
    selectedCircle.value.setMap(null);
    selectedCircle.value = null;
  }
};
const closeCreatePop = () => {
  isShowCreatePop.value = false;
}

const closeSearchPop = () => {
  isShowSearchPop.value = false;
  emit("close");
  clearMarkers();
  keyword.value = "";
  selectedPlace.value = null;
};

const addGround = (groundInfo) => {
  if (groundInfo)
    emit("add-ground", groundInfo);
};

const openCreatePop = () => {
  isShowCreatePop.value = true;
}

const loadKakao = async() => {
  await nextTick();
  if (!window.kakao || !window.kakao.maps) {
      loadKakaoMapScript();
  } else {
    window.kakao.maps.load(() => {
      nextTick(() => initMap());
    });
  }
}

watch(isShowSearchPop, async (val) => {
  if (val) loadKakao();
});

onMounted(loadKakao);

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

@media (max-width: 768px) {
  .details {
    padding: 12px;
  }

  .add-btn {
    font-size: 12px;
    padding: 8px 16px;
  }
}
</style>
