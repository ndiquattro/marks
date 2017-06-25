import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {CurrentService} from '../services/currentService';

@inject(CurrentService, EventAggregator)
export class AssignmentList {
  constructor(current, eventaggregator) {
    // Injects
    this.current = current;
    this.ea = eventaggregator;
  }

  attached() {
    // Populate List
    this.current.setAssignmentList();

    // Set up Subscriptions
    this.subsub = this.ea.subscribe('subjectSet', resp => this.current.setAssignmentList());
    this.reload = this.ea.subscribe('reloadAssignments', resp => this.current.setAssignmentList());
  }

  detached() {
    this.subsub.dispose();
    this.reload.dispose();
  }
}
