(function() {
  'use strict';

  angular
      .module('Marks')
      .directive('assmView', assmView);

  function assmView() {
    var directive = {
      restrict: 'E',
      scope: {},
      templateUrl: 'client/app/gradebook/components/assignmentview.tmpl.html',
      controller: AssmViewCtrl,
      controllerAs: 'vm',
      bindToController: {csub: '=', cassm: '='}
    };

    return directive;

    AssmViewCtrl.$inject = ['gbookData', '$scope', '$location']

    function AssmViewCtrl(gbookData, $scope, $location) {
      var vm = this;

      vm.delAssm = delAssm;
      vm.editAssm = editAssm;
      vm.isActiveAssign = isActiveAssign;
      vm.setAssm = setAssm;

      // Watch for changes in current subject
      $scope.$watch('vm.csub', activate);

      // Functions
      function activate() {
        if (vm.csub !== undefined) {
          getAssignments(vm.csub);
        }
      };

      function delAssm(assm) {
        // Remove scores associated with this assignment
        var qobj = {
            filters: [{"name": "assignid", "op": "eq", "val": assm.id}]};
        gbookData.Scores.getList({q: qobj}).then(function(scores) {
          scores.forEach(function(score) {score.remove()})
        })

        // Remove assignment
        assm.remove();

        // Clear cassm and reactivate
        $location.search({cassm: null});
        activate();
      };

      function editAssm(assm) {
        $location.search({ccat: "Assignments", eassm: assm.id});
        $location.path('/admin');
      };

      function getAssignments(subjid) {
        // Grab data
        if (subjid === null) {
          var qobj = {
            filters: [{"name": "subjid", "op": "is_null"}],
            order_by: [{"field": "date", "direction": "desc"}]};
        } else {
          var qobj = {
            filters: [{"name": "subjid", "op": "eq", "val": subjid}],
            order_by: [{"field": "date", "direction": "desc"}]};
        };

        gbookData.Assignments.getList({q: qobj})
            .then(function(data) {
              vm.assignments = data;
            });
      };

      function isActiveAssign(assmid) {
        if (assmid === Number(vm.cassm)) {
          return 'info'
        }
      };

      function setAssm(id) {
        if ($location.path() !== '/admin') {
          $location.search({csub: vm.csub, cassm: id});
          vm.cassm = id;
        }
      };

    };
  };
})();