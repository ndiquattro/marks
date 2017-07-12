import {inject} from 'aurelia-framework';
import {CurrentService} from '../shared/services/currentService';
import {ApiService} from '../shared/services/apiService';

@inject(CurrentService, ApiService)
export class Reports {
  constructor(current, api) {
    this.current = current;
    this.api = api;
  }

  attached() {
    this.reports = ['Student'];
  }

  setReport(report) {
    this.selectedReport = report;
  }
}
