import {HttpClient} from 'aurelia-http-client';

export class gradebook {
  constructor() {
    this.http = new HttpClient();
    this.subjects = [];
    this.assignments = null;
    this.scores = null;
    this.editScoreId = null;

    // Quick Entry Mode
    this.entered = [];
    this.quickmode = false;
    this.quickNameFocus = true;
    this.quickScoreFocus = false;
    this.quickPoints = null;
  }

  created() {
    // Get subjects
    this.http.get('http://localhost:5000/api/subjects').then(data => {
      this.subjects = JSON.parse(data.response).objects;
    });
  }

  getAssignments(id) {
    // Filter object
    var qobj = {
      filters: [{"name": "subjid", "op": "eq", "val": id}],
      order_by: [{"field": "date", "direction": "desc"}]
    };

    // Get Assignments
    this.http.createRequest('http://localhost:5000/api/assignments')
      .asGet()
      .withParams({q: JSON.stringify(qobj)})
      .send()
      .then(data => {
        this.assignments = JSON.parse(data.response).objects;
      });

    // Reset Scores
    this.scores = null;
    this.assignmentMeta = null;
  }

  getScores(id) {
    // Filter Object
    var qobj = {
      filters: [{"name": "assignid", "op": "eq", "val": id}],
      order_by: [{"field": "studref__first_name", "direction": "asc"}]
    }

    // Get Data
    this.http.createRequest('http://localhost:5000/api/scores')
      .asGet()
      .withParams({q: JSON.stringify(qobj)})
      .send()
      .then(data => {
        this.scores = JSON.parse(data.response).objects;
        this.assignmentMeta = this.scores[0].assref;
      });
  }

  editScore(score) {
    if (this.assignmentMeta.type === 'Points') {
      this.editScoreId = score.id;
      this.editFocus = true;
    } else {
      score.value = 1 - score.value
      this.updateScore('blurred', score.id, score.value)
    }
  }

  updateScore(key, id, value) {
    if(key === 13 || key === 'blurred') {
      this.http.createRequest('http://localhost:5000/api/scores/' + id)
        .asPut()
        .withContent({"value": value})
        .send()

      // Reset edits
      this.editScoreId = null;
    }
    // Return True for non-enter key presses
    return true;
  }

  toggleQuick() {
    this.quickmode = !this.quickmode;
    if (this.quickmode) {
      // this.notEntered = this.scores.map(score => score.studref.first_name);
      this.notEntered = this.scores
    }
  }

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

  quickUpdate(key) {
    if (key === 13) {
      if (this.assignmentMeta.type !== 'Checks') {
        this.updateScore(key, this.quickName.id, this.quickPoints);
        this.quickName.value = this.quickPoints;
        this.entered.push(this.quickName);
      } else {
        this.updateScore(key, this.quickName.id, 1);
        this.quickName.value = 1;
        this.entered.push(this.quickName);
      }

      // clear forms
      this.quickName = null;
      this.quickPoints = null;
      this.quickScoreFocus = false;
      this.quickNameFocus = true;

    } else {
      return true;
    }
  }
}
