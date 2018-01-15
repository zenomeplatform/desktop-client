<template>
<div class="table-wrapper"
    @update:visible = "d => $emit('update:visible', d)"
    @update:widths  = "d => $emit('update:widths', d)"
    @click.passive  = "click($event, 'select')"
    @click.right    = "click($event, 'context')">
  <div class="header" row='header'>
    <div v-for="key in visible" :key="key" class='cell'
      :style="{width: widths[key]+'px'}"
      :column='key'
      :class="{pressed: key === pressed}"
      @mousedown = "mousedownheader($event, key)">
      {{captions[key]}}
    </div>
  </div>
  <!-- -->
  <div class="data">
  <transition-group name="slide-list">
    <div v-for='record in expandedData' :key='record._id || record.id'>

      <div class="group" v-if="record.isGroup" :row="record.id">
        <div class="leading">
          <i class="fa fa-fw" :class="{
            'fa-chevron-right': unexpanded[record.id],
            'fa-chevron-down': !unexpanded[record.id] }"/> {{record.caption}}
        </div>
      </div>


      <div :row='record._id' :active='record.active'
        :class="{
          record  : true,
          selected: record._id == selected,
          active  : record.active == true
        }" v-else>
        <div v-for='key in visible' class='cell'
          :column='key' :key='key' :style="{width: widths[key]+'px'}">
            {{getValue(record, key)}}
        </div>
      </div>

    </div>
  </transition-group>
</div> <slot/>
</div>
</template>

<script>
import onDocument from '@/mixins/OnDocumentMixin'
import getAttribute from '@/mixins/getAttribute'



function swap (cols, i, j) {
  let temp = cols.slice()
  temp[i] = cols[j]
  temp[j] = cols[i]
  return temp.filter(item => item !== undefined)
}



function processClickEvent(event, action) {
  let target = event.target

  let active = getAttribute(target, 'active')
  let colId  = getAttribute(target, 'column')
  let rowId  = getAttribute(target, 'row')

  if (!colId && !rowId)
    rowId = "free"

  return { active, colId, rowId, event, action }
}



function flattenDataList (list, unexpanded) {
  let temp = []
  for (let item of list) {
    if (item.isGroup) {
      temp.push({ ...item, children: [] })
      if (!unexpanded[item.id])
        temp.push(...item.children)
    } else {
      temp.push(item)
    }
  }
  return temp
}



export default {
  name: 'table-advanced-resizable',
  mixins: [ onDocument ],
  props: [ 'captions', 'widths', 'visible', 'data', 'selected', 'hooks', 'unexpanded' ],
  data () {
    return {
      pressed: false
    }
  },
  computed: {
    centers () {
      let temp = 0
      let result = []
      for (let key of this.visible) {
        let width = this.widths[key]
        result.push(temp + width / 2)
        temp += width
      }
      return result
    },
    expandedData () {
      return flattenDataList (this.data, this.unexpanded)
    }
  },
  methods: {
    click (event, action) {
      this.$emit('click', processClickEvent(event, action))
    },
    getValue(record, key) {
      if (!this.hooks[key])
        return record[key]
      return this.hooks[key](record[key])
    },
    getOffsetOnEvent ({x, target}, key) {
      let i = this.visible.indexOf(key)
      let { left, width } = target.getBoundingClientRect()
      return {
        i,
        offset: left + width / 2 - this.centers[i],
        offsetMin: Math.min(x - left,  left + width - x)
      }
    },
    mousedownheader (_event, key) {
      let { i, offset, offsetMin } = this.getOffsetOnEvent(_event, key)
      let dispose

      if (offsetMin >= 10) {
        this.pressed = key
        dispose = this.movecolumn(i, offset)
      } else {
        dispose = this.resizecolumn(_event.x, offset)
      }

      this.onceDocument('mouseup', e => {
        dispose()
        this.pressed = undefined
      })
    },
    resizecolumn (x, offset) {
      let _centers =  this.centers.map(item => item + offset)

      let i = _centers.map((_x) => _x < x).reduce((a, b) => a + b) - 1
      let key = this.visible[i]
      let _widths = { ...this.widths }
      return this.onDocument('mousemove', ({ movementX }) => {
        _widths[key] += movementX
        this.$emit('update:widths', _widths)
      }, false)
    },
    movecolumn (i, offset) {
      let _vis = this.visible.slice()
      let _centers =  this.centers.map(item => item + offset)
      let j = i

      return this.onDocument('mousemove', (event) => {
        let p = _centers
          .map((x, _i) => x < event.x && j !== _i)
          .reduce((a, b) => a + b)
        if (j !== p) {
          this.$emit('update:visible', swap(_vis, i, p))
          j = p
        }
      }, false)
    }
  }
}
</script>

<style lang="scss" scoped>
.slide-list-item {
  transition: all 0.1s;
  display: inline-block;
  margin-right: 10px;
}
.slide-list-enter, .slide-list-leave-to {
  transform: translateY(10px);
  z-index       : -100;
  opacity: 0.7;
}
.slide-list-leave-active {
  position: absolute;
}
.slide-list-move {
  transition: transform 0.3s;
}
.slide-list-leave-active.slide-list-move  {
  transition: transform 0.1s;
}


.record {
  width         : 100%;
  right: 0px;
}

.header, .data, .record, .cell {
  white-space   : nowrap;
  user-select   : none;
  cursor        : default;
}

.cell  {
  width         : 100%;
}



.table-wrapper {
  overflow: scroll;
  bottom: 0px;


  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    margin: 1px;
    background: white;
  }

  &::-webkit-scrollbar-thumb {
    padding: 2px;
    border-radius: 0px;
    background: gray;
  }


  .data {
    font-family: "Lucida Console", Monaco, monospace;
    font-weight: 300;
    overflow: visible;
  }

  .header {
    position      : sticky;
    background    : white;
    color         : black;
    padding       : 0px;
    height        : 18px;
    top           : 0px;
    overflow      : visible;
    z-index       : 0;
    border-bottom : solid 1px gray;


    .cell {
      height: 18px;

      background: rgba(0,0,0,0.1);
      border-right: solid 1px gray;
      font-weight: bold;
      text-transform: lowercase;
      font-variant: small-caps;
      font-size: 14px;
      padding: 0px 5px 0px 5px;
    }
    .pressed.cell {
      background: rgba(0,0,0,0.2);
    }
  }



  .group {
    .leading {
      padding-left: 5px;
      background: rgba(200,0,0,0.1);
      i {
        font-size: 10px;
      }
    }

    background: rgba(0,200,0,0.1);
  }


  .record {
    z-index: 0;

    height: 20px;
    font-size: 14px;
    color: gray;

    &:hover          { background: rgba(0,0,0,0.02);   }
    &.selected       { background: rgba(0,0,0,0.07);   }
    &.selected:hover { background: rgba(0,0,0,0.1);    }

    &.active {
      color: black;
    }
  }

  .cell {
    height        : 22px;
    text-overflow : ellipsis;
    border-right  : solid 1px rgba(0,0,0,0.1);
    padding       : 1px 5px 1px 5px;
    display       : inline-block;
    overflow      : hidden;
  }
}





</style>
