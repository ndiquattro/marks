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

  activate(params) {
    // Check if we are changing subjects
    let changeSubject = false;
    if (this.current.subject) {
      if (this.current.subject.id !== Number(params.subject)) {
        changeSubject = true;
      }
    } else {
      changeSubject = true;
    }

    // If there is a subject and we are changing, get new info
    if (params.subject && changeSubject) {
      this.api.findOne('subjects', params.subject).then(data => {
        this.current.setSubject(data);
      });
    }

    if (!params.subject && this.current.subject) {
      this.current.clearSubject();
    }

    if (params.assignment) {
      this.api.findOne('assignments', params.assignment).then(data => {
        this.current.setAssignment(data);
        this.current.setAssignmentList(data.date);
      });
    }
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
    this.api.delete(this.current.assignment)
            .then(data => this.ea.publish('reloadAssignments'));

    this.current.clearAssignment();
  }

  toggleQuick() {
    this.quickEntry = !this.quickEntry;
  }
}
