import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {CurrentService} from 'shared/services/currentService';
import {HttpService} from 'shared/services/httpService';
import {AuthService} from 'aurelia-auth';

@inject(CurrentService, AuthService, Router, HttpService)
export class NavBar {
  constructor(current, auth, router, http) {
    this.current = current;
    this.auth = auth;
    this.router = router;
    this.http = http;
  }

  attached() {
    this.showReset = false;
  }

  login() {
    this.auth.login(this.loginData).then(resp => location.reload());
  }

  logout() {
    this.auth.logout().then(location.reload());
  }

  toggleReset() {
    this.showReset = true;
  }

  sendReset() {
    this.http.send('auth/forgot_password', {email: this.loginData.email});
  }
}
