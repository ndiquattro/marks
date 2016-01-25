angular
    .module('Marks')
    .directive('addSubject', addSubject);

function addSubject() {
  var directive = {
    restrict: 'E',
    templateUrl: '/static/app/admin/components/addsubject.tmpl.html',
    controller: addSubjectCtrl,
    controllerAs: 'sub'
  };
  return directive;

  function addSubjectCtrl(DataFactory) {
    var vm = this;

    var curyear = DataFactory.activeYear.id;
    vm.subdata = {};
    vm.subjects = [];

    vm.addSub = addSub;
    vm.delSub = delSub;
    vm.setClass = setClass;

    getSubjects();

    // Functions
    function getSubjects() {
      var qobj = {
      filters: [{"name": "yearid", "op": "eq", "val": curyear}],
      order_by: [{"field": "name", "direction": "asc"}]
      };

      DataFactory.Subjects.getList({q: qobj})
          .then(function(data){
            vm.subjects = data;
          });
    };

    function addSub() {
      vm.subdata.yearid = curyear;
      DataFactory.Subjects.post(vm.subdata);
      vm.subdata = {};
      getSubjects();
      vm.SubjectForm.$setPristine();
      vm.SubjectForm.$setUntouched();
    };

    function delSub(id) {
      DataFactory.Subjects.one(id).get()
          .then(function(subject){
            subject.remove();
            getSubjects();
          })
    };

    function setClass(form) {
      if (form.$valid) {

        return 'has-success'

      } else  if (form.$invalid && form.$touched) {

        return 'has-error'

      }
    };
  };
}