(function () {
  'use strict';

  angular
      .module('Marks')
      .directive('addSubject', addSubject);

  function addSubject() {
    var directive = {
      restrict: 'E',
      templateUrl: 'client/app/admin/components/subject.admin.tmpl.html',
      controller: SubjectCtrl,
      controllerAs: 'vm'
    };

    return directive;

    SubjectCtrl.$inject = ['gbookData', 'seshService'];

    function SubjectCtrl(gbookData, seshService) {
      var vm = this;

      vm.edit = false;
      vm.subdata = {};
      vm.subjects = [];
      vm.addSub = addSub;
      vm.delSub = delSub;
      vm.editSub = editSub;
      vm.isEdit = isEdit;
      vm.setClass = setClass;

      activate();

      // Functions
      function activate() {
        vm.cyearid = seshService.activeyear.id;
        getSubjects();
        vm.title = "Add";
        vm.btxt = "Add Subject"
      };
      function addSub() {
        if (vm.edit) {
          gbookData.Subjects.one(vm.subdata.id).get().then(function(subj) {
            subj.name = vm.subdata.name;
            subj.put();
            vm.edit = false;
            activate();
            clearForm();
          })
        } else {
          vm.subdata.yearid = vm.cyearid;
          gbookData.Subjects.post(vm.subdata).then(function(sub) {
            vm.newSub = sub.id;
          });
          getSubjects();
          vm.edit = false;
          clearForm();
        };
      };

      function clearForm() {
        vm.subdata = {};
        vm.SubjectForm.$setPristine();
        vm.SubjectForm.$setUntouched();
      };

      function delSub(sub) {
        sub.remove();
        getSubjects();
      };

      function defaultText() {
        vm.title = "Add"
        vm.btxt = "Add Subject"
      };

      function editSub(sub) {
        if (vm.edit === sub.id) {
          vm.edit = false;
          vm.subdata = {};
          defaultText();
        } else {
          vm.edit = sub.id;
          vm.subdata = sub;
          vm.title = "Edit";
          vm.btxt = "Save Changes"
        };
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

      function isEdit(id) {
        if (id === vm.edit) {
          return 'active'
        }
      };

      function isNew(id) {
        if (id === vm.newSub) {
          return 'active'
        };
      };

      function setClass(form) {
        if (form.$valid) {
          return 'has-success'
        } else if (form.$invalid && form.$touched) {
          return 'has-error'
        }
        ;
      };

      function setNew(id) {

      };

    };
  };
})();