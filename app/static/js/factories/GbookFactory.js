angular.module('Marks')
    .factory('GbookFactory', function($http) {
        'use strict';
        var gfact = this;

        // Set active Year
        gfact.activeYear = {};
        $http.get('/api/_curyear').then(function(data) {
            gfact.activeYear = data.data.data;
        });

        gfact.curYear = function() {
            return $http.get('/api/_curyear');
        }

        // Get Data
        gfact.getSubjects = function (yearid) {
            var queryObject = {filters: [{"name": "yearid", "op":"eq", "val": yearid}]};
            return $http.get('/api/subjects', {params: {q: queryObject}});
        };

        gfact.getAssignments = function (subjid) {
            var queryObject = {filters: [{"name": "subjid", "op":"eq", "val": subjid}]};
            return $http.get('/api/assignments', {params: {q: queryObject}});
        };

        gfact.getScores = function (assmid) {
            var queryObject = {filters: [{"name": "assignid", "op":"eq", "val": assmid}]};
            return $http.get('/api/scores', {params: {q: queryObject}})
        };

        // Update Data
        gfact.upScore = function(data, scoreid) {
            return $http.put('/api/scores/'+ scoreid, {value: data});
        };

    return gfact;
    });

