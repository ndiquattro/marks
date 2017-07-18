import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';
import {ApiService} from './apiService';
import {inject} from 'aurelia-framework';
import moment from 'moment';

@inject(ApiService, EventAggregator, Router)
export class CurrentService {
  constructor(api, eventaggregator, router) {
    // Injects
    this.api = api;
    this.ea = eventaggregator;
    this.router = router;

    this.subjectList = [];
  }

  // User methods
  setUser(user) {
    this.user = user;
  }

  reviveUser(userId) {
    this.api.findOne('users', userId)
            .then(data => {
              this.user = data;
              if (this.user.active_year) {
                this.reviveYear(this.user.active_year);
              }
            });
  }

  // Subject Methods
  setSubjectList() {
    // Define Query
    let query = {
      filters: [{'name': 'year_id', 'op': 'eq', 'val': this.year.id}]
    };

    return this.api.find('subjects', query)
            .then(data => this.subjectList = data.objects);
  }

  setSubject(subject) {
    this.subject = subject;
    this.clearAssignment();
    this.ea.publish('subjectSet');
  }

  clearSubject() {
    this.subject = false;
    this.clearAssignment();
  }

  // Assignment Methods
  setAssignmentList(date) {
    console.log("assignment list set")
    // Get Week edges
    date = moment(date);
    let weekStart = date.startOf('isoweek').format('YYYY-MM-DD');
    let weekEnd = date.endOf('isoweek').format('YYYY-MM-DD');

    // Define Query
    let query = {
      filters: [{'name': 'subject_id', 'op': 'eq', 'val': this.subject.id},
                {'name': 'date', 'op': 'ge', 'val': weekStart},
                {'name': 'date', 'op': 'le', 'val': weekEnd}],
      order_by: [{'field': 'date', 'direction': 'desc'}]
    };

    // Request
    return this.api.find('assignments', query).then(data => {
      this.assignmentList = data.objects;
      return date;
    });
  }

  setAssignment(assignment) {
    this.assignment = assignment;
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
      filters: [{'name': 'assignment_id', 'op': 'eq', 'val': assignId}],
      order_by: [{'field': 'student__first_name', 'direction': 'asc'}]
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

    // Save year in database
    this.user.active_year = year.id;
    this.api.save(this.user);

    // Clear Data of old year
    this.clearAssignment();
    this.subjectList = [];
    this.assignmentList = [];
  }

  reviveYear(yearId) {
    this.api.findOne('years', yearId)
            .then(data => this.year = data);
  }

  // App Navigation
  navigateTo(route, params) {
    this.router.navigateToRoute(route, params, {trigger: true});
  }
}
