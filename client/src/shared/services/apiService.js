import {HttpClient} from 'aurelia-http-client';
import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-auth';
import {HttpService} from 'shared/services/httpService';
import {User} from 'shared/models/user';
import {Year} from 'gradebook/models/year';
import {Student} from 'gradebook/models/student';
import {Subject} from 'gradebook/models/subject';
import {Assignment} from 'gradebook/models/assignment';
import {Score} from 'gradebook/models/score';
import moment from 'moment';

@inject(HttpClient, AuthService, HttpService)
export class ApiService {
  constructor(http, auth, httpserv) {
    // Configure client
    http.configure(config => {
      config
        .withBaseUrl('http://localhost:5000/api/')
        .withHeader('Authorization', 'Bearer ' + auth.auth.getToken())
        .withInterceptor({
          request(request) {
            // get token
            let token = auth.getTokenPayload();

            // Check if token will expire soon
            console.log(moment.unix(token.exp).diff(moment(), 'minutes'))
            if (moment.unix(token.exp).diff(moment(), 'minutes') < 1) {
              return httpserv.refreshToken()
                             .then(response => {
                               // Save new Token
                               console.log(response);
                               auth.setToken(response);
                             }).catch(error => {
                               // Delete Token and redirect to login
                               console.log(error);
                               //auth.logout()
                             });
            }
            return request;
          },
          // Parse every response to objects
          response(message) {
            // Check if this is a delete response
            if (message.statusCode === 204) {
              return message;
            }

            // Parse response and api source
            let parsed = JSON.parse(message.response);
            let source = message.requestMessage.url.split('/')[0];

            // If list, convert each object to model
            if (parsed.objects) {
              parsed.objects = parsed.objects.map(item => new modelMap[source](item));
              return parsed;
            }
            return new modelMap[source](parsed);
          }
        });
    });

    // Set
    this.http = http;
  }

  find(source, query) {
    return this.http.createRequest(source)
                    .asGet()
                    .withParams({q: JSON.stringify(query)})
                    .send();
  }

  findOne(source, id) {
    return this.http.createRequest(source + '/' + id)
                    .asGet()
                    .send();
  }

  save(model) {
    if (model.id) {
      return this.http.createRequest(model.source + '/' + model.id)
                      .asPut()
                      .withContent(model)
                      .send();
    }

    return this.http.createRequest(model.source)
                    .asPost()
                    .withContent(model)
                    .send();
  }

  delete(model) {
    return this.http.createRequest(model.source + '/' + model.id)
                    .asDelete()
                    .send();
  }
}

// Map for model creation
const modelMap = {'users': User,
                  'years': Year,
                  'students': Student,
                  'subjects': Subject,
                  'assignments': Assignment,
                  'scores': Score};
