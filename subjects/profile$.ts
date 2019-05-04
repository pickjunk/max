import { Subject } from 'rxjs';

interface Profile {
  id?: string;
  name?: string;
}

const profile$ = new Subject<Profile>();

export default profile$;
