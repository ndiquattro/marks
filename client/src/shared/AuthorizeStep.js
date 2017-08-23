import {inject} from 'aurelia-dependency-injection';
import {Redirect} from 'aurelia-router';
import {AuthService} from 'aurelia-auth';
import {HttpService} from 'shared/services/httpService';

@inject(AuthService, HttpService)
export class AuthorizeStep {
  constructor(auth, http) {
    this.auth = auth;
    this.http = http;
  }

  run(routingContext, next) {
    return this.http.refreshToken().then(() => {
      let isLoggedIn = this.auth.isAuthenticated();

      if (routingContext.getAllInstructions().some(i => i.config.auth)) {
        if (!isLoggedIn) {
          return next.cancel(new Redirect('/'));
        }
      }

      return next();
    });
  }
}
