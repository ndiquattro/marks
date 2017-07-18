import {inject, bindable} from 'aurelia-framework';
import {ValidationControllerFactory} from 'aurelia-validation';
import {EventAggregator} from 'aurelia-event-aggregator';
import {CurrentService} from 'shared/services/currentService';
import {ApiService} from 'shared/services/apiService';
import {Assignment} from 'gradebook/models/assignment';
import moment from 'moment';

@inject(ApiService, CurrentService, EventAggregator, ValidationControllerFactory)
export class AddAssignment {
  @bindable mode;
  newAssignment = new Assignment({date: moment().format('YYYY-MM-DD')});

  constructor(api, current, eventaggregator, controllerFactory) {
    this.api = api;
    this.current = current;
    this.ea = eventaggregator;
    this.controller = controllerFactory.createForCurrentScope();
  }

  attached() {
    if (this.mode === 'edit') {
      this.newAssignment = this.current.assignment;
      this.title = 'Edit Assignment';
      this.btn = 'Save Changes';
    } else {
      this.title = 'Add Assignment';
      this.btn = this.title;
    }
  }

  modeChanged() {
    this.attached();
  }

  detached() {
    this.newAssignment = new Assignment({date: moment().format('YYYY-MM-DD')});
  }

  submit() {
    this.controller.validate().then(result => {
      if (!result.valid) {
        return;
      }

      if (!this.newAssignment.subject_id) {
        this.newAssignment.subject_id = this.current.subject.id;
      }

      this.api.save(this.newAssignment)
              .then(data => {
                this.ea.publish('assignmentAdded', data);
                this.mode = false;
                this.detached();
                this.current.navigateTo('gradebook', {subject: this.current.subject.id,
                                                      assignment: data.id});
              });
    });
  }

  cancel() {
    this.mode = false;
  }
}
