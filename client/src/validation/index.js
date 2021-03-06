import './rules';
import {BootstrapFormRenderer} from './bootstrap-form-renderer';

export function configure(config) {
  config.plugin('aurelia-validation');

  config.container.registerHandler('bootstrap-form', container => container.get(BootstrapFormRenderer));
}
