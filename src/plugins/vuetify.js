import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'
import * as directives from 'vuetify/directives'
import {ko, en} from "vuetify/locale";

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
  components: {
    ...components,
    ...labsComponents
  },
  locale: {
    locale: "ko",
    fallback: "en",
    messages: {ko, en}
  },
  directives
})


export default vuetify
