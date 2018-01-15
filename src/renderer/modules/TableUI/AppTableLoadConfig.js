export default function tableLoadConfig (config, hooks) {
  hooks = hooks || {}
  
  return {
    captions : config.reduce((acc, n) => ({...acc, [n.id]: n.caption}), {}),
    widths   : config.reduce((acc, n) => ({...acc, [n.id]: n.width}), {}),
    visible  : config.map(it => it.id),
    available: config.map(it => it.id),
    hooks
  }
}
