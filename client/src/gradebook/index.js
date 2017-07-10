import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {CurrentService} from 'shared/services/currentService';
import {ApiService} from 'shared/services/apiService';

@inject(CurrentService, ApiService, EventAggregator)
export class GradeBook {
  constructor(current, api, eventaggregator) {
    // Data Holders
    this.current = current;
    this.api = api;
    this.ea = eventaggregator;

    // Initalize Selection Indicators
    this.quickEntry = false;
    this.editMode = false;
  }

  created() {
    if (this.current.year) {
      this.current.setSubjectList();
    }
  }

  addAssignment() {
    // Flip on add assignment dialog
    this.current.clearAssignment();
    this.editMode = 'add';
  }

  editAssignment() {
    this.editMode = 'edit';
  }

  deleteAssignment() {
    // Confirm with User
    let confirmed = confirm('Are you sure you want to delete ' + this.current.assignment.name + '?');

    if (confirmed) {
      this.api.delete(this.current.assignment)
              .then(data => this.ea.publish('reloadAssignments'));

      this.current.clearAssignment();
    }
  }

  toggleQuick() {
    this.quickEntry = !this.quickEntry;
  }
}
