import { Profile } from './profile';
export class User {
  _id: string;
  name: string;
  email: string;
  profiles: [Profile];
  password: string;
  active: boolean;
  token?: string;
}
