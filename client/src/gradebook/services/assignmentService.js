import {HttpClient} from 'aurelia-http-client';
import {inject} from 'aurelia-framework';

@inject(HttpClient)
export class AssignmentService {
  constructor(http) {
    // Injects
    this.http = http;

    // Data Holders
    this.meta = {};
    this.scores = [];

    // Initalize Flags
    this.newScores = false;
    this.scoresLoaded = false;
  }

  setAssignment(assignment) {
    this.meta = assignment;
    this.scoresLoaded = false;
    this.isPoints = assignment.type === 'Points';
    this.setScores(assignment.id);
  }

  clearAssignment() {
    this.meta = {};
    this.scores = [];
    this.scoresLoaded = false;
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
               this.scoresLoaded = true;
             });
  }

  flagNew() {
    this.newScores = !this.newScores;
  }
}
