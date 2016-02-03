(function() {
  'use strict';

  angular
      .module('Marks')
      .directive('addYear', addYear);

  function addYear() {
    var directive = {
      restrict: 'E',
      templateUrl: 'client/app/admin/components/year.admin.tmpl.html',
      controller: YearCtrl,
      controllerAs: 'vm'
    };

    return directive;

    YearCtrl.$inject = ['gbookData', 'seshService'];

    function YearCtrl(gbookData, seshService, $window) {
      var vm = this;

      vm.edit = false;
      vm.pdata = {};
      vm.years = [];
      vm.addYear = addYear;
      vm.delYear = delYear;
      vm.editYear = editYear;
      vm.isNew = isNew;
      vm.isEdit = isEdit;
      vm.selYear = selYear;
      vm.setClass = setClass;

      activate();

      // Functions
      function activate() {
        getYears();
        vm.formtitle = "Add";
        vm.btext = "Add Year";
      };

      function addYear() {
        if (vm.edit) {
          gbookData.Years.one(vm.pdata.id).get().then(function(year) {
            year.school = vm.pdata.school;
            year.year = vm.pdata.year;
            year.put();
            vm.edit = false;
            activate();
            clearForm();
          });
        } else {
          gbookData.Years.post(vm.pdata).then(function(year) {
            vm.newYear = year.id;
          });
          getYears();
          clearForm();
        };
      };

      function clearForm() {
        vm.pdata = {};
        vm.YearForm.$setPristine();
        vm.YearForm.$setUntouched();
      };

      function delYear(year) {
        year.remove();
        getYears();
      };

      function editYear(year) {
        vm.edit = year.id;
        vm.formtitle = "Edit";
        vm.btext = "Save Changes";
        vm.pdata.year = new Date(year.year);
        vm.pdata.school = year.school;
        vm.pdata.id = year.id;
      };

      function getYears() {
        var qobj = {q: {order_by: [{"field": "year", "direction": "desc"}]}};
        gbookData.Years.getList(qobj)
            .then(function (years) {
              vm.years = years;
            });
      };

      function isNew(yearid) {
        if (yearid === vm.newYear) {
          return 'success'
        }
      };

      function isEdit(yearid) {
        if (yearid === vm.edit){
          return 'active'
        }
      };

      function selYear(id) {
        seshService.setYear(id);
        $window.location.reload();
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