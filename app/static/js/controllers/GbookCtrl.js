angular.module('Marks')
    .controller('GbookCtrl',
        function GbookCtrl (GbookFactory, Restangular,$location,
                            $scope) {
            'use strict';
            var gbook = this;

            // Initiate Variables
            var curyear = GbookFactory.activeYear.id;
            gbook.subjects = [];
            gbook.assignments = [];
            gbook.scores = [];

            // Update based on URL
            $scope.$on('$routeUpdate', function(){
                var search = $location.search();
                gbook.csub = search.csub;
                gbook.cassm = search.cassm;
            });

            // Get Subject list to start
            GbookFactory.getSubjects(curyear)
                .success(function(data) {
                    gbook.subjects = data.objects;
                });

            // Functions to grab data on demand
            gbook.getAssignments = function(subjid) {
                // Update URL
                $location.search({csub: subjid, cassm: null});

                // Grab data
                GbookFactory.getAssignments(subjid, curyear)
                    .success(function(data) {
                        gbook.assignments = data.objects;
                    });
            };

            gbook.getScores = function(assmid) {
                // Update URL
                $location.search('cassm', assmid);

                // Grab data
                GbookFactory.getScores(assmid)
                    .success(function(data) {
                        gbook.scores = data.objects;
                    });

            };

            // Data Update Functions
            gbook.upScore = function(data, scrid) {
                GbookFactory.upScore(data, scrid)
            };

        });