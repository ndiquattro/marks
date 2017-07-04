import {inject} from 'aurelia-framework';
import {CurrentService} from 'shared/services/currentService';
import {AuthService, AuthorizeStep} from 'aurelia-auth';

@inject(CurrentService, AuthService)
export class App {
  configureRouter(config, router) {
    config.title = 'Marks';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
      // Main Nav routes
      { route: '/', moduleId: './home/index', nav: 0, title: 'Welcome', auth: false },
      { route: 'gradebook', moduleId: './gradebook/index', nav: 1, title: 'Gradebook', name: 'gradebook', auth: true},
      { route: 'reports', moduleId: './reports/index', nav: 2, title: 'Reports', auth: true},

      // User Managment
      { route: 'password/:token?', moduleId: './home/user/password', title: 'Password Managment'},

      // Signup Routes
      { route: 'payment', moduleId: './home/signup/payment', title: 'Setup Payment', name: 'payment', auth: true },
      { route: 'profile', moduleId: './home/signup/profile', title: 'Setup Profile', auth: true },
      { route: 'admin',  moduleId: './admin/index', title: 'Administration', name: 'admin', auth: true},

      // Add Routes
      { route: 'admin/addsubject',  moduleId: './admin/components/addSubject', title: 'Add Subject', name: 'addsubject', auth: true},
      { route: 'admin/addstudent',  moduleId: './admin/components/addStudent', title: 'Add Student', name: 'addstudent', auth: true},
      { route: 'admin/addyear',  moduleId: './admin/components/addYear', title: 'Add Year', name: 'addyear', auth: true}

    ]);

    this.router = router;
  }

  constructor(current, auth) {
    this.current = current;
    this.auth = auth;
  }

  activate() {
    this.reviveUser();
  }

  reviveUser() {
    if (this.auth.isAuthenticated()) {
      let token = this.auth.getTokenPayload();
      this.current.reviveUser(token.identity);
    }
  }
}
