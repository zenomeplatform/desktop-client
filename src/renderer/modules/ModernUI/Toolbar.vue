<template>
<v-toolbar app fixed dense>

  <v-toolbar-side-icon @click.native="toogle"/>

  <!-- BACK -->
  <v-btn icon @click="$router.go(-1)">
    <v-icon>fa-arrow-circle-left</v-icon>
  </v-btn>

  <!-- HOME -->
  <v-btn icon @click="$router.push(`/person/${personId}/profile`)">
    <v-icon>home</v-icon>
  </v-btn>
  <v-spacer/>

  <slot/>


</v-toolbar>
</template>

<script>
export default {
  methods: {
    toogle () {
      this.$emit('toogle')
    }
  },
  data() {
    return {}
  },
  props: ['value', 'personId']
}
</script>
