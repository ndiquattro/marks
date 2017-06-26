import {EventAggregator} from 'aurelia-event-aggregator';
import {ApiService} from './apiService';
import {inject} from 'aurelia-framework';

@inject(ApiService, EventAggregator)
export class CurrentService {
  constructor(api, eventaggregator) {
    // Injects
    this.api = api;
    this.ea = eventaggregator;

    // Check for year
    this.year = JSON.parse(localStorage.getItem('currentYear'));
  }

  // Subject Methods
  setSubjectList() {
    this.api.find('subjects')
            .then(data => this.subjectList = data.objects);
  }

  setSubject(subject) {
    this.subject = subject;
    this.clearAssignment();
    this.ea.publish('subjectSet');
  }

  // Assignment Methods
  setAssignmentList() {
    // Define Query
    let query = {
      filters: [{'name': 'subjid', 'op': 'eq', 'val': this.subject.id}],
      order_by: [{'field': 'date', 'direction': 'desc'}]
    };

    // Request
    this.api.find('assignments', query)
            .then(data => this.assignmentList = data.objects);
  }

  setAssignment(assignment) {
    this.assignment = assignment;
    this.isPoints = assignment.type === 'Points';
    this.setScores(assignment.id);
  }

  clearAssignment() {
    this.assignment = false;
    this.scores = false;
  }

  // Scores Methods
  setScores(assignId) {
    // Filter Object
    let query = {
      filters: [{'name': 'assignid', 'op': 'eq', 'val': assignId}],
      order_by: [{'field': 'studref__first_name', 'direction': 'asc'}]
    };

    // Get Data
    this.api.find('scores', query)
            .then(data => {
              this.scores = data.objects;
              this.ea.publish('scoreUpdate');
            });
  }

  // Years Methods
  setYear(year) {
    this.year = year;
    localStorage.setItem('currentYear', JSON.stringify(year));

    // Clear Data of old year
    this.clearAssignment();
    this.subjectList = false;
    this.assignmentList = false;
  }
}
