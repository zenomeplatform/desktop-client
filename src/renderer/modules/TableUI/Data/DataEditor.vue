<template>
<v-container>
  <textarea v-model="text" style="width: 100%; height: 80vh;"/>

  <v-card>
  <v-btn @click="save" :disabled="!allowed">Save</v-btn>
  {{hint}}
  </v-card>

</v-container>
</template>

<script>


const AppViewer = {
  watch: { '$route': 'refresh' },
  data () { return { result: {} } },
  created () {
    this.refresh()
  },
  computed: {
    id () {
      return this.$route.params.id
    }
  },
  methods: {
    refresh () {
      this.$addTask('task-db', 'findOne', {
        _id: this.$route.params.id
      }).then(record => {
        this.result = record.result
      })
    }
  }
}

var DatabaseEditor = {
  data () {
    return {
      text: '',
      hint: 'Save',
      object: {},
      allowed: false
    }
  },
  watch: {
    text (value) {
      try {
        let object = JSON.parse(this.text)
        this.object = object

        this.setHint(true,  'It\'s ok. You can save record now.')
      } catch (e) {
        this.setHint(false, e.toString())
      }
    }
  },
  extends: AppViewer,
  methods: {
    setHint (allowed, hint) {
      this.allowed = allowed
      this.hint = hint
    },
    refresh () {
      this.$addTask('task-db', 'findOne', {
        _id: this.$route.params.id
      }).then(record => {
        this.text = JSON.stringify(record.result, null, 4)
        this.$nextTick( () =>
          this.setHint(false, 'Just loaded. Nothing to save for now.')
        )
      })
    },
    save () {
      if (!this.allowed)
        throw new Error('Calling save function when serialization has failed.')

      this.setHint(false, 'Saving...')

      return this.$addTask('task-db', 'update', { _id: this.id }, this.object)
        .then(
          () => this.setHint(false, 'Done!')
        )
        .catch(
          (error) => this.setHint(false,  error.toString())
        )
    }
  }
}

export default DatabaseEditor


</script>
