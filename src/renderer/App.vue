<template>
<v-app style="width: 100vw; height: 100vh;">
  <router-view/>
    <!--NavigationDrawer v-model="state.drawer"/-->

    <!--v-container fluid>
      <v-content-->
      <!--/v-content>
    </v-container-->

  <ContextMenu/>

</v-app>
</template>





<script>
  import ContextMenu from './modules/ContextMenu/ContextMenu'

  import NavigationDrawer from './modules/ModernUI/NavigationDrawer'
  import Toolbar from './modules/ModernUI/Toolbar'

  import { bus } from './modules/ContextMenu/ContextBus'

  import "mdi/css/materialdesignicons.min.css"
  import { mapState } from 'vuex'


  export default {
    name: 'zenome-vue',
    components: { ContextMenu, NavigationDrawer, Toolbar },
    props: ['personId'],
    methods: {
      fire (event, payload) {
        bus.$emit(event, payload)
      }
    },
    data() {
      return {
        dialog: false,
        goto: '',
        state: {
          drawer: false,
          footer: false,
          el: 1,
          assignDataToUser: undefined
        }
      }
    },
    mounted () {
      document.ondragover = event => event.preventDefault()
      document.ondrop     = event => event.preventDefault()

      document.documentElement.addEventListener('click',
        (event) => { bus.$emit('click', '$event') }, false)
    }
  }
</script>

<style>
nav.toolbar {
  padding-left: 0px ! important;
}
</style>
