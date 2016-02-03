(function() {
  'use strict';

  angular
      .module('Marks')
      .factory('seshService', seshService);

  seshService.$inject = ['$http'];

  function seshService($http) {
    // Factory object
    var fact = {
      curYear: curYear,
      setYear: setYear
    };

    activate();

    return fact;

    // Functions
    function activate() {
      curYear().then(function(year) {
        fact.activeyear = year.data;
      });
    };

    function curYear() {
      return $http.get('/sesh/_curyear');
    };

    function setYear(id) {
      $http.post('/sesh/_setyear/' + id);
    };
  };
})();