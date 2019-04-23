import { useState } from 'react';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { toPromise } from './rxjs';

// status machine:
// none -> pending
// pending -> success / fail
// success / fail -> pending

export default function(fields) {
  const form = {};

  for (let field in fields) {
    const { initValue, validators } = fields[field];

    let [value, setValue] = useState(initValue);
    const [status, setStatus] = useState('none');
    const [error, setError] = useState('');

    const [validate$] = useState(() => new Subject());
    const [validated$] = useState(() =>
      validate$.pipe(
        switchMap(async function(v) {
          setStatus('pending');

          for (let validator of validators) {
            const err = await validator(v);
            if (err) {
              setStatus('fail');
              setError(err);
              return false;
            }
          }

          setStatus('success');
          setError('');
          return true;
        }),
      ),
    );

    form[field] = {
      value,
      setValue,
      status,
      setStatus,
      error,
      setError,
      validate$,
      validated$,
    };
  }

  async function validate(field, value) {
    if (field) {
      if (!form[field]) {
        throw new Error(`unexpected field [${field}]`);
      }

      const { validate$, validated$ } = form[field];
      const done = toPromise(validated$);
      validate$.next(value !== undefined ? value : form[field].value);
      return done;
    }

    const validations = [];
    for (let field in form) {
      validations.push(validate(field));
    }

    return Promise.all(validations).then(function(results) {
      for (let r of results) {
        if (r === false) {
          return false;
        }
      }

      return true;
    });
  }

  return {
    field(field, render) {
      if (!form[field]) {
        throw new Error(`unexpected field [${field}]`);
      }

      const { value, setValue, status, error } = form[field];

      return render({
        value,
        setValue,
        status,
        error,
        validate: function(value) {
          return validate(field, value);
        },
      });
    },
    validate,
    data() {
      const data = {};
      for (let field in form) {
        data[field] = form[field].value;
      }
      return data;
    },
  };
}
