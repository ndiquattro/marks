angular
    .module('Marks')
    .controller('AdminCtrl', AdminCtrl);

function AdminCtrl($scope, $location) {
    'use strict';
    var vm = this;

    // Initiate Variables
    vm.cats = ['Years', 'Students', 'Subjects', 'Assignments'];
    vm.ccat = [];

    // Update based on URL
    $scope.$on('$routeUpdate', function() {
        var search = $location.search();
        vm.ccat = search.ccat;
    });

    // Select category
    vm.selectCat = function(clickedcat) {
        // Update URL
        $location.search({ccat: clickedcat});
    };

    // Check active
    vm.isActive = function(cat) {
        return vm.ccat === cat
    };
};