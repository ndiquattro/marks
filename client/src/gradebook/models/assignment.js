import {ValidationRules} from 'aurelia-validation';

export class Assignment {
  constructor(data) {
    Object.assign(this, data);
  }

  get source() {return 'assignments';}

  get isPoints() {return this.type === 'Points';}
}

ValidationRules
  .ensure('name').displayName('Name')
    .required()
    .maxLength(255)
  .ensure('date').displayName('Date')
    .required()
    .satisfiesRule('date')
  .ensure('type').displayName('Type')
    .required()
  .ensure('max').displayName('Max Score')
    .required()
  .on(Assignment);
