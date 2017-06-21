import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {bindable} from 'aurelia-templating';

@inject(HttpClient)
export class AddAssignment {
  @bindable subject;
  @bindable edit;
  @bindable reloadAssignments;

  constructor(http) {
    this.http = http;
    this.assignment = {};
  }

  bind() {
    // Set title
    if (this.edit) {
      this.title = 'Edit Assignment';
      this.btn = 'Save Changes'
      this.assignment = this.edit;
    } else {
      this.title = 'Add Assignment';
      this.btn = this.title;
    }
  }

  submitAssignment() {
    if (this.edit) {
      // Update Assignment Information
      this.http.createRequest('http://localhost:5000/api/assignments/' + this.assignment.id)
        .asPut()
        .withContent(this.assignment)
        .send()
        .then(resp => this.reloadAssignments({assignment: resp.response}));
    } else {
      // Fill in subject id
      this.assignment.subjid = this.subject.id;

      // Add assignment information to database
      this.http.createRequest('http://localhost:5000/api/assignments')
        .asPost()
        .withContent(this.assignment)
        .send()
        .then(resp => this.reloadAssignments({assignment: resp.response}));

      // Clear Binds
      this.assignment = {};
    }
  }

  cancelEdit() {
    this.reloadAssignments();
  }

}
