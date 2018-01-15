<template>
  <v-container grid-list-xl full-height fluid pa-0>
  <v-layout row wrap>
  <v-flex xs6 md6 height-fill
    @mouseleave="hpIdSelected = undefined"
    style="height: calc(100vh - 53px); overflow: auto;"
  >


    <v-card tile>
      <v-container fluid grid-list-sm>
        <v-layout row v-for="id in superclasses" :key="id" class="mt-0 mb-0 ma-0">
          <v-flex xs1  class="pt-0 pb-0 ma-0">
            <v-btn icon small class="pt-0 pb-0 mt-0 mb-0 ma-0"
                @click="hpId = id">
              <v-icon class="pt-0 pb-0 mt-0 mb-0 ma-0">fa-arrow-up</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs11 class="pt-0 pb-0 ma-0">
            <v-btn flat small block
              @mouseenter="hpIdSelected = id"
            class="pt-0 pb-0 mt-0 mb-0 ma-0">
              {{getname(id)}}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>

    <v-card dark>
      <v-layout row class="mt-0 mb-0 ma-0" v-if="modifying">
        <v-flex xs12 class="pt-0 pb-0 ma-0">
          <v-btn flat small block class="pt-0 pb-0 mt-0 mb-0 ma-0"
              @click="cancelModifying">
            Cancel
          </v-btn>
        </v-flex>
      </v-layout>

      <v-layout row class="mt-0 mb-0 ma-0">
        <v-flex xs1  class="pt-0 pb-0 ma-0"/>
        <v-flex xs11 class="pt-0 pb-0 ma-0">
          <v-btn flat small class="pt-0 pb-0 mt-0 mb-0 ma-0" block>
            {{currentFeature.name}}
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card>


    <v-card tile>

      <v-container fluid grid-list-sm>
        <v-layout row v-for="id in folders"  :key="id" class="mt-0 mb-0 ma-0">
          <v-flex xs1  class="pt-0 pb-0 ma-0">
            <v-btn icon small class="pt-0 pb-0 mt-0 mb-0 ma-0" block
                @click="hpId = id">
              <v-icon class="pt-0 pb-0 mt-0 mb-0 ma-0">fa-folder</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs11 class="pt-0 pb-0 ma-0">
            <v-btn flat small
              @mouseenter="hpIdSelected = id"
              @click="hpId = id"
              class="pt-0 pb-0 mt-0 mb-0 ma-0">
              {{getname(id)}}<v-spacer/>
            </v-btn>
          </v-flex>
        </v-layout>

        <v-layout row v-for="id in subclasses"  :key="id" class="mt-0 mb-0 ma-0"
          @mouseenter="hpIdSelected = id"
        >
          <v-flex xs1  class="pt-0 pb-0 ma-0">
            <v-btn icon small class="pt-0 pb-0 mt-0 mb-0 ma-0" block
                @click="onClick($event, id)">
              <v-icon class="pt-0 pb-0 mt-0 mb-0 ma-0">fa-plus-square</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs11 class="pt-0 pb-0 ma-0">
            <v-btn flat small
              @click="hpId = id"
              class="pt-0 pb-0 mt-0 mb-0 ma-0">
              {{getname(id)}}<v-spacer/>
            </v-btn>
          </v-flex>
        </v-layout>

        <v-layout row v-for="id in subitems"  :key="id" class="mt-0 mb-0 ma-0"
          @mouseenter="hpIdSelected = id">
          <v-flex xs1  class="pt-0 pb-0 ma-0">
            <v-btn icon small class="pt-0 pb-0 mt-0 mb-0 ma-0" block
                @click="onClick($event, id)">
              <v-icon class="pt-0 pb-0 mt-0 mb-0 ma-0">fa-plus</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs11 class="pt-0 pb-0 ma-0">
            <v-btn flat small @click="onClick($event, id)" block
              class="pt-0 pb-0 mt-0 mb-0 ma-0">
              {{getname(id)}}<v-spacer/>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>

    </v-card>

  </v-flex>

  <v-flex xs6 md6
    @mouseenter="hpIdSelected = undefined"
  >

    <v-card dark class="pa-1" style="position: fixed; bottom: 2px; width: 60%; right: 2%; font-size: 12px;">
      <v-card-text class="pa-0" v-text="selectedFeature.def"/>
      <v-card-text class="pa-0" v-text="selectedFeature.comment"/>

      <v-card color="green" class="mt-1">
        <b v-if="selectedFeature.synonyms && selectedFeature.synonyms.length">Synonyms:</b>
        <div class="synonym" v-for="synonym in selectedFeature.synonyms">
          <span v-if="getSynonymType(synonym).layperson"><i>[Simple]</i></span>
          {{synonym[0]}}
        </div>
      </v-card>
    </v-card>



    <v-data-table
        :items="person.phenotype"
        :headers="headers"
        hide-actions
        class="elevation-0"
      >

      <template slot="items" slot-scope="props">
        <tr>
          <td>
            <v-btn block small flat class="ma-0 pa-0 pt-0 mt-0">
                {{props.item.id}}
            </v-btn>
            <v-menu offset-y>
              <v-btn block small flat class="ma-0 pa-0 pt-0 mt-0" slot="activator">
                  Menu
              </v-btn>
              <v-list>

                <v-list-tile @click="onDelete(props.item.id)">
                  <v-list-tile-title>Delete</v-list-tile-title>
                </v-list-tile>

                <v-divider/>

                <v-list-tile v-for="modifier in modifiers"  :key="modifier.id"
                 @click="startModifier(props.item.id, modifier.id)">
                  <v-list-tile-title>
                    Add modifier: {{modifier.name}}
                  </v-list-tile-title>
                </v-list-tile>

              </v-list>
            </v-menu>
          </td>
          <td>
            {{getname(props.item.id)}} ({{props.item.state}})
            <div v-for="mId in props.item.modifiers" v-if="props.item.modifiers">
              [+] {{getname(mId)}}
            </div>
          </td>
        </tr>
      </template>

    </v-data-table>

  </v-flex>
  </v-layout>



  </v-container>


</template>

<script>
  import { HPO, getPhenotypeById, getCategorySubclasses, MODIFIERS, START_ID, ROOT_ID, FOLDERS } from './OntologyParser'
  import { mapState } from 'vuex'

  // TODO https://phenotips.org/UserGuide/GettingStarted

  export default {
    methods: {
      // TODO Переделать согласно спецификации
      getSynonymType (synonym) {
        return {
          layperson : synonym.indexOf('layperson')  !== -1,
          exact     : synonym.indexOf('EXACT')      !== -1,
          related   : synonym.indexOf('RELATED')    !== -1
        }
      },
      cancelModifying() {
        this.modifying = false
        this.hpId = START_ID
      },
      onClick (event, id) {
        let phenotype

        if (this.person.phenotype)
          phenotype = this.person.phenotype.slice()
        else
          phenotype = []

        if (!this.modifying) {
          this.$addTask('task-db', 'update', { _id: this.personId }, {
            $set: {'phenotype': [...phenotype, { id, state:'Found' }]}
          })
          return
        }



        this.$addTask('task-db', 'update', { _id: this.personId }, {
          $set: {
            'phenotype': phenotype.map(
              item => {
                if (item.id !== this.modifying)
                  return item

                let mods = item.modifiers || []

                return { ...item, modifiers: [...mods, id] }
            })
          }
        })
        this.cancelModifying()


      },
      startModifier(pId, mId) {
        this.modifying = pId
        this.hpId = mId
      },
      onDelete(id) {
        this.$addTask('task-db', 'update', { _id: this.personId }, {
          $set: {'phenotype': this.person.phenotype.filter(t => t.id != id)}
        })
      },

      getname (id) {
        return getPhenotypeById(id).name
      },
    },
    computed: {
      /** Returns the feature with id from this.hpId */
      ...mapState({
          persons: S => S.RemoteWatcher.results.persons || [],
        }),
      person() {
        let temp = this.persons.filter(person => person._id == this.personId)
        return temp[0] || {}
      },
      modifiers () {
        return MODIFIERS.map(id => {
          return { id, name: getPhenotypeById(id).name }
        })
      },
      phenotype () {
        return this.person.phenotype || []
      },
      currentFeature  () { return getPhenotypeById(this.hpId) },
      selectedFeature () { return getPhenotypeById(this.hpIdSelected) },
      /** Returns the list of subclasses for currentFeature */
      folders() {
        return getCategorySubclasses(this.hpId)
          .filter(id => FOLDERS.includes(id))

      },
      superclasses() {
        return this.currentFeature.is_a.filter(id => id != ROOT_ID)
      },
      subclasses() {
        return getCategorySubclasses(this.hpId)
          .filter(id => !FOLDERS.includes(id))
          .filter(id => getCategorySubclasses(id).length > 0)
      },
      subitems() {
        return getCategorySubclasses(this.hpId)
          .filter(id => !FOLDERS.includes(id))
          .filter(id => getCategorySubclasses(id).length == 0)
      }
    },
    props: [ 'personId' ],
    watch: { '$route': 'update' },
    data () {
      return {
        hpId: START_ID,
        modifying: false,
        hpIdSelected: START_ID,
        headers: [
          {
            text: 'ID',
            align: 'left',
            sortable: true,
            value: 'id'
          },
          {
            text: 'Feature name and mod.',
            align: 'left',
            value: 'feature'
          }
        ]
      }
    }
  }

</script>
