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

        getYears();

        // Functions
        function addYear() {
            DataFactory.Years.post(vm.pdata)
            vm.pdata = {};
            getYears();
        };

        // Get Years
        function getYears() {
            var qobj = {q: {order_by: [{"field": "year", "direction":"desc"}]}};
            DataFactory.Years.getList(qobj)
                .then(function(years) {
                    vm.years = years;
                });
        }
    };
}