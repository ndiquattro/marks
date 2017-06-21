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
    this.addingAssignment = false;
    this.editingAssignment = false;
    this.reloadAssignmentsFlag = false;
  }

  created() {
    // Get subjects
    this.http.get('http://localhost:5000/api/subjects').then(data => {
      this.subjects = JSON.parse(data.response).objects;
    });
  }

  addAssignment() {
    // Flip on add assignment dialog
    this.assignmentSelected = false;
    this.addingAssignment = true;
  }

  editAssignment(assignment) {
    this.editingAssignment = assignment;
    // this.assignmentSelected = false;
  }

  deleteAssignment(assignment) {
    // Confirm with User
    let confirmed = confirm('Are you sure you want to delete ' + assignment.name + '?');

    // If confirmed, delete from database
    if (confirmed) {
      this.http.createRequest('http://localhost:5000/api/assignments/' + assignment.id)
        .asDelete()
        .send()
        .then(resp => this.reloadAssignments(resp.response));

      // Reset assignment selection
      this.assignmentSelected = false;
    }
  }

  selectSubject(subject) {
    // Tell the rest of the app which subject is selected.
    this.subjectSelected = subject;
    this.assignmentSelected = false;  // Reset assignment when switching subs
    this.addingAssignment = false;
  }

  selectAssignment(assignment) {
    this.assignmentSelected = assignment;
  }

  reloadAssignments(assignment) {
    this.reloadAssignmentsFlag = !this.reloadAssignmentsFlag;
    this.addingAssignment = false;  // Turn off add assignment
    this.editingAssignment = false;
    // this.selectAssignment(assignment);
  }

  toggleQuick() {
    this.quickEntry = !this.quickEntry;
  }
}
