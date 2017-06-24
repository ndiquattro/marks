import {HttpClient} from 'aurelia-http-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject} from 'aurelia-framework';

@inject(HttpClient, EventAggregator)
export class AssignmentService {
  constructor(http, eventaggregator) {
    // Injects
    this.http = http;
    this.ea = eventaggregator;
  }

  setSubject(subject) {
    this.subject = subject;
    this.clearAssignment();
    this.ea.publish('subjectUpdated');
  }

  setAssignment(assignment) {
    this.meta = assignment;
    this.isPoints = assignment.type === 'Points';
    this.setScores(assignment.id);
  }

  deleteAssignment() {
    // Confirm with User
    let confirmed = confirm('Are you sure you want to delete ' + this.meta.name + '?');

    // If confirmed, delete from database
    if (confirmed) {
      this.http.createRequest('http://localhost:5000/api/assignments/' + this.meta.id)
        .asDelete()
        .send()
        .then(resp => this.ea.publish('reloadAssignments'));

      // Reset assignment selection
      this.clearAssignment();
    }
  }
  clearAssignment() {
    this.meta = {};
    this.scores = false;
  }

  setScores(assignId) {
    // Filter Object
    let qobj = {
      filters: [{'name': 'assignid', 'op': 'eq', 'val': assignId}],
      order_by: [{'field': 'studref__first_name', 'direction': 'asc'}]
    };

    // Get Data
    this.http.createRequest('http://localhost:5000/api/scores')
             .asGet()
             .withParams({q: JSON.stringify(qobj)})
             .send()
             .then(data => {
               this.scores = JSON.parse(data.response).objects;
               this.ea.publish('scoreUpdate');
             });
  }
}
