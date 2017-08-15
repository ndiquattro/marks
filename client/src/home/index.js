import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AuthService} from 'aurelia-auth';
import {ValidationControllerFactory} from 'aurelia-validation';
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
                 console.log(resp)
                 this.current.setUser(new User(resp.user));

                 // Move on to next step
                 //this.router.navigateToRoute('payment');
                 //location.reload();
               });
    });
  }
}
