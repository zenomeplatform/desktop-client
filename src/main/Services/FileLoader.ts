import { readFile } from 'fs'

import bluebird = require('bluebird-global')
const readFileAsync = bluebird['promisify'](readFile)


import { create23meReadStream } from '../FormatHandlers/Plain23me/create23meStream'

import { ToNewArray } from '../Streams/WriteToArray'




class FileLoader {

  public LOADED_FILES: any = {}

  constructor () {}

  loadFile (object) {
    this.LOADED_FILES = {} // Full reset
    return this.addFile(object)
  }

  addFile (object) {
    let {_id, path} = object
    let Reciever = new ToNewArray()
    this.LOADED_FILES[_id] = Reciever.data

    create23meReadStream(path).pipe(Reciever)
  }


  read(id, offset) {
    offset = parseInt(offset)

    return {
      offset: offset,
      data: this.LOADED_FILES[id].slice(offset, offset + 30)
    }
  }

  search(id, keyword, offset) {
    let temp = []
    let skip = offset
    keyword = keyword.toString()

    for (let item of this.LOADED_FILES[id]) {
      if ( item[0].indexOf(keyword) > -1) {
        if (skip>0) {
          skip--;
        } else {
          temp.push(item)
        }
      }
      if (temp.length >= 30) break
    }


    return {
      offset: offset - skip,
      data: temp
    }
  }

}


export const F = new FileLoader()
