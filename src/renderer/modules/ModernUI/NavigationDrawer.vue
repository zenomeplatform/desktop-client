<template>
  <v-navigation-drawer app disable-resize-watcher disable-route-watcher
    :value="value" @update:value="$emit('update:value', $event)"
    clipped floating stateless hide-overlay>

    <slot/>

    <section v-for="submenu in menu">

      <v-subheader v-text="submenu.header"/>

      <v-btn flat block :to="'/person/'+ personId + '/' + item.to"
                    v-for="item in submenu.items" v-if="item.to" :key="item.to">
        <v-icon class="mr-1" v-text="'fa fa-fw ' + item.icon"/>
        {{item.label}}
        <v-spacer/>
      </v-btn>

      <v-btn flat block disabled v-for="item in submenu.items" v-if="!item.to" :key="item.to">
        <v-icon class="mr-1" v-text="'fa fa-fw ' + item.icon"/>
        {{item.label}}
        <v-spacer/>
      </v-btn>

    </section>


  </v-navigation-drawer>
</template>

<script>
  export default {
    props: ['value', 'menu', 'personId']
  }
</script>
