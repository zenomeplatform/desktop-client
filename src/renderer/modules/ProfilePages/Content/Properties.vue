<template>
<v-container fluid>
  <div style="padding:5px;">
      <v-text-field v-model="data.name" style="display: inline-block;" label="Name"/>
      <v-btn block @click="update">Rename</v-btn>
  </div>
<pre style="white-space: pre-wrap; font-size: 11px;">{{JSON.stringify(data, null, 2)}}</pre>
<div style="padding:5px;">
    <v-btn block @click="remove">Delete</v-btn>
</div>
</div>
</v-container>
</template>



<script>

const PropertiesFancy = {
  props: [ 'id' ],
  name: 'PropertiesFancy',

  watch: {
    'id': 'refresh'
  },
  data () {
    return {
      data: {}
    }
  },
  methods: {
    refresh () {
      this.$addTask('task-db', 'findOne', { _id: this.id })
      .then(r =>{
        this.data = r.result
      })
    },
    update () {
      return this.$addTask('task-db', 'update',
          { _id: this.id },
          { $set: { name:  this.data.name  } })
    },
    remove () {
      let personId = this.$route.params.personId
      return this.$addTask('task-db', 'remove', { _id: this.id })
        .then( () => this.$emit('getback') )
    }
  },
  created () {
    this.refresh()
  }
}



export default PropertiesFancy
</script>
