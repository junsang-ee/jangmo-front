import { createApp } from 'vue';
import '@/style.css'
import piniaState from 'pinia-plugin-persistedstate';
import {createPinia} from 'pinia';
import router from '@/router/router';
import App from '@/App.vue';
import { vueAxios } from '@/plugins/axios-plugin';
import vuetify from '@/plugins/vuetify';
import AlertPlugin from '@/plugins/custom-alert';
import ConfirmPlugin from '@/plugins/custom-confirm';


const pinia = createPinia();
pinia.use(piniaState);

createApp(App)
    .use(pinia)
    .use(router)
    .use(vueAxios)
    .use(vuetify)
    .use(AlertPlugin, {vuetify})
    .use(ConfirmPlugin, {vuetify})
    .mount('#app');