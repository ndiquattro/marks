import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {AssignmentService} from '../services/assignmentService';

@inject(HttpClient, AssignmentService)
export class ScoresList {
  constructor(http, assignment) {
    // Initalize http client
    this.http = http;
    this.assignment = assignment;

    // Initalize variables
    this.editScoreId = null;
  }

  editScore(score) {
    if (this.assignment.isPoints) {
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
    this.http.createRequest('http://localhost:5000/api/scores/' + score.id)
      .asPut()
      .withContent({'value': score.value})
      .send();

    // Update Current Scores
    this.assignment.flagNew();

    // Reset edit
    this.editScoreId = null;
  }
}
