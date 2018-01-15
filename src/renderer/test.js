const runtimeData = {
  vm: {},
  payload: {
    rowId: '898',
    active: true
  }
}

function isNotClickOnHeader (runtimeData) {
  return runtimeData.payload.rowId !== 'header'
}

function isActive (runtimeData) {
  return runtimeData.payload.active
}

function createButton(label, action) {
  return function (runtimeData, menu) {
    menu.push([ label(runtimeData), action(runtimeData) ])
  }
}



function createSimpleButton(label, action) {
  return function (runtimeData, menu) {
    menu.push([ label, action(runtimeData) ])
  }
}

function createConditionedGroup (condition, elements) {
  return function (runtimeData, menu) {
    if (!condition(runtimeData)) return

    for (let element of elements) {
      element (runtimeData, menu)
    }
  }
}

let test = createConditionedGroup (isNotClickOnHeader, [
  createSimpleButton('pdssdfsdf', O => `open::db/${O.payload.rowId}`),
  createSimpleButton('pdssdfsdf', O => `open::db/${O.payload.rowId}`),
  createSimpleButton('pdssdfsdf', O => `open::db/${O.payload.rowId}`),
  createSimpleButton('pdssdfsdf', O => `open::db/${O.payload.rowId}`),
  createConditionedGroup(
    isActive, [
      (O, menu) => menu.push([ '[database] DB Editor',   'open::db/'+O.payload.rowId     ])
    ])
])


let menu = []

test(runtimeData, menu)

console.log(menu)
