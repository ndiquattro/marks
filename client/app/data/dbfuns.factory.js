(function() {
  'use strict';

  angular
      .module('Marks')
      .factory('dbFuns', dbFuns);

  dbFuns.$inject = ['$http'];

  function dbFuns($http) {
    // Factory object
    var fact = {
      uniqueCheck: uniqueCheck
    };

    return fact;

    function uniqueCheck(id) {
      $http.post('/dbfunctions/_uniquecheck/' + id)
    };
  };
})();