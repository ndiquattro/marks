angular
    .module('Marks')
    .filter('PerView', PerView);

function PerView() {
  return function(input, max, type) {
    if (type == 'Points') {
      var deci = (input / max) * 100;
      return +(Math.round(deci + "e+2") + "e-2") + '%'
    } else {
      return input ? '\u2713' : '\u2718';
    }
  }
};

