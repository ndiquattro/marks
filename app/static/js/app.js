// Initiate app
var app = angular.module('gradebook', ["xeditable"]);

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

// Grades Controller
app.controller('GradesCtrl', function($scope, $http){
    // Initate variables
    $scope.csub = 0;
    $scope.cassm = 0;

    // Get Subjects List
    $scope.subjects = [];
    $http.get('/api/subjects').success(function(data){
        $scope.subjects = data.objects;
    });

    // Get Assignments
    $scope.cassms = [];
    $scope.getassms = function(csub) {
        var queryObject = {filters: [{"name": "subjid", "op":"eq", "val": csub}]};
        $http.get('/api/assignments', {params: {q: queryObject}}).success(function (data) {
            $scope.cassms = data.objects;
        });
    };

    // Get Scores
    $scope.scores = [];
    $scope.getscores = function(cassm) {
        var queryObject = {filters: [{"name": "assignid", "op":"eq", "val": cassm}]};
        $http.get('/api/scores', {params: {q: queryObject}}).success(function (data) {
            $scope.scores = data.objects;
        });
    };

    // Update Score
    $scope.updateScore = function(data, scoreid){
        return $http.put('/api/scores/'+ scoreid, {value: data});
    };
});

// Admin Controller
app.controller('AdminCtrl', function($scope, $http){
    // Initiate Variables
    $scope.ccat = 0;
    $scope.cats = ['Years', 'Students', 'Subjects', 'Assignments'];
    $scope.stored = [];

    // Get stored
    $scope.getStored = function(clickedcat) {

        var url = '/api/' + clickedcat.toLowerCase();
        $http.get(url).success(function(data){
           $scope.stored = data.objects;
        });
    };



});