angular.module('Marks')
    .controller('AdminCtrl',
        function GbookCtrl ($http) {
            'use strict';

             // Initiate Variables
            this.ccat = 0;
            this.cats = ['Years', 'Students', 'Subjects', 'Assignments'];
            this.stored = [];

            // Get stored
            this.getStored = function(clickedcat) {
                var url = '/api/' + clickedcat.toLowerCase();
                $http.get(url).success().then(angular.bind(this, function then(data) {
                    this.stored = data.data;
                }) );
            };

        });