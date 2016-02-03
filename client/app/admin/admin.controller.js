(function() {
  'use strict';

  angular
      .module('Marks')
      .controller('AdminCtrl', AdminCtrl);

  AdminCtrl.$inject = ['$scope', '$location'];

  function AdminCtrl($scope, $location) {
    var vm = this;

    vm.cats = ['Years', 'Students', 'Subjects', 'Assignments'];
    vm.ccat = [];
    vm.isActive = isActive;
    vm.selectCat = selectCat;

    // Update based on URL
    setNav();
    $scope.$on('$routeUpdate', function() {
      setNav();
    });

    // Functions
    function isActive(cat) {
      return vm.ccat === cat
    };

    function selectCat(clickedcat) {
      $location.search({ccat: clickedcat});
    };

    function setNav() {
      vm.ccat = $location.search().ccat;
    };
  };
})();