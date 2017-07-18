import {inject} from 'aurelia-framework';
import {selectpicker} from 'bootstrap-select';

const defaultOptions = {
  // style: 'btn btn-primary btn-simple',
  // size: false
};

@inject(Element)
export class BootstrapSelectCustomAttribute {
  constructor(element) {
    this.element = element;
  }

  attached() {
    let options = Object.assign({}, defaultOptions, this.value || {});
    $(this.element).selectpicker(options);
  }

  detached() {
    $(this.element).selectpicker('destroy');
  }
}
