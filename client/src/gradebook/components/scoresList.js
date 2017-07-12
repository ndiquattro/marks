import {inject} from 'aurelia-framework';
import {ValidationControllerFactory} from 'aurelia-validation';
import {EventAggregator} from 'aurelia-event-aggregator';
import {CurrentService} from '../../shared/services/currentService';
import {ApiService} from '../../shared/services/apiService';

@inject(ApiService, CurrentService, EventAggregator, ValidationControllerFactory)
export class ScoresList {
  constructor(api, current, eventaggregator, controllerFactory) {
    // Initalize http client
    this.api = api;
    this.ea = eventaggregator;
    this.current = current;
    this.controller = controllerFactory.createForCurrentScope();

    // Initalize variables
    this.editScoreId = null;
  }

  editScore(score) {
    if (this.current.assignment.isPoints) {
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
    this.controller.validate().then(result => {
      if (!result.valid) {
        return;
      }

      // Update Scores
      this.api.save(score).then(resp => {
        // Update Current Scores
        this.ea.publish('scoreUpdate');
        // Reset edit
        this.editScoreId = null;
      });
    });
  }
}
