import {ValidationRules} from 'aurelia-validation';

export class User {
  constructor(data) {
    Object.assign(this, data);
  }

  get source() {return 'users';}

  get teacherName() {
    if (this.title && this.last_name) {
      return this.title + ' ' + this.last_name;
    }
  }
}

ValidationRules
  .ensure('email')
    .required()
    .email()
  .ensure('password')
    .required()
    .minLength(8)
    .maxLength(50)
  .ensure('first_name').displayName('First Name')
    .maxLength(255)
  .ensure('last_name').displayName('Last Name')
    .required()
    .maxLength(255)
  .ensure('title')
    .required()
  .on(User);
