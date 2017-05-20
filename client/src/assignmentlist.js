import {HttpClient} from 'aurelia-http-client';
import {bindable} from "aurelia-framework";

export class AssignmentList {
  @bindable curSub;

  constructor() {
    this.http = new HttpClient();
    this.assignments = [];
  }

  activate(curSub){
    this.assignments = [curSub, curSub];
    console.log(curSub);
  }

    created() {
      this.http.get('http://localhost:5000/api/assignments').then(data => {
        // this.assignments = JSON.parse(data.response).objects;
        this.assignments = JSON.parse(data.response);
    });
    };

}
