(function() {
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

      vm.subdata = {};
      vm.subjects = [];
      vm.addSub = addSub;
      vm.delSub = delSub;
      vm.setClass = setClass;

      activate();

      // Functions
      function activate() {
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

      function addSub() {
        vm.subdata.yearid = vm.cyearid;
        gbookData.Subjects.post(vm.subdata);
        vm.subdata = {};
        getSubjects();
        vm.SubjectForm.$setPristine();
        vm.SubjectForm.$setUntouched();
      };

      function delSub(id) {
        gbookData.Subjects.one(id).get()
            .then(function(subject) {
              subject.remove();
              getSubjects();
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
  }
})();