angular
    .module('Marks')
    .factory('DataFactory', DataFactory);

function DataFactory($http, Restangular) {
    // Factory object
    var fact = {
        Years: Restangular.service('years'),
        Students: Restangular.service('students'),
        Subjects: Restangular.service('subjects'),
        Assignments: Restangular.service('assignments'),
        Scores: Restangular.service('scores'),
        CurYear: CurYear,
    };

    // Set Active Year
    fact.activeYear = {};
    $http.get('/api/_curyear').then(function(data) {
        fact.activeYear = data.data.data;
    });

    return fact;

    function CurYear() {
        return $http.get('/api/_curyear');
    }
};

