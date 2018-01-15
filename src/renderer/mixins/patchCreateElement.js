function normalizeArguments(args) {
  if (Array.isArray(args[1]) || typeof args[1] === 'string') {
    return [ args[0], {}, ...args.slice(1) ]
  } else {
    return args
  }
}


export function patchCreateElement (createElement) {
  return function (...args) {
    /** New syntax not used --- short-circut to the original function */
    if (typeof args[0] !== 'string' || args[0].indexOf('.') === -1) {
      return createElement(...args)
    }
    /** Insert an empty property object if no such */
    args = normalizeArguments(args)

    let [ tag, ...classes ] = args[0].split('.')
    if (args[1] && args[1].class) {
      classes.push(args[1].class)
    }

    args[0] = tag
    args[1] = { ...args[1], class: classes.join(' ') }
    //console.log(args)

    return createElement(tag, args[1],...args.slice(2))
  }
}
