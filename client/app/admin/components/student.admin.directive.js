(function() {
  'use strict';

  angular
      .module('Marks')
      .directive('addStudent', addStudent);

  function addStudent() {
    var directive = {
      restrict: 'E',
      templateUrl: 'client/app/admin/components/student.admin.tmpl.html',
      controller: StudentCtrl,
      controllerAs: 'vm'
    };

    return directive;

    StudentCtrl.$inject = ['gbookData', 'seshService', 'dbFuns'];

    function StudentCtrl(gbookData, seshService, dbFuns) {
      var vm = this;

      vm.studata = {};
      vm.students = [];

      vm.addStu = addStu;
      vm.delStu = delStu;
      vm.setClass = setClass;

      activate();

      // Functions
      function activate() {
        vm.cyearid = seshService.activeyear.id;
        getStudents();
      };

      function addStu() {
        vm.studata.yearid = vm.cyearid;
        gbookData.Students.post(vm.studata);
        dbFuns.uniqueCheck(vm.cyearid);
        vm.studata = {};
        getStudents();
        vm.StudentForm.$setPristine();
        vm.StudentForm.$setUntouched();
      };

      function delStu(id) {
        var student = gbookData.Students.one(id).get()
            .then(function(student) {
              student.remove();
              getStudents();
            });
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

      function setClass(form) {
        if (form.$valid) {
          return 'has-success'
        } else if (form.$invalid && form.$touched) {
          return 'has-error'
        };
      };

    };
  };
})();