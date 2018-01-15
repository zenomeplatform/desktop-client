import Vue from 'vue'
// import VueBus from './GlobalBus'
// Vue.use(VueBus)

export var bus = new Vue()



  export function createButton(label, action) {
    return function (runtimeData, menu) {
      menu.push([ label(runtimeData), action(runtimeData) ])
    }
  }

  export function createSimpleButton(label, action) {
    return function (runtimeData, menu) {
      menu.push([ label, action(runtimeData) ])
    }
  }

  export function createConditionedGroup (condition, elements) {
    return function (runtimeData, menu) {
      if (!condition(runtimeData)) return

      for (let element of elements) {
        element (runtimeData, menu)
      }
    }
  }

  export function createGroup (elements) {
    return function (runtimeData, menu) {
      for (let element of elements) {
        element (runtimeData, menu)
      }
    }
  }

  export function createDivider () {
    return function (runtimeData, menu) {
      menu.push([ '---', '---' ])
    }
  }



export class ContextMenu {

  constructor (vm) {
    this.$vm = vm
    this.menu = []
  }


  use(menu) {
    this.$menu = menu
    return this
  }


  context(payload) {
    let data = []
    let runtimeData = { vm: this.$vm, payload }
    this.$menu(runtimeData, data)
    data = data.map(([label, action]) => [ label, () => typeof action === 'function' ? action() : this.$vm.$do(action)  ])


    bus.$emit('context', {
      data : data,
      event: payload.event
    })
  }



}
