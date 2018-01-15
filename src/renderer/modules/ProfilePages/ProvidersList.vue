<template>
<div @click.passive      ="onclick($event, false)"
     @click.right.passive="onclick($event, true )">
  <v-card v-if="link">
    <v-card-content>
      Here is a link to your results. Please, open it in your browser:
      <pre style="white-space: pre-wrap; margin-left: 1cm;margin-right: 1cm;">
        {{link}}
      </pre>
    </v-card-content>

  </v-card>
  <provider-item :provider='k' :personId="personId" :key='k._id'
    v-for="k in providers"/>

</div>

</template>

<script>
import getAttribute from '../../mixins/getAttribute'
import { mapState } from 'vuex'

const ProviderItem = {
  functional: true,
  render (h, context) {

    let p = context.props.provider
    if (!p) return <h3>Error: incorrect provider.</h3>

    return (
      <v-card class='prov'>
      <v-card-title>{p.layout.name}</v-card-title>
      <v-card-text>{p.short}</v-card-text>
        <v-card tile>
          <v-btn action={'open::'+context.props.personId+'::'+p._id}>View</v-btn>
        </v-card>

      </v-card>
    )
  }
}



const ProvidersList = {
  components: { ProviderItem },
  props: ['personId'],
  data() {
    return {
      link: undefined
    }
  },
  methods: {
    onclick (event, right) {
      let action = getAttribute(event.target, 'action')

      if (!action) {
        throw new Error(event, right, action)
      }


      let [ _action, ...rest ] = action.split('::')

      if (_action === 'open') {
        this.$router.push(`/person/${rest[0]}/provider/${rest[1]}`)
      }
      else if (action) {
        this.$do(action)
      }
    }
  },
  computed: {
    ...mapState({
        persons: S => S.RemoteWatcher.results.persons || [],
        questionnaires: S => S.RemoteWatcher.results.questionnaires || [],
        providers: S => S.RemoteWatcher.results.providers || [],
        files: S => S.RemoteWatcher.results.files || []
      }),
      currentPerson() {
        let temp = this.persons.filter(person =>
          person._id == this.personId)
        return temp[0] || null
      }
  }
}

export default ProvidersList



</script>
