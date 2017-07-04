import {HttpClient} from 'aurelia-http-client';
import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-auth';

@inject(HttpClient, AuthService)
export class ApiService {
  constructor(http, auth) {
    // Configure client
    http.configure(config => {
      config
        .withBaseUrl('http://localhost:5000/api/')
        .withHeader('Authorization', 'Bearer ' + auth.auth.getToken())
        .withInterceptor({
          // Parse every response to objects
          response(message) {
            if (message.statusCode !== 204) {
              return JSON.parse(message.response);
            }
          }
        });
    });

    // Set
    this.http = http;
  }

  find(source, query) {
    let req = this.http.createRequest(source)
                       .asGet();

    if (query) {
      req = req.withParams({q: JSON.stringify(query)});
    }

    return req.send();
  }

  findOne(source, id) {
    return this.http.createRequest(source + '/' + id).asGet().send();
  }

  update(source, id, newvals) {
    return this.http.createRequest(source + '/' + id)
                    .asPut()
                    .withContent(newvals)
                    .send();
  }

  add(source, newitem) {
    return this.http.createRequest(source)
                    .asPost()
                    .withContent(newitem)
                    .send();
  }

  delete(source, id) {
    return this.http.createRequest(source + '/' + id)
                    .asDelete()
                    .send();
  }
}
