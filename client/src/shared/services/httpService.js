import {inject} from 'aurelia-framework';
import {AureliaConfiguration} from 'aurelia-configuration';
import {HttpClient} from 'aurelia-http-client';
import {AuthService} from 'aurelia-auth';

@inject(AuthService, AureliaConfiguration)
export class HttpService {
  constructor(auth, aurconfig) {
    this.http = new HttpClient();
    this.auth = auth;

    // Confg this http client
    this.http.configure(config => {
      config.withBaseUrl(aurconfig.get('baseurl'))
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

  refreshToken() {
    return this.http.createRequest('auth/refresh_token')
                    .withHeader('Access-Control-Allow-Credentials', true)
                    .withCredentials('include')
                    .asPost()
                    .send();
  }
}
