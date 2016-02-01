angular
    .module('Marks')
    .directive('editScores', editScores);

function editScores() {
  var directive = {
    restrict: 'E',
    scope: {},
    templateUrl: '/static/app/gradebook/components/editscores.tmpl.html',
    controller: editScoresCtrl,
    controllerAs: 'vm',
    bindToController:{cassm: '='}
  };
  return directive;

  function editScoresCtrl($scope, $location, DataFactory) {
    var vm = this;

    vm.scores = [];
    vm.upScore = upScore;
    vm.togCheck = togCheck;
    vm.selectAll = selectAll;

    $scope.$watch('vm.cassm', function() {
      getScores(vm.cassm);
      getMaxScore(vm.cassm);
    });

    // Functions
    function getScores(assmid) {
      // Grab data
      var qobj = {
        filters: [{"name": "assignid", "op": "eq", "val": assmid}],
        order_by: [{"field": "studref__first_name", "direction": "asc"}]
      };
      DataFactory.Scores.getList({q: qobj})
          .then(function (data) {
            vm.scores = data;
          });
    };

    function upScore(data, scrid) {
      DataFactory.Scores.one(scrid).get()
          .then(function (score) {
            score.value = data;
            score.save();
          });
    };

    function selectAll(form) {
      var input = form.$editables[0].inputEl;
      setTimeout(function () { input.select(); }, 50);
    };

    function getMaxScore(assmid) {
      DataFactory.Assignments.one(assmid).get()
          .then(function(assm) {
            vm.max = assm.max;
            vm.type = assm.type;
          });
    };

    function togCheck(scrid) {
      DataFactory.Scores.one(scrid).get()
          .then(function (score) {
            score.value = !score.value;
            score.save();
          });
    }
  };

}
