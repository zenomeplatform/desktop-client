import {
  createGroup as G,
  createConditionedGroup as CG,
  createDivider,
  createButton as O,
  createSimpleButton as o
} from '@/modules/ContextMenu/ContextBus'

function notIn(item, items) {
  return !items.includes(item)
}


export default G([
    CG(
      ({payload}) => payload.rowId === 'free',[
        o('[error] Empty',      ({payload}) => ''),
      ]),
    CG(
      ({payload}) => payload.rowId === 'header',[
        ({vm, payload}, menu) =>
            vm.config.available.map(item => {
              if (vm.config.visible.indexOf(item) == -1)
                menu.push(['[ ] '+item, () => vm.config.visible = [item, ...vm.config.visible ]])
              else
                menu.push(['[v] '+item, () => vm.config.visible = vm.config.visible.filter(x => x !== item)])
            })
      ]),
    CG(
      ({payload}) => notIn(payload.rowId, ['header', 'free']),[
      // o('[file] Open', ({payload, vm}) => {
      //   let file = vm.files.filter(f => f._id === payload.rowId).pop()
      //   if (file) return 'open::'+ file.type +'/'+payload.rowId
      //
      //   let person = vm.persons.filter(f => f._id === payload.rowId).pop()
      //   if (person) return 'open::'+ 'person' +'/'+payload.rowId
      //
      //   return ''
      // }),
      //createDivider(),
      O(
        ({payload}) =>  payload.active === 'true' ? '[v] Active (toogle)' : '[ ] Active (toogle)',
        ({payload}) => (payload.active === 'true' ? 'disable::' : 'enable::')
          + payload.rowId
      ),
      createDivider(),
      o('[remove] Remove',      ({payload}) => 'remove::'+payload.rowId ),
      o('[user] Assign Person', ({payload, vm}) => () => {
        vm.assignDataToUser = true
        vm.assignPersonId = payload.rowId

        //return 'open::assign-person/'+payload.rowId
      }),
      //o('[database] DB Editor', ({payload}) => 'open::db/'+payload.rowId ),
      //o('[list] Propreties',    ({payload}) => 'open::properies/'+payload.rowId ),
    ])
  ])
