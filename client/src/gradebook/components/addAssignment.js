import {inject} from 'aurelia-framework';
import {bindable} from 'aurelia-templating';
import {EventAggregator} from 'aurelia-event-aggregator';
import {CurrentService} from '../services/currentService';
import {ApiService} from '../services/apiService';

@inject(ApiService, CurrentService, EventAggregator)
export class AddAssignment {
  @bindable mode;

  constructor(api, current, eventaggregator) {
    this.api = api;
    this.current = current;
    this.ea = eventaggregator;
  }

  created() {
    this.newAssignment = {};
  }

  bind() {
    // Set title
    if (this.mode === 'edit') {
      this.title = 'Edit Assignment';
      this.btn = 'Save Changes';
      this.newAssignment = this.current.assignment;
    } else {
      this.title = 'Add Assignment';
      this.btn = this.title;
    }
  }

  detached() {
    this.newAssignment = {};
  }

  submitAssignment() {
    if (this.mode === 'edit') {
      // Update Assignment Information
      this.api.update('assignments', this.current.assignment.id, this.current.assignment);

      // Turn off edit mode
      this.mode = false;
    } else {
      // Fill in subject ID
      this.newAssignment.subjid = this.current.subject.id;

      // Add assignment information to database
      this.api.add('assignments', this.newAssignment)
              .then(data => {
                this.ea.publish('reloadAssignments');

                // Clear Binds and Select
                this.current.setAssignment(data);
                this.mode = false;
              });
    }
  }

  cancel() {
    this.mode = false;
  }
}
