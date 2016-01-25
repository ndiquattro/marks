angular
    .module('Marks')
    .directive('assmView', assmView);

function assmView() {
  var directive = {
    restrict: 'E',
    scope: {},
    templateUrl: '/static/app/gradebook/components/assmview.tmpl.html',
    controller: assmViewCtrl,
    controllerAs: 'vm',
    bindToController: {csub: '=', cassm: '='}
  };
  return directive;

  function assmViewCtrl($scope, $location, DataFactory) {
    var vm = this;

    vm.isActiveAssign = isActiveAssign;
    vm.setAssm = setAssm;

    $scope.$watch('vm.csub', function() {
      getAssignments(vm.csub);
    });

    // Functions
    function isActiveAssign(assmid) {
      return vm.cassm === assmid;
    };

    function getAssignments(subjid) {
      // Grab data
      var qobj = {
        filters: [{"name": "subjid", "op": "eq", "val": subjid}],
        order_by: [{"field": "date", "direction": "desc"}]
      };
      DataFactory.Assignments.getList({q: qobj})
          .then(function (data) {
            vm.assignments = data;
          });
    };

    function setAssm(id) {
      // Update URL
      $location.search({csub: vm.csub, cassm: id});
      vm.cassm = id;
    };

  };
};
