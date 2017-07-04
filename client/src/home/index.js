import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {CurrentService} from 'shared/services/currentService';
import {AuthService} from 'aurelia-auth';

@inject(Router, AuthService, CurrentService)
export class Home {
  constructor(router, auth, current) {
    this.router = router;
    this.auth = auth;
    this.current = current;
  }

  attached() {
    this.newUser = {};
  }

  submitSignUp() {
    this.auth.signup('name', this.newUser.email, this.newUser.password)
             .then(resp => {
               this.current.setUser(resp.user);
               this.router.navigateToRoute('payment');
             });
  }
}
