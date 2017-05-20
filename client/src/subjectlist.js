import {HttpClient} from 'aurelia-http-client';

export class SubjectList {
  constructor() {
    this.http = new HttpClient();
    this.subjects = [];
  }

    created() {
      this.http.get('http://localhost:5000/api/subjects').then(data => {
        this.subjects = JSON.parse(data.response).objects;
        // this.subjects = items.objects;
    });
    };

    select(contact) {
      this.selectedId = contact.id;
      return true;
    }
}
