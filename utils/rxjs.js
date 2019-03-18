export function toPromise(observable) {
  return new Promise(function (resolve, reject) {
    const s = observable.subscribe(function (v) {
      resolve(v);
      s.unsubscribe();
    }, function (e) {
      reject(e);
      s.unsubscribe();
    });
  });
}