import { readFile } from 'fs'

import bluebird = require('bluebird-global')
const readFileAsync = bluebird['promisify'](readFile)


import { create23meReadStream } from '../FormatHandlers/Plain23me/create23meStream'

import { ToArray } from '../Streams/WriteToArray'


let A = []

let Reciever = new ToArray(A)
let Emitter = create23meReadStream('/home/serzero2007/Documents/Projects/ZenomeMPVd/GeneticDataFiles/user1772_file1031_yearofbirth_unknown_sex_unknown.ancestry.txt')





Emitter.pipe(Reciever)

setTimeout(() => {
console.log(A[19456])

let B = A.map(item => item[0])


let chunks = []
let name = 'rs1251525'

for (let i = 0; i < 9; i++) {
  chunks.push(name.slice(i, i+3))

  let chunk = name.slice(i, i+3)
  let C = B.filter(nam => nam.search(chunks[i]) > -1)

  console.log('length', C.length)

  console.log(name.search(chunks[i]))
}






console.log(B[19456])


console.log(chunks)

}, 4000)
