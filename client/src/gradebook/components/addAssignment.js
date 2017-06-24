import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {bindable} from 'aurelia-templating';
import {EventAggregator} from 'aurelia-event-aggregator';
import {AssignmentService} from '../services/assignmentService';

@inject(HttpClient, AssignmentService, EventAggregator)
export class AddAssignment {
  @bindable mode;

  constructor(http, assignment, eventaggregator) {
    this.http = http;
    this.assignment = assignment;
    this.ea = eventaggregator;
  }

  created() {
    this.newAssignment = {};
  }

  bind() {
    // Set title
    if (this.mode === 'edit') {
      this.title = 'Edit Assignment';
      this.btn = 'Save Changes';
      this.newAssignment = this.assignment.meta;
    } else {
      this.title = 'Add Assignment';
      this.btn = this.title;
    }
  }

  detached() {
    this.newAssignment = {};
  }

  submitAssignment() {
    if (this.mode === 'edit') {
      // Update Assignment Information
      this.http.createRequest('http://localhost:5000/api/assignments/' + this.assignment.meta.id)
        .asPut()
        .withContent(this.assignment.meta)
        .send();

      // Turn off edit mode
      this.mode = false;
    } else {
      // Fill in subject ID
      this.newAssignment.subjid = this.assignment.subject.id;

      // Add assignment information to database
      this.http.createRequest('http://localhost:5000/api/assignments')
        .asPost()
        .withContent(this.newAssignment)
        .send()
        .then(data => {
          this.ea.publish('reloadAssignments');

          // Clear Binds and Select
          this.assignment.setAssignment(JSON.parse(data.response));
          this.mode = false;
        });
    }
  }

  cancel() {
    this.mode = false;
  }
}
