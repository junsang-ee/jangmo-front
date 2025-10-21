import { createApp, h } from 'vue';
import ConfirmModal from '@/views/components/common/ConfirmModal.vue';

export default {
  install(app, options = {}) {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const confirmApp = createApp({
      render: () => h(ConfirmModal, { ref: 'confirm' }),
    });

    if (options.vuetify) {
      confirmApp.use(options.vuetify);
    }

    const vm = confirmApp.mount(container);

    app.config.globalProperties.$confirm = (msg, title) =>
      vm.$refs.confirm.open(msg, title);

    Object.defineProperty(globalThis, '$confirm', {
      get() {
        return vm.$refs.confirm.open;
      },
    });
  },
};
