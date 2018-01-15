<template>
<AppTable :data="sortedFiles" v-bind.sync="config" :selected="selected" :unexpanded="unexpanded" class="data-table" @click='click' style="overflow-y:hidden;">
    <v-bottom-sheet v-model="assignDataToUser">
    <v-list>
      <v-subheader>Assign to:</v-subheader>
      <v-list-tile v-for="p in persons" :key="p._id"
        @click="assign(assignPersonId, p._id)" >
        <v-list-tile-title>{{ p.name }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-bottom-sheet>
</AppTable>
</template>

<script>
  import AppTable from '../AppTableAdvancedResizable'
  import tableLoadConfig from '../AppTableLoadConfig'
  import filesize from 'filesize'
  import { mapState } from 'vuex'
  import { bus, ContextMenu } from '@/modules/ContextMenu/ContextBus'

  import TheMenu from './DataMenu'




  const GeneticDataList = {
    components: { AppTable },
    /** */
    data ()  {
      return {
        selected: undefined,
        unexpanded: {},
        assignPersonId: undefined,
        assignDataToUser: undefined,
        sortby: 'name',
        config: tableLoadConfig([
          { id: '_id',      caption: 'Id',       width: 200 },
          { id: 'size',     caption: 'Size',     width: 100 },
          { id: 'provider', caption: 'Provider', width: 200 },
          { id: 'person',   caption: 'Person',   width: 200 },
          { id: 'build',    caption: 'Build',    width: 200 },
          { id: 'name',     caption: 'Name',     width: 200 },
          { id: 'type',     caption: 'Type',     width: 100 },
          { id: 'path',     caption: 'Path',     width: 200 },
        ], {
          size  : value =>  value ? filesize(value): value,
          person: id    =>  this.getPerson(id).name
        })
      }
    },
    mounted () {
      this.contextMenu = new ContextMenu(this).use(TheMenu)
    },
    methods: {
      assign(recordId, personId){
        return this.$addTask('task-db', 'update',
          { _id: recordId },
          { $set: { person:  personId } }).then(
            () => { this.assignDataToUser = false }
          )
      },
      getPerson (id) {
        for (let person of this.persons) {
          if (person._id === id)
            return person
        }
        return {}
      },
      click (payload) {
        let { action, rowId, active } = payload

        if (!rowId)
          return

        if (rowId !== 'header' && rowId !== 'free')
          this.selected = rowId

        if (!this.personsId.includes(rowId))
          return this.contextMenu.context(payload)

        if (action === 'context')
          return this.contextMenu.context(payload)


        this.$set(this.unexpanded, rowId, !this.unexpanded[rowId])


      }
    },
    computed: {
      ...mapState({
        persons : state => state.RemoteWatcher.results.persons || [],
        files   : state => state.RemoteWatcher.results.files   || []
      }),
      personsId () {
        return this.persons.map(person => person._id)
      },
      sortedFiles () {
        let temp = this.files.slice()
        let data = []

        for (let person of this.persons) {
          let personId = person._id

          let group = {
            id: personId,
            isGroup: true,
            caption: person.name,
            children: temp.filter(item => item.person === personId)
          }

          data.push(group)
          temp = temp.filter(item => item.person !== personId)
        }

        if (temp.length > 0)
          data.push({
            id: 'not-assigned',
            isGroup: true,
            caption: 'Not assigned',
            children: temp
          })


        return data
      }
    }
  }

  export default GeneticDataList






</script>
