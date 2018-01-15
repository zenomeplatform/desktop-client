let database = { rxdb: undefined }

import RxDB from 'rxdb';
import memdown from 'memdown';
var util = require('util')
import { AbstractLevelDOWN } from 'abstract-leveldown'
import promiseIpc from 'electron-promise-ipc';

console.log(AbstractLevelDOWN)
// constructor, passes through the 'location' argument to the AbstractLevelDOWN constructor
//
function IpcDOWN (location) {
  if (!(this instanceof MemDOWN)) return new MemDOWN(location)

  AbstractLevelDOWN.call(this, typeof location === 'string' ? location : '')

  this._location = this.location ? '$' + this.location : '_tree'
  this._store = this.location ? globalStore : this
}

// our new prototype inherits from AbstractLevelDOWN
util.inherits(IpcDOWN, memdown)

// implement some methods

IpcDOWN.prototype._open = function (options, callback) {
  // initialise a memory storage object
  this._store = {}
  // optional use of nextTick to be a nice async citizen
  process.nextTick(function () { callback(null, this) }.bind(this))
}

IpcDOWN.prototype._put = function (key, value, options, callback) {
  key = '_' + key // safety, to avoid key='__proto__'-type skullduggery
  this._store[key] = value
  process.nextTick(callback)
}

IpcDOWN.prototype._get = function (key, options, callback) {
  var value = this._store['_' + key]
  if (value === undefined) {
    // 'NotFound' error, consistent with LevelDOWN API
    return process.nextTick(function () { callback(new Error('NotFound')) })
  }
  process.nextTick(function () {
    callback(null, value)
  })
}

IpcDOWN.prototype._del = function (key, options, callback) {
  delete this._store['_' + key]
  process.nextTick(callback)
}

RxDB.plugin(require('pouchdb-adapter-leveldb'))

RxDB.create({name: 'mydatabase', adapter: IpcDOWN})
    .then(db => database.rxdb = db)

export default database
