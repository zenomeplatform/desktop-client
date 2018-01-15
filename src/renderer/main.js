if (process.env.NODE_ENV !== 'development') global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')

import Vue from 'vue'
import axios from 'axios'
import filesize from 'filesize'
import { ipcRenderer } from 'electron'

import App from './App'
import store, { IPCFrontendPlugin } from './modules/Store'
import router from './Router'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import "vue-material-design-icons/styles.css"
import '../renderer/assets/font-awesome-4.7.0/css/font-awesome.min.css'
import '../renderer/assets/roboto-and-material-icons-fonts/css/roboto.min.css'
import '../renderer/assets/roboto-and-material-icons-fonts/css/material-icons.min.css'

//import database from './RxDB'



Vue.use(IPCFrontendPlugin)
Vue.use(Vuetify)

Vue.filter('filesize', filesize)

const DB_WATCHERS_CONFIG = [
  [ 'files',           'data'   ],
  [ 'persons',         'persons'   ],
  [ 'providers',       'configuration',  'provider' ],
  [ 'questionnaires',  'configuration',  'questionnaire' ],
  [ 'user'     ,       'configuration',  'account'  ]
]

DB_WATCHERS_CONFIG.map(
  ([ id, category, type ]) => ipcRenderer.send('db', {
    id, action: 'watch', query: { category, type }
  })
)

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App></App>'
}).$mount('#app')
