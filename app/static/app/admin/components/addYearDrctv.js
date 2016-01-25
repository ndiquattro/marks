angular
    .module('Marks')
    .directive('addYear', addYear);

function addYear() {
  var directive = {
    restrict: 'E',
    templateUrl: '/static/app/admin/components/addyear.tmpl.html',
    controller: addYearCtrl,
    controllerAs: 'vm'
  };
  return directive;

  function addYearCtrl(DataFactory) {
    var vm = this;

    vm.pdata = {};
    vm.years = [];
    vm.addYear = addYear;
    vm.setNew = setNew;
    vm.setClass = setClass;
    vm.delYear = delYear;
    vm.selYear = selYear;

    getYears();

    // Functions
    function addYear() {
      DataFactory.Years.post(vm.pdata)
      vm.newYear = vm.pdata.year;
      vm.pdata = {};
      getYears();
      vm.YearForm.$setPristine();
      vm.YearForm.$setUntouched();
    };

    function getYears() {
      var qobj = {q: {order_by: [{"field": "year", "direction": "desc"}]}};
      DataFactory.Years.getList(qobj)
          .then(function (years) {
            vm.years = years;
          });
    }

    function setClass(form) {
      if (form.$valid) {

        return 'has-success'

      } else  if (form.$invalid && form.$touched) {

        return 'has-error'

      }
    };

    function setNew(date) {
      return Date.parse(date) === Date.parse(vm.newYear);
    }

    function delYear(id) {
      DataFactory.Years.one(id).get()
          .then(function(year) {
            year.remove();
            getYears();
          });
    };

    function selYear(id) {
      DataFactory.SetYear(id);
    };

  };
}