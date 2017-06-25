import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {CurrentService} from '../services/currentService';
import {ApiService} from '../services/apiService';

@inject(ApiService, CurrentService, EventAggregator)
export class ScoresList {
  constructor(api, current, eventaggregator) {
    // Initalize http client
    this.api = api;
    this.ea = eventaggregator;
    this.current = current;

    // Initalize variables
    this.editScoreId = null;
  }

  editScore(score) {
    if (this.current.isPoints) {
      this.editScoreId = score.id;
      this.editFocus = true;
    } else {
      score.value = 1 - score.value;
      this.updateScore(score);
    }
  }

  deFocus(key) {
    if (key === 13) {
      this.editFocus = false;
    } else {
      return true;
    }
  }

  updateScore(score) {
    // Update Scores
    this.api.update('scores', score.id, {'value': score.value});

    // Update Current Scores
    this.ea.publish('scoreUpdate');

    // Reset edit
    this.editScoreId = null;
  }
}
