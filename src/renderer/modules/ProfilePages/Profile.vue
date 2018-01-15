<template>
<v-container grid-list-md>

  <v-layout row>
    <v-flex xs4 lg3>

      <SectionLabel label="Person"/>
      <v-card class="mb-1">
      <v-list>
        <ListContent :title="person.name" :subtitle="'Visible name'"/>
        <v-divider class="mt-1 mb-1" />
        <ListContent :title="person.note" :subtitle="'Note'"/>
      </v-list>
      </v-card>


      <SectionLabel label="Add record"/>
      <!-- Genetic File [Button]-->
      <v-btn block flat @click="selectFile">
        <v-icon>fa-fw fa-plus</v-icon> Genetic file <v-spacer/>
      </v-btn>

      <!-- Phenotype [Button]-->
      <v-btn block flat to="phenotype">
        <v-icon>fa-fw fa-user</v-icon> Phenotype <v-spacer/>
      </v-btn>

      <v-btn block flat
        id="proposedQuestionnairesButton"
        @click.native.prevent="proposedQuestionnairesMenu = true">
        <v-icon>fa-fw fa-file-text</v-icon> Questionnaire <v-spacer/>
          {{proposedQuestionnaires.length}}
      </v-btn>

      <v-btn block flat to="providers">
        <v-icon>fa-fw fa-user</v-icon> Get Report <v-spacer/>
      </v-btn>

      <!-- Questionnaire [Dropdown]-->
      <v-menu v-model="proposedQuestionnairesMenu"
          absolute :position-x="300" :position-y="300" right>
        <v-list>
          <ListContent v-for="item in proposedQuestionnaires"
            :key="item._id"
            :title="item.title"
            :subtitle="resolveProviderName(item.providerId)"
            @click="$router.push('quest/'+item._id)"
          />
        </v-list>
      </v-menu>

    </v-flex>

    <v-flex xs12 sm8 lg9>
      <SectionLabels
        :labels="mainArea"
        @click.native="mainArea.length > 1 ? mainArea.pop() : mainArea"
      />

      <component :personId="personId"
        :is="mainArea[mainArea.length-1].is"
        :id="mainArea[mainArea.length-1].id"
        @getback="mainArea.length > 1 ? mainArea.pop() : mainArea"
        @select="mainArea.push({ is: $event[0], id: $event[1], text: $event[2] })"
      />



    </v-flex>

  </v-layout>

<v-layout row justify-center>
  <v-dialog v-model="dialogSelect.visible" max-width="600" transition="dialog-bottom-transition" hide-overlay>
    <v-card>
      <v-card-title class="headline">
        Genetic file
      </v-card-title>

      <v-layout row>

        <v-flex xs6 lg6>
          <v-card-media contain
            :src="getProviderImage(dialogSelect.provider)" height="300px">
          </v-card-media>
        </v-flex>


        <v-flex xs5 lg5>
          <v-card-text v-if="dialogSelect.item">
            <b>Build used:</b> {{dialogSelect.item.build}}          <br/>
            <b>File size: </b> {{dialogSelect.item.size | filesize}}<br/>
            <b>Provider:  </b> {{dialogSelect.provider}}            <br/>
          </v-card-text>
        </v-flex>

      </v-layout>

      <v-card-actions>

        <v-spacer></v-spacer>

        <v-btn color="green darken-1" flat
          @click.native="dialogSelect.visible = false">Disagree
        </v-btn>

        <v-btn color="green darken-1" flat
          @click.native="dialogSelect.call">Agree
        </v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</v-layout>

</v-container>
</template>

<script>
import { mapState } from 'vuex'

import DataList from './Content/DataList'
import Personal from  './Content/Personal'
import ReportView from  './Content/ReportView'
import GeneticDataView from './Content/GeneticView'
import PropertiesFancy from './Content/Properties'


const DialogAnimated = {
  props: [ 'show' ],
  template: `
  <v-layout row justify-center>
    <v-dialog v-model="show" transition="dialog-bottom-transition" hide-overlay>
      <slot/>
    </v-dialog>
  </v-layout>`
}



const SectionLabels = {
  props: [ 'labels' ],
  template: `
    <div style="height: 30px; transform: translateY(-13px);">
      <span v-for="(label, i) in labels" v-if="label.text">
        <v-icon v-if="i > 0">fa fa-fw fa-caret-right</v-icon>
        <v-btn flat small>{{label.text}}</v-btn>
      </span>
      <v-divider class="mt-0 mb-1" />
    </div>
  `
}



const SectionLabel = {
  props: [ 'label', 'sublabel' ],
  template: `
    <div>
    <h3 style="opacity: 0.1;">{{label}}
      <span v-if="sublabel">
        --- {{sublabel}}
      </span>
    </h3>
    <v-divider class="mt-1 mb-1" />
    </div>
  `
}

const ListContent = {
  props: ['title', 'subtitle'],
  template: `
  <v-list-tile @click="$emit('click', $event)">
  <v-list-tile-content>
    <slot/>
    <v-list-tile-title v-if="title" v-text="title"/>
    <v-list-tile-sub-title v-if="subtitle" v-text="subtitle"/>
  </v-list-tile-content>
  </v-list-tile>
  `
}


function checkQuestionnairy(finished, item) {
  for (let record of finished) {
    if (record.questionnaireId === item.questionnaireId &&
      record.providerId === item.providerId) return item._id
  }
}



export default {
  components: { PropertiesFancy, DialogAnimated, SectionLabel, ListContent, DataList, Personal, ReportView, GeneticDataView, SectionLabels },
  data() {
    return {
      file: undefined,
      dialogSelect: { visible: false, item: undefined, info: undefined },
      mainArea: [{
        text: 'All Records',
        is: 'DataList',
        id: this.personId
      }],
      proposedQuestionnairesMenu: false
    }
  },
  methods: {
    back () {
      this.mainArea = { text: 'All Records', is: 'DataList', id: personId }
    },
    getProviderImage (provider) {
      if (provider) {
          // Images for: 'AncestryDNA', '23andMe', 'PLINK'
          return `static/providers/${provider}.jpg`
        }
        return 'static/placeholder.jpg'
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
    },
    async selectFile () {
      return this.$addTask('select-file').then(file => {
        file = { ...file, person: this.personId }

        console.log(file)
        if (!file.path)
          return

        this.dialogSelect = {
          visible: true,
          item: file,
          provider: file.provider,
          call: () => {
            this.$store.dispatch('addTask', {
              file,  task: "link-file"
            })
            this.dialogSelect.visible = false
          }
        }
      })
    }
  },
  props: [ 'personId' ],
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
    },
    proposedQuestionnaires() {
      let finished = this.fileIds
        .filter(item =>  item.category === 'data' && item.type === 'personal')
        .map(item => item.id)

      return this.questionnaires.filter(
        item => !checkQuestionnairy(finished, item)
      )
    }
  }
}
</script>


<style scoped lang="scss">
.person-block {
  position: sticky;
  top: 60px;
}
</style>
