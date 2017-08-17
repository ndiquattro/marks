import {inject} from 'aurelia-framework';
import {AureliaConfiguration} from 'aurelia-configuration';
import {HttpClient} from 'aurelia-http-client';
import {AuthService} from 'aurelia-auth';
import moment from 'moment';

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

  login(userInfo) {
    return this.http.createRequest('auth/login')
                    // .withHeader('Access-Control-Allow-Credentials', true)
                    .withCredentials('include')
                    .withContent(userInfo)
                    .asPost()
                    .send()
                    .then(response => {
                      this.auth.auth.setToken(response);
                      return response;
                    });
  }

  refreshToken() {
    // Get access token
    let token = this.auth.getTokenPayload();

    // Check if token exists
    if (!token) {
      return 'No Token';
    }

    // Check if token will expire soon
    if (moment.unix(token.exp).diff(moment(), 'minutes') < 1) {
      return this.http.createRequest('auth/refresh_token')
                      .withHeader('X-CSRF-TOKEN', document.cookie.split('=')[1])
                      .withCredentials('include')
                      .asPost()
                      .send()
                      .then(response => {
                        // Save new Token
                        this.auth.auth.removeToken();
                        this.auth.auth.setToken(response, 5);
                        console.log('new token set');
                      }).catch(error => {
                        // Delete Token and redirect to login
                        console.log('Refresh Token Failed');
                        console.log(error);
                        this.auth.auth.logout();
                      });
    }

    return Promise.resolve('Valid');
  }
}
