(function() {
  'use strict';

  angular
      .module('Marks')
      .factory('gbookData', gbookData);

  gbookData.$inject = ['$http', 'Restangular'];

  function gbookData($http, Restangular) {
    // Factory object
    var fact = {
      Years: Restangular.service('years'),
      Students: Restangular.service('students'),
      Subjects: Restangular.service('subjects'),
      Assignments: Restangular.service('assignments'),
      Scores: Restangular.service('scores')
    };

    return fact;
  };
})();
