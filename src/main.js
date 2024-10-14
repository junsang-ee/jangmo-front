import { createApp } from 'vue';
import '@/style.css'
import piniaState from 'pinia-plugin-persistedstate';
import {createPinia} from 'pinia';
import router from '@/router/router';
import App from '@/App.vue';
import vuetify from '@/plugins/vuetify';

const pinia = createPinia();
pinia.use(piniaState);

createApp(App)
    .use(pinia)
    .use(router)
    .use(vuetify)
    .mount('#app');