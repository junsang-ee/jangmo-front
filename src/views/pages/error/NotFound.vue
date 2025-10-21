<template>
    <div class="centered-screen">
      <div class="error-container">
        <img src="@/assets/images/error-notfound.svg" alt="404" class="error-image"/>
        <div class="error-text-container">
          <div class="error-title">요청하신 페이지를 찾을 수 없습니다.</div>
          <div class="error-description">
            <p>페이지가 존재하지 않거나, 사용할 수 없는 페이지입니다.</p>
            <p>불편함을 드려서 죄송합니다.</p>
          </div>
          <button class="button-filled-l-blue" @click="toHome">홈으로</button>
        </div>
      </div>
    </div>
</template>

<script setup>
import {useRouter} from 'vue-router';

const router = useRouter();
const toHome = () => router.replace('Dashboard');
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
    position: relative;
    width: 1000px;
    height: 540px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.error-image {
    height: 392px;
}

.error-text-container {
    position: absolute;
    left: 10px;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
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


</style>
