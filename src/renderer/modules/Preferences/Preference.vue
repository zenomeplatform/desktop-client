<template>
<div>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-btn color="error" dark slot="activator">Delete account ({{person.name}}, ID: {{person._id}})</v-btn>
      <v-card>
        <v-card-title class="headline">Confirm deletion.</v-card-title>
        <v-card-text>Do you really want to delete this account? This cannot be undone.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="dialog = false">Cancel</v-btn>
          <v-btn color="red darken-1" flat @click.native="del">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
  <!--v-container grid-list-md>

    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <h2>ZNA token wallet configuration</h2>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <v-text-field name="address" label="Ethereum address"/>
      </v-flex>
    </v-layout>


    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <v-text-field name="name" label="Visible name"/>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <v-btn>Save</v-btn>
        <v-btn flat>Cancel</v-btn>
      </v-flex>
    </v-layout>

  </v-container>

  <v-divider/-->

  <!--v-container grid-list-md>

    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <h2>Export/Import database</h2>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <v-btn>Export to file</v-btn>
        <v-btn>Import from file</v-btn>
      </v-flex>
    </v-layout>

  </v-container-->

<v-container>
  <v-divider/>
  <h2>Debugging</h2>
  <DebugRunTask/>
</v-container>




</div>

  <!--v-layout row>
      <v-flex xs12 sm5 offset-sm1>




          <v-list two-line subheader>

            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>

                </v-list-tile-title>
                <v-list-tile-sub-title>
                  ZNA tokens are stored on this ethereum wallet.
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  Show your status
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  Your status is visible to everyone
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>

          </v-list>

          <v-divider/>




      </v-flex>
    </v-layout-->
</template>

<script>

  import Users from './PersonsList'
  import DebugRunTask from './DebugRunTask'

  const Preference = {
    name: 'Preference',
    components: {Users, DebugRunTask},
    props: ['personId'],
    data () {
      return {
        dialog: false,
        address: '',
        folder: '',
        defaultPerson: ''
      }
    },
    mounted () {
      this.$addTask('task-db', 'findOne', { _id: 'settings' })
      .then(res => {
        if (res && res.result && res.result.user) {
          this.address = res.result.user.address
          this.folder = res.result.user.folder
          this.defaultPerson = res.result.user.defaultPerson
        }
      })
    },
    methods: {
      del () {
        this.$addTask('task-db', 'remove', { _id: this.personId })
        this.$router.push('/home')
      },
      run (arg) {
        this.$addTask('task-db', 'update', { _id: 'settings' }, arg)
      }
    },
    computed: {
      persons () {
        return this.$store.state.RemoteWatcher.results.persons || []
      },
      person() {
        let temp = this.persons.filter(person =>
          person._id == this.personId)
        return temp[0] || null
      }
    }
  }

  export default Preference


</script>
