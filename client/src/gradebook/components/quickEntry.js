import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {CurrentService} from '../../shared/services/currentService';
import {ApiService} from '../../shared/services/apiService';

@inject(ApiService, CurrentService, EventAggregator)
export class QuickEntry {

  constructor(api, current, eventaggregator) {
    // Initalize http client
    this.api = api;
    this.current = current;
    this.ea = eventaggregator;
  }

  attached() {
    // Initalize variables
    this.entered = [];
    this.notEntered = this.current.scores;

    // Set Flags
    this.isPoints = this.current.isPoints;
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
        .filter(x => x.student.first_name.toLowerCase().indexOf(value) === 0)
        .sort();
      return Promise.resolve(suggestions);
    },

    getName: suggestion => suggestion.student.first_name
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
    // Update Scores
    this.api.update('scores', score.id, {'value': score.value});

    // Tell the app a score has been updated
    this.ea.publish('scoreUpdate');
  }
}
