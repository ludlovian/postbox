'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var PLock = _interopDefault(require('plock'));
var PSwitch = _interopDefault(require('pswitch'));

class Postbox {
  constructor (width = 1) {
    this._queue = [];
    this._lock = new PLock(width);
    this._busy = new PSwitch(false);
  }
  post (item) {
    this._queue.push(item);
    this._busy.set(true);
  }
  async get ({ wait = false } = {}) {
    while (true) {
      await this._busy.whenOn;
      await this._lock.lock();
      if (this._queue.length) break
      this._lock.release();
    }
    const item = this._queue.shift();
    if (!wait) this.release();
    return item
  }
  release () {
    this._lock.release();
    if (this._queue.length === 0) this._busy.set(false);
  }
  async * getAll () {
    while (true) {
      const item = await this.get();
      yield item;
    }
  }
  get size () {
    return this._queue.length
  }
  get active () {
    return this._lock.locks
  }
  get idle () {
    return this._busy.whenOff
  }
  get busy () {
    return this._busy.whenOn
  }
}

module.exports = Postbox;
