import {ValidationRules} from 'aurelia-validation';

export class Year {
  constructor(data) {
    Object.assign(this, data);
  }

  get source() {return 'years';}
}

ValidationRules
  .ensure('school').displayName('School Name')
    .required()
    .maxLength(255)
  .ensure('first_day').displayName('First Day')
    .required()
    .satisfiesRule('date')
  .ensure('last_day').displayName('Last Day')
    .required()
    .satisfiesRule('date')
  .on(Year);
