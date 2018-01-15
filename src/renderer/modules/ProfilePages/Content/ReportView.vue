<template>
<v-container fluid>
  <div v-if="data" style="margin-left: 1cm;margin-right: 1cm;">
    Here is a link to your results. Please, open it in your browser:
    <pre style="white-space: pre-wrap; font-size: 11px;">
      {{data.ajax}}
    </pre>
    <v-btn @click="openInBrowser(data.ajax)">Open in browser</v-btn>

  </div>
</v-container>
</template>



<script>
const {shell} = require('electron')

const ReportView = {
  props: [ 'id' ],
  watch: {
    'id': 'refresh'
  },
  data () {
    return {
      data: {}
    }
  },
  computed: {
    text () {
      this.data.ajax
    }
  },
  methods: {
    refresh () {
      this.$addTask('task-db', 'findOne', { _id: this.id })
      .then(r =>{
        this.data = r.result
      })
    },
    openInBrowser (link) {
      shell.openExternal(link)
    }
  },
  created () {
    this.refresh()
  }
}



export default ReportView
</script>
