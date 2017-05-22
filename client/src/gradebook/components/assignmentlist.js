import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {bindable} from 'aurelia-templating';

@inject(HttpClient)
export class AssignmentList {
  @bindable subject;
  @bindable selectAssignment;

  constructor(http) {
    // Initalize http client
    this.http = http;

    // Initalize Selection Indicators
    this.selectedId = false;
  }

  subjectChanged() {
    this.getAssignments(this.subject);
    this.selectedId = false;
  }

  getAssignments(subject) {
    // Filter object
    let qobj = {
      filters: [{'name': 'subjid', 'op': 'eq', 'val': subject.id}],
      order_by: [{'field': 'date', 'direction': 'desc'}]
    };

    // Request Assignments
    this.http.createRequest('http://localhost:5000/api/assignments')
      .asGet()
      .withParams({q: JSON.stringify(qobj)})
      .send()
      .then(data => {
        this.assignments = JSON.parse(data.response).objects;
      });
  }

  chooseAssignment(assignment) {
    this.selectedId = assignment.id;
    this.selectAssignment({assignment: assignment});
  }
}
