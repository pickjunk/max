import { Observable } from 'rxjs';

export function toPromise<T>(observable: Observable<T>): Promise<T> {
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