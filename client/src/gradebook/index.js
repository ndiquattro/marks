import {HttpClient} from 'aurelia-http-client';
import {inject} from 'aurelia-framework';

@inject(HttpClient)
export class GradeBook {
  constructor(http) {
    // Initalize Client
    this.http = http;

    // Initalize Selection Indicators
    this.subjectSelected = false;
    this.assignmentSelected = false;
    this.quickEntry = false;
  }

  created() {
    // Get subjects
    this.http.get('http://localhost:5000/api/subjects').then(data => {
      this.subjects = JSON.parse(data.response).objects;
    });
  }

  selectSubject(subject) {
    // Tell the rest of the app which subject is selected.
    this.subjectSelected = subject;
    this.assignmentSelected = false;  // Reset assignment when switching subs
  }

  selectAssignment(assignment) {
    this.assignmentSelected = assignment;
  }

  toggleQuick() {
    this.quickEntry = !this.quickEntry;
  }
}
