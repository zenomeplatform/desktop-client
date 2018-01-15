<template>
<AppTable :data="persons" v-bind.sync="config" :selected="selected" class="data-table" @click='click' :style="{height: '200px'}"/>
</template>

<script>
  import AppTable from '../TableUI/AppTableAdvancedResizable'
  import tableLoadConfig from '../TableUI/AppTableLoadConfig'
  import { ContextMenu, createGroup, createConditionedGroup, createDivider,  createSimpleButton } from '../ContextMenu/ContextBus'


  export default {
    components: { AppTable },
    mounted () {
      this.contextMenu = new ContextMenu(this).use(createGroup([
        createConditionedGroup(
          ({payload}) => payload.rowId !== 'header',[
          createDivider(),
          createSimpleButton('[remove] Remove', ({payload}) => 'remove::'+payload.rowId ),
          //createSimpleButton('[database] DB Editor', ({payload}) => 'open::db/'+payload.rowId ),
          //createSimpleButton('[list] Propreties', ({payload}) => 'open::properies/'+payload.rowId ),
        ])
      ]))
    },
    methods: {
      click (payload) {
        let { action, rowId, active } = payload
        if (!rowId)
          return

        if (rowId !== 'header')
          this.selected = rowId

        this.contextMenu.context(payload)
      }
    },
    data ()  {
      return {
        selected: undefined,
        config: tableLoadConfig([
          {id: '_id',       caption: 'Id',                  width: 150},
          {id: 'name',      caption: 'Shown Name',          width: 300},
          {id: 'note',      caption: 'Note',                width: 300}
        ])
      }
    },
    computed: {
      persons () {
        return this.$store.state.RemoteWatcher.results.persons || []
      }
    }
  }
</script>


<style>
.output {
  white-space: pre-wrap;
  width: 90%;
  word-break: break-all;
}
</style>
