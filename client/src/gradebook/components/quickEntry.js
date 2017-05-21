import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {bindable} from 'aurelia-templating'

@inject(HttpClient)
export class QuickEntry {
  @bindable assignment;

  constructor(HttpClient) {
    // Initalize http client
    this.http = HttpClient;

    // Initalize variables
    this.entered = [];
  }

  bind() {
    this.getScores(this.assignment);
    this.isPoints = this.assignment.type === 'Points';
    this.nameFocus = true;
  }

  detached() {
    this.entered = [];
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
      return Promise.resolve(suggestions) },

    getName: suggestion => suggestion.studref.first_name
  };

  getScores(assignment) {
    // Filter Object
    var qobj = {
      filters: [{"name": "assignid", "op": "eq", "val": assignment.id}],
      order_by: [{"field": "studref__first_name", "direction": "asc"}]
    }

    // Get Data
    this.http.createRequest('http://localhost:5000/api/scores')
      .asGet()
      .withParams({q: JSON.stringify(qobj)})
      .send()
      .then(data => {
        this.notEntered = JSON.parse(data.response).objects;
      });
  }

  parseKey(key) {
    if (key === 13) {
      if (this.isPoints) {
        this.score.value = this.quickPoints;
        this.updateScore(this.score);
      } else {
        this.score.value = 1;
        this.updateScore(this.score);
      }

      // Add to the entered list
      this.entered.push(this.score);

      // Remove Score from future suggestions
      this.notEntered = this.notEntered.filter(item => item.id !== this.score.id)

      // clear forms
      this.score = null;
      this.quickPoints = null;
      this.scoreFocus = false;
      this.nameFocus = true;

    } else {
      return true;
    }
  }

  updateScore(score) {
      this.http.createRequest('http://localhost:5000/api/scores/' + score.id)
        .asPut()
        .withContent({"value": score.value})
        .send()
    }
}
