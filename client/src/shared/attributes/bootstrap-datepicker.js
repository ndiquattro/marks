import {inject} from 'aurelia-framework';
import datepicker from 'src/assets/js/bootstrap-datepicker.js';

const defaultOptions = {
  format: 'yyyy-mm-dd',
  color: 'blue'
};

@inject(Element)
export class BootstrapDatepickerCustomAttribute {
  constructor(element) {
    this.element = element;
  }

  attached() {
    let options = Object.assign({}, defaultOptions, this.value || {});
    $(this.element).datepicker(options).on('changeDate', e => fireEvent(e.target, 'change'));
  }

  detached() {
    $(this.element).datepicker('hide');
  }
}

function fireEvent(element, name) {
  let event = document.createEvent('Event');
  event.initEvent(name, true, true);
  element.dispatchEvent(event);
}
