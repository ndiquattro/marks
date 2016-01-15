angular.module('Marks')
    .directive('subjects', function SubjectsDrctv () {
    'use strict';

    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: "static/js/directives/subjects.tmpl.html",
        controllerAs: 'subjects',

        controller: function (GbookFactory) {
            this.subjects = [];

            GbookFactory.getSubjects()
                .then(angular.bind(this, function then() {
                    this.subjects = GbookFactory.subjects;
                }) );
        },

        link: function(scope, element, attrs, ctrl) {

        }
    }
});
