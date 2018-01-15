<template>
  <div>
    <div class="toolbox">
    </div>

    <!--div class="editor-area">
      <component
        :is="element.type"
        v-bind="element"
        v-for="element in rElements"/>
    </div-->


  </div>
</template>

<script>

  /**
   *  A position is determ by two numbers
   *
   *    row {integer}
   *
   *    col_start  {integer}
   *    col_end    {integer}
   *
   */


  function getStyleFromDescription (desc, context) {

    let { stepx, stepy } = context || {  stepx: 20, stepy: 80  }

    let col_start = desc.col_start || 1
    let col_end   = desc.col_end   || col_start + 8
    let row       = desc.row       || 1

    let left = (col_start - 1) * stepx + 10
    let width = ( col_end - col_start) * stepx - 20
    let top = (row - 1) * stepy + 10

    let style = {
      transform: `translateX(${left}px) translateY(${top}px)`,
      background: 'white',
      border: '1px solid gray',
      width: width + 'px',
      position: 'absolute'
    }

    console.log(style)

    return style
  }



  const labelbox = {
    props: ['text'],
    data () {
      return { value: '' }
    },
    template: `<v-text-field :label="text" v-model="value"/>`
  }



  export default {
    components: {labelbox},
    data () {
      return {
        elements: [{
          type: 'labelbox', text: 'hihi', col_start: 1
        }, {
          type: 'labelbox', text: 'hihi', col_start: 10
        }]
      }
    },
    computed: {
      rElements () {
        return this.elements.map( element => {
          let style = getStyleFromDescription (element)
          let temp = { ...element, style }
          console.log(temp)
          return temp
        })
      }
    },
    methods: {
      onMove(event) {
        let { x, y } = event
        console.log(event)
      }
    }
  }
</script>
