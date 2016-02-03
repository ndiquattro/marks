(function() {
  'use strict';

  angular
      .module('Marks')
      .directive('addAssm', addAssm);

  function addAssm() {
    var directive = {
      restrict: 'E',
      templateUrl: 'client/app/admin/components/assignment.admin.tmpl.html',
      controller: AssmCtrl,
      controllerAs: 'vm'
    };

    return directive;

    AssmCtrl.$inject = ['gbookData', 'seshService', '$location'];

    function AssmCtrl(gbookData, seshService, $location) {
      var vm = this;

      vm.adata = {};
      vm.students = [];
      vm.subjects = [];
      vm.types = ['Points', 'Checks'];
      vm.addAssm = addAssm;
      vm.setClass = setClass;

      activate();

      // Functions
      function activate() {
        vm.cyearid = seshService.activeyear.id;
        getSubjects();
        getStudents();
      };

      function addAssm() {
        // Post New Assignment Info
        gbookData.Assignments.post(vm.adata)
            .then(fillScores)
            .then(redirect);

            function fillScores(newassm) {
              vm.students.plain().forEach(function(student) {
                gbookData.Scores.post({
                  stuid: student.id,
                  assignid: newassm.id,
                  value: null
                });
              });
              return newassm.id
            };

            function redirect(assmid) {
              $location.search({'csub': vm.adata.subjid, 'cassm': assmid})
              $location.path('/gradebook')
            };
      };

      function getStudents() {
        var qobj = {
          filters: [{"name": "yearid", "op": "eq", "val": vm.cyearid}],
          order_by: [{"field": "first_name", "direction": "asc"}]
        };

        gbookData.Students.getList({q: qobj})
            .then(function(data) {
              vm.students = data;
            });
      };

      function getSubjects() {
        var qobj = {
          filters: [{"name": "yearid", "op": "eq", "val": vm.cyearid}],
          order_by: [{"field": "name", "direction": "asc"}]
        };

        gbookData.Subjects.getList({q: qobj})
            .then(function(data) {
              vm.subjects = data;
              setDefault();
            });
      };

      function setClass(form) {
        if (form.$valid) {
          return 'has-success'
        } else if (form.$invalid && form.$touched) {
          return 'has-error'
        }
      };

      function setDefault() {
        var params = $location.search();
        if (params.sub) {
          vm.adata.subjid = params.sub;
        }
      };

    };
  }
})();