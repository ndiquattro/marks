import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {AssignmentService} from '../services/assignmentService';

@inject(HttpClient, AssignmentService, EventAggregator)
export class AssignmentList {
  constructor(http, assignment, eventaggregator) {
    // Initalize http client
    this.http = http;
    this.assignment = assignment;
    this.ea = eventaggregator;
  }

  created() {
    this.getAssignments(this.assignment.subject);
    this.subscription = this.ea.subscribe('subjectUpdated', resp => this.getAssignments(this.assignment.subject));
    this.reload = this.ea.subscribe('reloadAssignments', resp => this.getAssignments(this.assignment.subject));
  }

  detached() {
    this.subscription.dispose();
    this.reload.dispose();
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
}
