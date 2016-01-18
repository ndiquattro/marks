angular
    .module('Marks')
    .controller('GbookCtrl', GbookCtrl);

function GbookCtrl(DataFactory, $location, $scope) {
    'use strict';
    var vm = this;

    vm.subjects = [];
    vm.isActiveSub = isActiveSub;
    vm.assignments = [];
    vm.isActiveAssign = isActiveAssign;
    vm.getAssignments = getAssignments;
    vm.scores = [];
    vm.getScores = getScores;
    vm.upScore = upScore;

    // Activate View
    var curyear = DataFactory.activeYear.id;
    setNav();
    getSubjects();

    // Update based on URL
    $scope.$on('$routeUpdate', setNav);

    // Functions
    function setNav() {
        var search = $location.search();
        vm.csub = search.csub;
        vm.cassm = search.cassm;
    };

    function isActiveSub(subid) {
        return vm.csub === subid;
    };

    function isActiveAssign(assmid) {
        return vm.cassm === assmid;
    };

    function getSubjects() {
        var qobj = {filters: [{"name": "yearid", "op":"eq", "val": curyear}],
                    order_by: [{"field": "name", "direction": "asc"}]};
        DataFactory.Subjects.getList({q: qobj})
            .then(function(data) {
                vm.subjects = data;
            });
    };

    function getAssignments(subjid) {
        // Update URL
        $location.search({csub: subjid, cassm: null});

        // Grab data
        var qobj = {filters: [{"name": "subjid", "op":"eq", "val": subjid}],
                    order_by: [{"field": "date", "direction": "desc"}]};
        DataFactory.Assignments.getList({q: qobj})
            .then(function(data) {
                vm.assignments = data;
            });
    };

    function getScores(assmid) {
        // Update URL
        $location.search('cassm', assmid);

        // Grab data
        var qobj = {filters: [{"name": "assignid", "op":"eq", "val": assmid}],
                    order_by: [{"field": "studref__first_name", "direction": "asc"}]};
        DataFactory.Scores.getList({q: qobj})
            .then(function(data) {
                vm.scores = data;
            })
    };

    function upScore(data, scrid) {
        var score = DataFactory.Scores.one(scrid).get()
            .then(function(score) {
                score.value = data;
                score.save();
            });
    };
};