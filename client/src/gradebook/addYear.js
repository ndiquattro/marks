import {inject} from 'aurelia-framework';
import {ValidationControllerFactory} from 'aurelia-validation';
import {CurrentService} from 'shared/services/currentService';
import {ApiService} from 'shared/services/apiService';
import {Year} from 'gradebook/models/year';

@inject(CurrentService, ApiService, ValidationControllerFactory)
export class AddYear {
  newYear = new Year();

  constructor(current, api, controllerFactory) {
    this.current = current;
    this.api = api;
    this.controller = controllerFactory.createForCurrentScope();
  }

  created() {
    this.title = 'Add Year';
    this.bttn = 'Add Year';
    this.setYearList();
    this.formStart = true;
  }

  reset() {
    this.controller.reset();
    this.newYear = new Year();
    this.formStart = true;
    this.title = 'Add Year';
    this.bttn = 'Add Year';
  }

  setYearList() {
    let query = {
      order_by: [{'field': 'first_day', 'direction': 'desc'}]
    };

    this.api.find('years', query)
            .then(data => this.years = data)
            .catch(error => console.log(error));
  }

  edit(year) {
    this.newYear = year;
    this.title = 'Edit Year';
    this.bttn = 'Save Changes';
  }

  delete(year) {
    let confirmed = confirm('Are you sure you want to delete ' + year.school + ' (' + year.first_day + ')' + '?');

    if (confirmed) {
      this.api.delete(year)
              .then(data => this.setYearList())
              .catch(error => console.log(error));
    }
  }

  submit() {
    // Check for validaiton
    this.controller.validate().then(result => {
      if (!result.valid) {
        return;
      }

      // Save or Add
      this.api.save(this.newYear)
              .then(resp => {
                if (!this.current.year || this.newYear.id === this.current.year.id) {
                  this.current.setYear(resp);
                }
                this.setYearList();
                this.reset();  // Refresh year list to get update
              })
              .catch(error => console.log(error));
    });
  }
}
