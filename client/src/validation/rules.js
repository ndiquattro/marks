import {ValidationRules} from 'aurelia-validation';

ValidationRules.customRule(
  'date',
  (value, obj) => value === null || value === undefined || value === '' || !isNaN(Date.parse(value)),
  '${$displayName} must be a valid date.'
);
