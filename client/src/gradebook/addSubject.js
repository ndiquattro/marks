import {inject} from 'aurelia-framework';
import {CurrentService} from 'shared/services/currentService';
import {ApiService} from 'shared/services/apiService';

@inject(CurrentService, ApiService)
export class AddSubject {
  constructor(current, api) {
    this.current = current;
    this.api = api;
  }

  attached() {
    this.reset();
  }

  reset() {
    this.mode = 'add';
    this.title = 'Add Subject';
    this.bttn = 'Add Subject';
    this.newSubject = {};
  }

  edit(subject) {
    this.mode = 'edit';
    this.newSubject = subject;

    this.title = 'Edit Subject';
    this.bttn = 'Save Changes';
  }

  delete(subject) {
    let confirmed = confirm('Are you sure you want to delete ' + subject.name  + '?');

    if (confirmed) {
      this.api.delete('subjects', subject.id)
              .then(data => this.current.setSubjectList());
    }
  }

  submit() {
    if (this.mode === 'edit') {
      this.api.update('subjects', this.newSubject.id, this.newSubject)
              .then(resp => this.reset());
    } else {
      // Add Current year
      this.newSubject.year_id = this.current.year.id;

      this.api.add('subjects', this.newSubject)
              .then(resp => {
                this.current.setSubjectList();
                this.reset();
              });
    }
  }
}
