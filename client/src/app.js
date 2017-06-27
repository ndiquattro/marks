import {inject} from 'aurelia-framework';
import {CurrentService} from 'shared/services/currentService';

@inject(CurrentService)
export class App {
  configureRouter(config, router) {
    config.title = 'Marks';
    config.map([
      { route: '', redirect: 'gradebook' },
      { route: 'gradebook', moduleId: './gradebook/index', nav: 1, title: 'Gradebook'},
      { route: 'reports', moduleId: './reports/index', nav: 2, title: 'Reports'},
      { route: 'admin',  moduleId: './admin/index', nav: 3, title: 'Administration'}
    ]);

    this.router = router;
  }

  constructor(current) {
    this.current = current;
  }
}
