<template>
  <v-app>
    <Toolbar @toogle="state.drawer =! state.drawer" :personId="personId">
      <RightTopMenu :menu="RIGHT_MENU"/>
    </Toolbar>

    <NavigationDrawer :personId="personId" v-model="state.drawer" :menu="menu">
    </NavigationDrawer>

    <v-container fluid style="position: absolute; margin-top: 50px; padding: 0px; height: calc(100vh - 50px); overflow-y: scroll;">
        <router-view>
        </router-view>
    </v-container>
    <!--v-footer app>
    </v-footer-->
  </v-app>
</template>

<script>

  import { default as NavigationDrawer } from './NavigationDrawer'
  import { default as RightTopMenu } from './RightTopMenu'
  import { default as Toolbar } from './Toolbar'

  import { mapState } from 'vuex'

  const LEFT_MENU = [
    {
      header: 'Navigation',
      items: [
        { to: "profile",   icon: 'fa-user',     label: 'Profile'       },
        { to: "data",      icon: 'fa-file',     label: 'Data Manager'  },
        { to: "providers", icon: 'fa-exchange', label: 'Providers'     },
      //  { to: "gbrowser", icon: 'fa-eye', label: 'Genetic Browser' }
      ]
    }
  ]

  const BaseTemplate = {
    computed: {
      ...mapState({
          persons: S => S.RemoteWatcher.results.persons || []
        }),
        person() {
          let temp = this.persons.filter(person =>
            person._id == this.personId)
          return temp[0] || null
        },
    },
    components: {NavigationDrawer, RightTopMenu, Toolbar },
    data () {
      return {
        state: {
          drawer: false
        },
        menu: LEFT_MENU,
        RIGHT_MENU: [
          { to: `/person/${this.personId}/preference`, label: 'Preferences' },
          { to: `/home`, label: 'Exit' },
        ],
      }
    },
    props: [ 'personId' ]
  }

  export default BaseTemplate
</script>
