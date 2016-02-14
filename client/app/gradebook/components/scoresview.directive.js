(function() {
  'use strict';

  angular
      .module('Marks')
      .directive('scoresView', scoresView);

  function scoresView() {
    var directive = {
      restrict: 'E',
      scope: {},
      templateUrl: 'client/app/gradebook/components/scoresview.tmpl.html',
      controller: ScoresViewCtrl,
      controllerAs: 'vm',
      bindToController: {cassm: '='}
    };

    return directive;

    ScoresViewCtrl.$inject = ['gbookData', '$scope', '$location'];

    function ScoresViewCtrl(gbookData, $scope, $location) {
      var vm = this;

      vm.scores = [];
      vm.checkCheck = checkCheck;
      vm.isType = isType;
      vm.selectAll = selectAll;
      vm.togCheck = togCheck;
      vm.upScore = upScore;

      activate();

      // Watch for changes
      $scope.$watch('vm.cassm', activate);

      // Functions
      function activate() {
        getScores(vm.cassm);
        getAssmInfo(vm.cassm);
      };

      function checkCheck(val) {
        if (val) {
          return 'glyphicon glyphicon-check'
        } else {
          return 'glyphicon glyphicon-unchecked'
        };
      };

      function getScores(assmid) {
        // Grab data
        var qobj = {
          filters: [{"name": "assignid", "op": "eq", "val": assmid}],
          order_by: [{"field": "studref__first_name", "direction": "asc"}]
        };
        gbookData.Scores.getList({q: qobj})
            .then(function (data) {
              vm.scores = data;
            });
      };

      function isType(type) {
        return type === vm.type;
      };

      function upScore(data, score) {
        score.value = data;
        score.save();
      };

      function selectAll(form) {
        var input = form.$editables[0].inputEl;
        setTimeout(function () {
          input.select();
        }, 50);
      };

      function getAssmInfo(assmid) {
        gbookData.Assignments.one(assmid).get()
            .then(function (assm) {
              vm.max = assm.max;
              vm.type = assm.type;
              if (vm.type == 'Points') {
                vm.valTitle = 'Score';
              } else {
                vm.valTitle = 'Checked';
              };
            });
      };

      function togCheck(score) {
        score.value = !score.value;
        score.save();
      };

    };
  };
})();
