(function () {
  'use strict';

  angular
      .module('Marks')
      .controller('GbookCtrl', GbookCtrl);

  GbookCtrl.$inject = ['gbookData', 'seshService', '$location', '$scope'];

  function GbookCtrl(gbookData, seshService, $location, $scope) {
    var vm = this;

    vm.subjects = [];
    vm.quickmode = false;
    vm.isActiveSub = isActiveSub;
    vm.setQuick = setQuick;
    vm.setSub = setSub;
    vm.quickAddAssm = quickAddAssm;

    activate();

    // Update based on URL
    $scope.$on('$routeUpdate', setNav);

    // Functions
    function activate() {
      setNav();
      vm.cyearid = seshService.activeyear.id;
      getSubjects();
    };

    function getSubjects() {
      var qobj = {
        filters: [{"name": "yearid", "op": "eq", "val": vm.cyearid}],
        order_by: [{"field": "name", "direction": "asc"}]
      };
      gbookData.Subjects.getList({q: qobj})
          .then(function (data) {
            vm.subjects = data;
          });
    };

    function isActiveSub(subid) {
      if (vm.csub == subid) {
        return 'active'
      }
    };

    function quickAddAssm(subid) {
      $location.search({'ccat': 'Assignments', 'sub': subid})
      $location.path('/admin');
    };

    function setNav() {
      var search = $location.search();
      vm.csub = search.csub;
      vm.cassm = search.cassm;
    };

    function setQuick() {
      vm.quickmode = !vm.quickmode;
    };

    function setSub(id) {
      $location.search({csub: id, cassm: null});
    };

  };
})();