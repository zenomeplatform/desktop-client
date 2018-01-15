
/**
 *  Deeply flatten nested array
 *
 *  @method flatten
 *  @param  {Array} object [description]
 *  @return {Array} [description]
 */
export function flatten(object) {
  if (!Array.isArray(object))
    return [object]
  return object.reduce((prev, cur) => [
    ...prev,
    ...flatten(cur)
  ], [])
}
