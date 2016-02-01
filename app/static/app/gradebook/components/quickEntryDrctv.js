angular
    .module('Marks')
    .directive('quickEntry', quickEntry);

function quickEntry() {
  var directive = {
    restrict: 'E',
    scope: {},
    templateUrl: '/static/app/gradebook/components/quickentry.tmpl.html',
    controller: quickEntryCtrl,
    controllerAs: 'vm',
    bindToController: {cassm: '='}
  };
  return directive;

  function quickEntryCtrl($scope, $filter, DataFactory) {
    var vm = this;

    vm.scores = [];
    vm.upScore = upScore;
    vm.entered = [];
    vm.setFocus = setFocus;
    vm.setClass = setClass;
    vm.assm = getAssm(vm.cassm);

    getScores(vm.cassm);
    getMaxScore(vm.cassm);

    function getScores(assmid) {
      // Grab data
      var qobj = {
        filters: [{"name": "assignid", "op": "eq", "val": assmid}],
        order_by: [{"field": "studref__first_name", "direction": "asc"}]
      };

      DataFactory.Scores.getList({q: qobj})
          .then(function (data) {
            vm.scores = data;
          })

      // Set focus
      $("#stu").focus();
    };

    function upScore(event) {
      // Check if the enter key has been pressed
      if (event.which === 13) {

        // Validate
        if (vm.EditForm.$valid) {

          // Reset Focus
          $("#stu").focus();

          // Update the score in the database
          DataFactory.Scores.one(vm.newScore.id).get()
              .then(function(score) {
                // Update Scores
                score.value = vm.newValue;
                vm.newScore.value = vm.newValue;
                score.save();

                // Move this score to the entered array
                vm.entered.push(vm.newScore);
                vm.scores = vm.scores.filter(function (el) {
                  return el.id !== vm.newScore.id
                });

                // Clear Model data
                vm.newScore = null;
                vm.newValue = null;
                vm.EditForm.$setPristine();
                vm.EditForm.$setUntouched();
              });
        };
      }
    }

    function setFocus(event, id) {
      if (event.which === 13) {
        $(id).focus();

        if (vm.assm.type === 'Checks') {
          vm.newValue = 1;
          vm.upScore(event);
        }
      }
    };

    function getMaxScore(assmid) {
      DataFactory.Assignments.one(assmid).get()
          .then(function(assm) {
            vm.max = assm.max;
          });
    };

    function setClass(form) {
      if (form.$valid) {
        return 'has-success'
      } else if (form.$invalid && form.$touched) {
        return 'has-error'
      }
    };

    function getAssm(id) {
      DataFactory.Assignments.one(id).get()
          .then(function(assm) {
            vm.assm = assm;
          })
    }

  };
};
