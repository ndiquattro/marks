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

    function YearCtrl(gbookData, seshService) {
      var vm = this;

      vm.pdata = {};
      vm.years = [];
      vm.addYear = addYear;
      vm.delYear = delYear;
      vm.selYear = selYear;
      vm.setClass = setClass;
      vm.setNew = setNew;

      activate();

      // Functions
      function activate() {
        getYears();
      };

      function addYear() {
        gbookData.Years.post(vm.pdata);
        vm.newYear = vm.pdata.year;
        vm.pdata = {};
        getYears();
        vm.YearForm.$setPristine();
        vm.YearForm.$setUntouched();
      };

      function delYear(id) {
        gbookData.Years.one(id).get()
            .then(function (year) {
              year.remove();
              getYears();
            });
      };

      function getYears() {
        var qobj = {q: {order_by: [{"field": "year", "direction": "desc"}]}};
        gbookData.Years.getList(qobj)
            .then(function (years) {
              vm.years = years;
            });
      };

      function selYear(id) {
        seshService.setYear(id);
      };

      function setClass(form) {
        if (form.$valid) {
          return 'has-success'
        } else if (form.$invalid && form.$touched) {
          return 'has-error'
        };
      };

      function setNew(date) {
        return Date.parse(date) === Date.parse(vm.newYear);
      };
    };
  };
})();