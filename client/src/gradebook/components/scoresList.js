import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {bindable} from 'aurelia-templating';

@inject(HttpClient)
export class ScoresList {
  @bindable assignment;

  constructor(http) {
    // Initalize http client
    this.http = http;

    // Initalize variables
    this.editScoreId = null;
  }

  bind() {
    this.getScores(this.assignment);
    this.isPoints = this.assignment.type === 'Points';
  }

  assignmentChanged(newval, oldval) {
    this.bind();
  }

  getScores(assignment) {
    // Filter Object
    let qobj = {
      filters: [{'name': 'assignid', 'op': 'eq', 'val': assignment.id}],
      order_by: [{'field': 'studref__first_name', 'direction': 'asc'}]
    };

    // Get Data
    this.http.createRequest('http://localhost:5000/api/scores')
      .asGet()
      .withParams({q: JSON.stringify(qobj)})
      .send()
      .then(data => {
        this.scores = JSON.parse(data.response).objects;
      });
  }

  editScore(score) {
    if (this.isPoints) {
      this.editScoreId = score.id;
      this.editFocus = true;
    } else {
      score.value = 1 - score.value;
      this.updateScore('blurred', score);
    }
  }

  updateScore(key, score) {
    if (key === 13 || key === 'blurred') {
      this.http.createRequest('http://localhost:5000/api/scores/' + score.id)
        .asPut()
        .withContent({'value': score.value})
        .send();

      // Reset edit
      this.editScoreId = null;
    }
    // Return True for non-enter key presses
    return true;
  }
}
