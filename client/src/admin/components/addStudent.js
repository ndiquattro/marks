import {inject} from 'aurelia-framework';
import {CurrentService} from '../../gradebook/services/currentService';
import {ApiService} from '../../gradebook/services/apiService';

@inject(CurrentService, ApiService)
export class AddStudent {
  constructor(current, api) {
    this.current = current;
    this.api = api;
  }

  attached() {
    this.mode = 'add';
    this.title = 'Add Student';
    this.bttn = 'Add Student';
    this.newStudent = {};
    this.students = [];

    // Get students
    this.setStudentList();
  }

  setStudentList() {
    let query = {
      filters: [{'name': 'yearid', 'op': 'eq', 'val': this.current.year.id}],
      order_by: [{'field': 'first_name', 'direction': 'asc'}]
    };

    this.api.find('students', query)
            .then(data => {
              this.students = data.objects;
            });
  }

  cancel() {
    this.mode = 'add';
    this.title = 'Add Student';
    this.bttn = 'Add Student';
    this.newStudent = {};
  }

  edit(student) {
    this.newStudent = student;
    this.mode = 'edit';

    this.title = 'Edit Student';
    this.bttn = 'Save Changes';
  }

  delete(student) {
    let confirmed = confirm('Are you sure you want to delete ' + student.first_name + ' ' + student.last_name + '?');

    if (confirmed) {
      this.api.delete('students', student.id)
              .then(data => this.setStudentList());
    }
  }

  submit() {
    if (this.mode === 'edit') {
      this.api.update('students', this.newStudent.id, this.newStudent)
              .then(resp => this.cancel());
    } else {
      // Add Current year
      this.newStudent.yearid = this.current.year.id;

      this.api.add('students', this.newStudent)
              .then(resp => this.attached());
    }
  }

}
