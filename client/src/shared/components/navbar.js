import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {ValidationControllerFactory} from 'aurelia-validation';
import {AuthService} from 'aurelia-auth';
import {CurrentService} from 'shared/services/currentService';
import {HttpService} from 'shared/services/httpService';
import {User} from 'shared/models/user';

@inject(CurrentService, AuthService, Router, HttpService,
        ValidationControllerFactory)
export class NavBar {
  user = new User();

  constructor(current, auth, router, http, controllerFactory) {
    this.current = current;
    this.auth = auth;
    this.router = router;
    this.http = http;
    this.controller = controllerFactory.createForCurrentScope();
  }

  attached() {
    this.showReset = false;
  }

  login() {
    // this.auth.login(this.user).then(resp => location.reload());
    this.http.login(this.user);
  }

  logout() {
    this.http.logout().then(this.auth.logout()).then(location.reload());
    // .then(resp => location.reload());
  }

  toggleReset() {
    this.showReset = true;
  }

  sendReset() {
    this.http.send('auth/forgot_password', {email: this.loginData.email});
  }
}
