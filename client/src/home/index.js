import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AuthService} from 'aurelia-auth';
import {ValidationControllerFactory, ValidationRules} from 'aurelia-validation';
import {CurrentService} from 'shared/services/currentService';
import {User} from 'shared/models/user';

@inject(Router, AuthService, CurrentService, ValidationControllerFactory)
export class Home {
  newUser = new User();

  constructor(router, auth, current, controllerFactory) {
    this.router = router;
    this.auth = auth;
    this.current = current;
    this.controller = controllerFactory.createForCurrentScope();
    this.confirmPassword;
    this.password = 'hello';
  }

  submitSignUp() {
    // Check for Validation
    this.controller.validate().then(result => {
      if (!result.valid) {
        return;
      }
      // Send form
      this.auth.signup(this.newUser)
               .then(resp => {
                 // Set as current user
                 this.current.setUser(new User(resp.user));

                 // Move on to next step
                 this.router.navigateToRoute('payment');
                 location.reload();
               });
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
    || value === obj[otherPropertyName].password,
  '${$displayName} must match Password',
  otherPropertyName => ({ otherPropertyName })
);


ValidationRules
  .ensure('confirmPassword')
    .required()
    .satisfiesRule('matchesPassword', 'newUser')
  .on(Home);
