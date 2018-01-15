<template>
<v-container>

  <v-layout row>
    <v-flex xs12>
      <v-card dark>
        <v-card-title>
          <div class="headline">{{provider.layout.name}}</div>
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>




  <v-layout row wrap>
    <v-flex xs12 sm4 class="mb-1 mt-1 pr-1">
      <v-card class="mb-1 mt-1">
        <v-card-media
          contain
          height="250px"
          :src="provider.layout.image"
        >
        </v-card-media>
      </v-card>
    </v-flex>

    <v-flex xs12 sm8 class="mb-1 mt-1">
      <v-card tile>
        <v-card-title>
        {{provider.layout.description}}
      </v-card-title>
      </v-card>
    </v-flex>


  </v-layout>

  <v-layout row>
    <v-flex xs12>
      <v-card dark>

      <h3 class="heading ml-2 mt-3 pt-1 pb-1">
          Products
      </h3>
    </v-card>

    </v-flex>
  </v-layout>

  <v-layout row wrap class="products">
    <v-flex xs12 sm6 lg4 v-for="item in provider.layout.services" :key="item.id">
      <v-card class="ml-1 mr-2 mt-1 mb-1">
        <v-card-title>
          <div class="headline">{{item.caption}}</div>

          <div>{{item.description}}</div>
        </v-card-title>

        <v-card-actions style="align-self: flex-end;">
          <v-btn @click="getReport(item)" v-if="item.ajax">Get it</v-btn>
          <v-btn v-else disabled>Disabled in MVP</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>

  </v-layout>

</v-container>


</template>

<script>
const {shell} = require('electron')
import { mapState } from 'vuex'

const ProvidersList = {
  props: ['personId', 'providerId'],
  data() {
    return {
      link: undefined
    }
  },
  methods: {
    getReport(item) {
      let rsids = item.rsids

      let files = this.files
        .filter(item => item.active)
        .filter(item => item.category === 'data')
        .filter(item => item.type === 'genetic')
        .filter(item => item.person === this.personId)

      console.log(files)

      if (files.length === 0) {
        alert('It seems that you have no genetic files.')
        return
      }

      let payload = {
        "task": [ "request-rsid", files[0]._id ], rsids,
        "url": item.ajax,
      }

      this.$store.dispatch('addTask', payload)
        .then(result => {
          if (!result.ajax)
            alert('Connection problem. Please check your internet connection.')
          shell.openExternal(result.ajax)
        })



    }
  },
  computed: {
    ...mapState({
        persons: S => S.RemoteWatcher.results.persons || [],
        providers: S => S.RemoteWatcher.results.providers || [],
        files: S => S.RemoteWatcher.results.files || []
      }),
       provider() {
        let temp = this.providers.filter(provider =>
          provider._id == this.providerId)
        return temp[0] || {
          layout: {}
        }
      }
  }
}

export default ProvidersList



</script>


<style>
.layout.row.products {
  margin-top: 10px;
  align-items: stretch;
  align-content: stretch;
}

.layout.row.products > div {
  align-self: stretch;
  height: inherit;
}
.layout.row.products > div > div {
  height: 95% !important;
  flex-direction: column;
  justify-content: space-between;
  display: flex;
}


</style>
