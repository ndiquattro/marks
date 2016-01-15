angular.module('Marks')
    .directive('navbar', function () {

    return {
        restrict: 'E',
        scope: false,
        templateUrl: "static/js/directives/nav.tmpl.html",
        controllerAs: 'nav',

        controller: function (GbookFactory, $location) {
            var nav = this;

            // Active tab function
            nav.isActive = function(route) {
                return route === $location.path()
            };

            // Get Active year info
            GbookFactory.curYear().then(function(data) {
                    nav.activeYear = data.data.data;
                });
        },

    }
});
