angular
    .module('Marks')
    .controller('GbookCtrl', GbookCtrl);

function GbookCtrl(DataFactory, $location, $scope) {
  'use strict';
  var vm = this;

  vm.subjects = [];
  vm.setSub = setSub;
  vm.isActiveSub = isActiveSub;
  vm.setQuick = setQuick;
  vm.quickmode = false;
  vm.quickAddAssm = quickAddAssm;

  // Update based on URL
  setNav();
  $scope.$on('$routeUpdate', function() {
    setNav();
  });

  // Activate View
  var curyear = DataFactory.activeYear.id;
  getSubjects();

  // Functions
  function isActiveSub(subid) {
    return vm.csub === subid;
  };

  function setSub(id) {
    // Update URL
    $location.search({csub: id, cassm: null});
  };

  function getSubjects() {
    var qobj = {
      filters: [{"name": "yearid", "op": "eq", "val": curyear}],
      order_by: [{"field": "name", "direction": "asc"}]
    };
    DataFactory.Subjects.getList({q: qobj})
        .then(function (data) {
          vm.subjects = data;
        });
  };

  function setQuick() {
    vm.quickmode = !vm.quickmode;
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
};