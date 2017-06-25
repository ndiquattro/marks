import {HttpClient} from 'aurelia-http-client';
import {inject} from 'aurelia-framework';

@inject(HttpClient)
export class ApiService {
  constructor(http) {
    // Configure client
    http.configure(config => {
      config
        .withBaseUrl('http://localhost:5000/api/')
        .withInterceptor({
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
    let req = this.http.createRequest(source).asGet();

    if (query) {
      req = req.withParams({q: JSON.stringify(query)});
    }

    return req.send();
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
