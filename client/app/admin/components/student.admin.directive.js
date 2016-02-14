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

      vm.edit = false;
      vm.studata = {};
      vm.students = [];

      vm.addStu = addStu;
      vm.delStu = delStu;
      vm.editStu = editStu;
      vm.isEdit = isEdit;
      vm.setClass = setClass;

      activate();

      // Functions
      function activate() {
        vm.cyearid = seshService.activeyear.id;
        getStudents();
        defaultText();
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

      function delStu(student) {
        student.remove();
        getStudents();
      };

      function defaultText() {
        vm.title = "Add";
        vm.btxt = "Add Student";
      }

      function editStu(stu) {
        if (vm.edit === stu.id) {
          vm.edit = false;
          vm.studata = {};
          defaultText();
        } else {
          vm.edit = stu.id;
          vm.studata = stu;
          vm.title = "Edit";
          vm.btxt = "Save Changes";
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

      function isEdit(id) {
        if (id === vm.edit) {
          return 'active'
        }
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