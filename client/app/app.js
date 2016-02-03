(function() {
  'use strict';

  angular
      .module('Marks', ['xeditable', 'ngRoute', 'restangular', 'ui.bootstrap',
        'ngMessages'])
      .config(config);

  config.$inject = ['$routeProvider', 'RestangularProvider'];

  function config($routeProvider, RestangularProvider) {
    // Set Routes
    $routeProvider
        .when('/gradebook', {
          templateUrl: 'client/app/gradebook/gradebook.html',
          controller: 'GbookCtrl',
          controllerAs: 'vm',
          reloadOnSearch: false,
          resolve: {seshService: function(seshService) { return seshService; }}
        })
        .when('/admin', {
          templateUrl: 'client/app/admin/admin.html',
          controller: 'AdminCtrl',
          controllerAs: 'vm',
          reloadOnSearch: false,
          resolve: {seshService: function(seshService) { return seshService; }}
        })
        .otherwise({
          redirectTo: '/gradebook'
        });

    // Restangular setup
    RestangularProvider.setBaseUrl('/api');
    RestangularProvider.setResponseExtractor(function (response, operation) {
      var newResponse;
      if (operation === 'getList') {

        newResponse = response.objects;
        newResponse.metadata = {
          numResults: response.num_results,
          page: response.page,
          totalPages: response.total_pages
        };
      } else {
        newResponse = response;
      }

      return newResponse;
    });
  };
})();