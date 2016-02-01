angular
    .module('Marks')
    .directive('addStudent', addStudent);

function addStudent() {
  var directive = {
    restrict: 'E',
    templateUrl: '/static/app/admin/components/addstudent.tmpl.html',
    controller: addStudentCtrl,
    controllerAs: 'stu'
  };
  return directive;

  function addStudentCtrl(DataFactory) {
    var vm = this;

    var curyear = DataFactory.activeYear.id;
    vm.studata = {};
    vm.students = [];

    vm.addStu = addStu;
    vm.delStu = delStu;
    vm.setClass = setClass;

    getStudents();

    // Functions
    function getStudents() {
      var qobj = {
      filters: [{"name": "yearid", "op": "eq", "val": curyear}],
      order_by: [{"field": "first_name", "direction": "asc"}]
      };

      DataFactory.Students.getList({q: qobj})
          .then(function(data){
            vm.students = data;
          });
    };

    function addStu() {
      vm.studata.yearid = curyear;
      DataFactory.Students.post(vm.studata);
      DataFactory.uniqueCheck(curyear);
      vm.studata = {};
      getStudents();
      vm.StudentForm.$setPristine();
      vm.StudentForm.$setUntouched();

    };

    function delStu(id) {
      var student = DataFactory.Students.one(id).get()
          .then(function(student){
            student.remove();
            getStudents();
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