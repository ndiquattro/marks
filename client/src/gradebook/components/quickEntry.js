import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {EventAggregator} from 'aurelia-event-aggregator';
import {AssignmentService} from '../services/assignmentService';

@inject(HttpClient, AssignmentService, EventAggregator)
export class QuickEntry {

  constructor(http, assignment, eventaggregator) {
    // Initalize http client
    this.http = http;
    this.assignment = assignment;
    this.ea = eventaggregator;
  }

  attached() {
    // Initalize variables
    this.entered = [];
    this.notEntered = this.assignment.scores;

    // Set Flags
    this.isPoints = this.assignment.isPoints;
    this.nameFocus = true;
    this.scoreFocus = false;
  }

  detached() {
    this.entered = [];
    this.notEntered = [];
  }

  // Provides autocomplete Suggestions
  suggestionService = {
    suggest: value => {
      // Check if there is any input
      if (value === '') {
        return Promise.resolve([]);
      }
      value = value.toLowerCase();
      const suggestions = this.notEntered
        .filter(x => x.studref.first_name.toLowerCase().indexOf(value) === 0)
        .sort();
      return Promise.resolve(suggestions);
    },

    getName: suggestion => suggestion.studref.first_name
  };

  pushScore(score) {
    // Add to the entered list
    this.entered.push(score);

    // Remove Score from future suggestions
    this.notEntered = this.notEntered.filter(item => item.id !== score.id);

    // clear forms and reset focus
    this.score = null;
    this.quickPoints = null;
    this.scoreFocus = false;
    this.nameFocus = true;
  }

  parseKey(key) {
    if (key === 13) {
      // If Checks type
      if (!this.isPoints && key === 13) {
        this.score.value = 1;
        this.updateScore(this.score);
        this.pushScore(this.score);
      }

      // If Points type
      if (this.quickPoints) {
        this.score.value = this.quickPoints;
        this.updateScore(this.score);
        this.pushScore(this.score);
      }
    } else {
      return true;
    }
  }

  updateScore(score) {
    this.http.createRequest('http://localhost:5000/api/scores/' + score.id)
      .asPut()
      .withContent({'value': score.value})
      .send();

    // Tell the app a score has been updated
    this.ea.publish('scoreUpdate');
  }
}
