import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export class FirstTime {
  constructor(router) {
    this.router = router;
  }

  created() {
    this.completed = [];
    this.todo = ['Introduction', 'Setup Profile', 'Years', 'Students', 'Subjects'];
    this.totalsteps = this.todo.length;
    this.progress = 0;

    this.activeStep = 'Introduction';
  }

  nextStep() {
    this.completed.push(this.todo.shift());
    this.activeStep = this.todo[0];

    this.progress = (this.completed.length / this.totalsteps) * 100;

    if (this.todo.length === 0) {
      setTimeout(() => {
        this.router.navigate('gradebook');
      }, 1000);
    }
  }
}
