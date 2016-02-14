(function() {
  'use strict';

  angular
      .module('Marks')
      .directive('quickEntry', quickEntry);

  function quickEntry() {
    var directive = {
      restrict: 'E',
      scope: {},
      templateUrl: 'client/app/gradebook/components/quickentry.tmpl.html',
      controller: QuickEntryCtrl,
      controllerAs: 'vm',
      bindToController: {cassm: '='}
    };

    return directive;

    QuickEntryCtrl.$inject = ['gbookData', '$scope', '$filter'];

    function QuickEntryCtrl(gbookData, $scope, $filter) {
      var vm = this;

      vm.assm = [];
      vm.entered = [];
      vm.scores = [];
      vm.assmType = assmType;
      vm.setClass = setClass;
      vm.setFocus = setFocus;
      vm.upScore = upScore;

      activate();

      // Functions
      function activate() {
        getScores(vm.cassm);
        getAssm(vm.cassm);
      };

      function assmType(type) {
        return type === vm.assm.type;
      };

      function getScores(assmid) {
        var qobj = {
          filters: [{"name": "assignid", "op": "eq", "val": assmid}],
          order_by: [{"field": "studref__first_name", "direction": "asc"}]
        };

        gbookData.Scores.getList({q: qobj})
            .then(function(data) {
              vm.scores = data;
            });

        // Set focus to name field
        $("#stu").focus();
      };

      function upScore(event) {
        // Check if the enter key has been pressed
        if (event.which === 13) {
          // Validate
          if (vm.EditForm.$valid) {
            // Reset Focus to name field
            $("#stu").focus();

            // Update the score in the database
            vm.newScore.value = vm.newValue;
            vm.newScore.save();

            // Move new score to the entered array
            vm.entered.push(vm.newScore);
            vm.scores = vm.scores.filter(function(el) {
              return el.id !== vm.newScore.id
            });

            // Reset form
            vm.newScore = null;
            vm.newValue = null;
            vm.EditForm.$setPristine();
            vm.EditForm.$setUntouched();
          };
        };
      };

      function setFocus(event, id) {
        if (event.which === 13) {
          $(id).focus();

          if (vm.assm.type === 'Checks') {
            vm.newValue = 1;
            vm.upScore(event);
          };
        }
      };

      function setClass(form) {
        if (form.$valid) {
          return 'has-success'
        } else if (form.$invalid && form.$touched) {
          return 'has-error'
        }
      };

      function getAssm(id) {
        gbookData.Assignments.one(id).get()
            .then(function(assm) {
              vm.assm = assm;
              if (vm.assm.type == 'Points') {
                vm.valTitle = "Score";
              } else {
                vm.valTitle = "Checked";
              };
            });
      };

    };
  };
})();
