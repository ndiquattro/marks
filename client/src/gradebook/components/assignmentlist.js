import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {CurrentService} from 'shared/services/currentService';
import moment from 'moment';

@inject(CurrentService, EventAggregator)
export class AssignmentList {
  constructor(current, eventaggregator) {
    // Injects
    this.current = current;
    this.ea = eventaggregator;
  }

  attached() {
    // Populate List
    if (!this.current.assignment) {
      this.listWeek = moment().startOf('isoweek');
      this.current.setAssignmentList(this.listWeek);
    } else {
      this.listWeek = moment(this.current.assignment.date).startOf('isoweek');
      this.current.setAssignmentList(this.current.assignment.date);
    }

    // Set up Subscriptions
    this.subsub = this.ea.subscribe('subjectSet', resp => {
      this.current.setAssignmentList(this.current.assignment.date);
    });

    this.reload = this.ea.subscribe('reloadAssignments', resp => {
      this.current.setAssignmentList(this.current.assignment.date);
    });
  }

  jumpWeek() {
    console.log('changedate')
    this.current.setAssignmentList(this.listWeek).then(date => {
      this.listWeek = date.startOf('isoweek');
    });
  }

  detached() {
    this.subsub.dispose();
    this.reload.dispose();
  }
}
