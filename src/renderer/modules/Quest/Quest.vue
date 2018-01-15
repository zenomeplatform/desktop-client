<template>
<div class="question-board">
    <QuestionnaireElement :data="data" :schema="schema" :path="[]" @update:data="data=$event" />
    <div class="complete-panel">

      <div v-if="next.length">
        To complete test, please answer all questions ({{next.length}} remain(s))
      </div>

      <div v-else>
        <button style="width: 100%" @click="addResult">
          Complete Test
        </button>
      </div>

    </div>
    <div class="question" v-if="!next.length">
      The data will be saved to your local database and can be accessed from the data page.
    </div>
  <!--div class="add-questions">
    {{next}}
    <pre><br>{{JSON.stringify(data, null, 2)}} </pre>
  </div-->
</div>
</template>

<script>
import objectPath from 'object-path'
import { patchCreateElement } from '../../mixins/patchCreateElement'
import { flatten } from '../../mixins/flatten'
import { mapState } from 'vuex'


function isChecked(name, id, type, data) {
  let qdata = data[name]
  if (!qdata) return false
  switch (type) {
    case 'radio'   : return (qdata === id)
    case 'checkbox': return qdata && qdata.indexOf(id) !== -1
  }
}


const AnswerControlSimple = {
  functional: true,
  render(createElement, { parent, props }) {
    let { name, type  } = props

    return (
      <div class="items">
        {props.items.map( item =>
          <label>
            <input type={type} name={name} domPropsChecked={
                isChecked(name, item.id, type, props.data)
            } onChange={event => parent.$emit('modify', {
                id: item.id, type, name, checked: event.target.checked
            })}/>
            <span class="mark"/>
            {item.t}
          </label>
        )}
      </div>
    )
  }
}


const HeaderBlock = {
  functional: true,
  render(h, { props }) {
    return (
      <div class="header">
        <h3 class="title">{props.title}</h3>
        <p class="description">{props.description}</p>
      </div>
    )
  }
}


const QuestionText = {
  functional: true,
  render (h, {props}) {
    return (
      <p class="text">
        {props.question}
      </p>
    )
  }
}

function onModifyCheckbox(id, checked, data) {
  data = data ? data.slice() : []
  if (!checked)
    return data.filter(r => r !== id)
  /* here checked === true */
  if (id === 'none')
    return ['none']
  /* here checked and not none */
  if (data.indexOf(id) === -1)
    data.push(id)
  return data.filter(r => r !== 'none')

}


const QuestionnaireElement = {
  name: 'QuestionnaireElement',
  components: {
    AnswerControlSimple,
    HeaderBlock,
    QuestionText
  },
  props: ['schema', 'data', 'name', 'path'],
  mounted() {
    this.$on('modify', item => {
      let data
      let { type, id, name, checked } = item

      switch (type) {
        case 'checkbox':
          data = onModifyCheckbox(id, checked, this.data[name]); break;
        case 'radio':
          data = id; break;
        default: return
      }
      this.$emit('update:data', { ...this.data,
        [name]: data
      })
    })
  },
  computed: {
    type() {
      if (this.path.length > 10) return 'off'
      return Array.isArray(this.current) ? 'section' : this.current.type
    },
    current() {
      return objectPath.get(this.schema, this.path)
    }
  },
  methods: {
    pp(next) {
      return [...this.path, next]
    },
  },
  template: `
    <section v-if="type === 'section'">
      <QuestionnaireElement :key="i" :schema="schema" :data="data"
        @update:data="$emit('update:data', $event)"
        v-for="item, i in current" :path="pp(i)"/>
    </section>
    <HeaderBlock v-bind="current" v-else-if="type === 'header'"/>
    <div class="question" v-else>
      <QuestionText v-bind="current"/>
      <AnswerControlSimple v-bind="current" :data="data"/>
    </div>
  `
}



const QuestionnaireViewer = {

  props: ['personId','questionnaireId'],

  components: {
    QuestionnaireElement
  },
  data() {
    return {
      schema: [],
      ids: [],
      data: {},
      id: undefined
    }
  },
  mounted() {
    this.refresh()
  },
  watch: {
    questionnaireId() {
      this.refresh()
    }
  },
  methods: {
    addResult() {
      return this.$addTask(
        'task-db', 'insert',
          { category: "data",
            type: "personal",
            person: this.personId,
            id: this.id,
            data: this.data }
      ).then(data => {
        this.data = {}
        this.$router.go(-1)
      })
    },
    refresh() {
      if (!this.questionnaireId) return
      return this
        .$addTask( 'task-db', 'findOne', {_id: this.questionnaireId })
        .then(R => {
        let data = R.result
        this.id = {
          providerId     : data.providerId,
          questionnaireId: data.questionnaireId
        }
        this.schema = data.data
        this.ids = flatten(this.schema).map(x => x.name)
      })
    }
  },
  computed: {
    ...mapState({
      persons: S => S.RemoteWatcher.results.persons || [],
      currentPersonId: S => S.currentPerson
    }),
    next() {
      if (!this.ids) return ['loading']
      return this.ids.filter(x => x && this.data &&  this.data[x] === undefined)
    }
  },
}

export default QuestionnaireViewer
</script>

<style>



</style>

<style scoped lang="scss">

.question-board >>> div.complete-panel {
    position: sticky;
    -webkit-user-select:none;

    padding: 4px 7px;
    z-index: 2;
    bottom: 0;
    background: white;
    opacity: 0.7;
    cursor: default;
    &:hover {
        opacity: 1;
    }
    transition-property: all;
    transition-duration: 0.1s;
    transition-timing-function: ease-in;
}

.question-board >>> div.complete-panel,
.question-board >>> div.header,
.question-board >>> div.question {
    box-shadow: 0 1px 2px rgba(0,0,0,.1);
    border: 1px solid #CCC;
    -webkit-user-select:none;
    background: white;
    margin-bottom: 4px;
    margin-left: 15px;
}

.question-board >>> div.header {
    margin-top: 20px;
    position: sticky;
    background: white;
    z-index: 1;
    top: 0px;
    -webkit-user-select:none;

    .description,
    h3.title {
        margin: 0;
        padding: 5px 10px;
    }
    h3.title {
        background: rgba(0,0,0,0.03);
        border-bottom: 1px solid rgba(0,0,0,0.1);
    }
}

.question-board >>> div.question {
    padding: 5px 10px;
    top: 0;
    -webkit-user-select:none;

    p.text {
        padding: 0;
        margin-bottom: 0;
        border-bottom: 1px solid rgba(0,0,0,0.1);
        font-weight: 600;
    }

    .items {
        padding: 3px 5px;
    }


}

.question-board >>> label {
  -webkit-user-select:none;
    position: relative;
    display: block;
    margin-top: 5px;
    padding-left: 25px;
    cursor: pointer;

    input {
        position: absolute;
        opacity: 0;
    }

    input ~ span.mark,
    input ~ span.mark::after {
        position: absolute;
        display: block;
        vertical-align: baseline;
        visibility: visible;
    }

    input ~ span.mark {
        top: 0;
        left: 2px;
        width: 16px;
        height: 16px;
        background: #e6e6e6;
    }

    input ~ span.mark::after {
        content: " ";
        width: 8px;
        height: 8px;
        margin: 4px;
    }

    input[type="radio"] ~ span.mark,
    input[type="radio"] ~ span.mark::after {
        border-radius: 50%;
    }
    input:hover ~ span.mark::after {
        margin: 4px;
        border: 1px rgba(0,0,0,0.3) solid;
    }
    input:checked ~ span.mark::after {
        background: #777;
    }
}

.question-board {
    position: relative;
    margin: auto;
    left: 0;
    top: 20px;
    padding-right: 20px;
    padding-left: 0px;
    max-width: 700px;
}

.add-questions {
    // left: 550px;
    width: 10px;
    position: fixed;
    border: 1px solid black;
    top: 55px;
    bottom: 5px;
    right: 15px;
}
</style>
