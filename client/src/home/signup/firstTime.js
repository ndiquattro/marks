import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export class FirstTime {
  constructor(router) {
    this.router = router;
  }

  created() {
    this.completed = [];
    this.todo = ['Introduction', 'Profile', 'Years', 'Students', 'Subjects'];

    this.activeStep = 'Introduction';
  }

  nextStep(step) {
    if (step !== this.activeStep) {
      return;
    }

    this.completed.push(this.todo.shift());
    this.activeStep = this.todo[0];

    if (this.todo.length === 0) {
      setTimeout(() => {
        this.router.navigate('gradebook');
      }, 800);
    }
  }
}
