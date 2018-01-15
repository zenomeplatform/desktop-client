/**
 *  Analog of createReadStream that reads data from 23me file and provides
 *    a stream of records.
 *
 *  Record template depends on @function getGenotypeExtractor.
 *
 *  @record [
 *    <rsid>,
 *    <genotype>,
 *    <chromosome>,
 *    <position>
 *  ]
 */

import fs = require('fs');
import split = require('split2');

import { Skip } from '../../Streams/Skip'



import { prepareForStream } from './prepareForStream'

export interface StreamRange {
  start ?: number
  end   ?: number
}

export function create23meReadStream ( path: string, options?: StreamRange ) {

  let  { extractor, offset } = prepareForStream (path)
  let __tranformer = split(
    L => extractor(L.split('\t')))

  // +1, because of the header
  let __skipper = new Skip(offset+1)

  return fs.createReadStream(path)
    .pipe(__tranformer)
    .pipe(__skipper)
}
