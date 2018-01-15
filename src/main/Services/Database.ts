declare var __static: any;
import bluebird = require('bluebird-global')

const DB = require('nedb')

import RosalindConfig from '../../config/Rosalind'
import RosalindQuestionarieConfig from '../../config/RosalindQuestionarie'

const DEFAULTs = {
  "W7LCVhZcamIiYHsb": RosalindConfig,
  "cQwTswJtFk15y2Vq": RosalindQuestionarieConfig
}

function LoadDefaults (DBase, DEFAULTs) {
  for (let _id in DEFAULTs) {
    DBase.update({ _id }, { _id, ...DEFAULTs[_id] }, { upsert: true })
  }
}




enum DB_CMD {
  findOne ,
  find    ,
  count   ,
  watch   ,
  insert,
  remove,
  update,
}





export class Datastore {

  public database: any;
  public _state: any = {
    requests: {},
    results: {}
  }

  constructor(public path, public handler) {
    this.database = new DB({
      filename: path, autoload: true })
    LoadDefaults(this.database, DEFAULTs)
  }

  /**
   *  Wrap a database method and parameters to return
   *     a function with no args that returns promise
   *
   *  @method promisify
   *  @param  {String}  method    name of method
   *  @param  {...any}  request   function params
   *  @return {() => Promise}
   */
  promisify(method, ...request) {
    let result = this._promisify(method, ...request)

    if (['update', 'remove', 'insert'].indexOf(method) !== -1)
      result.then(data => this._watch(false))

    return result
  }

  /**
   *  Helper function
   *
   *  @method _promisify
   */
  _promisify(method, ...query) {
    return new Promise(
      (resolve, reject) => this.database[method](...query,
        (error, data) => error ? reject(error) : resolve(data)
      )
    )
  }

  _watch(force) {
    for (let id in this._state.requests) {
      let _request = this._state.requests[id]
      let _result = this._state.results[id]

      this.find(_request).then(res => {
        let result = JSON.stringify(res)
        let request = JSON.stringify(_request)

        if ((result !== _result) || force) {
          this._state.results[id] = result
          this.handler({id, request, result, action: 'changed'})
        }
      })
    }
  }

  watch(id, request) {
    this._state.requests[id] = request
    this._watch(true)
    return new Promise((resolve) => {
      resolve(true)
    })
  }

  /* eslint-disable */
  find(...request) {
    return this.promisify('find', ...request)
  }
  remove(...request) {
    return this.promisify('remove', ...request)
  }
  findOne(...request) {
    return this.promisify('findOne', ...request)
  }
  insert(data, ...rest) {
    return this.promisify('insert',
        { ...data, time_added: Date.now() },
      ...rest)
  }
  update(...request) {
    return this.promisify('update', ...request)
  }
  count(...request) {
    return this.promisify('count', ...request)
  }
  /* eslint-enable */

  remote(task) {
    console.log(task)
    return this._remote(task).then(result => {
      //if (Array.isArray(result))
      return {
        ...task,
        result
      }
      //return { ...task, ...result }
    })
  }

  _remote(object) {
    let {
      action,
      data,
      id,
      task,
      query,
      update,
      options,
      projections
    } = object

    action = action || task[1]

    if (task && task.length > 2) {
      switch (action) {
        case 'remove':
        case 'find':
        case 'findOne':
        case 'count':
          query = query || task[2];
          break;
        case 'update':
        case 'insert':
          query = query || task[2];
          data = data || task[2];
          update = update || task[3];
          break;
      }
    }

    options = options || {}

    switch (action) {
      case 'watch':
        return this.watch(id, query)
      case 'insert':
      console.log('Insert')
        return this.insert(data)
      case 'remove':
        return this.remove(query, options)
      case 'find':
        return this.find(query, projections)
      case 'update':
        {
          return this.update(query, update, {
            multi: true,
            ...options
          })
        }
      case 'findOne':
        return this.findOne(query)
      case 'count':
        return this.count(query)
    }
  }
}
