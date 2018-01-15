<template>
  <v-container fluid>


    <v-layout class="mt-5">
    <v-flex xs12 sm6 offset-sm3>

      <h2 class="display-2">
        Welcome to Zenome!
      </h2>
      <i>Select an already registered profile or create a new one.</i>

    </v-flex>
    </v-layout>



    <v-layout class="mt-5" v-if="persons.length">
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-list>
            <v-list-tile
              v-for="person in persons"
              :key="person._id"
              @click="selectPerson(person)">
                <v-list-tile-content>
                  <v-list-tile-title v-text="person.name"/>
                </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>



  <!--v-layout class="mt-1" v-if="persons.length">
    <v-flex xs12 sm6 offset-sm3>
      <v-checkbox v-model="autologin"
        label="Remember my choice (autologin)"/>
    </v-flex>
  </v-layout-->


  <v-layout class="mt-5">
    <v-flex xs12 sm6 offset-sm3>
      <v-btn block @click="$router.push('/register')" id="first-register-button">
          Register a new person
      </v-btn>
    </v-flex>
  </v-layout>



</v-container>

</template>

<script>
  export default {
    data () {
      return {
        autologin: false
      }
    },
    methods: {
      selectPerson (person) {
        this.$store.dispatch('setCurrentPerson', {
          personId:   person._id,
          setDefault: this.autologin
        })

        this.$router.push('/person/'+person._id+'/profile')

      }
    },
    computed: {
      persons () {
        return this.$store.state.RemoteWatcher.results.persons || []
      }
    }
  }
</script>
