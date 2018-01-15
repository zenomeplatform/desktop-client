<template>
<div class='context-menu' :style='getStyle'>
  <div v-for='item in data'>
    <div class="divider" v-if="item[0] === '---'"/>
    <div @click='item[1]($event)' class="item" v-else>
      <i class="fa" :class="classArray(item)"></i>
      {{processLabel(item[0])}}
    </div>
  </div>
</div>
</template>

<script>
import {bus} from './ContextBus'


const ContextMenu = {
  data () {
    return { data: [], x: 0, y: 0, display: 'none' }
  },
  methods: {
    processLabel (label) {
      return label.split(']').pop()
    },
    classArray(item) {

      let result = /\[(.*)\]/.exec(item[0])
      if (!result)
        return []

      result = result[1]

      if ( result === 'v' )
        return ['fa-check']
      return ['fa-'+result]
    }
  },
  created () {
    bus.$on('context', ({data, event}) => {
      this.x = event.x;
      this.y = event.y;
      this.data = data;

      let yy = this.y - window.innerHeight

      this.$nextTick(
        function () {
          if (yy + this.$el.clientHeight > 0) {
            this.y = event.y-yy - this.$el.clientHeight
          }
        }
      )


      this.display = 'block';
    })
    bus.$on('click', () => {
      this.display = 'none'
    })
  },
  computed: {
    getStyle () {
      return {
        transform: `translate(${this.x}px,${this.y}px)`,
        display: this.display
      }
    }
  }
}

export default ContextMenu

</script>

<style scoped lang="scss">

.overlay {
  background: red;
  z-index: 1000;
}


.context-menu {
  -webkit-user-select:none;
  cursor: default;
  position: fixed;
  left: 0;
  top: 0;
  background-color: #f9f9f9;
  max-width: 360px;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1000;

  .divider {
    border: solid 1px #ddd;
  }


  .item {
    padding: 4px 4px 4px 7px;
    height: 24px;

    i {
      position: relative;
      left: 1px;
      width: 20px;
    }

    &:hover {
      background-color: #f1f1f1;
    }
  }

  .icon {

  }
}


</style>
