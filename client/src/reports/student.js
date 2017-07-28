import {inject} from 'aurelia-framework';
import {ValidationControllerFactory} from 'aurelia-validation';
import {CurrentService} from 'shared/services/currentService';
import {ApiService} from 'shared/services/apiService';

import moment from 'moment';

@inject(CurrentService, ApiService, ValidationControllerFactory)
export class StudentReport {
  constructor(current, api, controllerFactory) {
    this.current = current;
    this.api = api;
    this.controller = controllerFactory.createForCurrentScope();
  }

  activate(params) {
    let studentId = Number(params.id);
    this.selected = {'start': this.current.year.first_day, 'end': moment().format('YYYY-MM-DD')};
    this.api.findOne('students', studentId).then(data => {
      this.selected.student = data;
      this.generate();
    });
  }

  attached() {
    this.setStudentList();
    this.current.setSubjectList();
  }

  setStudentList() {
    let query = {
      filters: [{'name': 'year_id', 'op': 'eq', 'val': this.current.year.id}],
      order_by: [{'field': 'first_name', 'direction': 'asc'}]
    };

    this.api.find('students', query)
            .then(data => this.students = data.objects);
  }

  generate() {
    this.reportGenerated = false;

    let query = {
      filters: [{'name': 'student_id', 'op': 'eq', 'val': this.selected.student.id},
                {'name': 'assignment', 'op': 'has', 'val': {
                  'name': 'date', 'op': 'ge', 'val': this.selected.start}},
                  {'name': 'assignment', 'op': 'has', 'val': {
                    'name': 'date', 'op': 'le', 'val': this.selected.end}}],
      order_by: [{'field': 'assignment__date', 'direction': 'asc'}]
    };

    // Get data
    this.api.find('scores', query)
            .then(data => {
              this.scores = data.objects;
              this.reportGenerated = true;
            });
  }
}
