(function() {
  'use strict';

  angular
      .module('Marks')
      .filter('perView', perView)
      .filter('showName', showName);

  function perView() {
    return function(input, max) {
      if (input === null) {
        return "NA"
      } else {
        var deci = (input / max) * 100;
        return +(Math.round(deci + "e+1") + "e-1") + '%'
      }
    }
  };

  function showName() {
    return function (input) {
      if (input.unique !== null) {
        if (input.unique >= input.last_name.length) {
          return input.first_name + " " + input.last_name
        } else if (input.unique === 0) {
          return input.first_name + " " + input.last_name[0] + "."
        } else {
          return input.first_name + " " +
              input.last_name.substring(0, input.unique + 1) + "."
        }
      } else {
        return input.first_name
      }
    };
  };
})();