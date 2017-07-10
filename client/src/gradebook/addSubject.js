import {inject} from 'aurelia-framework';
import {ValidationControllerFactory} from 'aurelia-validation';
import {CurrentService} from 'shared/services/currentService';
import {ApiService} from 'shared/services/apiService';
import {Subject} from 'gradebook/models/subject';

@inject(CurrentService, ApiService, ValidationControllerFactory)
export class AddSubject {
  newSubject = new Subject();

  constructor(current, api, controllerFactory) {
    this.current = current;
    this.api = api;
    this.controller = controllerFactory.createForCurrentScope();
  }

  created() {
    this.title = 'Add Subject';
    this.bttn = 'Add Subject';
    this.current.setSubjectList();
    this.formStart = true;
  }

  reset() {
    this.title = 'Add Subject';
    this.bttn = 'Add Subject';
    this.formStart = true;
    this.newSubject = new Subject();
    this.controller.reset();
  }

  edit(subject) {
    this.controller.reset();
    this.newSubject = subject;
    this.formStart = true;
    this.title = 'Edit Subject';
    this.bttn = 'Save Changes';
  }

  delete(subject) {
    let confirmed = confirm('Are you sure you want to delete ' + subject.name  + '?');

    if (confirmed) {
      this.api.delete(subject).then(data => this.current.setSubjectList());
    }
  }

  submit() {
    this.controller.validate().then(result => {
      if (!result.valid) {
        return;
      }

      if (!this.newSubject.year_id) {
        this.newSubject.year_id = this.current.year.id;
      }

      this.api.save(this.newSubject).then(data => {
        this.current.setSubjectList();
        this.reset();
      });
    });
  }
}
