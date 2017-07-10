import {ValidationRules} from 'aurelia-validation';

export class Score {
  constructor(data) {
    Object.assign(this, data);
  }

  get source() {return 'scores';}
}

ValidationRules
  .ensure('value').displayName('Score')
    .required()
  .on(Score);
