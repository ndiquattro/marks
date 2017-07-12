import {ValidationRules} from 'aurelia-validation';

export class Subject {
  constructor(data) {
    Object.assign(this, data);
  }

  get source() {return 'subjects';}
}

ValidationRules
  .ensure('name').displayName('Name')
    .required()
    .maxLength(255)
  .on(Subject);
