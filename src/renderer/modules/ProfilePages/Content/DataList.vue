<template>

<v-data-table :items="fileIds" hide-headers hide-actions class="elevation-1">
  <template slot="items" slot-scope="props">

    <td @click="select(props.item)">
      <!-- BEGIN [ First Row, For Genetic Files ] -->
        <span v-if="props.item.type === 'genetic'">
          Genetic Testing by <b>{{  props.item.provider }}</b>
        </span>
      <!-- END -->

      <span v-if="props.item.type === 'report'">
        Results by Rosalind
      </span>

      <!-- BEGIN [ First Row, For Personal Files ] -->
        <span v-if="props.item.type === 'personal'">
            {{ resolveQuestionnaire(props.item.id).title }} by
          <b>{{ resolveProviderName(props.item.id.providerId) }}</b>
        </span>
      <!-- END -->

      <!-- BEGIN [ First Row ] -->
        <span v-if="props.item.name">
          <br/>{{props.item.name}}
        </span>
      <!-- END -->
    </td>


    <!-- BEGIN [ 2 Row ] -->
    <td @click="select(props.item)"> {{ getTime (props.item) }} </td>
    <!-- END -->

    <!-- BEGIN [ 3 Row ] -->
    <td>
      <v-btn icon small @click="open(props.item, 'info')">
        <v-icon color="blue darken-4">fa-info</v-icon>
      </v-btn>
    </td>
    <!-- END -->
  </template>
</v-data-table>

</template>



<script>
import { mapState } from 'vuex'



export default {
  props: [ 'personId', 'dialog' ],
  methods: {
    getTime (item) {
      if (item.time)
        return item.time

      if (item.time_added) {
        let date = new Date(item.time_added)
        return date.toLocaleDateString() +
         ' ' + date.toLocaleTimeString()
      }

      return 'Time Not Specified'
    },
    select (item) {
      let comp = item.type === 'genetic'  ? 'GeneticDataView'     :
                 item.type === 'report'   ? 'ReportView'          :
                 item.type === 'personal' ? 'Personal'            : undefined

      let name = item.type === 'genetic'  ? 'Genetic File'        :
                 item.type === 'report'   ? 'Report'              :
                 item.type === 'personal' ? 'Questionnaire Data'  : undefined

      this.$emit('select', [comp, item._id, name])
    },
    open (item, info) {
      this.$emit('select', ['PropertiesFancy', item._id, 'Info'])
      //this.$emit('update:dialog', { item, info, visible: true })
    },

    resolveQuestionnaire(id) {
      for (let q of this.questionnaires) {
        if (q.questionnaireId === id.questionnaireId &&
          q.providerId === id.providerId)
          return q
      }
      return {}
    },
    resolveProviderName(id) {
      for (let q of this.providers) {
        if (q.layout.id === id) return q.layout.name
      }
      return "---"
    }
  },
  computed: { ...mapState({
      persons: S => S.RemoteWatcher.results.persons || [],
      questionnaires: S => S.RemoteWatcher.results.questionnaires || [],
      providers: S => S.RemoteWatcher.results.providers || [],
      files: S => S.RemoteWatcher.results.files || []
    }),
    fileIds() {
      return this.files.filter(f => f.person == this.personId)
    },
    person() {
      let temp = this.persons.filter(person => person._id == this.personId)
      return temp[0] || {}
    }
  }
}
</script>
