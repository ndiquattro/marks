import {inject} from 'aurelia-framework';
import {ApiService} from 'shared/services/apiService';
import {CurrentService} from 'shared/services/currentService';
import {Router} from 'aurelia-router';

@inject(CurrentService, ApiService, Router)
export class Profile {
  constructor(current, api, router) {
    this.current = current;
    this.api = api;
    this.router = router;
  }

  attached() {
    this.profile = this.current.user;
  }

  submit() {
    this.api.update('users', this.current.user.id, this.profile)
            .then(resp => {
              // this.current.setUser(resp);
              this.router.navigateToRoute('admin');
            });
  }
}
