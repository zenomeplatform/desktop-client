import fs = require('fs');
import { getExtractor } from './getGenotypeExtractor';

/******************************************************************************
 *     @description     We dont need async calls here cause all operations    *
 *                        rus almost at no time.  Also when running inside    *
 *                        async function or Promise, it does not block the    *
 *                        main event loop.                                    *
 ******************************************************************************/

/**
 *  Extract the first 2048 bytes of the file
 */

function _extractFileHead (path) {
  let fd = fs.openSync(path, 'r')
  
  let buffer = Buffer.alloc(2048)
  fs.readSync(fd, buffer, 0, 2047, 0)
  fs.closeSync(fd)

  return buffer.toString('utf8')
}



/**
*  Extract comments and header
*/
export function extractFileHead (path) {

  let lines = _extractFileHead(path)
    .split('\n')
    .map( line => line.split('\t') )

  let header = lines.filter( line => line.length > 1 ).shift()

  lines = lines.filter( line => line.length == 1 )

  let offset = lines.length
  let text = lines.join('\n')

  return { header, text, offset }
}



/**
 *  Do all preparations needed for getting data stream.
 *    @param {string} path      path to file.
 *
 *    @var {string[]} header    header labels
 *    @var { string } text      Preface text (comments)
 *    @var { number } offset    how many lines preface takes
 *
 *    @func extractor  transform data from rows into standart normalized form
 */

export function prepareForStream (path: string) {
   let { header, text, offset } = extractFileHead(path)
   let extractor = getExtractor(header)

   return { header, text, path, extractor, offset }
}
