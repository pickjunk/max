import { useState, ReactNode } from 'react';
import { Subject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { toPromise } from './rxjs';

// status machine:
// none -> pending
// pending -> success / fail
// success / fail -> pending

interface Fields {
  [field: string]: {
    initValue?: any;
    validators?: Validate[];
  }
}

interface Validate {
  (v: any): Promise<string> | string;
}

interface Form {
  [field: string]: {
    value: any;
    setValue: React.Dispatch<any>;
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
    validate$: Subject<any>;
    validated$: Observable<boolean>;
  };
}

interface FieldRender {
  (params: {
    value: any;
    setValue: React.Dispatch<any>;
    status: string;
    error: string;
    validate: (value: any) => Promise<any>;
  }): ReactNode;
}

interface FormData {
  [field: string]: any;
}

export default function useForm(fields: Fields) {
  const form: Form = {};

  for (let field in fields) {
    const { initValue, validators } = fields[field];

    let [value, setValue] = useState(initValue);
    const [status, setStatus] = useState('none');
    const [error, setError] = useState('');

    const [validate$] = useState(() => new Subject<any>());
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

  async function validate(field?: string, value?: any): Promise<any> {
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
    field(field: string, render: FieldRender): ReactNode {
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
    data(): FormData {
      const data = {};
      for (let field in form) {
        data[field] = form[field].value;
      }
      return data;
    },
  };
}
