<template>
<v-container fluid>

  <div style="position: fixed; top: 0; bottom: 0; left: 0; right: 0;">

    <img src='static/back.png' style="width: 100%; background-clip: padding-box;"/>

    <div style="width: 43%; position: absolute; top: 0px; left: calc(100% / 12); background: black; height: 100vh;  opacity: 0.3;"/>

  </div>

  <br/>

  <v-layout>
    <v-flex xs12 sm5 offset-sm1>



      <FirstStartPageBlock
        heading="Genetic Data"
        text="Zenome Platform is designed to work with genetic data.
        So you have to provide some data to start with."
        :actions ="[ 'Supported Data Formats']"
      />

      <FirstStartPageBlock
        heading="Have no data?"
        text="You can always order sequencing in a certified lab.
        Also there are special offers available."
        :actions ="[ 'See options', 'Check out special offers']"
      />

      <v-card>
        <v-btn @click="$router.push('/greeter')" color='light-green accent-3'
                    block> Enter platform </v-btn>
      </v-card>
    </v-flex>
  </v-layout>

</v-container>
</template>

<script>


let FirstStartPageBlock = {
  props: ['heading', 'text', 'actions'],
  template: `
  <v-card class="mt-2 mb-2">
    <v-card-title primary-title>
      <h3 class="headline mb-0">{{heading}}</h3>
      {{text}}
    </v-card-title>
    <v-card-actions>
      <v-btn flat color="orange" disabled v-for="action in actions"
        :key="action">
        {{action}}
      </v-btn>

    </v-card-actions>
  </v-card>`
}



  export default {
    components: {FirstStartPageBlock},
    name: 'FirstStartPage'
  }
</script>
