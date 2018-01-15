import { Transform } from 'stream'

/**
 *  Object-transformation stream that skips (ignores)
 *  	specified number of objects.
 *
 *  @method constructor
 *  @param  {number}  _toSkip   number of elements to skip.
 *  @return {Transform}    			transform. stream
 */

export class Skip extends Transform {

	public _toSkip: number;

	constructor(_toSkip: number) {
    super({ objectMode: true });
		this._toSkip = _toSkip
  }

	_transform(object, enc, callback) {
		if (this._toSkip === 0)
			this.push(object)
		else
			this._toSkip--;
		callback();
	}

}
