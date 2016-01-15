// Initiate app
angular.module('Marks', ['xeditable', 'ngRoute', 'restangular'])
    .config(function ($routeProvider, RestangularProvider) {
        'use strict';

        // Set Routes
        $routeProvider
            .when('/gradebook', {
                templateUrl: 'static/views/gradebook.html',
                controller: 'GbookCtrl',
                controllerAs: 'gbook',
                reloadOnSearch: false,
                activetab: 'gbook',
                resolve: {GbookFactory: function(GbookFactory) {
                    return GbookFactory;
                    }
                }
            })
            .when('/admin', {
                templateUrl: 'static/views/admin.html',
                controller: 'AdminCtrl',
                controllerAs: 'admin',
                reloadOnSearch: false,
                activetab: 'admin'
            }).otherwise({
                redirectTo: '/gradebook'
        });


        // configure restangular
        RestangularProvider.setBaseUrl('/api');

        // configure the response extractor for each request
        RestangularProvider.setResponseExtractor(function(response, operation) {
          // This is a get for a list
          var newResponse;
          if (operation === 'getList') {
            // Return the result objects as an array and attach the metadata
            newResponse = response.objects;
            newResponse.metadata = {
              numResults: response.num_results,
              page: response.page,
              totalPages: response.total_pages
            };
          } else {
            // This is an element
            newResponse = response;
          }
          return newResponse;
        });

    }).run(function(editableOptions, $rootScope){
        editableOptions.theme = 'bs3';
        $rootScope.$on('$routeChangeError', function(event, current, previous, rejection){
            console.log(event, current, previous, rejection)
        })
});