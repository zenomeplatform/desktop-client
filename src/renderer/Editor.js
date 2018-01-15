import Vue from 'vue'
import Editor from './components/Viewer/QuestEditor.vue'

/* eslint-disable no-new */
new Vue({
  components: { Editor },
  template: '<Editor></Editor>'
}).$mount('#app')
