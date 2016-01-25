angular
    .module('Marks')
    .directive('navbar', navbar);

function navbar() {
  var directive = {
    restrict: 'E',
    templateUrl: "static/app/layout/nav.tmpl.html",
    controller: NavBarCtrl,
    controllerAs: 'nav',
  };
  return directive;

  function NavBarCtrl(DataFactory, $location) {
    var vm = this;

    // Active tab function
    vm.isActive = function (route) {
      return route === $location.path()
    };

    // Get Active year info manually because we are outside of route
    DataFactory.CurYear()
        .then(function (data) {
          vm.activeYear = data.data.data;
        });
  };
};
