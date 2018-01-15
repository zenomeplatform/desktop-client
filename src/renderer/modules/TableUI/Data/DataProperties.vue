<template>
<div id="content-wrapper-no-menu">
  <div>
    Name (id: {{id}}):
    <input v-model="result.name"/>
    <button @click="update">Save</button>
  </div>
  <div><pre style="white-space: pre-wrap;">
    {{JSON.stringify(result, null, 2)}}
  </pre></div>
</div>
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



var DataProperties = {
  extends: AppViewer,
  methods: {
    update () {
      return this.$addTask('task-db', 'update',
          { _id: this.$route.params.id },
          { $set: { name:  this.result.name  } })
    }
  }
}


export default DataProperties

</script>
