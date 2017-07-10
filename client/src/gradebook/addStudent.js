import {inject} from 'aurelia-framework';
import {ValidationControllerFactory} from 'aurelia-validation';
import {CurrentService} from 'shared/services/currentService';
import {ApiService} from 'shared/services/apiService';
import {Student} from 'gradebook/models/student';

@inject(CurrentService, ApiService, ValidationControllerFactory)
export class AddStudent {
  newStudent = new Student();

  constructor(current, api, controllerFactory) {
    this.current = current;
    this.api = api;
    this.controller = controllerFactory.createForCurrentScope();
  }

  created() {
    this.title = 'Add Student';
    this.bttn = 'Add Student';
    this.students = [];

    // Get students
    this.setStudentList();
    this.formStart = true;
  }

  reset() {
    this.controller.reset();
    this.newStudent = new Student();
    this.title = 'Add Student';
    this.bttn = 'Add Student';
  }

  setStudentList() {
    let query = {
      filters: [{'name': 'year_id', 'op': 'eq', 'val': this.current.year.id}],
      order_by: [{'field': 'first_name', 'direction': 'asc'}]
    };

    this.api.find('students', query)
            .then(data => this.students = data);
  }

  edit(student) {
    this.newStudent = student;
    this.controller.reset();
    this.title = 'Edit Student';
    this.bttn = 'Save Changes';
  }

  delete(student) {
    let confirmed = confirm('Are you sure you want to delete ' + student.fullName + '?');

    if (confirmed) {
      this.api.delete(student)
              .then(data => this.setStudentList());
    }
  }

  submit() {
    this.controller.validate().then(result => {
      if (!result.valid) {
        return;
      }

      // Reset Focus
      this.formStart = true;

      // Add year_id if missing
      if (!this.newStudent.year_id) {
        this.newStudent.year_id = this.current.year.id;
      }

      // Save Changes
      this.api.save(this.newStudent).then(resp => {
        // Refresh Student list
        this.setStudentList();
        // Reset Form
        this.reset();
      });
    });
  }
}
