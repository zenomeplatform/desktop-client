<template>
<v-container fluid>
  <h2>{{title}}</h2>
  <br/>
  <div v-for="a in answers">
    <div><b>{{a.question}}</b></div>
    <div><i>> {{a.answer.join(', ')}}</i></div>
    <br/>
  </div>
</v-container>
</template>



<script>

/**
 *  Deeply flatten nested array
 *
 *  @method flatten
 *  @param  {Array} object [description]
 *  @return {Array} [description]
 */
export function flatten(object) {
  if (!Array.isArray(object))
    return [object]
  return object.reduce((prev, cur) => [
    ...prev,
    ...flatten(cur)
  ], [])
}




const ServiceView = {
  props: [ 'id' ],
  data () {
    return {
      title: undefined,
      schema: undefined,
      data: undefined
    }
  },
  computed: {
    answers() {
      let answers = []

      if (this.schema && this.data) flatten(this.schema).map(item => {
        let ids = item.type === 'radio'    ? [this.data[item.name]] :
                  item.type === 'checkbox' ?  this.data[item.name]  : undefined

        if (ids) answers.push({
          question: item.question,
          answer: item.items.filter(x => x&&ids.includes(x.id)).map(x => x.t)
        })
      })

      return answers
    }
  },
  methods: {
    refresh () {
      this.$addTask('task-db', 'findOne', { _id: this.id }).then(r => {

        this.data = r.result.data;

        this.$addTask('task-db', 'findOne', r.result.id).then(q => {
          this.schema = q.result.data
          this.title = q.result.title
        })

      })
    }
  },
  created () {
    this.refresh()
  }
}



export default ServiceView
</script>
