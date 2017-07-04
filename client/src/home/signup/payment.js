import {inject} from 'aurelia-framework';
import {ApiService} from 'shared/services/apiService';

@inject(ApiService)
export class PaymentSetup {
  constructor(api) {
    this.api = api;
  }
}
