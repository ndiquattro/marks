import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {AssignmentService} from './services/assignmentService';

@inject(AssignmentService, HttpClient)
export class GradeBook {
  constructor(assignment, http) {
    // Data Holders
    this.assignment = assignment;
    this.http = http;

    // Initalize Selection Indicators
    this.quickEntry = false;
    this.editMode = false;
  }

  created() {
    // Get subjects
    this.http.get('http://localhost:5000/api/subjects').then(data => {
      this.subjects = JSON.parse(data.response).objects;
    });
  }

  addAssignment() {
    // Flip on add assignment dialog
    this.assignment.clearAssignment();
    this.editMode = 'add';
  }

  editAssignment() {
    this.editMode = 'edit';
  }

  toggleQuick() {
    this.quickEntry = !this.quickEntry;
  }
}
