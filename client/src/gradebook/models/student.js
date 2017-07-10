import {ValidationRules} from 'aurelia-validation';

export class Student {
  constructor(data) {
    Object.assign(this, data);
  }

  get source() {return 'students';}

  get fullName() {return this.first_name + ' ' + this.last_name;}
}

ValidationRules
  .ensure('first_name').displayName('First Name')
    .required()
    .maxLength(255)
  .ensure('last_name').displayName('Last Name')
    .required()
    .maxLength(255)
  .on(Student);
