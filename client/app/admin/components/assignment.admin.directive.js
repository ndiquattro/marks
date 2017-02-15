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

    AssmCtrl.$inject = ['gbookData', 'seshService', '$location', '$filter'];

    function AssmCtrl(gbookData, seshService, $location, $filter) {
      var vm = this;

      vm.adata = {subjid: null};
      vm.students = [];
      vm.subjects = [];
      vm.types = ['Points', 'Checks'];
      vm.addAssm = addAssm;
      vm.setClass = setClass;

      activate();

      // Functions
      function activate() {
        vm.cyearid = seshService.activeyear.id;
        defaultText();
        setDefault();
        getSubjects();
        getStudents();
      };

      function addAssm() {
        if (vm.edit) {
          gbookData.Assignments.one(vm.adata.id).get().then(function(assm) {
            assm = vm.adata;
            assm.put();
            vm.edit = false;
            redirect(vm.adata.id);
          });
        } else {
          // Post New Assignment Info
          vm.adata.date = new Date(vm.adata.date);
          gbookData.Assignments.post(vm.adata)
              .then(fillScores)
              .then(redirect);
        };
      };

      function defaultText() {
        vm.title = "Add";
        vm.btxt = "Add Assignment";
      };

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
            });
      };

      function setClass(form) {
        if (form.$valid) {
          return 'has-success'
        } else if (form.$invalid && form.$touched) {
          return 'has-error'
        }
      };

      function redirect(assmid) {
        $location.search({'csub': vm.adata.subjid, 'cassm': assmid})
        $location.path('/gradebook')
      };

      function setDefault() {
        var params = $location.search();
        if (params.sub) {
          vm.adata.subjid = params.sub;
        }
        if (params.eassm) {
          gbookData.Assignments.one(params.eassm).get().then(function(assm) {
            vm.edit = true;
            vm.adata = assm;
            vm.adata.date = $filter('date')(vm.adata.date, 'MMMM d, yyyy');
            vm.title = "Edit";
            vm.btxt = "Save Changes";
          })
        }
      };

    };
  }
})();