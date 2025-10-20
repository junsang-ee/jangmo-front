import { createApp, h } from 'vue';
import AlertModal from '@/views/components/common/AlertModal.vue';

export default {
  install(app, options = {}) {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const alertApp = createApp({
      render: () => h(AlertModal, { ref: 'alert' }),
    });

    if (options.vuetify)
     alertApp.use(options.vuetify);

    const vm = alertApp.mount(container);

    app.config.globalProperties.$alert = (msg) => vm.$refs.alert.open(msg);

    Object.defineProperty(globalThis, '$alert', {
      get() {
        return vm.$refs.alert.open;
      },
    });
  },
};
