import {inject} from 'aurelia-framework';
import {CurrentService} from 'shared/services/currentService';
import {HttpService} from 'shared/services/httpService';
import {AuthService, AuthorizeStep} from 'aurelia-auth';
// import 'bootstrap';

@inject(CurrentService, AuthService, HttpService)
export class App {
  configureRouter(config, router) {
    config.title = 'Marks';
    config.options.pushState = true;
    config.options.root = '/';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
      // Main Nav routes
      { route: '/', moduleId: './home/index', nav: 0, title: 'Welcome', auth: false },
      // { route: 'gradebook', moduleId: './gradebook/index', nav: 1, title: 'Gradebook', name: 'gradebook', auth: true},
      { route: 'gradebook/:subject?/:assignment?', moduleId: './gradebook/index', nav: 1, title: 'Gradebook', name: 'gradebook', auth: true, href: 'gradebook'},
      { route: '/contact', moduleId: './home/contact', title: 'Contact', auth: false },
      { route: '/tos_privacy', moduleId: './home/tos_privacy', title: 'Terms of Service & Privacy Policy', auth: false },

      // Reports
      { route: 'reports', redirect: 'gradebook'},
      { route: 'reports/student/:id', moduleId: './reports/student', title: 'Student Report', name: 'studentreport', auth: true},

      // User Managment
      { route: 'settings', redirect: 'settings/Profile'},
      { route: 'settings/:section?', moduleId: './admin/settings', title: 'Settings', name: 'settings', auth: true},
      { route: 'password/:token', moduleId: './admin/components/password', title: 'Reset Password'},

      // Signup Routes
      { route: 'payment', moduleId: './home/signup/payment', title: 'Setup Payment', name: 'payment', auth: true },
      { route: 'first_time', moduleId: './home/signup/firstTime', title: 'Gradebook Setup', name: 'firsttime', auth: true },

      // Add Routes
      { route: 'gradebook/addsubject',  moduleId: './gradebook/addSubject', title: 'Add Subject', name: 'addsubject', auth: true},
      { route: 'gradebook/addstudent',  moduleId: './gradebook/addStudent', title: 'Add Student', name: 'addstudent', auth: true},
      { route: 'gradebook/addyear',  moduleId: './gradebook/addYear', title: 'Add Year', name: 'addyear', auth: true}
    ]);

    this.router = router;
  }

  constructor(current, auth, http) {
    this.current = current;
    this.auth = auth;
    this.http = http;
  }

  activate() {
    this.reviveUser();
  }

  reviveUser() {
    if (this.auth.isAuthenticated()) {
      let token = this.auth.getTokenPayload();
      this.current.reviveUser(token.identity);
    } else {
      this.http.refreshToken();
    }
  }
}
