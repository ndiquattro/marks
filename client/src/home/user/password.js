import {inject} from 'aurelia-framework';
import {HttpService} from 'shared/services/httpService';

@inject(HttpService)
export class Password {
  constructor(http) {
    this.http = http;
  }

  activate(params) {
    if (params.token !== undefined) {
      this.token = params.token;
      this.reset = true;
    } else {
      this.reset = false;
    }
  }

  attached() {
    this.password = {};
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
    this.http.send('auth/change_password', this.password, true)
             .then(resp => this.feedback = resp.message);
  }
}
