// Initiate app
(function(){
    var app = angular.module('gradebook', []);

    app.controller('SubjectsCtrl', ['$http', function($http){
        var subjects = this;
        subjects.subjects = [];

        $http.get('http://localhost:5000/view/').success(function(data){
            subjects.subjects = data.data;
        });
    }]);
})();
