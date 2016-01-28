angular
    .module('Marks')
    .directive('addAssm', addAssm);

function addAssm() {
  var directive = {
    restrict: 'E',
    templateUrl: '/static/app/admin/components/addassignment.tmpl.html',
    controller: addAssmCtrl,
    controllerAs: 'vm'
  };
  return directive;

  function addAssmCtrl(DataFactory, $location) {
    var vm = this;

    var curyear = DataFactory.activeYear.id;
    vm.adata = {};
    vm.subjects = [];
    vm.types = ['Points', 'Checks'];
    vm.addAssm = addAssm;
    vm.setClass = setClass;

    getSubjects();

    // Functions
    function addAssm() {
      // Post New Assignment Info
      DataFactory.Assignments.post(vm.adata)
          .then(function(newassm) {

            // Get Students
            var qobj = {
              filters: [{"name": "yearid", "op": "eq", "val": curyear}]
            };
            DataFactory.Students.getList({q: qobj})
                .then(function(students) {

                  students.plain().forEach(function(student) {
                    DataFactory.Scores.post({stuid: student.id,
                      assignid: newassm.id, value: 0});

                  });
                  $location.search({'csub': vm.adata.subjid,
                    'cassm': newassm.id})
                  $location.path('/gradebook')
                });
          });
    };

    function getSubjects() {
      var qobj = {
      filters: [{"name": "yearid", "op": "eq", "val": curyear}],
      order_by: [{"field": "name", "direction": "asc"}]
      };

      DataFactory.Subjects.getList({q: qobj})
          .then(function(data){
            vm.subjects = data;
            setDefault();
          });
    };

    function setClass(form) {
      if (form.$valid) {

        return 'has-success'

      } else  if (form.$invalid && form.$touched) {

        return 'has-error'

      }
    };

    function setDefault() {
      var params = $location.search();
      if (params.sub) {
        vm.adata.subjid = params.sub;
      }
    };
  };
}