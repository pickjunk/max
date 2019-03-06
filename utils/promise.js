/* eslint-disable */
// Stoppable Promise
// https://github.com/xieranmaya/blog/issues/5
var STOP_VALUE = Symbol('PromiseStop');
var STOPPER_PROMISE = Promise.resolve(STOP_VALUE);

Promise.prototype._then = Promise.prototype.then;

Promise.stop = function() {
  return STOPPER_PROMISE;
};

Promise.prototype.then = function(onResolved, onRejected) {
  return this._then(
    onResolved
      ? function(value) {
          return value === STOP_VALUE ? STOP_VALUE : onResolved(value);
        }
      : undefined,
    onRejected,
  );
};
