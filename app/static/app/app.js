angular
    .module('Marks', ['xeditable', 'ngRoute', 'restangular', 'ui.bootstrap'])
    .config(config);

function config($routeProvider, RestangularProvider) {
    'use strict';

    // Set Routes
    $routeProvider
        .when('/gradebook', {
            templateUrl: 'static/app/gradebook/gradebook.html',
            controller: 'GbookCtrl',
            controllerAs: 'vm',
            reloadOnSearch: false,
            resolve: {DataFactory: function(DataFactory) {return DataFactory}
            }
            })
        .when('/admin', {
            templateUrl: 'static/app/admin/admin.html',
            controller: 'AdminCtrl',
            controllerAs: 'admin',
            reloadOnSearch: false,
            resolve: {DataFactory: function(DataFactory) {return DataFactory}
            }
            })
        .otherwise({
            redirectTo: '/gradebook'
        });

    // Restangular setup
    RestangularProvider.setBaseUrl('/api');
    RestangularProvider.setResponseExtractor(function(response, operation) {
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