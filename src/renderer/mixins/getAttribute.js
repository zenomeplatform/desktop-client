/**
 *  Goes from target up to the "app" element, iterating all parents.
 *  If an element has the specified attribute, it's returned.
 *
 *  @method getAttribute
 *  @param  {DOMElement}     target    to start with
 *  @param  {string}         attribute to find
 *  @return {any}            value for the attribute
 */

function getAttribute(target, attribute) {
  let temp

  while (!temp) {
    temp = target.attributes[attribute]
    target = target.parentElement
    if (!target || target.id === 'app')
      return
  }

  return temp.value
}


export default getAttribute
