import { Writable } from 'stream'



export class ToArray extends Writable {

  constructor(public targetArray: any[]) {
    super({ objectMode: true });
  }

  _write(item, encoding, callback) {
    this.targetArray.push(item);
    callback();
  }
}






/**
 *  Writable stream (ie destination) ---
 *    that saves incoming values in a new
 *    array.
 *
 *  @method constructor
 *  @return {Writable} Stream
 */


export class ToNewArray extends Writable {

  public data: any[] = []

  constructor() {
    super({ objectMode: true });
  }

  _write(item, encoding, callback) {
    this.data.push(item);
    callback();
  }
}
