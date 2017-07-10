import {HttpClient} from 'aurelia-http-client';
import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-auth';
import {User} from 'shared/models/user';
import {Year} from 'gradebook/models/year';
import {Student} from 'gradebook/models/student';
import {Subject} from 'gradebook/models/subject';

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
                  'subjects': Subject};
