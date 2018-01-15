<template>
  <v-container fluid>
  <v-layout>
  <v-flex xs12 sm6 offset-sm3>
    <v-card>
    <v-card-text>

      <h2 class="headline">
        Add a person.
      </h2>

      <v-text-field v-model="person.name"
          id="person-register-field-name"
        label="Shown name"/>

      <v-select v-model="person.gender" label="Gender"
                id="person-register-select-gender"
        :items="[ { value: 'N/S', text: 'Not specified' },
                  { value: 'M',   text: 'Male'          },
                  { value: 'F',   text: 'Female'        } ]"/>

      <v-text-field v-model="person.note"
        id="person-register-field-note"
        label="Note" multi-line/>

      <h6 v-if="hint">{{hint}}</h6>

      <v-btn :disabled="!!hint" block @click="add" id="person-register-button-register">
        Register
      </v-btn>

      <v-btn block color="red lighten-1" to="/first">
        Cancel
      </v-btn>

     </v-card-text>
     </v-card>
  </v-flex>
  </v-layout>
  </v-container>
</template>

<script>


  function getHint(person) {
    if (person.name.length < 3)
      return "Shown name should be at least 3 letters long."
    if (!person.gender)
      return "Please, select the gender or explicit 'not specified' option."
    return undefined
  }


  function getNewObject() { return { name: '', gender: '', note: '' } }



  export default {
    computed: {
      hint() {
        return getHint(this.person)
      }
    },
    methods: {
      cancel () {
        this.person = getNewObject()
        this.$router.push('/greeter')
      },
      add () {
        this.$addTask('task-db', 'insert', {
          ...this.person,
          category: 'persons',
          type    : 'person'
        }).then(() => {
          this.cancel()
        })
      }
    },
    data () {
      return {
        person: getNewObject()
      }
    }
  }
</script>
