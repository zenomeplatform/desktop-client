/* eslint-disable object-property-newline */
/* eslint-disable no-multi-spaces */
import Vue from 'vue'
import Promise from 'bluebird'
import yeast from 'yeast'
import Vuex from 'vuex'
import { updateField } from 'vuex-map-fields';
//import { mapFields } from 'vuex-map-fields';

const TaskModule = {
  state () {
    return {
      tasks: {},
      resolvers: {}
    }
  },
  mutations: {
    /**
     *  @param  state             store object
     *  @param  state.tasks       all active tasks
     *  @param  state.resolvers   saved [resolve, reject] functions
     *  @param  task              specification object
     *  @param  task.id           unique task id
     */

    /**  Adds a new task to the store.  */
    TASK_START (state, task) {
      Vue.set(state.tasks, task.id, task)
    },
    /** Remove the task from store by id  */
    TASK_REMOVE(state, task){
      Vue.delete(state.tasks, task.id)
    },
    /** Sync information about task status */
    TASK_UPDATE(state, task){
      Vue.set( state.tasks, task.id,
        { ...state.tasks[task.id], ...task })
    },


    /** Store resolve and reject into the store */
    RESOLVER_ADD (state, task) {
      Vue.set(state.resolvers, task.id, task )
    },
    /** Delete these functions */
    RESOLVER_DEL (state, task) {
      Vue.set(state.resolvers, task.id,{ })
    },


    /** Resolves task with data from @var task */
    TASK_RESOLVE (state, task){
      state.resolvers[task.id].resolve(task)
    },
    /** Rejects task with data from @var task */
    TASK_REJECT  (state, {id, error }){
      state.resolvers[id].reject(error)
    }
  },
  actions: {
    async addTask ({commit}, data) {
      let id = yeast()
      commit('TASK_START', { ...data, id })
      return new Promise((resolve, reject) => {
        commit('RESOLVER_ADD', { id, resolve, reject })
      })
    },
    async onUpdate ({commit}, data) {
      commit('TASK_UPDATE', data)
    },
    async onFinish ({commit}, data) {
      //console.log(data.result, data)
      commit('TASK_RESOLVE', data)
      commit('TASK_REMOVE', data)
      commit('RESOLVER_DEL', data)
    }
  }
}


const KeyValRuntimeStorage = {
  state () {
    return {}
  },
  mutations: { updateField  }
}


const RemoteWatcher = {
  state () {
    return {
      queries: {},
      results: {}
    }
  },
  mutations: {
    DATABASE_SYNC (state, { id, request, result }) {
      if (request) Vue.set(state.queries, id, request)
      if (result)  Vue.set(state.results, id, result)
    }
  },
  actions: {
    async databaseSyncronize ({ commit }, { id, request, result }) {
      commit('DATABASE_SYNC', { id,
       request : JSON.parse(request),
       result  : JSON.parse(result)
      })
    }
  }
}



export const ipcRemoteTasks = ipc  => store => {

  store.registerModule('Tasks', TaskModule)
  store.registerModule('RemoteWatcher', RemoteWatcher)

  store.subscribe(mutation => {
    if (mutation.type === 'TASK_START') {
      ipc.send('tasks-add', mutation.payload)
    }
  })

  ipc.on('db', (e, D) =>  store.dispatch('databaseSyncronize', D))
  ipc.on('task-finished', (e, D) => store.dispatch('onFinish', D))
  ipc.on('task-updated',  (e, D) => store.dispatch('onUpdate', D))
}


export let IPCFrontendPlugin = {
  install (Vue, options) {
    Vue.prototype.$addTask = function (...task) {
      return this.$store.dispatch('addTask', {task})
    }

    Vue.prototype.$do = function (action) {
      if (action === undefined)
        return

      let [ _action, ...rest ] = action.split('::')

      switch (_action) {
        case 'open': {
          this.$router.push(rest.join('/'))
          break;
        }
        case 'remove': {
          let [ id ] = rest
          this.$addTask('task-db', 'remove', { _id: id })
          break;
        }
        case 'enable': {
          let [ id ] = rest
          this.$addTask('task-db', 'update', { _id: id }, { $set: { active: true } })
          break;
        }
        case 'disable': {
          let [ id ] = rest
          this.$addTask('task-db', 'update', { _id: id }, { $set: { active: false } })
          break;
        }

      }
    }
  }
}

import { ipcRenderer } from 'electron'

Vue.use(Vuex)

export default new Vuex.Store({
  state () {
    return {
      currentPerson: undefined,
      openedDialogs: []
    }
  },
  mutations: {
    SET_CURRENT_PERSON (state, id) { state.currentPerson = id }
  },
  actions: {
    async setCurrentPerson ({ commit }, id) {
      commit('SET_CURRENT_PERSON', id)
    }
  },
  plugins: [ipcRemoteTasks(ipcRenderer)],
  strict : process.env.NODE_ENV !== 'production'
})
