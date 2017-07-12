import {inject} from 'aurelia-framework';
import {ValidationControllerFactory} from 'aurelia-validation';
import {ApiService} from 'shared/services/apiService';
import {CurrentService} from 'shared/services/currentService';

@inject(CurrentService, ApiService, ValidationControllerFactory)
export class Profile {
  constructor(current, api, controllerFactory) {
    this.current = current;
    this.api = api;
    this.controller = controllerFactory.createForCurrentScope();
  }

  attached() {
    this.profile = this.current.user;
  }

  submit() {
    this.controller.validate().then(result => {
      if (!result.valid) {
        return;
      }
      this.isSaving = true;
      this.api.save(this.profile).then(data => {
        this.isSaving = false;
        this.saved = true;
      });
    });
  }
}
