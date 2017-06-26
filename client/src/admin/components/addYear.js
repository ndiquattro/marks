import {inject} from 'aurelia-framework';
import {CurrentService} from '../../gradebook/services/currentService';
import {ApiService} from '../../gradebook/services/apiService';

@inject(CurrentService, ApiService)
export class AddYear {
  constructor(current, api) {
    this.current = current;
    this.api = api;
    this.mode = 'add';
  }

  attached() {
    this.newYear = {};
    this.mode = 'add';
    this.title = 'Year';
    this.bttn = 'Add Year';
    this.setYearList();
  }

  setYearList() {
    let query = {
      order_by: [{'field': 'year', 'direction': 'desc'}]
    };

    this.api.find('years', query)
            .then(data => {
              this.years = data.objects;
            });
  }

  setYear(year) {
    this.current.setYear(year);
  }

  edit(year) {
    this.newYear = year;
    this.mode = 'edit';
    this.title = 'Edit Year';
    this.bttn = 'Save Changes';
  }

  cancel() {
    this.newYear = {};
    this.mode = 'add';
  }

  delete(year) {
    let confirmed = confirm('Are you sure you want to delete ' + year.school + ' (' + year.year + ')' + '?');

    if (confirmed) {
      this.api.delete('years', year.id)
              .then(data => this.setYearList());
    }
  }

  submitYear() {
    if (this.mode === 'edit') {
      this.api.update('years', this.newYear.id, this.newYear)
              .then(resp => {
                if (this.newYear.id === this.current.year.id) {
                  this.current.setYear(this.newYear);
                }
              });
    } else {
      this.api.add('years', this.newYear)
              .then(resp => {
                this.setYearList();
                this.setYear(resp);
              });
    }

    // reset
    this.newYear = {};
    this.mode = 'add';
  }
}
