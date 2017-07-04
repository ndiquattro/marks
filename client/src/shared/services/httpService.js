import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import {AuthService} from 'aurelia-auth';

@inject(AuthService)
export class HttpService {
  constructor(auth) {
    this.http = new HttpClient();
    this.auth = auth;

    // Confg this http client
    this.http.configure(config => {
      config.withBaseUrl('http://localhost:5000/')
            .withInterceptor({
              // Parse every response to objects
              response(message) {
                return JSON.parse(message.response);
              }
            });
    });
  }

  send(url, body, withToken = false) {
    let req = this.http.createRequest(url)
                       .asPost()
                       .withContent(body);
    if (withToken) {
      req = req.withHeader('Authorization', 'Bearer ' + this.auth.auth.getToken());
    }

    return req.send();
  }
}
