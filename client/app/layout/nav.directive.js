(function() {
  'use strict';

  angular
      .module('Marks')
      .directive('navbar', navBar);

  function navBar() {
    var directive = {
      restrict: 'E',
      templateUrl: "client/app/layout/nav.tmpl.html",
      controller: NavBarCtrl,
      controllerAs: 'vm',
    };

    return directive;

    NavBarCtrl.$inject = ['seshService', '$location'];

    function NavBarCtrl(seshService, $location) {
      var vm = this;

      vm.activeYear = {};
      vm.isActive = isActive;

      activate();

      // Functions
      function activate() {
        getActiveYear();
      };

      function getActiveYear() {
        seshService.curYear().then(function(data) {
          vm.activeYear = data.data;
        });
      };

      function isActive(route) {
        if (route === $location.path()) {
          return 'active'
        };
      };

    };
  };
})();
