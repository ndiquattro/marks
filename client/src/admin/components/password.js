import {inject} from 'aurelia-framework';
import {ValidationControllerFactory, ValidationRules} from 'aurelia-validation';
import {HttpService} from 'shared/services/httpService';

@inject(HttpService, ValidationControllerFactory)
export class Password {
  constructor(http, controllerFactory) {
    this.http = http;
    this.controller = controllerFactory.createForCurrentScope();
    this.currentPassword;
    this.newPassword;
    this.confirmPassword;
  }

  activate(params) {
    if (params.token !== undefined) {
      this.token = params.token;
      this.reset = true;
    } else {
      this.reset = false;
    }
  }

  resetPassword() {
    // Add token
    this.password.token = this.token;

    // Send Reset
    this.http.send('auth/reset_password', this.password)
             .then(resp => {
               if (resp.error) {
                 this.feedback = 'Error: ' + resp.error;
               } else {
                 this.feedback = 'Password Changed!';
               }
             });
  }

  changePassword() {
    // Check for Validation
    this.controller.validate().then(result => {
      if (!result.valid) {
        return;
      }
      let payload = {'current_pass': this.currentPassword,
                     'new_pass': this.newPassword};
      this.http.send('auth/change_password', payload, true)
               .then(resp => this.feedback = resp.message);
    });
  }
}

ValidationRules.customRule(
  'matchesPassword',
  (value, obj, otherPropertyName) =>
    value === null
    || value === undefined
    || value === ''
    || obj[otherPropertyName] === null
    || obj[otherPropertyName] === undefined
    || obj[otherPropertyName] === ''
    || value === obj[otherPropertyName],
  '${$displayName} must match ${$getDisplayName($config.otherPropertyName)}',
  otherPropertyName => ({ otherPropertyName })
);


ValidationRules
  .ensure('newPassword')
    .required()
    .minLength(8)
    .maxLength(50)
  .ensure('confirmPassword')
    .required()
    .satisfiesRule('matchesPassword', 'newPassword')
  .on(Password);
