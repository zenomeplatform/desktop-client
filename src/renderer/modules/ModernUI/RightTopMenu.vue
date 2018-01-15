<template>
  <v-menu offset-y>
    <v-btn icon slot="activator">
      <v-icon>more_vert</v-icon>
    </v-btn>

    <v-list v-for="item in menu" :key="item.to">
      <v-list-tile :to="item.to">
        <v-list-tile-title
          v-text="item.label"/>
      </v-list-tile>
    </v-list>

  </v-menu>
</template>

<script>
  export default {
    props: ['menu']
  }
</script>
