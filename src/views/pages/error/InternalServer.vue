<template>
    <div class="centered-screen">
      <div class="error-container">
        <div class="error-text-container">
          <div class="error-title">서버에 문제가 발생했습니다.</div>
          <div class="error-description">
            <p>현재 서버에 오류가 발생했습니다.</p>
            <p>새로고침을 하거나 나중에 다시 시도해 주세요.</p>
          </div>
          <button class="button-filled-l-blue" @click="toHome">홈으로</button>
        </div>
        <div>
          <img src="@/assets/images/error-server.webp" alt="500" class="error-image"/>
        </div>
      </div>
    </div>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter();
const toHome = () => router.replace("Dashboard");
</script>

<style scope>

.centered-screen {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
}

.error-container {
    width: 1000px;
    height: 540px;
    display: flex;
    justify-content: center;
    gap: 64px;
}

.error-text-container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-self: center;
}

.error-title {
    font-size: 18px;
    line-height: 12px;
    color: #232323;
}

.error-description {
    font-size: 14px;
    line-height: 22px;
    color: #71788d;
}

.button-filled-l-blue {
    background-color: #4c90ef;
    border-radius: 4px;
    padding: 10px 20px;
    color: white;
    border: none;
    font-size: 16px;
    cursor: pointer;
    width: 260px;
    height: 48px;
    text-align: center;
}

.button-filled-l-blue:hover {
    background-color: #467ddb;
}

.button-filled-l-blue:active {
    background-color: #416cc9;
}

.button-filled-l-blue:focus {
    outline: 2px solid #5f9cf2;
}

.error-image {
    max-width: 100%;
    height: auto;
}


</style>