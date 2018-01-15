// TODO Refactor to class


const readline = require('readline');
const fs = require('fs');

const OBO_FILE_PATH = __static + '/hp.obo'

const rl = readline.createInterface({
  input: fs.createReadStream(OBO_FILE_PATH),
  crlfDelay: Infinity
});

function processValue (value) {
  let result = []
  while (value) {
    value = value.trim()
    if (value[0] === '!') break
    let temp = /^\[.*\]|^\".*\"|^[^ \\\[\"]+/.exec(value)
    if (!temp) break
    result.push(temp[0])
    value = value.slice(temp[0].length)
  }
  return result
}

export var HPO = {}
var __subclasses_cache = {}



let temp = { is_a: [] }

function finishStanza () {
  if (!temp.is_obsolete)
    HPO[temp.id] = temp
  temp = { is_a: [], alt_id: [], synonyms: [] }
}

/**
 *  A workaround for V8-specific bug
 *
 *  @method unleakString
 *  @param  {string}  string
 *  @return {string}  The same string that does not have a reference to "parent"
 */
function unleakString (string) {
  return ( " " + string ).slice(1)
}

function processLine(line) {
  let i = line.indexOf(':')
  let key = line.slice(0, i)
  let value = line.slice(i+1)

  let j = value.indexOf(' ! ')
  if (j > -1) { value = value.slice(0,j) }
  value = value.trim()

  return {
    key   : unleakString(key),
    value : unleakString(value)
  }
}


rl.on('line', (line) => {

  if (line === '') return
  if (line === '[Term]')
    return finishStanza()

  let {key, value} = processLine(line)

  switch (key) {
    case 'id'           : temp.id           = value;  break;
    case 'name'         : temp.name         = value;  break;
    case 'is_a'         : temp.is_a     .push(value); break;
    case 'alt_id'       : temp.alt_id   .push(value); break;

    case 'is_obsolete'  : temp.is_obsolete  = value;  break;
    //case 'replaced_by'  : temp.replaced_by  = value;  break;
    //case 'consider'     : temp.consider     = value;  break;

    //case 'is_anonymous' : temp.is_anonymous = value;  break;
    //case 'subset'       : temp.subset       = value;  break;
    case 'comment'      : temp.comment      = value;  break;

    case 'def'          : temp.def         = processValue(value)[0]; break;
    case 'synonym'      : temp.synonyms.push(processValue(value));   break;
  }

}).on('close', () =>{
  finishStanza()

  for (let i in HPO) {
    __subclasses_cache[i] = []
  }

  for (let i in HPO) {
    for (let j of HPO[i].is_a) {
      __subclasses_cache[j].push(i)
    }
  }

})


export function getPhenotypeById(id) {
  if (!HPO[id])
    return {}
  return HPO[id]
}





export function getCategorySubclasses (id) {
  if (__subclasses_cache[id])
    return __subclasses_cache[id]

  /**
   * @description
   * Fallback for extremly rare cases.
   **/
  let T = []
  for (let i in HPO) {
    if (HPO[i].is_a.includes(id))
      T.push(i)
  }
  return T
}

export const START_ID  = 'HP:0000118'
export const ROOT_ID   = 'HP:0000001'
export const MODIFIERS = [
  'HP:0000005', 'HP:0040279', 'HP:0040006', 'HP:0012823'
]
export const FOLDERS = [
  "HP:0003674", "HP:0003679", "HP:0003812", "HP:0011008",
  "HP:0012824", "HP:0012830", "HP:0025204", "HP:0025254",
  "HP:0025280", "HP:0025285", "HP:0031375"
]
