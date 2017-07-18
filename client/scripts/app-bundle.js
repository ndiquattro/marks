define('app',['exports', 'aurelia-framework', 'shared/services/currentService', 'aurelia-auth'], function (exports, _aureliaFramework, _currentService, _aureliaAuth) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_currentService.CurrentService, _aureliaAuth.AuthService), _dec(_class = function () {
    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Marks';
      config.options.pushState = true;
      config.options.root = '/';
      config.addPipelineStep('authorize', _aureliaAuth.AuthorizeStep);
      config.map([{ route: '/', moduleId: './home/index', nav: 0, title: 'Welcome', auth: false }, { route: 'gradebook/:subject?/:assignment?', moduleId: './gradebook/index', nav: 1, title: 'Gradebook', name: 'gradebook', auth: true, href: 'gradebook' }, { route: 'reports', moduleId: './reports/index', nav: 2, title: 'Reports', auth: true }, { route: 'settings', moduleId: './admin/settings', title: 'Settings', name: 'settings', auth: true }, { route: 'password/:token', moduleId: './admin/components/password', title: 'Reset Password' }, { route: 'payment', moduleId: './home/signup/payment', title: 'Setup Payment', name: 'payment', auth: true }, { route: 'first_time', moduleId: './home/signup/firstTime', title: 'Gradebook Setup', name: 'firsttime', auth: true }, { route: 'gradebook/addsubject', moduleId: './gradebook/addSubject', title: 'Add Subject', name: 'addsubject', auth: true }, { route: 'gradebook/addstudent', moduleId: './gradebook/addStudent', title: 'Add Student', name: 'addstudent', auth: true }, { route: 'gradebook/addyear', moduleId: './gradebook/addYear', title: 'Add Year', name: 'addyear', auth: true }]);

      this.router = router;
    };

    function App(current, auth) {
      _classCallCheck(this, App);

      this.current = current;
      this.auth = auth;
    }

    App.prototype.activate = function activate() {
      this.reviveUser();
    };

    App.prototype.reviveUser = function reviveUser() {
      if (this.auth.isAuthenticated()) {
        var token = this.auth.getTokenPayload();
        this.current.reviveUser(token.identity);
      }
    };

    return App;
  }()) || _class);
});
define('authConfig',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var configForDevelopment = {
    baseUrl: 'http://localhost:5000/',
    loginRedirect: '#/gradebook'
  };

  var configForProduction = {};

  var config = void 0;
  if (window.location.hostname === 'localhost') {
    config = configForDevelopment;
  } else {
    config = configForProduction;
  }

  exports.default = config;
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment', './authConfig'], function (exports, _environment, _authConfig) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  var _authConfig2 = _interopRequireDefault(_authConfig);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('validation').globalResources(['shared/attributes/bootstrap-datepicker', 'shared/attributes/bootstrap-select', 'shared/attributes/tooltip', 'shared/converters/dateFormat', 'shared/converters/scoreFormat']).plugin('aurelia-auth', function (baseConfig) {
      baseConfig.configure(_authConfig2.default);
    });

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('admin/settings',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Settings = exports.Settings = function Settings() {
    _classCallCheck(this, Settings);
  };
});
define('gradebook/addStudent',['exports', 'aurelia-framework', 'aurelia-validation', 'shared/services/currentService', 'shared/services/apiService', 'gradebook/models/student'], function (exports, _aureliaFramework, _aureliaValidation, _currentService, _apiService, _student) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AddStudent = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AddStudent = exports.AddStudent = (_dec = (0, _aureliaFramework.inject)(_currentService.CurrentService, _apiService.ApiService, _aureliaValidation.ValidationControllerFactory), _dec(_class = function () {
    function AddStudent(current, api, controllerFactory) {
      _classCallCheck(this, AddStudent);

      this.newStudent = new _student.Student();

      this.current = current;
      this.api = api;
      this.controller = controllerFactory.createForCurrentScope();
    }

    AddStudent.prototype.created = function created() {
      this.title = 'Add Student';
      this.bttn = 'Add Student';
      this.students = [];

      this.setStudentList();
      this.formStart = true;
    };

    AddStudent.prototype.reset = function reset() {
      this.controller.reset();
      this.newStudent = new _student.Student();
      this.title = 'Add Student';
      this.bttn = 'Add Student';
    };

    AddStudent.prototype.setStudentList = function setStudentList() {
      var _this = this;

      var query = {
        filters: [{ 'name': 'year_id', 'op': 'eq', 'val': this.current.year.id }],
        order_by: [{ 'field': 'first_name', 'direction': 'asc' }]
      };

      this.api.find('students', query).then(function (data) {
        return _this.students = data;
      });
    };

    AddStudent.prototype.edit = function edit(student) {
      this.newStudent = student;
      this.controller.reset();
      this.title = 'Edit Student';
      this.bttn = 'Save Changes';
    };

    AddStudent.prototype.delete = function _delete(student) {
      var _this2 = this;

      var confirmed = confirm('Are you sure you want to delete ' + student.fullName + '?');

      if (confirmed) {
        this.api.delete(student).then(function (data) {
          return _this2.setStudentList();
        });
      }
    };

    AddStudent.prototype.submit = function submit() {
      var _this3 = this;

      this.controller.validate().then(function (result) {
        if (!result.valid) {
          return;
        }

        _this3.formStart = true;

        if (!_this3.newStudent.year_id) {
          _this3.newStudent.year_id = _this3.current.year.id;
        }

        _this3.api.save(_this3.newStudent).then(function (resp) {
          _this3.setStudentList();

          _this3.reset();
        });
      });
    };

    return AddStudent;
  }()) || _class);
});
define('gradebook/addSubject',['exports', 'aurelia-framework', 'aurelia-validation', 'shared/services/currentService', 'shared/services/apiService', 'gradebook/models/subject'], function (exports, _aureliaFramework, _aureliaValidation, _currentService, _apiService, _subject) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AddSubject = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AddSubject = exports.AddSubject = (_dec = (0, _aureliaFramework.inject)(_currentService.CurrentService, _apiService.ApiService, _aureliaValidation.ValidationControllerFactory), _dec(_class = function () {
    function AddSubject(current, api, controllerFactory) {
      _classCallCheck(this, AddSubject);

      this.newSubject = new _subject.Subject();

      this.current = current;
      this.api = api;
      this.controller = controllerFactory.createForCurrentScope();
    }

    AddSubject.prototype.created = function created() {
      this.title = 'Add Subject';
      this.bttn = 'Add Subject';
      this.current.setSubjectList();
      this.formStart = true;
    };

    AddSubject.prototype.reset = function reset() {
      this.title = 'Add Subject';
      this.bttn = 'Add Subject';
      this.formStart = true;
      this.newSubject = new _subject.Subject();
      this.controller.reset();
    };

    AddSubject.prototype.edit = function edit(subject) {
      this.controller.reset();
      this.newSubject = subject;
      this.formStart = true;
      this.title = 'Edit Subject';
      this.bttn = 'Save Changes';
    };

    AddSubject.prototype.delete = function _delete(subject) {
      var _this = this;

      var confirmed = confirm('Are you sure you want to delete ' + subject.name + '?');

      if (confirmed) {
        this.api.delete(subject).then(function (data) {
          return _this.current.setSubjectList();
        });
      }
    };

    AddSubject.prototype.submit = function submit() {
      var _this2 = this;

      this.controller.validate().then(function (result) {
        if (!result.valid) {
          return;
        }

        if (!_this2.newSubject.year_id) {
          _this2.newSubject.year_id = _this2.current.year.id;
        }

        _this2.api.save(_this2.newSubject).then(function (data) {
          _this2.current.setSubjectList();
          _this2.reset();
        });
      });
    };

    return AddSubject;
  }()) || _class);
});
define('gradebook/addYear',['exports', 'aurelia-framework', 'aurelia-validation', 'shared/services/currentService', 'shared/services/apiService', 'gradebook/models/year'], function (exports, _aureliaFramework, _aureliaValidation, _currentService, _apiService, _year) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AddYear = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AddYear = exports.AddYear = (_dec = (0, _aureliaFramework.inject)(_currentService.CurrentService, _apiService.ApiService, _aureliaValidation.ValidationControllerFactory), _dec(_class = function () {
    function AddYear(current, api, controllerFactory) {
      _classCallCheck(this, AddYear);

      this.newYear = new _year.Year();

      this.current = current;
      this.api = api;
      this.controller = controllerFactory.createForCurrentScope();
    }

    AddYear.prototype.created = function created() {
      this.title = 'Add Year';
      this.bttn = 'Add Year';
      this.setYearList();
      this.formStart = true;
    };

    AddYear.prototype.reset = function reset() {
      this.controller.reset();
      this.newYear = new _year.Year();
      this.formStart = true;
      this.title = 'Add Year';
      this.bttn = 'Add Year';
    };

    AddYear.prototype.setYearList = function setYearList() {
      var _this = this;

      var query = {
        order_by: [{ 'field': 'first_day', 'direction': 'desc' }]
      };

      this.api.find('years', query).then(function (data) {
        return _this.years = data;
      }).catch(function (error) {
        return console.log(error);
      });
    };

    AddYear.prototype.edit = function edit(year) {
      this.newYear = year;
      this.title = 'Edit Year';
      this.bttn = 'Save Changes';
    };

    AddYear.prototype.delete = function _delete(year) {
      var _this2 = this;

      var confirmed = confirm('Are you sure you want to delete ' + year.school + ' (' + year.first_day + ')' + '?');

      if (confirmed) {
        this.api.delete(year).then(function (data) {
          return _this2.setYearList();
        }).catch(function (error) {
          return console.log(error);
        });
      }
    };

    AddYear.prototype.submit = function submit() {
      var _this3 = this;

      this.controller.validate().then(function (result) {
        if (!result.valid) {
          return;
        }

        _this3.api.save(_this3.newYear).then(function (resp) {
          if (!_this3.current.year || _this3.newYear.id === _this3.current.year.id) {
            _this3.current.setYear(resp);
          }
          _this3.setYearList();
          _this3.reset();
        }).catch(function (error) {
          return console.log(error);
        });
      });
    };

    return AddYear;
  }()) || _class);
});
define('gradebook/index',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'shared/services/currentService', 'shared/services/apiService'], function (exports, _aureliaFramework, _aureliaEventAggregator, _currentService, _apiService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.GradeBook = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var GradeBook = exports.GradeBook = (_dec = (0, _aureliaFramework.inject)(_currentService.CurrentService, _apiService.ApiService, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function GradeBook(current, api, eventaggregator) {
      _classCallCheck(this, GradeBook);

      this.current = current;
      this.api = api;
      this.ea = eventaggregator;

      this.quickEntry = false;
      this.editMode = false;
    }

    GradeBook.prototype.activate = function activate(params) {
      var _this = this;

      var changeSubject = false;
      if (this.current.subject) {
        if (this.current.subject.id !== Number(params.subject)) {
          changeSubject = true;
        }
      } else {
        changeSubject = true;
      }

      if (params.subject && changeSubject) {
        this.api.findOne('subjects', params.subject).then(function (data) {
          _this.current.setSubject(data);
        });
      }

      if (!params.subject && this.current.subject) {
        this.current.clearSubject();
      }

      if (params.assignment) {
        this.api.findOne('assignments', params.assignment).then(function (data) {
          _this.current.setAssignment(data);
          _this.current.setAssignmentList(data.date);
        });
      }
    };

    GradeBook.prototype.created = function created() {
      if (this.current.year) {
        this.current.setSubjectList();
      }
    };

    GradeBook.prototype.addAssignment = function addAssignment() {
      this.current.clearAssignment();
      this.editMode = 'add';
    };

    GradeBook.prototype.editAssignment = function editAssignment() {
      this.editMode = 'edit';
    };

    GradeBook.prototype.deleteAssignment = function deleteAssignment() {
      var _this2 = this;

      this.api.delete(this.current.assignment).then(function (data) {
        return _this2.ea.publish('reloadAssignments');
      });

      this.current.clearAssignment();
    };

    GradeBook.prototype.toggleQuick = function toggleQuick() {
      this.quickEntry = !this.quickEntry;
    };

    return GradeBook;
  }()) || _class);
});
define('home/index',['exports', 'aurelia-framework', 'aurelia-router', 'aurelia-auth', 'aurelia-validation', 'shared/services/currentService', 'shared/models/user'], function (exports, _aureliaFramework, _aureliaRouter, _aureliaAuth, _aureliaValidation, _currentService, _user) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Home = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Home = exports.Home = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _aureliaAuth.AuthService, _currentService.CurrentService, _aureliaValidation.ValidationControllerFactory), _dec(_class = function () {
    function Home(router, auth, current, controllerFactory) {
      _classCallCheck(this, Home);

      this.newUser = new _user.User();

      this.router = router;
      this.auth = auth;
      this.current = current;
      this.controller = controllerFactory.createForCurrentScope();
    }

    Home.prototype.submitSignUp = function submitSignUp() {
      var _this = this;

      this.controller.validate().then(function (result) {
        if (!result.valid) {
          return;
        }

        _this.auth.signup(_this.newUser).then(function (resp) {
          _this.current.setUser(new _user.User(resp.user));

          _this.router.navigateToRoute('payment');
          location.reload();
        });
      });
    };

    return Home;
  }()) || _class);
});
define('reports/index',['exports', 'aurelia-framework', '../shared/services/currentService', '../shared/services/apiService'], function (exports, _aureliaFramework, _currentService, _apiService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Reports = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Reports = exports.Reports = (_dec = (0, _aureliaFramework.inject)(_currentService.CurrentService, _apiService.ApiService), _dec(_class = function () {
    function Reports(current, api) {
      _classCallCheck(this, Reports);

      this.current = current;
      this.api = api;
    }

    Reports.prototype.attached = function attached() {
      this.reports = ['Student'];
    };

    Reports.prototype.setReport = function setReport(report) {
      this.selectedReport = report;
    };

    return Reports;
  }()) || _class);
});
define('validation/bootstrap-form-renderer',['exports', 'aurelia-validation'], function (exports, _aureliaValidation) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BootstrapFormRenderer = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var BootstrapFormRenderer = exports.BootstrapFormRenderer = function () {
    function BootstrapFormRenderer() {
      _classCallCheck(this, BootstrapFormRenderer);
    }

    BootstrapFormRenderer.prototype.render = function render(instruction) {
      for (var _iterator = instruction.unrender, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref2 = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref2 = _i.value;
        }

        var _ref5 = _ref2;
        var result = _ref5.result,
            elements = _ref5.elements;

        for (var _iterator3 = elements, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
          var _ref6;

          if (_isArray3) {
            if (_i3 >= _iterator3.length) break;
            _ref6 = _iterator3[_i3++];
          } else {
            _i3 = _iterator3.next();
            if (_i3.done) break;
            _ref6 = _i3.value;
          }

          var element = _ref6;

          this.remove(element, result);
        }
      }

      for (var _iterator2 = instruction.render, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref4;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref4 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref4 = _i2.value;
        }

        var _ref7 = _ref4;
        var result = _ref7.result,
            elements = _ref7.elements;

        for (var _iterator4 = elements, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
          var _ref8;

          if (_isArray4) {
            if (_i4 >= _iterator4.length) break;
            _ref8 = _iterator4[_i4++];
          } else {
            _i4 = _iterator4.next();
            if (_i4.done) break;
            _ref8 = _i4.value;
          }

          var _element = _ref8;

          this.add(_element, result);
        }
      }
    };

    BootstrapFormRenderer.prototype.add = function add(element, result) {
      if (result.valid) {
        return;
      }

      var formGroup = element.closest('.form-group');
      if (!formGroup) {
        return;
      }

      formGroup.classList.add('has-error');

      var message = document.createElement('span');
      message.className = 'help-block validation-message';
      message.textContent = result.message;
      message.id = 'validation-message-' + result.id;
      formGroup.appendChild(message);
    };

    BootstrapFormRenderer.prototype.remove = function remove(element, result) {
      if (result.valid) {
        return;
      }

      var formGroup = element.closest('.form-group');
      if (!formGroup) {
        return;
      }

      var message = formGroup.querySelector('#validation-message-' + result.id);
      if (message) {
        formGroup.removeChild(message);

        if (formGroup.querySelectorAll('.help-block.validation-message').length === 0) {
          formGroup.classList.remove('has-error');
        }
      }
    };

    return BootstrapFormRenderer;
  }();
});
define('validation/index',['exports', './bootstrap-form-renderer', './rules'], function (exports, _bootstrapFormRenderer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {
    config.plugin('aurelia-validation');

    config.container.registerHandler('bootstrap-form', function (container) {
      return container.get(_bootstrapFormRenderer.BootstrapFormRenderer);
    });
  }
});
define('validation/rules',['aurelia-validation'], function (_aureliaValidation) {
  'use strict';

  _aureliaValidation.ValidationRules.customRule('date', function (value, obj) {
    return value === null || value === undefined || value === '' || !isNaN(Date.parse(value));
  }, '${$displayName} must be a valid date.');
});
define('admin/components/password',['exports', 'aurelia-framework', 'shared/services/httpService'], function (exports, _aureliaFramework, _httpService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Password = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Password = exports.Password = (_dec = (0, _aureliaFramework.inject)(_httpService.HttpService), _dec(_class = function () {
    function Password(http) {
      _classCallCheck(this, Password);

      this.http = http;
    }

    Password.prototype.activate = function activate(params) {
      if (params.token !== undefined) {
        this.token = params.token;
        this.reset = true;
      } else {
        this.reset = false;
      }
    };

    Password.prototype.attached = function attached() {
      this.password = {};
    };

    Password.prototype.resetPassword = function resetPassword() {
      var _this = this;

      this.password.token = this.token;

      this.http.send('auth/reset_password', this.password).then(function (resp) {
        if (resp.error) {
          _this.feedback = 'Error: ' + resp.error;
        } else {
          _this.feedback = 'Password Changed!';
        }
      });
    };

    Password.prototype.changePassword = function changePassword() {
      var _this2 = this;

      this.http.send('auth/change_password', this.password, true).then(function (resp) {
        return _this2.feedback = resp.message;
      });
    };

    return Password;
  }()) || _class);
});
define('admin/components/profile',['exports', 'aurelia-framework', 'aurelia-validation', 'shared/services/apiService', 'shared/services/currentService'], function (exports, _aureliaFramework, _aureliaValidation, _apiService, _currentService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Profile = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Profile = exports.Profile = (_dec = (0, _aureliaFramework.inject)(_currentService.CurrentService, _apiService.ApiService, _aureliaValidation.ValidationControllerFactory), _dec(_class = function () {
    function Profile(current, api, controllerFactory) {
      _classCallCheck(this, Profile);

      this.current = current;
      this.api = api;
      this.controller = controllerFactory.createForCurrentScope();
    }

    Profile.prototype.attached = function attached() {
      this.profile = this.current.user;
    };

    Profile.prototype.submit = function submit() {
      var _this = this;

      this.controller.validate().then(function (result) {
        if (!result.valid) {
          return;
        }
        _this.isSaving = true;
        _this.api.save(_this.profile).then(function (data) {
          _this.isSaving = false;
          _this.saved = true;
        });
      });
    };

    return Profile;
  }()) || _class);
});
define('assets/js/bootstrap-datepicker',[], function () {
	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
		return typeof obj;
	} : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	var color = '';
	!function ($) {

		var Datepicker = function Datepicker(element, options) {
			this.element = $(element);
			this.format = DPGlobal.parseFormat(options.format || this.element.data('date-format') || 'mm/dd/yyyy');
			this.picker = $(DPGlobal.template).appendTo('body').on({
				click: $.proxy(this.click, this) });
			this.isInput = this.element.is('input');
			this.component = this.element.is('.date') ? this.element.find('.add-on') : false;

			if (this.isInput) {
				this.element.on({
					focus: $.proxy(this.show, this),

					keyup: $.proxy(this.update, this)
				});
			} else {
				if (this.component) {
					this.component.on('click', $.proxy(this.show, this));
				} else {
					this.element.on('click', $.proxy(this.show, this));
				}
			}

			this.minViewMode = options.minViewMode || this.element.data('date-minviewmode') || 0;
			if (typeof this.minViewMode === 'string') {
				switch (this.minViewMode) {
					case 'months':
						this.minViewMode = 1;
						break;
					case 'years':
						this.minViewMode = 2;
						break;
					default:
						this.minViewMode = 0;
						break;
				}
			}
			this.viewMode = options.viewMode || this.element.data('date-viewmode') || 0;
			if (typeof this.viewMode === 'string') {
				switch (this.viewMode) {
					case 'months':
						this.viewMode = 1;
						break;
					case 'years':
						this.viewMode = 2;
						break;
					default:
						this.viewMode = 0;
						break;
				}
			}
			this.color = options.color || 'azure';
			this.startViewMode = this.viewMode;
			this.weekStart = options.weekStart || this.element.data('date-weekstart') || 0;
			this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;
			this.onRender = options.onRender;
			this.fillDow();
			this.fillMonths();
			this.update();
			this.showMode();
		};

		Datepicker.prototype = {
			constructor: Datepicker,

			show: function show(e) {
				var datepicker = this.picker;

				this.picker.show();
				this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
				this.place();
				$(window).on('resize', $.proxy(this.place, this));
				if (e) {
					e.stopPropagation();
					e.preventDefault();
				}
				if (!this.isInput) {}
				var that = this;
				$(document).on('mousedown', function (ev) {
					if ($(ev.target).closest('.datepicker').length == 0) {
						that.hide();
					}
				});
				this.element.trigger({
					type: 'show',
					date: this.date
				});

				setTimeout(function () {
					datepicker.addClass('open');
				}, 170);
			},

			hide: function hide() {
				var datepicker = this.picker;
				datepicker.removeClass('open');

				setTimeout(function () {
					datepicker.hide();
				}, 500);

				$(window).off('resize', this.place);
				this.viewMode = this.startViewMode;
				this.showMode();
				if (!this.isInput) {
					$(document).off('mousedown', this.hide);
				}

				this.element.trigger({
					type: 'hide',
					date: this.date
				});
			},

			set: function set() {
				var formated = DPGlobal.formatDate(this.date, this.format);
				if (!this.isInput) {
					if (this.component) {
						this.element.find('input').prop('value', formated);
					}
					this.element.data('date', formated);
				} else {
					this.element.prop('value', formated);
				}
			},

			setValue: function setValue(newDate) {
				if (typeof newDate === 'string') {
					this.date = DPGlobal.parseDate(newDate, this.format);
				} else {
					this.date = new Date(newDate);
				}
				this.set();
				this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
				this.fill();
			},

			place: function place() {
				var offset = this.component ? this.component.offset() : this.element.offset();
				this.picker.css({
					top: offset.top + this.height,
					left: offset.left
				});
			},

			update: function update(newDate) {
				this.date = DPGlobal.parseDate(typeof newDate === 'string' ? newDate : this.isInput ? this.element.prop('value') : this.element.data('date'), this.format);
				this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0);
				this.fill();
			},

			fillDow: function fillDow() {
				var dowCnt = this.weekStart;
				var html = '<tr>';
				while (dowCnt < this.weekStart + 7) {
					html += '<th class="dow">' + DPGlobal.dates.daysMin[dowCnt++ % 7] + '</th>';
				}
				html += '</tr>';
				this.picker.find('.datepicker-days thead').append(html);
			},

			fillMonths: function fillMonths() {
				var html = '';
				var i = 0;
				while (i < 12) {
					html += '<span class="month">' + DPGlobal.dates.monthsShort[i++] + '</span>';
				}
				this.picker.find('.datepicker-months td').append(html);
			},

			fill: function fill() {
				var d = new Date(this.viewDate),
				    year = d.getFullYear(),
				    month = d.getMonth(),
				    currentDate = this.date.valueOf();
				this.picker.find('.datepicker-days th:eq(1)').text(DPGlobal.dates.months[month] + ' ' + year);
				var prevMonth = new Date(year, month - 1, 28, 0, 0, 0, 0),
				    day = DPGlobal.getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());
				prevMonth.setDate(day);
				prevMonth.setDate(day - (prevMonth.getDay() - this.weekStart + 7) % 7);
				var nextMonth = new Date(prevMonth);
				nextMonth.setDate(nextMonth.getDate() + 42);
				nextMonth = nextMonth.valueOf();
				var html = [];
				var clsName, prevY, prevM;
				while (prevMonth.valueOf() < nextMonth) {
					if (prevMonth.getDay() === this.weekStart) {
						html.push('<tr>');
					}
					clsName = this.onRender(prevMonth);
					prevY = prevMonth.getFullYear();
					prevM = prevMonth.getMonth();
					if (prevM < month && prevY === year || prevY < year) {
						clsName += ' old';
					} else if (prevM > month && prevY === year || prevY > year) {
						clsName += ' new';
					}
					if (prevMonth.valueOf() === currentDate) {
						clsName += ' active ' + this.color;
					}
					html.push('<td class="day ' + clsName + '"><p>' + prevMonth.getDate() + '</p></td>');
					if (prevMonth.getDay() === this.weekEnd) {
						html.push('</tr>');
					}
					prevMonth.setDate(prevMonth.getDate() + 1);
				}
				this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
				var currentYear = this.date.getFullYear();

				var months = this.picker.find('.datepicker-months').find('th:eq(1)').text(year).end().find('span').removeClass('active');
				if (currentYear === year) {
					months.eq(this.date.getMonth()).addClass('active').addClass(this.color);
				}

				html = '';
				year = parseInt(year / 10, 10) * 10;
				var yearCont = this.picker.find('.datepicker-years').find('th:eq(1)').text(year + '-' + (year + 9)).end().find('td');
				year -= 1;
				for (var i = -1; i < 11; i++) {
					html += '<span class="year' + (i === -1 || i === 10 ? ' old' : '') + (currentYear === year ? ' active ' : '') + this.color + '">' + year + '</span>';
					year += 1;
				}
				yearCont.html(html);
			},

			click: function click(e) {
				e.stopPropagation();
				e.preventDefault();
				var target = $(e.target).closest('span, td, th');
				if (target.length === 1) {
					switch (target[0].nodeName.toLowerCase()) {
						case 'th':
							switch (target[0].className) {
								case 'switch-datepicker':
									this.showMode(1);
									break;
								case 'prev':
								case 'next':
									this.viewDate['set' + DPGlobal.modes[this.viewMode].navFnc].call(this.viewDate, this.viewDate['get' + DPGlobal.modes[this.viewMode].navFnc].call(this.viewDate) + DPGlobal.modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1));
									this.fill();
									this.set();
									break;
							}
							break;
						case 'span':
							if (target.is('.month')) {
								var month = target.parent().find('span').index(target);
								this.viewDate.setMonth(month);
							} else {
								var year = parseInt(target.text(), 10) || 0;
								this.viewDate.setFullYear(year);
							}
							if (this.viewMode !== 0) {
								this.date = new Date(this.viewDate);
								this.element.trigger({
									type: 'changeDate',
									date: this.date,
									viewMode: DPGlobal.modes[this.viewMode].clsName
								});
							}
							this.showMode(-1);
							this.fill();
							this.set();
							break;
						case 'td':
							if (target.is('.day') && !target.is('.disabled')) {
								var day = parseInt(target.text(), 10) || 1;
								var month = this.viewDate.getMonth();
								if (target.is('.old')) {
									month -= 1;
								} else if (target.is('.new')) {
									month += 1;
								}
								var year = this.viewDate.getFullYear();
								this.date = new Date(year, month, day, 0, 0, 0, 0);
								this.viewDate = new Date(year, month, Math.min(28, day), 0, 0, 0, 0);
								this.fill();
								this.set();
								this.element.trigger({
									type: 'changeDate',
									date: this.date,
									viewMode: DPGlobal.modes[this.viewMode].clsName
								});
							}
							break;
					}
				}
			},

			mousedown: function mousedown(e) {
				e.stopPropagation();
				e.preventDefault();
			},

			showMode: function showMode(dir) {
				if (dir) {
					this.viewMode = Math.max(this.minViewMode, Math.min(2, this.viewMode + dir));
				}
				this.picker.find('>div').hide().filter('.datepicker-' + DPGlobal.modes[this.viewMode].clsName).show();
			}
		};

		$.fn.datepicker = function (option, val) {
			return this.each(function () {
				var $this = $(this),
				    data = $this.data('datepicker'),
				    options = (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object' && option;
				if (!data) {
					$this.data('datepicker', data = new Datepicker(this, $.extend({}, $.fn.datepicker.defaults, options)));
				}
				if (typeof option === 'string') data[option](val);
			});
		};

		$.fn.datepicker.defaults = {
			onRender: function onRender(date) {
				return '';
			}
		};
		$.fn.datepicker.Constructor = Datepicker;

		var DPGlobal = {
			modes: [{
				clsName: 'days',
				navFnc: 'Month',
				navStep: 1
			}, {
				clsName: 'months',
				navFnc: 'FullYear',
				navStep: 1
			}, {
				clsName: 'years',
				navFnc: 'FullYear',
				navStep: 10
			}],
			dates: {
				days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
				daysMin: ["S", "M", "T", "W", "T", "F", "S", "S"],
				months: ["JAN.", "FEB.", "MAR.", "APR.", "MAY", "JUN.", "JUL.", "AUG.", "SEPT.", "OCT.", "NOV.", "DEC."],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			},
			isLeapYear: function isLeapYear(year) {
				return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
			},
			getDaysInMonth: function getDaysInMonth(year, month) {
				return [31, DPGlobal.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
			},
			parseFormat: function parseFormat(format) {
				var separator = format.match(/[.\/\-\s].*?/),
				    parts = format.split(/\W+/);
				if (!separator || !parts || parts.length === 0) {
					throw new Error("Invalid date format.");
				}
				return { separator: separator, parts: parts };
			},
			parseDate: function parseDate(date, format) {
				var parts = date.split(format.separator),
				    date = new Date(),
				    val;
				date.setHours(0);
				date.setMinutes(0);
				date.setSeconds(0);
				date.setMilliseconds(0);
				if (parts.length === format.parts.length) {
					var year = date.getFullYear(),
					    day = date.getDate(),
					    month = date.getMonth();
					for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
						val = parseInt(parts[i], 10) || 1;
						switch (format.parts[i]) {
							case 'dd':
							case 'd':
								day = val;
								date.setDate(val);
								break;
							case 'mm':
							case 'm':
								month = val - 1;
								date.setMonth(val - 1);
								break;
							case 'yy':
								year = 2000 + val;
								date.setFullYear(2000 + val);
								break;
							case 'yyyy':
								year = val;
								date.setFullYear(val);
								break;
						}
					}
					date = new Date(year, month, day, 0, 0, 0);
				}
				return date;
			},
			formatDate: function formatDate(date, format) {
				var val = {
					d: date.getDate(),
					m: date.getMonth() + 1,
					yy: date.getFullYear().toString().substring(2),
					yyyy: date.getFullYear()
				};
				val.dd = (val.d < 10 ? '0' : '') + val.d;
				val.mm = (val.m < 10 ? '0' : '') + val.m;
				var date = [];
				for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
					date.push(val[format.parts[i]]);
				}
				return date.join(format.separator);
			},
			headTemplate: '<thead>' + '<tr>' + '<th class="prev"><p>&lsaquo;</p></th>' + '<th colspan="5" class="switch-datepicker"></th>' + '<th class="next"><p>&rsaquo;</p></th>' + '</tr>' + '</thead>',
			contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
		};

		DPGlobal.template = '<div class="datepicker dropdown-menu">' + '<div class="datepicker-days">' + '<table class=" table-condensed">' + DPGlobal.headTemplate + '<tbody></tbody>' + '</table>' + '</div>' + '<div class="datepicker-months">' + '<table class="table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + '</table>' + '</div>' + '<div class="datepicker-years">' + '<table class="table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + '</table>' + '</div>' + '</div>';
	}(window.jQuery);
});
define(['module', 'exports', "jquery"], function (module, exports) {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      define(["jquery"], function (a0) {
        return factory(a0);
      });
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
      module.exports = factory();
    } else {
      factory(jQuery);
    }
  })(undefined, function (jQuery) {

    (function ($) {
      'use strict';

      if (!String.prototype.includes) {
        (function () {
          'use strict';

          var toString = {}.toString;
          var defineProperty = function () {
            try {
              var object = {};
              var $defineProperty = Object.defineProperty;
              var result = $defineProperty(object, object, object) && $defineProperty;
            } catch (error) {}
            return result;
          }();
          var indexOf = ''.indexOf;
          var includes = function includes(search) {
            if (this == null) {
              throw new TypeError();
            }
            var string = String(this);
            if (search && toString.call(search) == '[object RegExp]') {
              throw new TypeError();
            }
            var stringLength = string.length;
            var searchString = String(search);
            var searchLength = searchString.length;
            var position = arguments.length > 1 ? arguments[1] : undefined;

            var pos = position ? Number(position) : 0;
            if (pos != pos) {
              pos = 0;
            }
            var start = Math.min(Math.max(pos, 0), stringLength);

            if (searchLength + start > stringLength) {
              return false;
            }
            return indexOf.call(string, searchString, pos) != -1;
          };
          if (defineProperty) {
            defineProperty(String.prototype, 'includes', {
              'value': includes,
              'configurable': true,
              'writable': true
            });
          } else {
            String.prototype.includes = includes;
          }
        })();
      }

      if (!String.prototype.startsWith) {
        (function () {
          'use strict';

          var defineProperty = function () {
            try {
              var object = {};
              var $defineProperty = Object.defineProperty;
              var result = $defineProperty(object, object, object) && $defineProperty;
            } catch (error) {}
            return result;
          }();
          var toString = {}.toString;
          var startsWith = function startsWith(search) {
            if (this == null) {
              throw new TypeError();
            }
            var string = String(this);
            if (search && toString.call(search) == '[object RegExp]') {
              throw new TypeError();
            }
            var stringLength = string.length;
            var searchString = String(search);
            var searchLength = searchString.length;
            var position = arguments.length > 1 ? arguments[1] : undefined;

            var pos = position ? Number(position) : 0;
            if (pos != pos) {
              pos = 0;
            }
            var start = Math.min(Math.max(pos, 0), stringLength);

            if (searchLength + start > stringLength) {
              return false;
            }
            var index = -1;
            while (++index < searchLength) {
              if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
                return false;
              }
            }
            return true;
          };
          if (defineProperty) {
            defineProperty(String.prototype, 'startsWith', {
              'value': startsWith,
              'configurable': true,
              'writable': true
            });
          } else {
            String.prototype.startsWith = startsWith;
          }
        })();
      }

      if (!Object.keys) {
        Object.keys = function (o, k, r) {
          r = [];

          for (k in o) {
            r.hasOwnProperty.call(o, k) && r.push(k);
          }
          return r;
        };
      }

      $.fn.triggerNative = function (eventName) {
        var el = this[0],
            event;

        if (el.dispatchEvent) {
          if (typeof Event === 'function') {
            event = new Event(eventName, {
              bubbles: true
            });
          } else {
            event = document.createEvent('Event');
            event.initEvent(eventName, true, false);
          }

          el.dispatchEvent(event);
        } else {
          if (el.fireEvent) {
            event = document.createEventObject();
            event.eventType = eventName;
            el.fireEvent('on' + eventName, event);
          }

          this.trigger(eventName);
        }
      };

      $.expr[':'].icontains = function (obj, index, meta) {
        var $obj = $(obj);
        var haystack = ($obj.data('tokens') || $obj.text()).toUpperCase();
        return haystack.includes(meta[3].toUpperCase());
      };

      $.expr[':'].ibegins = function (obj, index, meta) {
        var $obj = $(obj);
        var haystack = ($obj.data('tokens') || $obj.text()).toUpperCase();
        return haystack.startsWith(meta[3].toUpperCase());
      };

      $.expr[':'].aicontains = function (obj, index, meta) {
        var $obj = $(obj);
        var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toUpperCase();
        return haystack.includes(meta[3].toUpperCase());
      };

      $.expr[':'].aibegins = function (obj, index, meta) {
        var $obj = $(obj);
        var haystack = ($obj.data('tokens') || $obj.data('normalizedText') || $obj.text()).toUpperCase();
        return haystack.startsWith(meta[3].toUpperCase());
      };

      function normalizeToBase(text) {
        var rExps = [{ re: /[\xC0-\xC6]/g, ch: "A" }, { re: /[\xE0-\xE6]/g, ch: "a" }, { re: /[\xC8-\xCB]/g, ch: "E" }, { re: /[\xE8-\xEB]/g, ch: "e" }, { re: /[\xCC-\xCF]/g, ch: "I" }, { re: /[\xEC-\xEF]/g, ch: "i" }, { re: /[\xD2-\xD6]/g, ch: "O" }, { re: /[\xF2-\xF6]/g, ch: "o" }, { re: /[\xD9-\xDC]/g, ch: "U" }, { re: /[\xF9-\xFC]/g, ch: "u" }, { re: /[\xC7-\xE7]/g, ch: "c" }, { re: /[\xD1]/g, ch: "N" }, { re: /[\xF1]/g, ch: "n" }];
        $.each(rExps, function () {
          text = text.replace(this.re, this.ch);
        });
        return text;
      }

      function htmlEscape(html) {
        var escapeMap = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '`': '&#x60;'
        };
        var source = '(?:' + Object.keys(escapeMap).join('|') + ')',
            testRegexp = new RegExp(source),
            replaceRegexp = new RegExp(source, 'g'),
            string = html == null ? '' : '' + html;
        return testRegexp.test(string) ? string.replace(replaceRegexp, function (match) {
          return escapeMap[match];
        }) : string;
      }

      var Selectpicker = function Selectpicker(element, options, e) {
        if (e) {
          e.stopPropagation();
          e.preventDefault();
        }

        this.$element = $(element);
        this.$newElement = null;
        this.$button = null;
        this.$menu = null;
        this.$lis = null;
        this.options = options;

        if (this.options.title === null) {
          this.options.title = this.$element.attr('title');
        }

        this.val = Selectpicker.prototype.val;
        this.render = Selectpicker.prototype.render;
        this.refresh = Selectpicker.prototype.refresh;
        this.setStyle = Selectpicker.prototype.setStyle;
        this.selectAll = Selectpicker.prototype.selectAll;
        this.deselectAll = Selectpicker.prototype.deselectAll;
        this.destroy = Selectpicker.prototype.destroy;
        this.remove = Selectpicker.prototype.remove;
        this.show = Selectpicker.prototype.show;
        this.hide = Selectpicker.prototype.hide;

        this.init();
      };

      Selectpicker.VERSION = '1.8.1';

      Selectpicker.DEFAULTS = {
        noneSelectedText: 'Nothing selected',
        noneResultsText: 'No results matched {0}',
        countSelectedText: function countSelectedText(numSelected, numTotal) {
          return numSelected == 1 ? "{0} item selected" : "{0} items selected";
        },
        maxOptionsText: function maxOptionsText(numAll, numGroup) {
          return [numAll == 1 ? 'Limit reached ({n} item max)' : 'Limit reached ({n} items max)', numGroup == 1 ? 'Group limit reached ({n} item max)' : 'Group limit reached ({n} items max)'];
        },
        selectAllText: 'Select All',
        deselectAllText: 'Deselect All',
        doneButton: false,
        doneButtonText: 'Close',
        multipleSeparator: ', ',
        styleBase: 'btn',
        style: 'btn-default',
        size: 'auto',
        title: null,
        selectedTextFormat: 'values',
        width: false,
        container: false,
        hideDisabled: false,
        showSubtext: false,
        showIcon: true,
        showContent: true,
        dropupAuto: true,
        header: false,
        liveSearch: false,
        liveSearchPlaceholder: null,
        liveSearchNormalize: false,
        liveSearchStyle: 'contains',
        actionsBox: false,

        iconBase: 'fa',
        tickIcon: 'fa-check',
        template: {
          caret: '<span class="caret"></span>'
        },
        maxOptions: false,
        mobile: false,
        selectOnTab: false,
        dropdownAlignRight: false
      };

      Selectpicker.prototype = {

        constructor: Selectpicker,

        init: function init() {
          var that = this,
              id = this.$element.attr('id');

          this.liObj = {};
          this.multiple = this.$element.prop('multiple');
          this.autofocus = this.$element.prop('autofocus');
          this.$newElement = this.createView();
          this.$element.after(this.$newElement).appendTo(this.$newElement);
          this.$button = this.$newElement.children('button');
          this.$menu = this.$newElement.children('.dropdown-menu');
          this.$menuInner = this.$menu.children('.inner');
          this.$searchbox = this.$menu.find('input');

          if (this.options.dropdownAlignRight) this.$menu.addClass('dropdown-menu-right');

          if (typeof id !== 'undefined') {
            this.$button.attr('data-id', id);
            $('label[for="' + id + '"]').click(function (e) {
              e.preventDefault();
              that.$button.focus();
            });
          }

          this.checkDisabled();
          this.clickListener();
          if (this.options.liveSearch) this.liveSearchListener();
          this.render();
          this.setStyle();
          this.setWidth();
          if (this.options.container) this.selectPosition();
          this.$menu.data('this', this);
          this.$newElement.data('this', this);
          if (this.options.mobile) this.mobile();

          this.$newElement.on({
            'hide.bs.dropdown': function hideBsDropdown(e) {
              that.$element.trigger('hide.bs.select', e);
            },
            'hidden.bs.dropdown': function hiddenBsDropdown(e) {
              that.$element.trigger('hidden.bs.select', e);
            },
            'show.bs.dropdown': function showBsDropdown(e) {
              that.$element.trigger('show.bs.select', e);
            },
            'shown.bs.dropdown': function shownBsDropdown(e) {
              that.$element.trigger('shown.bs.select', e);
            }
          });

          if (that.$element[0].hasAttribute('required')) {
            this.$element.on('invalid', function () {
              that.$button.addClass('bs-invalid').focus();

              that.$element.on({
                'focus.bs.select': function focusBsSelect() {
                  that.$button.focus();
                  that.$element.off('focus.bs.select');
                },
                'shown.bs.select': function shownBsSelect() {
                  that.$element.val(that.$element.val()).off('shown.bs.select');
                },
                'rendered.bs.select': function renderedBsSelect() {
                  if (this.validity.valid) that.$button.removeClass('bs-invalid');
                  that.$element.off('rendered.bs.select');
                }
              });
            });
          }

          setTimeout(function () {
            that.$element.trigger('loaded.bs.select');
          });
        },

        createDropdown: function createDropdown() {
          var multiple = this.multiple ? ' show-tick' : '',
              inputGroup = this.$element.parent().hasClass('input-group') ? ' input-group-btn' : '',
              autofocus = this.autofocus ? ' autofocus' : '';

          var header = this.options.header ? '<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>' + this.options.header + '</div>' : '';
          var searchbox = this.options.liveSearch ? '<div class="bs-searchbox">' + '<input type="text" class="form-control" autocomplete="off"' + (null === this.options.liveSearchPlaceholder ? '' : ' placeholder="' + htmlEscape(this.options.liveSearchPlaceholder) + '"') + '>' + '</div>' : '';
          var actionsbox = this.multiple && this.options.actionsBox ? '<div class="bs-actionsbox">' + '<div class="btn-group btn-group-sm btn-block">' + '<button type="button" class="actions-btn bs-select-all btn btn-default">' + this.options.selectAllText + '</button>' + '<button type="button" class="actions-btn bs-deselect-all btn btn-default">' + this.options.deselectAllText + '</button>' + '</div>' + '</div>' : '';
          var donebutton = this.multiple && this.options.doneButton ? '<div class="bs-donebutton">' + '<div class="btn-group btn-block">' + '<button type="button" class="btn btn-sm btn-default">' + this.options.doneButtonText + '</button>' + '</div>' + '</div>' : '';
          var drop = '<div class="btn-group bootstrap-select' + multiple + inputGroup + '">' + '<button type="button" class="' + this.options.styleBase + ' dropdown-toggle" data-toggle="dropdown"' + autofocus + '>' + '<span class="filter-option pull-left"></span>&nbsp;' + '<span class="bs-caret">' + this.options.template.caret + '</span>' + '</button>' + '<div class="dropdown-menu open">' + header + searchbox + actionsbox + '<ul class="dropdown-menu inner" role="menu">' + '</ul>' + donebutton + '</div>' + '</div>';

          return $(drop);
        },

        createView: function createView() {
          var $drop = this.createDropdown(),
              li = this.createLi();

          $drop.find('ul')[0].innerHTML = li;
          return $drop;
        },

        reloadLi: function reloadLi() {
          this.destroyLi();

          var li = this.createLi();
          this.$menuInner[0].innerHTML = li;
        },

        destroyLi: function destroyLi() {
          this.$menu.find('li').remove();
        },

        createLi: function createLi() {
          var that = this,
              _li = [],
              optID = 0,
              titleOption = document.createElement('option'),
              liIndex = -1;
          var generateLI = function generateLI(content, index, classes, optgroup) {
            return '<li' + (typeof classes !== 'undefined' & '' !== classes ? ' class="' + classes + '"' : '') + (typeof index !== 'undefined' & null !== index ? ' data-original-index="' + index + '"' : '') + (typeof optgroup !== 'undefined' & null !== optgroup ? 'data-optgroup="' + optgroup + '"' : '') + '>' + content + '</li>';
          };

          var generateA = function generateA(text, classes, inline, tokens) {
            return '<a tabindex="0"' + (typeof classes !== 'undefined' ? ' class="' + classes + '"' : '') + (typeof inline !== 'undefined' ? ' style="' + inline + '"' : '') + (that.options.liveSearchNormalize ? ' data-normalized-text="' + normalizeToBase(htmlEscape(text)) + '"' : '') + (typeof tokens !== 'undefined' || tokens !== null ? ' data-tokens="' + tokens + '"' : '') + '>' + text + '<span class="' + that.options.iconBase + ' ' + that.options.tickIcon + ' check-mark"></span>' + '</a>';
          };

          if (this.options.title && !this.multiple) {
            liIndex--;

            if (!this.$element.find('.bs-title-option').length) {
              var element = this.$element[0];
              titleOption.className = 'bs-title-option';
              titleOption.appendChild(document.createTextNode(this.options.title));
              titleOption.value = '';
              element.insertBefore(titleOption, element.firstChild);

              if ($(element.options[element.selectedIndex]).attr('selected') === undefined) titleOption.selected = true;
            }
          }

          this.$element.find('option').each(function (index) {
            var $this = $(this);

            liIndex++;

            if ($this.hasClass('bs-title-option')) return;

            var optionClass = this.className || '',
                inline = this.style.cssText,
                text = $this.data('content') ? $this.data('content') : $this.html(),
                tokens = $this.data('tokens') ? $this.data('tokens') : null,
                subtext = typeof $this.data('subtext') !== 'undefined' ? '<small class="text-muted">' + $this.data('subtext') + '</small>' : '',
                icon = typeof $this.data('icon') !== 'undefined' ? '<span class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></span> ' : '',
                isDisabled = this.disabled || this.parentNode.tagName === 'OPTGROUP' && this.parentNode.disabled;

            if (icon !== '' && isDisabled) {
              icon = '<span>' + icon + '</span>';
            }

            if (that.options.hideDisabled && isDisabled) {
              liIndex--;
              return;
            }

            if (!$this.data('content')) {
              text = icon + '<span class="text">' + text + subtext + '</span>';
            }

            if (this.parentNode.tagName === 'OPTGROUP' && $this.data('divider') !== true) {
              var optGroupClass = ' ' + this.parentNode.className || '';

              if ($this.index() === 0) {
                optID += 1;

                var label = this.parentNode.label,
                    labelSubtext = typeof $this.parent().data('subtext') !== 'undefined' ? '<small class="text-muted">' + $this.parent().data('subtext') + '</small>' : '',
                    labelIcon = $this.parent().data('icon') ? '<span class="' + that.options.iconBase + ' ' + $this.parent().data('icon') + '"></span> ' : '';

                label = labelIcon + '<span class="text">' + label + labelSubtext + '</span>';

                if (index !== 0 && _li.length > 0) {
                  liIndex++;
                  _li.push(generateLI('', null, 'divider', optID + 'div'));
                }
                liIndex++;
                _li.push(generateLI(label, null, 'dropdown-header' + optGroupClass, optID));
              }
              _li.push(generateLI(generateA(text, 'opt ' + optionClass + optGroupClass, inline, tokens), index, '', optID));
            } else if ($this.data('divider') === true) {
              _li.push(generateLI('', index, 'divider'));
            } else if ($this.data('hidden') === true) {
              _li.push(generateLI(generateA(text, optionClass, inline, tokens), index, 'hidden is-hidden'));
            } else {
              if (this.previousElementSibling && this.previousElementSibling.tagName === 'OPTGROUP') {
                liIndex++;
                _li.push(generateLI('', null, 'divider', optID + 'div'));
              }
              _li.push(generateLI(generateA(text, optionClass, inline, tokens), index));
            }

            that.liObj[index] = liIndex;
          });

          if (!this.multiple && this.$element.find('option:selected').length === 0 && !this.options.title) {
            this.$element.find('option').eq(0).prop('selected', true).attr('selected', 'selected');
          }

          return _li.join('');
        },

        findLis: function findLis() {
          if (this.$lis == null) this.$lis = this.$menu.find('li');
          return this.$lis;
        },

        render: function render(updateLi) {
          var that = this,
              notDisabled;

          if (updateLi !== false) {
            this.$element.find('option').each(function (index) {
              var $lis = that.findLis().eq(that.liObj[index]);

              that.setDisabled(index, this.disabled || this.parentNode.tagName === 'OPTGROUP' && this.parentNode.disabled, $lis);
              that.setSelected(index, this.selected, $lis);
            });
          }

          this.tabIndex();

          var selectedItems = this.$element.find('option').map(function () {
            if (this.selected) {
              if (that.options.hideDisabled && (this.disabled || this.parentNode.tagName === 'OPTGROUP' && this.parentNode.disabled)) return;

              var $this = $(this),
                  icon = $this.data('icon') && that.options.showIcon ? '<i class="' + that.options.iconBase + ' ' + $this.data('icon') + '"></i> ' : '',
                  subtext;

              if (that.options.showSubtext && $this.data('subtext') && !that.multiple) {
                subtext = ' <small class="text-muted">' + $this.data('subtext') + '</small>';
              } else {
                subtext = '';
              }
              if (typeof $this.attr('title') !== 'undefined') {
                return $this.attr('title');
              } else if ($this.data('content') && that.options.showContent) {
                return $this.data('content');
              } else {
                return icon + $this.html() + subtext;
              }
            }
          }).toArray();

          var title = !this.multiple ? selectedItems[0] : selectedItems.join(this.options.multipleSeparator);

          if (this.multiple && this.options.selectedTextFormat.indexOf('count') > -1) {
            var max = this.options.selectedTextFormat.split('>');
            if (max.length > 1 && selectedItems.length > max[1] || max.length == 1 && selectedItems.length >= 2) {
              notDisabled = this.options.hideDisabled ? ', [disabled]' : '';
              var totalCount = this.$element.find('option').not('[data-divider="true"], [data-hidden="true"]' + notDisabled).length,
                  tr8nText = typeof this.options.countSelectedText === 'function' ? this.options.countSelectedText(selectedItems.length, totalCount) : this.options.countSelectedText;
              title = tr8nText.replace('{0}', selectedItems.length.toString()).replace('{1}', totalCount.toString());
            }
          }

          if (this.options.title == undefined) {
            this.options.title = this.$element.attr('title');
          }

          if (this.options.selectedTextFormat == 'static') {
            title = this.options.title;
          }

          if (!title) {
            title = typeof this.options.title !== 'undefined' ? this.options.title : this.options.noneSelectedText;
          }

          this.$button.attr('title', $.trim(title.replace(/<[^>]*>?/g, '')));
          this.$button.children('.filter-option').html(title);

          this.$element.trigger('rendered.bs.select');
        },

        setStyle: function setStyle(style, status) {
          if (this.$element.attr('class')) {
            this.$newElement.addClass(this.$element.attr('class').replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi, ''));
          }

          var buttonClass = style ? style : this.options.style;

          if (status == 'add') {
            this.$button.addClass(buttonClass);
          } else if (status == 'remove') {
            this.$button.removeClass(buttonClass);
          } else {
            this.$button.removeClass(this.options.style);
            this.$button.addClass(buttonClass);
          }
        },

        liHeight: function liHeight(refresh) {
          if (!refresh && (this.options.size === false || this.sizeInfo)) return;

          var newElement = document.createElement('div'),
              menu = document.createElement('div'),
              menuInner = document.createElement('ul'),
              divider = document.createElement('li'),
              li = document.createElement('li'),
              a = document.createElement('a'),
              text = document.createElement('span'),
              header = this.options.header && this.$menu.find('.popover-title').length > 0 ? this.$menu.find('.popover-title')[0].cloneNode(true) : null,
              search = this.options.liveSearch ? document.createElement('div') : null,
              actions = this.options.actionsBox && this.multiple && this.$menu.find('.bs-actionsbox').length > 0 ? this.$menu.find('.bs-actionsbox')[0].cloneNode(true) : null,
              doneButton = this.options.doneButton && this.multiple && this.$menu.find('.bs-donebutton').length > 0 ? this.$menu.find('.bs-donebutton')[0].cloneNode(true) : null;

          text.className = 'text';
          newElement.className = this.$menu[0].parentNode.className + ' open';
          menu.className = 'dropdown-menu open';
          menuInner.className = 'dropdown-menu inner';
          divider.className = 'divider';

          text.appendChild(document.createTextNode('Inner text'));
          a.appendChild(text);
          li.appendChild(a);
          menuInner.appendChild(li);
          menuInner.appendChild(divider);
          if (header) menu.appendChild(header);
          if (search) {
            var input = document.createElement('span');
            search.className = 'bs-searchbox';
            input.className = 'form-control';
            search.appendChild(input);
            menu.appendChild(search);
          }
          if (actions) menu.appendChild(actions);
          menu.appendChild(menuInner);
          if (doneButton) menu.appendChild(doneButton);
          newElement.appendChild(menu);

          document.body.appendChild(newElement);

          var liHeight = a.offsetHeight,
              headerHeight = header ? header.offsetHeight : 0,
              searchHeight = search ? search.offsetHeight : 0,
              actionsHeight = actions ? actions.offsetHeight : 0,
              doneButtonHeight = doneButton ? doneButton.offsetHeight : 0,
              dividerHeight = $(divider).outerHeight(true),
              menuStyle = typeof getComputedStyle === 'function' ? getComputedStyle(menu) : false,
              $menu = menuStyle ? null : $(menu),
              menuPadding = parseInt(menuStyle ? menuStyle.paddingTop : $menu.css('paddingTop')) + parseInt(menuStyle ? menuStyle.paddingBottom : $menu.css('paddingBottom')) + parseInt(menuStyle ? menuStyle.borderTopWidth : $menu.css('borderTopWidth')) + parseInt(menuStyle ? menuStyle.borderBottomWidth : $menu.css('borderBottomWidth')),
              menuExtras = menuPadding + parseInt(menuStyle ? menuStyle.marginTop : $menu.css('marginTop')) + parseInt(menuStyle ? menuStyle.marginBottom : $menu.css('marginBottom')) + 2;

          document.body.removeChild(newElement);

          this.sizeInfo = {
            liHeight: liHeight,
            headerHeight: headerHeight,
            searchHeight: searchHeight,
            actionsHeight: actionsHeight,
            doneButtonHeight: doneButtonHeight,
            dividerHeight: dividerHeight,
            menuPadding: menuPadding,
            menuExtras: menuExtras
          };
        },

        setSize: function setSize() {
          this.findLis();
          this.liHeight();

          if (this.options.header) this.$menu.css('padding-top', 0);
          if (this.options.size === false) return;

          var that = this,
              $menu = this.$menu,
              $menuInner = this.$menuInner,
              $window = $(window),
              selectHeight = this.$newElement[0].offsetHeight,
              liHeight = this.sizeInfo['liHeight'],
              headerHeight = this.sizeInfo['headerHeight'],
              searchHeight = this.sizeInfo['searchHeight'],
              actionsHeight = this.sizeInfo['actionsHeight'],
              doneButtonHeight = this.sizeInfo['doneButtonHeight'],
              divHeight = this.sizeInfo['dividerHeight'],
              menuPadding = this.sizeInfo['menuPadding'],
              menuExtras = this.sizeInfo['menuExtras'],
              notDisabled = this.options.hideDisabled ? '.disabled' : '',
              menuHeight,
              getHeight,
              selectOffsetTop,
              selectOffsetBot,
              posVert = function posVert() {
            selectOffsetTop = that.$newElement.offset().top - $window.scrollTop();
            selectOffsetBot = $window.height() - selectOffsetTop - selectHeight;
          };

          posVert();

          if (this.options.size === 'auto') {
            var getSize = function getSize() {
              var minHeight,
                  hasClass = function hasClass(className, include) {
                return function (element) {
                  if (include) {
                    return element.classList ? element.classList.contains(className) : $(element).hasClass(className);
                  } else {
                    return !(element.classList ? element.classList.contains(className) : $(element).hasClass(className));
                  }
                };
              },
                  lis = that.$menuInner[0].getElementsByTagName('li'),
                  lisVisible = Array.prototype.filter ? Array.prototype.filter.call(lis, hasClass('hidden', false)) : that.$lis.not('.hidden'),
                  optGroup = Array.prototype.filter ? Array.prototype.filter.call(lisVisible, hasClass('dropdown-header', true)) : lisVisible.filter('.dropdown-header');

              posVert();
              menuHeight = selectOffsetBot - menuExtras;

              if (that.options.container) {
                if (!$menu.data('height')) $menu.data('height', $menu.height());
                getHeight = $menu.data('height');
              } else {
                getHeight = $menu.height();
              }

              if (that.options.dropupAuto) {
                that.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && menuHeight - menuExtras < getHeight);
              }
              if (that.$newElement.hasClass('dropup')) {
                menuHeight = selectOffsetTop - menuExtras;
              }

              if (lisVisible.length + optGroup.length > 3) {
                minHeight = liHeight * 3 + menuExtras - 2;
              } else {
                minHeight = 0;
              }

              $menu.css({
                'max-height': menuHeight + 'px',
                'overflow': 'hidden',
                'min-height': minHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight + 'px'
              });
              $menuInner.css({
                'max-height': menuHeight - headerHeight - searchHeight - actionsHeight - doneButtonHeight - menuPadding + 'px',
                'overflow-y': 'auto',
                'min-height': Math.max(minHeight - menuPadding, 0) + 'px'
              });
            };
            getSize();
            this.$searchbox.off('input.getSize propertychange.getSize').on('input.getSize propertychange.getSize', getSize);
            $window.off('resize.getSize scroll.getSize').on('resize.getSize scroll.getSize', getSize);
          } else if (this.options.size && this.options.size != 'auto' && this.$lis.not(notDisabled).length > this.options.size) {
            var optIndex = this.$lis.not('.divider').not(notDisabled).children().slice(0, this.options.size).last().parent().index(),
                divLength = this.$lis.slice(0, optIndex + 1).filter('.divider').length;
            menuHeight = liHeight * this.options.size + divLength * divHeight + menuPadding;

            if (that.options.container) {
              if (!$menu.data('height')) $menu.data('height', $menu.height());
              getHeight = $menu.data('height');
            } else {
              getHeight = $menu.height();
            }

            if (that.options.dropupAuto) {
              this.$newElement.toggleClass('dropup', selectOffsetTop > selectOffsetBot && menuHeight - menuExtras < getHeight);
            }
            $menu.css({
              'max-height': menuHeight + headerHeight + searchHeight + actionsHeight + doneButtonHeight + 'px',
              'overflow': 'hidden',
              'min-height': ''
            });
            $menuInner.css({
              'max-height': menuHeight - menuPadding + 'px',
              'overflow-y': 'auto',
              'min-height': ''
            });
          }
        },

        setWidth: function setWidth() {
          if (this.options.width === 'auto') {
            this.$menu.css('min-width', '0');

            var $selectClone = this.$menu.parent().clone().appendTo('body'),
                $selectClone2 = this.options.container ? this.$newElement.clone().appendTo('body') : $selectClone,
                ulWidth = $selectClone.children('.dropdown-menu').outerWidth(),
                btnWidth = $selectClone2.css('width', 'auto').children('button').outerWidth();

            $selectClone.remove();
            $selectClone2.remove();

            this.$newElement.css('width', Math.max(ulWidth, btnWidth) + 'px');
          } else if (this.options.width === 'fit') {
            this.$menu.css('min-width', '');
            this.$newElement.css('width', '').addClass('fit-width');
          } else if (this.options.width) {
            this.$menu.css('min-width', '');
            this.$newElement.css('width', this.options.width);
          } else {
            this.$menu.css('min-width', '');
            this.$newElement.css('width', '');
          }

          if (this.$newElement.hasClass('fit-width') && this.options.width !== 'fit') {
            this.$newElement.removeClass('fit-width');
          }
        },

        selectPosition: function selectPosition() {
          this.$bsContainer = $('<div class="bs-container" />');

          var that = this,
              pos,
              actualHeight,
              getPlacement = function getPlacement($element) {
            that.$bsContainer.addClass($element.attr('class').replace(/form-control|fit-width/gi, '')).toggleClass('dropup', $element.hasClass('dropup'));
            pos = $element.offset();
            actualHeight = $element.hasClass('dropup') ? 0 : $element[0].offsetHeight;
            that.$bsContainer.css({
              'top': pos.top + actualHeight,
              'left': pos.left,
              'width': $element[0].offsetWidth
            });
          };

          this.$button.on('click', function () {
            var $this = $(this);

            if (that.isDisabled()) {
              return;
            }

            getPlacement(that.$newElement);

            that.$bsContainer.appendTo(that.options.container).toggleClass('open', !$this.hasClass('open')).append(that.$menu);
          });

          $(window).on('resize scroll', function () {
            getPlacement(that.$newElement);
          });

          this.$element.on('hide.bs.select', function () {
            that.$menu.data('height', that.$menu.height());
            that.$bsContainer.detach();
          });
        },

        setSelected: function setSelected(index, selected, $lis) {
          if (!$lis) {
            $lis = this.findLis().eq(this.liObj[index]);
          }

          $lis.toggleClass('selected', selected);
        },

        setDisabled: function setDisabled(index, disabled, $lis) {
          if (!$lis) {
            $lis = this.findLis().eq(this.liObj[index]);
          }

          if (disabled) {
            $lis.addClass('disabled').children('a').attr('href', '#').attr('tabindex', -1);
          } else {
            $lis.removeClass('disabled').children('a').removeAttr('href').attr('tabindex', 0);
          }
        },

        isDisabled: function isDisabled() {
          return this.$element[0].disabled;
        },

        checkDisabled: function checkDisabled() {
          var that = this;

          if (this.isDisabled()) {
            this.$newElement.addClass('disabled');
            this.$button.addClass('disabled').attr('tabindex', -1);
          } else {
            if (this.$button.hasClass('disabled')) {
              this.$newElement.removeClass('disabled');
              this.$button.removeClass('disabled');
            }

            if (this.$button.attr('tabindex') == -1 && !this.$element.data('tabindex')) {
              this.$button.removeAttr('tabindex');
            }
          }

          this.$button.click(function () {
            return !that.isDisabled();
          });
        },

        tabIndex: function tabIndex() {
          if (this.$element.data('tabindex') !== this.$element.attr('tabindex') && this.$element.attr('tabindex') !== -98 && this.$element.attr('tabindex') !== '-98') {
            this.$element.data('tabindex', this.$element.attr('tabindex'));
            this.$button.attr('tabindex', this.$element.data('tabindex'));
          }

          this.$element.attr('tabindex', -98);
        },

        clickListener: function clickListener() {
          var that = this,
              $document = $(document);

          this.$newElement.on('touchstart.dropdown', '.dropdown-menu', function (e) {
            e.stopPropagation();
          });

          $document.data('spaceSelect', false);

          this.$button.on('keyup', function (e) {
            if (/(32)/.test(e.keyCode.toString(10)) && $document.data('spaceSelect')) {
              e.preventDefault();
              $document.data('spaceSelect', false);
            }
          });

          this.$button.on('click', function () {
            that.setSize();
            that.$element.on('shown.bs.select', function () {
              if (!that.options.liveSearch && !that.multiple) {
                that.$menuInner.find('.selected a').focus();
              } else if (!that.multiple) {
                var selectedIndex = that.liObj[that.$element[0].selectedIndex];

                if (typeof selectedIndex !== 'number' || that.options.size === false) return;

                var offset = that.$lis.eq(selectedIndex)[0].offsetTop - that.$menuInner[0].offsetTop;
                offset = offset - that.$menuInner[0].offsetHeight / 2 + that.sizeInfo.liHeight / 2;
                that.$menuInner[0].scrollTop = offset;
              }
            });
          });

          this.$menuInner.on('click', 'li a', function (e) {
            var $this = $(this),
                clickedIndex = $this.parent().data('originalIndex'),
                prevValue = that.$element.val(),
                prevIndex = that.$element.prop('selectedIndex');

            if (that.multiple) {
              e.stopPropagation();
            }

            e.preventDefault();

            if (!that.isDisabled() && !$this.parent().hasClass('disabled')) {
              var $options = that.$element.find('option'),
                  $option = $options.eq(clickedIndex),
                  state = $option.prop('selected'),
                  $optgroup = $option.parent('optgroup'),
                  maxOptions = that.options.maxOptions,
                  maxOptionsGrp = $optgroup.data('maxOptions') || false;

              if (!that.multiple) {
                $options.prop('selected', false);
                $option.prop('selected', true);
                that.$menuInner.find('.selected').removeClass('selected');
                that.setSelected(clickedIndex, true);
              } else {
                $option.prop('selected', !state);
                that.setSelected(clickedIndex, !state);
                $this.blur();

                if (maxOptions !== false || maxOptionsGrp !== false) {
                  var maxReached = maxOptions < $options.filter(':selected').length,
                      maxReachedGrp = maxOptionsGrp < $optgroup.find('option:selected').length;

                  if (maxOptions && maxReached || maxOptionsGrp && maxReachedGrp) {
                    if (maxOptions && maxOptions == 1) {
                      $options.prop('selected', false);
                      $option.prop('selected', true);
                      that.$menuInner.find('.selected').removeClass('selected');
                      that.setSelected(clickedIndex, true);
                    } else if (maxOptionsGrp && maxOptionsGrp == 1) {
                      $optgroup.find('option:selected').prop('selected', false);
                      $option.prop('selected', true);
                      var optgroupID = $this.parent().data('optgroup');
                      that.$menuInner.find('[data-optgroup="' + optgroupID + '"]').removeClass('selected');
                      that.setSelected(clickedIndex, true);
                    } else {
                      var maxOptionsArr = typeof that.options.maxOptionsText === 'function' ? that.options.maxOptionsText(maxOptions, maxOptionsGrp) : that.options.maxOptionsText,
                          maxTxt = maxOptionsArr[0].replace('{n}', maxOptions),
                          maxTxtGrp = maxOptionsArr[1].replace('{n}', maxOptionsGrp),
                          $notify = $('<div class="notify"></div>');

                      if (maxOptionsArr[2]) {
                        maxTxt = maxTxt.replace('{var}', maxOptionsArr[2][maxOptions > 1 ? 0 : 1]);
                        maxTxtGrp = maxTxtGrp.replace('{var}', maxOptionsArr[2][maxOptionsGrp > 1 ? 0 : 1]);
                      }

                      $option.prop('selected', false);

                      that.$menu.append($notify);

                      if (maxOptions && maxReached) {
                        $notify.append($('<div>' + maxTxt + '</div>'));
                        that.$element.trigger('maxReached.bs.select');
                      }

                      if (maxOptionsGrp && maxReachedGrp) {
                        $notify.append($('<div>' + maxTxtGrp + '</div>'));
                        that.$element.trigger('maxReachedGrp.bs.select');
                      }

                      setTimeout(function () {
                        that.setSelected(clickedIndex, false);
                      }, 10);

                      $notify.delay(750).fadeOut(300, function () {
                        $(this).remove();
                      });
                    }
                  }
                }
              }

              if (!that.multiple) {
                that.$button.focus();
              } else if (that.options.liveSearch) {
                that.$searchbox.focus();
              }

              if (prevValue != that.$element.val() && that.multiple || prevIndex != that.$element.prop('selectedIndex') && !that.multiple) {
                that.$element.triggerNative('change');

                that.$element.trigger('changed.bs.select', [clickedIndex, $option.prop('selected'), state]);
              }
            }
          });

          this.$menu.on('click', 'li.disabled a, .popover-title, .popover-title :not(.close)', function (e) {
            if (e.currentTarget == this) {
              e.preventDefault();
              e.stopPropagation();
              if (that.options.liveSearch && !$(e.target).hasClass('close')) {
                that.$searchbox.focus();
              } else {
                that.$button.focus();
              }
            }
          });

          this.$menuInner.on('click', '.divider, .dropdown-header', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (that.options.liveSearch) {
              that.$searchbox.focus();
            } else {
              that.$button.focus();
            }
          });

          this.$menu.on('click', '.popover-title .close', function () {
            that.$button.click();
          });

          this.$searchbox.on('click', function (e) {
            e.stopPropagation();
          });

          this.$menu.on('click', '.actions-btn', function (e) {
            if (that.options.liveSearch) {
              that.$searchbox.focus();
            } else {
              that.$button.focus();
            }

            e.preventDefault();
            e.stopPropagation();

            if ($(this).hasClass('bs-select-all')) {
              that.selectAll();
            } else {
              that.deselectAll();
            }
            that.$element.triggerNative('change');
          });

          this.$element.change(function () {
            that.render(false);
          });
        },

        liveSearchListener: function liveSearchListener() {
          var that = this,
              $no_results = $('<li class="no-results"></li>');

          this.$button.on('click.dropdown.data-api touchstart.dropdown.data-api', function () {
            that.$menuInner.find('.active').removeClass('active');
            if (!!that.$searchbox.val()) {
              that.$searchbox.val('');
              that.$lis.not('.is-hidden').removeClass('hidden');
              if (!!$no_results.parent().length) $no_results.remove();
            }
            if (!that.multiple) that.$menuInner.find('.selected').addClass('active');
            setTimeout(function () {
              that.$searchbox.focus();
            }, 10);
          });

          this.$searchbox.on('click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api', function (e) {
            e.stopPropagation();
          });

          this.$searchbox.on('input propertychange', function () {
            if (that.$searchbox.val()) {
              var $searchBase = that.$lis.not('.is-hidden').removeClass('hidden').children('a');
              if (that.options.liveSearchNormalize) {
                $searchBase = $searchBase.not(':a' + that._searchStyle() + '("' + normalizeToBase(that.$searchbox.val()) + '")');
              } else {
                $searchBase = $searchBase.not(':' + that._searchStyle() + '("' + that.$searchbox.val() + '")');
              }
              $searchBase.parent().addClass('hidden');

              that.$lis.filter('.dropdown-header').each(function () {
                var $this = $(this),
                    optgroup = $this.data('optgroup');

                if (that.$lis.filter('[data-optgroup=' + optgroup + ']').not($this).not('.hidden').length === 0) {
                  $this.addClass('hidden');
                  that.$lis.filter('[data-optgroup=' + optgroup + 'div]').addClass('hidden');
                }
              });

              var $lisVisible = that.$lis.not('.hidden');

              $lisVisible.each(function (index) {
                var $this = $(this);

                if ($this.hasClass('divider') && ($this.index() === $lisVisible.first().index() || $this.index() === $lisVisible.last().index() || $lisVisible.eq(index + 1).hasClass('divider'))) {
                  $this.addClass('hidden');
                }
              });

              if (!that.$lis.not('.hidden, .no-results').length) {
                if (!!$no_results.parent().length) {
                  $no_results.remove();
                }
                $no_results.html(that.options.noneResultsText.replace('{0}', '"' + htmlEscape(that.$searchbox.val()) + '"')).show();
                that.$menuInner.append($no_results);
              } else if (!!$no_results.parent().length) {
                $no_results.remove();
              }
            } else {
              that.$lis.not('.is-hidden').removeClass('hidden');
              if (!!$no_results.parent().length) {
                $no_results.remove();
              }
            }

            that.$lis.filter('.active').removeClass('active');
            if (that.$searchbox.val()) that.$lis.not('.hidden, .divider, .dropdown-header').eq(0).addClass('active').children('a').focus();
            $(this).focus();
          });
        },

        _searchStyle: function _searchStyle() {
          var styles = {
            begins: 'ibegins',
            startsWith: 'ibegins'
          };

          return styles[this.options.liveSearchStyle] || 'icontains';
        },

        val: function val(value) {
          if (typeof value !== 'undefined') {
            this.$element.val(value);
            this.render();

            return this.$element;
          } else {
            return this.$element.val();
          }
        },

        changeAll: function changeAll(status) {
          if (typeof status === 'undefined') status = true;

          this.findLis();

          var $options = this.$element.find('option'),
              $lisVisible = this.$lis.not('.divider, .dropdown-header, .disabled, .hidden').toggleClass('selected', status),
              lisVisLen = $lisVisible.length,
              selectedOptions = [];

          for (var i = 0; i < lisVisLen; i++) {
            var origIndex = $lisVisible[i].getAttribute('data-original-index');
            selectedOptions[selectedOptions.length] = $options.eq(origIndex)[0];
          }

          $(selectedOptions).prop('selected', status);

          this.render(false);
        },

        selectAll: function selectAll() {
          return this.changeAll(true);
        },

        deselectAll: function deselectAll() {
          return this.changeAll(false);
        },

        keydown: function keydown(e) {
          var $this = $(this),
              $parent = $this.is('input') ? $this.parent().parent() : $this.parent(),
              $items,
              that = $parent.data('this'),
              index,
              next,
              first,
              last,
              prev,
              nextPrev,
              prevIndex,
              isActive,
              selector = ':not(.disabled, .hidden, .dropdown-header, .divider)',
              keyCodeMap = {
            32: ' ',
            48: '0',
            49: '1',
            50: '2',
            51: '3',
            52: '4',
            53: '5',
            54: '6',
            55: '7',
            56: '8',
            57: '9',
            59: ';',
            65: 'a',
            66: 'b',
            67: 'c',
            68: 'd',
            69: 'e',
            70: 'f',
            71: 'g',
            72: 'h',
            73: 'i',
            74: 'j',
            75: 'k',
            76: 'l',
            77: 'm',
            78: 'n',
            79: 'o',
            80: 'p',
            81: 'q',
            82: 'r',
            83: 's',
            84: 't',
            85: 'u',
            86: 'v',
            87: 'w',
            88: 'x',
            89: 'y',
            90: 'z',
            96: '0',
            97: '1',
            98: '2',
            99: '3',
            100: '4',
            101: '5',
            102: '6',
            103: '7',
            104: '8',
            105: '9'
          };

          if (that.options.liveSearch) $parent = $this.parent().parent();

          if (that.options.container) $parent = that.$menu;

          $items = $('[role=menu] li', $parent);

          isActive = that.$newElement.hasClass('open');

          if (!isActive && (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode >= 65 && e.keyCode <= 90)) {
            if (!that.options.container) {
              that.setSize();
              that.$menu.parent().addClass('open');
              isActive = true;
            } else {
              that.$button.trigger('click');
            }
            that.$searchbox.focus();
          }

          if (that.options.liveSearch) {
            if (/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && that.$menu.find('.active').length === 0) {
              e.preventDefault();
              that.$menu.parent().removeClass('open');
              if (that.options.container) that.$newElement.removeClass('open');
              that.$button.focus();
            }

            $items = $('[role=menu] li' + selector, $parent);
            if (!$this.val() && !/(38|40)/.test(e.keyCode.toString(10))) {
              if ($items.filter('.active').length === 0) {
                $items = that.$menuInner.find('li');
                if (that.options.liveSearchNormalize) {
                  $items = $items.filter(':a' + that._searchStyle() + '(' + normalizeToBase(keyCodeMap[e.keyCode]) + ')');
                } else {
                  $items = $items.filter(':' + that._searchStyle() + '(' + keyCodeMap[e.keyCode] + ')');
                }
              }
            }
          }

          if (!$items.length) return;

          if (/(38|40)/.test(e.keyCode.toString(10))) {
            index = $items.index($items.find('a').filter(':focus').parent());
            first = $items.filter(selector).first().index();
            last = $items.filter(selector).last().index();
            next = $items.eq(index).nextAll(selector).eq(0).index();
            prev = $items.eq(index).prevAll(selector).eq(0).index();
            nextPrev = $items.eq(next).prevAll(selector).eq(0).index();

            if (that.options.liveSearch) {
              $items.each(function (i) {
                if (!$(this).hasClass('disabled')) {
                  $(this).data('index', i);
                }
              });
              index = $items.index($items.filter('.active'));
              first = $items.first().data('index');
              last = $items.last().data('index');
              next = $items.eq(index).nextAll().eq(0).data('index');
              prev = $items.eq(index).prevAll().eq(0).data('index');
              nextPrev = $items.eq(next).prevAll().eq(0).data('index');
            }

            prevIndex = $this.data('prevIndex');

            if (e.keyCode == 38) {
              if (that.options.liveSearch) index--;
              if (index != nextPrev && index > prev) index = prev;
              if (index < first) index = first;
              if (index == prevIndex) index = last;
            } else if (e.keyCode == 40) {
              if (that.options.liveSearch) index++;
              if (index == -1) index = 0;
              if (index != nextPrev && index < next) index = next;
              if (index > last) index = last;
              if (index == prevIndex) index = first;
            }

            $this.data('prevIndex', index);

            if (!that.options.liveSearch) {
              $items.eq(index).children('a').focus();
            } else {
              e.preventDefault();
              if (!$this.hasClass('dropdown-toggle')) {
                $items.removeClass('active').eq(index).addClass('active').children('a').focus();
                $this.focus();
              }
            }
          } else if (!$this.is('input')) {
            var keyIndex = [],
                count,
                prevKey;

            $items.each(function () {
              if (!$(this).hasClass('disabled')) {
                if ($.trim($(this).children('a').text().toLowerCase()).substring(0, 1) == keyCodeMap[e.keyCode]) {
                  keyIndex.push($(this).index());
                }
              }
            });

            count = $(document).data('keycount');
            count++;
            $(document).data('keycount', count);

            prevKey = $.trim($(':focus').text().toLowerCase()).substring(0, 1);

            if (prevKey != keyCodeMap[e.keyCode]) {
              count = 1;
              $(document).data('keycount', count);
            } else if (count >= keyIndex.length) {
              $(document).data('keycount', 0);
              if (count > keyIndex.length) count = 1;
            }

            $items.eq(keyIndex[count - 1]).children('a').focus();
          }

          if ((/(13|32)/.test(e.keyCode.toString(10)) || /(^9$)/.test(e.keyCode.toString(10)) && that.options.selectOnTab) && isActive) {
            if (!/(32)/.test(e.keyCode.toString(10))) e.preventDefault();
            if (!that.options.liveSearch) {
              var elem = $(':focus');
              elem.click();

              elem.focus();

              e.preventDefault();

              $(document).data('spaceSelect', true);
            } else if (!/(32)/.test(e.keyCode.toString(10))) {
              that.$menuInner.find('.active a').click();
              $this.focus();
            }
            $(document).data('keycount', 0);
          }

          if (/(^9$|27)/.test(e.keyCode.toString(10)) && isActive && (that.multiple || that.options.liveSearch) || /(27)/.test(e.keyCode.toString(10)) && !isActive) {
            that.$menu.parent().removeClass('open');
            if (that.options.container) that.$newElement.removeClass('open');
            that.$button.focus();
          }
        },

        mobile: function mobile() {
          this.$element.addClass('mobile-device');
        },

        refresh: function refresh() {
          this.$lis = null;
          this.liObj = {};
          this.reloadLi();
          this.render();
          this.checkDisabled();
          this.liHeight(true);
          this.setStyle();
          this.setWidth();
          if (this.$lis) this.$searchbox.trigger('propertychange');

          this.$element.trigger('refreshed.bs.select');
        },

        hide: function hide() {
          this.$newElement.hide();
        },

        show: function show() {
          this.$newElement.show();
        },

        remove: function remove() {
          this.$newElement.remove();
          this.$element.remove();
        },

        destroy: function destroy() {
          this.$newElement.remove();

          if (this.$bsContainer) {
            this.$bsContainer.remove();
          } else {
            this.$menu.remove();
          }

          this.$element.off('.bs.select').removeData('selectpicker').removeClass('bs-select-hidden selectpicker');
        }
      };

      function Plugin(option, event) {
        var args = arguments;

        var _option = option,
            _event = event;
        [].shift.apply(args);

        var value;
        var chain = this.each(function () {
          var $this = $(this);
          if ($this.is('select')) {
            var data = $this.data('selectpicker'),
                options = (typeof _option === 'undefined' ? 'undefined' : _typeof(_option)) == 'object' && _option;

            if (!data) {
              var config = $.extend({}, Selectpicker.DEFAULTS, $.fn.selectpicker.defaults || {}, $this.data(), options);
              config.template = $.extend({}, Selectpicker.DEFAULTS.template, $.fn.selectpicker.defaults ? $.fn.selectpicker.defaults.template : {}, $this.data().template, options.template);
              $this.data('selectpicker', data = new Selectpicker(this, config, _event));
            } else if (options) {
              for (var i in options) {
                if (options.hasOwnProperty(i)) {
                  data.options[i] = options[i];
                }
              }
            }

            if (typeof _option == 'string') {
              if (data[_option] instanceof Function) {
                value = data[_option].apply(data, args);
              } else {
                value = data.options[_option];
              }
            }
          }
        });

        if (typeof value !== 'undefined') {
          return value;
        } else {
          return chain;
        }
      }

      var old = $.fn.selectpicker;
      $.fn.selectpicker = Plugin;
      $.fn.selectpicker.Constructor = Selectpicker;

      $.fn.selectpicker.noConflict = function () {
        $.fn.selectpicker = old;
        return this;
      };

      $(document).data('keycount', 0).on('keydown.bs.select', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="menu"], .bs-searchbox input', Selectpicker.prototype.keydown).on('focusin.modal', '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="menu"], .bs-searchbox input', function (e) {
        e.stopPropagation();
      });

      $(window).on('load.bs.select.data-api', function () {
        $('.selectpicker').each(function () {
          var $selectpicker = $(this);
          Plugin.call($selectpicker, $selectpicker.data());
        });
      });
    })(jQuery);
  });
});
define('assets/js/ct-paper-bootstrapswitch',[], function () {
  "use strict";

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  !function ($) {
    "use strict";

    $.fn['bootstrapSwitch'] = function (method) {
      var methods = {
        init: function init() {
          return this.each(function () {
            var $element = $(this),
                $div,
                $switchLeft,
                $switchRight,
                $label,
                myClasses = "",
                classes = $element.attr('class'),
                color,
                moving,
                onLabel = "ON",
                offLabel = "OFF",
                icon = false;

            $.each(['switch-mini', 'switch-small', 'switch-large'], function (i, el) {
              if (classes.indexOf(el) >= 0) myClasses = el;
            });

            $element.addClass('has-switch');

            if ($element.data('on') !== undefined) color = "switch-" + $element.data('on');

            if ($element.data('on-label') !== undefined) onLabel = $element.data('on-label');

            if ($element.data('off-label') !== undefined) offLabel = $element.data('off-label');

            if ($element.data('icon') !== undefined) icon = $element.data('icon');

            $switchLeft = $('<span>').addClass("switch-left").addClass(myClasses).addClass(color).html(onLabel);

            color = '';
            if ($element.data('off') !== undefined) color = "switch-" + $element.data('off');

            $switchRight = $('<span>').addClass("switch-right").addClass(myClasses).addClass(color).html(offLabel);

            $label = $('<label>').html("&nbsp;").addClass(myClasses).attr('for', $element.find('input').attr('id'));

            if (icon) {
              $label.html('<i class="' + icon + '"></i>');
            }

            $div = $element.find(':checkbox').wrap($('<div>')).parent().data('animated', false);

            if ($element.data('animated') !== false) $div.addClass('switch-animate').data('animated', true);

            $div.append($switchLeft).append($label).append($switchRight);

            $element.find('>div').addClass($element.find('input').is(':checked') ? 'switch-on' : 'switch-off');

            if ($element.find('input').is(':disabled')) $(this).addClass('deactivate');

            var changeStatus = function changeStatus($this) {
              $this.siblings('label').trigger('mousedown').trigger('mouseup').trigger('click');
            };

            $element.on('keydown', function (e) {
              if (e.keyCode === 32) {
                e.stopImmediatePropagation();
                e.preventDefault();
                changeStatus($(e.target).find('span:first'));
              }
            });

            $switchLeft.on('click', function (e) {
              changeStatus($(this));
            });

            $switchRight.on('click', function (e) {
              changeStatus($(this));
            });

            $element.find('input').on('change', function (e) {
              var $this = $(this),
                  $element = $this.parent(),
                  thisState = $this.is(':checked'),
                  state = $element.is('.switch-off');

              e.preventDefault();

              $element.css('left', '');

              if (state === thisState) {

                if (thisState) $element.removeClass('switch-off').addClass('switch-on');else $element.removeClass('switch-on').addClass('switch-off');

                if ($element.data('animated') !== false) $element.addClass("switch-animate");

                $element.parent().trigger('switch-change', { 'el': $this, 'value': thisState });
              }
            });

            $element.find('label').on('mousedown touchstart', function (e) {
              var $this = $(this);
              moving = false;

              e.preventDefault();
              e.stopImmediatePropagation();

              $this.closest('div').removeClass('switch-animate');

              if ($this.closest('.has-switch').is('.deactivate')) $this.unbind('click');else {
                $this.on('mousemove touchmove', function (e) {
                  var $element = $(this).closest('.switch'),
                      relativeX = (e.pageX || e.originalEvent.targetTouches[0].pageX) - $element.offset().left,
                      percent = relativeX / $element.width() * 100,
                      left = 25,
                      right = 75;

                  moving = true;

                  if (percent < left) percent = left;else if (percent > right) percent = right;

                  $element.find('>div').css('left', percent - right + "%");
                });

                $this.on('click touchend', function (e) {
                  var $this = $(this),
                      $target = $(e.target),
                      $myCheckBox = $target.siblings('input');

                  e.stopImmediatePropagation();
                  e.preventDefault();

                  $this.unbind('mouseleave');

                  if (moving) $myCheckBox.prop('checked', !(parseInt($this.parent().css('left')) < -25));else $myCheckBox.prop("checked", !$myCheckBox.is(":checked"));

                  moving = false;
                  $myCheckBox.trigger('change');
                });

                $this.on('mouseleave', function (e) {
                  var $this = $(this),
                      $myCheckBox = $this.siblings('input');

                  e.preventDefault();
                  e.stopImmediatePropagation();

                  $this.unbind('mouseleave');
                  $this.trigger('mouseup');

                  $myCheckBox.prop('checked', !(parseInt($this.parent().css('left')) < -25)).trigger('change');
                });

                $this.on('mouseup', function (e) {
                  e.stopImmediatePropagation();
                  e.preventDefault();

                  $(this).unbind('mousemove');
                });
              }
            });
          });
        },
        toggleActivation: function toggleActivation() {
          $(this).toggleClass('deactivate');
        },
        isActive: function isActive() {
          return !$(this).hasClass('deactivate');
        },
        setActive: function setActive(active) {
          if (active) $(this).removeClass('deactivate');else $(this).addClass('deactivate');
        },
        toggleState: function toggleState(skipOnChange) {
          var $input = $(this).find('input:checkbox');
          $input.prop('checked', !$input.is(':checked')).trigger('change', skipOnChange);
        },
        setState: function setState(value, skipOnChange) {
          $(this).find('input:checkbox').prop('checked', value).trigger('change', skipOnChange);
        },
        status: function status() {
          return $(this).find('input:checkbox').is(':checked');
        },
        destroy: function destroy() {
          var $div = $(this).find('div'),
              $checkbox;

          $div.find(':not(input:checkbox)').remove();

          $checkbox = $div.children();
          $checkbox.unwrap().unwrap();

          $checkbox.unbind('change');

          return $checkbox;
        }
      };

      if (methods[method]) return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));else if ((typeof method === "undefined" ? "undefined" : _typeof(method)) === 'object' || !method) return methods.init.apply(this, arguments);else $.error('Method ' + method + ' does not exist!');
    };
  }(jQuery);
});
define('assets/js/ct-paper-checkbox',[], function () {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  !function ($) {

    var Checkbox = function Checkbox(element, options) {
      this.init(element, options);
    };

    Checkbox.prototype = {

      constructor: Checkbox,

      init: function init(element, options) {
        var $el = this.$element = $(element);

        this.options = $.extend({}, $.fn.checkbox.defaults, options);
        $el.before(this.options.template);
        this.setState();
      },

      setState: function setState() {
        var $el = this.$element,
            $parent = $el.closest('.checkbox');

        $el.prop('disabled') && $parent.addClass('disabled');
        $el.prop('checked') && $parent.addClass('checked');
      },

      toggle: function toggle() {
        var ch = 'checked',
            $el = this.$element,
            $parent = $el.closest('.checkbox'),
            checked = $el.prop(ch),
            e = $.Event('toggle');

        if ($el.prop('disabled') == false) {
          $parent.toggleClass(ch) && checked ? $el.removeAttr(ch) : $el.prop(ch, ch);
          $el.trigger(e).trigger('change');
        }
      },

      setCheck: function setCheck(option) {
        var d = 'disabled',
            ch = 'checked',
            $el = this.$element,
            $parent = $el.closest('.checkbox'),
            checkAction = option == 'check' ? true : false,
            e = $.Event(option);

        $parent[checkAction ? 'addClass' : 'removeClass'](ch) && checkAction ? $el.prop(ch, ch) : $el.removeAttr(ch);
        $el.trigger(e).trigger('change');
      }

    };

    var old = $.fn.checkbox;

    $.fn.checkbox = function (option) {
      return this.each(function () {
        var $this = $(this),
            data = $this.data('checkbox'),
            options = $.extend({}, $.fn.checkbox.defaults, $this.data(), (typeof option === 'undefined' ? 'undefined' : _typeof(option)) == 'object' && option);
        if (!data) $this.data('checkbox', data = new Checkbox(this, options));
        if (option == 'toggle') data.toggle();
        if (option == 'check' || option == 'uncheck') data.setCheck(option);else if (option) data.setState();
      });
    };

    $.fn.checkbox.defaults = {
      template: '<span class="icons"><span class="first-icon fa fa-square fa-base"></span><span class="second-icon fa fa-check-square fa-base"></span></span>'
    };

    $.fn.checkbox.noConflict = function () {
      $.fn.checkbox = old;
      return this;
    };

    $(document).on('click.checkbox.data-api', '[data-toggle^=checkbox], .checkbox', function (e) {
      var $checkbox = $(e.target);
      if (e.target.tagName != "A") {
        e && e.preventDefault() && e.stopPropagation();
        if (!$checkbox.hasClass('checkbox')) $checkbox = $checkbox.closest('.checkbox');
        $checkbox.find(':checkbox').checkbox('toggle');
      }
    });

    $(function () {
      $('[data-toggle="checkbox"]').each(function () {
        var $checkbox = $(this);
        $checkbox.checkbox();
      });
    });
  }(window.jQuery);
});
define('assets/js/ct-paper',[], function () {
    'use strict';

    var searchVisible = 0;
    var transparent = true;

    var transparentDemo = true;
    var fixedTop = false;

    var navbar_initialized = false;

    $(document).ready(function () {
        window_width = $(window).width();

        burger_menu = $('nav[role="navigation-demo"]').hasClass('navbar-burger') ? true : false;

        if (window_width < 768 || burger_menu) {
            ct_paper.initRightMenu();
        }

        $('.textarea-limited').keyup(function () {
            var max = $(this).data('limit');
            var len = $(this).val().length;
            if (len >= max) {
                $('#textarea-limited-message').text(' you have reached the limit');
            } else {
                var char = max - len;
                $('#textarea-limited-message').text(char + ' characters left');
            }
        });

        $('[rel="tooltip"]').tooltip({
            container: 'body',
            selector: 'body'
        });

        $('.btn-tooltip').tooltip();
        $('.label-tooltip').tooltip();

        if ($('.switch').length != 0) {
            $('.switch')['bootstrapSwitch']();
        }

        if ($("[data-toggle='switch']").length != 0) {
            $("[data-toggle='switch']").wrap('<div class="switch" />').parent().bootstrapSwitch();
        }

        if ($(".selectpicker").length != 0) {
            $(".selectpicker").selectpicker();
        }

        if ($(".tagsinput").length != 0) {
            $(".tagsinput").tagsInput();
        }

        if ($('.datepicker').length != 0) {
            $('.datepicker').datepicker({
                weekStart: 1,
                color: '{color}'
            });
        }

        $('.carousel').carousel({});

        $('.form-control').on("focus", function () {
            $(this).parent('.input-group').addClass("input-group-focus");
        }).on("blur", function () {
            $(this).parent(".input-group").removeClass("input-group-focus");
        });

        $('.dropdown-sharing .switch').click(function (e) {
            e.stopPropagation();
        });
    });

    $(window).resize(function () {
        if ($(window).width() < 768) {
            ct_paper.initRightMenu();
        }
        if ($(window).width() >= 768 && !burger_menu) {
            $('nav[role="navigation-demo"]').removeClass('navbar-burger');
            ct_paper.misc.navbar_menu_visible = 0;
            navbar_initialized = false;
            $('html').removeClass('nav-open');
        }
    });

    ct_paper = {
        misc: {
            navbar_menu_visible: 0
        },
        initRightMenu: function initRightMenu() {
            if (!navbar_initialized) {
                $nav = $('nav[role="navigation-demo"]');
                $nav.addClass('navbar-burger');

                $navbar = $nav.find('.navbar-collapse').first().clone(true);

                ul_content = '';

                $navbar.children('ul').each(function () {
                    content_buff = $(this).html();
                    ul_content = ul_content + content_buff;
                });

                ul_content = '<ul class="nav navbar-nav">' + ul_content + '</ul>';
                $navbar.html(ul_content);

                $('body').append($navbar);

                background_image = $navbar.data('nav-image');
                if (background_image != undefined) {
                    $navbar.css('background', "url('" + background_image + "')").removeAttr('data-nav-image').css('background-size', "cover").addClass('has-image');
                }

                $toggle = $('.navbar-toggle');

                $navbar.find('a, button').removeClass('btn btn-round btn-default btn-simple btn-neutral btn-fill btn-info btn-primary btn-success btn-danger btn-warning');
                $navbar.find('button').addClass('btn-simple btn-block');

                $toggle.click(function () {

                    if (ct_paper.misc.navbar_menu_visible == 1) {
                        $('html').removeClass('nav-open');
                        ct_paper.misc.navbar_menu_visible = 0;
                        $('#bodyClick').remove();
                        setTimeout(function () {
                            $toggle.removeClass('toggled');
                        }, 550);
                    } else {
                        setTimeout(function () {
                            $toggle.addClass('toggled');
                        }, 580);

                        div = '<div id="bodyClick"></div>';
                        $(div).appendTo("body").click(function () {
                            $('html').removeClass('nav-open');
                            ct_paper.misc.navbar_menu_visible = 0;
                            $('#bodyClick').remove();
                            setTimeout(function () {
                                $toggle.removeClass('toggled');
                            }, 550);
                        });

                        $('html').addClass('nav-open');
                        ct_paper.misc.navbar_menu_visible = 1;
                    }
                });
                navbar_initialized = true;
            }
        },

        fitBackgroundForCards: function fitBackgroundForCards() {
            $('.card').each(function () {
                if (!$(this).hasClass('card-product') && !$(this).hasClass('card-user')) {
                    image = $(this).find('.image img');

                    image.hide();
                    image_src = image.attr('src');

                    $(this).find('.image').css({
                        "background-image": "url('" + image_src + "')",
                        "background-position": "center center",
                        "background-size": "cover"
                    });
                }
            });
        },
        initPopovers: function initPopovers() {
            if ($('[data-toggle="popover"]').length != 0) {
                $('body').append('<div class="popover-filter"></div>');

                $('[data-toggle="popover"]').popover().on('show.bs.popover', function () {
                    $('.popover-filter').click(function () {
                        $(this).removeClass('in');
                        $('[data-toggle="popover"]').popover('hide');
                    });
                    $('.popover-filter').addClass('in');
                }).on('hide.bs.popover', function () {
                    $('.popover-filter').removeClass('in');
                });
            }
        },

        initSliders: function initSliders() {
            if ($('#slider-range').length != 0) {
                $("#slider-range").slider({
                    range: true,
                    min: 0,
                    max: 500,
                    values: [75, 300]
                });
            }
            if ($('#refine-price-range').length != 0) {
                $("#refine-price-range").slider({
                    range: true,
                    min: 0,
                    max: 999,
                    values: [100, 850],
                    slide: function slide(event, ui) {
                        min_price = ui.values[0];
                        max_price = ui.values[1];
                        $(this).siblings('.price-left').html('&euro; ' + min_price);
                        $(this).siblings('.price-right').html('&euro; ' + max_price);
                    }
                });
            }
            if ($('#slider-default').length != 0 || $('#slider-default2').length != 0) {
                $("#slider-default, #slider-default2").slider({
                    value: 70,
                    orientation: "horizontal",
                    range: "min",
                    animate: true
                });
            }
        },

        initVideoBackground: function initVideoBackground() {
            $('[data-toggle="video"]').click(function () {
                id_video = $(this).data('video');
                video = $('#' + id_video).get(0);

                parent = $(this).parent('div').parent('div');

                if (video.paused) {
                    video.play();
                    $(this).html('<i class="fa fa-pause"></i> Pause Video');
                    parent.addClass('state-play');
                } else {
                    video.pause();
                    $(this).html('<i class="fa fa-play"></i> Play Video');
                    parent.removeClass('state-play');
                }
            });
        },

        initNavbarSearch: function initNavbarSearch() {
            $('[data-toggle="search"]').click(function () {
                if (searchVisible == 0) {
                    searchVisible = 1;
                    $(this).parent().addClass('active');
                    $('.navbar-search-form').fadeIn(function () {
                        $('.navbar-search-form input').focus();
                    });
                } else {
                    searchVisible = 0;
                    $(this).parent().removeClass('active');
                    $(this).blur();
                    $('.navbar-search-form').fadeOut(function () {
                        $('.navbar-search-form input').blur();
                    });
                }
            });
        }
    };

    ct_paper.fitBackgroundForCards();

    ct_paper.initNavbarSearch();

    ct_paper.initPopovers();

    ct_paper.initSliders();

    ct_paper.initVideoBackground();


    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            }, wait);
            if (immediate && !timeout) func.apply(context, args);
        };
    };
});
define('assets/js/jquery-ui-1.10.4.custom.min',[], function () {
  "use strict";

  (function (e, t) {
    function i(t, i) {
      var s,
          a,
          o,
          r = t.nodeName.toLowerCase();return "area" === r ? (s = t.parentNode, a = s.name, t.href && a && "map" === s.nodeName.toLowerCase() ? (o = e("img[usemap=#" + a + "]")[0], !!o && n(o)) : !1) : (/input|select|textarea|button|object/.test(r) ? !t.disabled : "a" === r ? t.href || i : i) && n(t);
    }function n(t) {
      return e.expr.filters.visible(t) && !e(t).parents().addBack().filter(function () {
        return "hidden" === e.css(this, "visibility");
      }).length;
    }var s = 0,
        a = /^ui-id-\d+$/;e.ui = e.ui || {}, e.extend(e.ui, { version: "1.10.4", keyCode: { BACKSPACE: 8, COMMA: 188, DELETE: 46, DOWN: 40, END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, LEFT: 37, NUMPAD_ADD: 107, NUMPAD_DECIMAL: 110, NUMPAD_DIVIDE: 111, NUMPAD_ENTER: 108, NUMPAD_MULTIPLY: 106, NUMPAD_SUBTRACT: 109, PAGE_DOWN: 34, PAGE_UP: 33, PERIOD: 190, RIGHT: 39, SPACE: 32, TAB: 9, UP: 38 } }), e.fn.extend({ focus: function (t) {
        return function (i, n) {
          return "number" == typeof i ? this.each(function () {
            var t = this;setTimeout(function () {
              e(t).focus(), n && n.call(t);
            }, i);
          }) : t.apply(this, arguments);
        };
      }(e.fn.focus), scrollParent: function scrollParent() {
        var t;return t = e.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function () {
          return (/(relative|absolute|fixed)/.test(e.css(this, "position")) && /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"))
          );
        }).eq(0) : this.parents().filter(function () {
          return (/(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"))
          );
        }).eq(0), /fixed/.test(this.css("position")) || !t.length ? e(document) : t;
      }, zIndex: function zIndex(i) {
        if (i !== t) return this.css("zIndex", i);if (this.length) for (var n, s, a = e(this[0]); a.length && a[0] !== document;) {
          if (n = a.css("position"), ("absolute" === n || "relative" === n || "fixed" === n) && (s = parseInt(a.css("zIndex"), 10), !isNaN(s) && 0 !== s)) return s;a = a.parent();
        }return 0;
      }, uniqueId: function uniqueId() {
        return this.each(function () {
          this.id || (this.id = "ui-id-" + ++s);
        });
      }, removeUniqueId: function removeUniqueId() {
        return this.each(function () {
          a.test(this.id) && e(this).removeAttr("id");
        });
      } }), e.extend(e.expr[":"], { data: e.expr.createPseudo ? e.expr.createPseudo(function (t) {
        return function (i) {
          return !!e.data(i, t);
        };
      }) : function (t, i, n) {
        return !!e.data(t, n[3]);
      }, focusable: function focusable(t) {
        return i(t, !isNaN(e.attr(t, "tabindex")));
      }, tabbable: function tabbable(t) {
        var n = e.attr(t, "tabindex"),
            s = isNaN(n);return (s || n >= 0) && i(t, !s);
      } }), e("<a>").outerWidth(1).jquery || e.each(["Width", "Height"], function (i, n) {
      function s(t, i, n, s) {
        return e.each(a, function () {
          i -= parseFloat(e.css(t, "padding" + this)) || 0, n && (i -= parseFloat(e.css(t, "border" + this + "Width")) || 0), s && (i -= parseFloat(e.css(t, "margin" + this)) || 0);
        }), i;
      }var a = "Width" === n ? ["Left", "Right"] : ["Top", "Bottom"],
          o = n.toLowerCase(),
          r = { innerWidth: e.fn.innerWidth, innerHeight: e.fn.innerHeight, outerWidth: e.fn.outerWidth, outerHeight: e.fn.outerHeight };e.fn["inner" + n] = function (i) {
        return i === t ? r["inner" + n].call(this) : this.each(function () {
          e(this).css(o, s(this, i) + "px");
        });
      }, e.fn["outer" + n] = function (t, i) {
        return "number" != typeof t ? r["outer" + n].call(this, t) : this.each(function () {
          e(this).css(o, s(this, t, !0, i) + "px");
        });
      };
    }), e.fn.addBack || (e.fn.addBack = function (e) {
      return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
    }), e("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (e.fn.removeData = function (t) {
      return function (i) {
        return arguments.length ? t.call(this, e.camelCase(i)) : t.call(this);
      };
    }(e.fn.removeData)), e.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), e.support.selectstart = "onselectstart" in document.createElement("div"), e.fn.extend({ disableSelection: function disableSelection() {
        return this.bind((e.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (e) {
          e.preventDefault();
        });
      }, enableSelection: function enableSelection() {
        return this.unbind(".ui-disableSelection");
      } }), e.extend(e.ui, { plugin: { add: function add(t, i, n) {
          var s,
              a = e.ui[t].prototype;for (s in n) {
            a.plugins[s] = a.plugins[s] || [], a.plugins[s].push([i, n[s]]);
          }
        }, call: function call(e, t, i) {
          var n,
              s = e.plugins[t];if (s && e.element[0].parentNode && 11 !== e.element[0].parentNode.nodeType) for (n = 0; s.length > n; n++) {
            e.options[s[n][0]] && s[n][1].apply(e.element, i);
          }
        } }, hasScroll: function hasScroll(t, i) {
        if ("hidden" === e(t).css("overflow")) return !1;var n = i && "left" === i ? "scrollLeft" : "scrollTop",
            s = !1;return t[n] > 0 ? !0 : (t[n] = 1, s = t[n] > 0, t[n] = 0, s);
      } });
  })(jQuery);(function (t, e) {
    var i = 0,
        s = Array.prototype.slice,
        n = t.cleanData;t.cleanData = function (e) {
      for (var i, s = 0; null != (i = e[s]); s++) {
        try {
          t(i).triggerHandler("remove");
        } catch (o) {}
      }n(e);
    }, t.widget = function (i, s, n) {
      var o,
          a,
          r,
          h,
          l = {},
          c = i.split(".")[0];i = i.split(".")[1], o = c + "-" + i, n || (n = s, s = t.Widget), t.expr[":"][o.toLowerCase()] = function (e) {
        return !!t.data(e, o);
      }, t[c] = t[c] || {}, a = t[c][i], r = t[c][i] = function (t, i) {
        return this._createWidget ? (arguments.length && this._createWidget(t, i), e) : new r(t, i);
      }, t.extend(r, a, { version: n.version, _proto: t.extend({}, n), _childConstructors: [] }), h = new s(), h.options = t.widget.extend({}, h.options), t.each(n, function (i, n) {
        return t.isFunction(n) ? (l[i] = function () {
          var t = function t() {
            return s.prototype[i].apply(this, arguments);
          },
              e = function e(t) {
            return s.prototype[i].apply(this, t);
          };return function () {
            var i,
                s = this._super,
                o = this._superApply;return this._super = t, this._superApply = e, i = n.apply(this, arguments), this._super = s, this._superApply = o, i;
          };
        }(), e) : (l[i] = n, e);
      }), r.prototype = t.widget.extend(h, { widgetEventPrefix: a ? h.widgetEventPrefix || i : i }, l, { constructor: r, namespace: c, widgetName: i, widgetFullName: o }), a ? (t.each(a._childConstructors, function (e, i) {
        var s = i.prototype;t.widget(s.namespace + "." + s.widgetName, r, i._proto);
      }), delete a._childConstructors) : s._childConstructors.push(r), t.widget.bridge(i, r);
    }, t.widget.extend = function (i) {
      for (var n, o, a = s.call(arguments, 1), r = 0, h = a.length; h > r; r++) {
        for (n in a[r]) {
          o = a[r][n], a[r].hasOwnProperty(n) && o !== e && (i[n] = t.isPlainObject(o) ? t.isPlainObject(i[n]) ? t.widget.extend({}, i[n], o) : t.widget.extend({}, o) : o);
        }
      }return i;
    }, t.widget.bridge = function (i, n) {
      var o = n.prototype.widgetFullName || i;t.fn[i] = function (a) {
        var r = "string" == typeof a,
            h = s.call(arguments, 1),
            l = this;return a = !r && h.length ? t.widget.extend.apply(null, [a].concat(h)) : a, r ? this.each(function () {
          var s,
              n = t.data(this, o);return n ? t.isFunction(n[a]) && "_" !== a.charAt(0) ? (s = n[a].apply(n, h), s !== n && s !== e ? (l = s && s.jquery ? l.pushStack(s.get()) : s, !1) : e) : t.error("no such method '" + a + "' for " + i + " widget instance") : t.error("cannot call methods on " + i + " prior to initialization; " + "attempted to call method '" + a + "'");
        }) : this.each(function () {
          var e = t.data(this, o);e ? e.option(a || {})._init() : t.data(this, o, new n(a, this));
        }), l;
      };
    }, t.Widget = function () {}, t.Widget._childConstructors = [], t.Widget.prototype = { widgetName: "widget", widgetEventPrefix: "", defaultElement: "<div>", options: { disabled: !1, create: null }, _createWidget: function _createWidget(e, s) {
        s = t(s || this.defaultElement || this)[0], this.element = t(s), this.uuid = i++, this.eventNamespace = "." + this.widgetName + this.uuid, this.options = t.widget.extend({}, this.options, this._getCreateOptions(), e), this.bindings = t(), this.hoverable = t(), this.focusable = t(), s !== this && (t.data(s, this.widgetFullName, this), this._on(!0, this.element, { remove: function remove(t) {
            t.target === s && this.destroy();
          } }), this.document = t(s.style ? s.ownerDocument : s.document || s), this.window = t(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init();
      }, _getCreateOptions: t.noop, _getCreateEventData: t.noop, _create: t.noop, _init: t.noop, destroy: function destroy() {
        this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(t.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus");
      }, _destroy: t.noop, widget: function widget() {
        return this.element;
      }, option: function option(i, s) {
        var n,
            o,
            a,
            r = i;if (0 === arguments.length) return t.widget.extend({}, this.options);if ("string" == typeof i) if (r = {}, n = i.split("."), i = n.shift(), n.length) {
          for (o = r[i] = t.widget.extend({}, this.options[i]), a = 0; n.length - 1 > a; a++) {
            o[n[a]] = o[n[a]] || {}, o = o[n[a]];
          }if (i = n.pop(), 1 === arguments.length) return o[i] === e ? null : o[i];o[i] = s;
        } else {
          if (1 === arguments.length) return this.options[i] === e ? null : this.options[i];r[i] = s;
        }return this._setOptions(r), this;
      }, _setOptions: function _setOptions(t) {
        var e;for (e in t) {
          this._setOption(e, t[e]);
        }return this;
      }, _setOption: function _setOption(t, e) {
        return this.options[t] = e, "disabled" === t && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!e).attr("aria-disabled", e), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this;
      }, enable: function enable() {
        return this._setOption("disabled", !1);
      }, disable: function disable() {
        return this._setOption("disabled", !0);
      }, _on: function _on(i, s, n) {
        var o,
            a = this;"boolean" != typeof i && (n = s, s = i, i = !1), n ? (s = o = t(s), this.bindings = this.bindings.add(s)) : (n = s, s = this.element, o = this.widget()), t.each(n, function (n, r) {
          function h() {
            return i || a.options.disabled !== !0 && !t(this).hasClass("ui-state-disabled") ? ("string" == typeof r ? a[r] : r).apply(a, arguments) : e;
          }"string" != typeof r && (h.guid = r.guid = r.guid || h.guid || t.guid++);var l = n.match(/^(\w+)\s*(.*)$/),
              c = l[1] + a.eventNamespace,
              u = l[2];u ? o.delegate(u, c, h) : s.bind(c, h);
        });
      }, _off: function _off(t, e) {
        e = (e || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, t.unbind(e).undelegate(e);
      }, _delay: function _delay(t, e) {
        function i() {
          return ("string" == typeof t ? s[t] : t).apply(s, arguments);
        }var s = this;return setTimeout(i, e || 0);
      }, _hoverable: function _hoverable(e) {
        this.hoverable = this.hoverable.add(e), this._on(e, { mouseenter: function mouseenter(e) {
            t(e.currentTarget).addClass("ui-state-hover");
          }, mouseleave: function mouseleave(e) {
            t(e.currentTarget).removeClass("ui-state-hover");
          } });
      }, _focusable: function _focusable(e) {
        this.focusable = this.focusable.add(e), this._on(e, { focusin: function focusin(e) {
            t(e.currentTarget).addClass("ui-state-focus");
          }, focusout: function focusout(e) {
            t(e.currentTarget).removeClass("ui-state-focus");
          } });
      }, _trigger: function _trigger(e, i, s) {
        var n,
            o,
            a = this.options[e];if (s = s || {}, i = t.Event(i), i.type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase(), i.target = this.element[0], o = i.originalEvent) for (n in o) {
          n in i || (i[n] = o[n]);
        }return this.element.trigger(i, s), !(t.isFunction(a) && a.apply(this.element[0], [i].concat(s)) === !1 || i.isDefaultPrevented());
      } }, t.each({ show: "fadeIn", hide: "fadeOut" }, function (e, i) {
      t.Widget.prototype["_" + e] = function (s, n, o) {
        "string" == typeof n && (n = { effect: n });var a,
            r = n ? n === !0 || "number" == typeof n ? i : n.effect || i : e;n = n || {}, "number" == typeof n && (n = { duration: n }), a = !t.isEmptyObject(n), n.complete = o, n.delay && s.delay(n.delay), a && t.effects && t.effects.effect[r] ? s[e](n) : r !== e && s[r] ? s[r](n.duration, n.easing, o) : s.queue(function (i) {
          t(this)[e](), o && o.call(s[0]), i();
        });
      };
    });
  })(jQuery);(function (t) {
    var e = !1;t(document).mouseup(function () {
      e = !1;
    }), t.widget("ui.mouse", { version: "1.10.4", options: { cancel: "input,textarea,button,select,option", distance: 1, delay: 0 }, _mouseInit: function _mouseInit() {
        var e = this;this.element.bind("mousedown." + this.widgetName, function (t) {
          return e._mouseDown(t);
        }).bind("click." + this.widgetName, function (i) {
          return !0 === t.data(i.target, e.widgetName + ".preventClickEvent") ? (t.removeData(i.target, e.widgetName + ".preventClickEvent"), i.stopImmediatePropagation(), !1) : undefined;
        }), this.started = !1;
      }, _mouseDestroy: function _mouseDestroy() {
        this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && t(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
      }, _mouseDown: function _mouseDown(i) {
        if (!e) {
          this._mouseStarted && this._mouseUp(i), this._mouseDownEvent = i;var s = this,
              n = 1 === i.which,
              a = "string" == typeof this.options.cancel && i.target.nodeName ? t(i.target).closest(this.options.cancel).length : !1;return n && !a && this._mouseCapture(i) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
            s.mouseDelayMet = !0;
          }, this.options.delay)), this._mouseDistanceMet(i) && this._mouseDelayMet(i) && (this._mouseStarted = this._mouseStart(i) !== !1, !this._mouseStarted) ? (i.preventDefault(), !0) : (!0 === t.data(i.target, this.widgetName + ".preventClickEvent") && t.removeData(i.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (t) {
            return s._mouseMove(t);
          }, this._mouseUpDelegate = function (t) {
            return s._mouseUp(t);
          }, t(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), i.preventDefault(), e = !0, !0)) : !0;
        }
      }, _mouseMove: function _mouseMove(e) {
        return t.ui.ie && (!document.documentMode || 9 > document.documentMode) && !e.button ? this._mouseUp(e) : this._mouseStarted ? (this._mouseDrag(e), e.preventDefault()) : (this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, e) !== !1, this._mouseStarted ? this._mouseDrag(e) : this._mouseUp(e)), !this._mouseStarted);
      }, _mouseUp: function _mouseUp(e) {
        return t(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, e.target === this._mouseDownEvent.target && t.data(e.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(e)), !1;
      }, _mouseDistanceMet: function _mouseDistanceMet(t) {
        return Math.max(Math.abs(this._mouseDownEvent.pageX - t.pageX), Math.abs(this._mouseDownEvent.pageY - t.pageY)) >= this.options.distance;
      }, _mouseDelayMet: function _mouseDelayMet() {
        return this.mouseDelayMet;
      }, _mouseStart: function _mouseStart() {}, _mouseDrag: function _mouseDrag() {}, _mouseStop: function _mouseStop() {}, _mouseCapture: function _mouseCapture() {
        return !0;
      } });
  })(jQuery);(function (t) {
    var e = 5;t.widget("ui.slider", t.ui.mouse, { version: "1.10.4", widgetEventPrefix: "slide", options: { animate: !1, distance: 0, max: 100, min: 0, orientation: "horizontal", range: !1, step: 1, value: 0, values: null, change: null, slide: null, start: null, stop: null }, _create: function _create() {
        this._keySliding = !1, this._mouseSliding = !1, this._animateOff = !0, this._handleIndex = null, this._detectOrientation(), this._mouseInit(), this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget" + " ui-widget-content" + " ui-corner-all"), this._refresh(), this._setOption("disabled", this.options.disabled), this._animateOff = !1;
      }, _refresh: function _refresh() {
        this._createRange(), this._createHandles(), this._setupEvents(), this._refreshValue();
      }, _createHandles: function _createHandles() {
        var e,
            i,
            s = this.options,
            n = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),
            a = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",
            o = [];for (i = s.values && s.values.length || 1, n.length > i && (n.slice(i).remove(), n = n.slice(0, i)), e = n.length; i > e; e++) {
          o.push(a);
        }this.handles = n.add(t(o.join("")).appendTo(this.element)), this.handle = this.handles.eq(0), this.handles.each(function (e) {
          t(this).data("ui-slider-handle-index", e);
        });
      }, _createRange: function _createRange() {
        var e = this.options,
            i = "";e.range ? (e.range === !0 && (e.values ? e.values.length && 2 !== e.values.length ? e.values = [e.values[0], e.values[0]] : t.isArray(e.values) && (e.values = e.values.slice(0)) : e.values = [this._valueMin(), this._valueMin()]), this.range && this.range.length ? this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({ left: "", bottom: "" }) : (this.range = t("<div></div>").appendTo(this.element), i = "ui-slider-range ui-widget-header ui-corner-all"), this.range.addClass(i + ("min" === e.range || "max" === e.range ? " ui-slider-range-" + e.range : ""))) : (this.range && this.range.remove(), this.range = null);
      }, _setupEvents: function _setupEvents() {
        var t = this.handles.add(this.range).filter("a");this._off(t), this._on(t, this._handleEvents), this._hoverable(t), this._focusable(t);
      }, _destroy: function _destroy() {
        this.handles.remove(), this.range && this.range.remove(), this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all"), this._mouseDestroy();
      }, _mouseCapture: function _mouseCapture(e) {
        var i,
            s,
            n,
            a,
            o,
            r,
            l,
            h,
            u = this,
            c = this.options;return c.disabled ? !1 : (this.elementSize = { width: this.element.outerWidth(), height: this.element.outerHeight() }, this.elementOffset = this.element.offset(), i = { x: e.pageX, y: e.pageY }, s = this._normValueFromMouse(i), n = this._valueMax() - this._valueMin() + 1, this.handles.each(function (e) {
          var i = Math.abs(s - u.values(e));(n > i || n === i && (e === u._lastChangedValue || u.values(e) === c.min)) && (n = i, a = t(this), o = e);
        }), r = this._start(e, o), r === !1 ? !1 : (this._mouseSliding = !0, this._handleIndex = o, a.addClass("ui-state-active").focus(), l = a.offset(), h = !t(e.target).parents().addBack().is(".ui-slider-handle"), this._clickOffset = h ? { left: 0, top: 0 } : { left: e.pageX - l.left - a.width() / 2, top: e.pageY - l.top - a.height() / 2 - (parseInt(a.css("borderTopWidth"), 10) || 0) - (parseInt(a.css("borderBottomWidth"), 10) || 0) + (parseInt(a.css("marginTop"), 10) || 0) }, this.handles.hasClass("ui-state-hover") || this._slide(e, o, s), this._animateOff = !0, !0));
      }, _mouseStart: function _mouseStart() {
        return !0;
      }, _mouseDrag: function _mouseDrag(t) {
        var e = { x: t.pageX, y: t.pageY },
            i = this._normValueFromMouse(e);return this._slide(t, this._handleIndex, i), !1;
      }, _mouseStop: function _mouseStop(t) {
        return this.handles.removeClass("ui-state-active"), this._mouseSliding = !1, this._stop(t, this._handleIndex), this._change(t, this._handleIndex), this._handleIndex = null, this._clickOffset = null, this._animateOff = !1, !1;
      }, _detectOrientation: function _detectOrientation() {
        this.orientation = "vertical" === this.options.orientation ? "vertical" : "horizontal";
      }, _normValueFromMouse: function _normValueFromMouse(t) {
        var e, i, s, n, a;return "horizontal" === this.orientation ? (e = this.elementSize.width, i = t.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (e = this.elementSize.height, i = t.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)), s = i / e, s > 1 && (s = 1), 0 > s && (s = 0), "vertical" === this.orientation && (s = 1 - s), n = this._valueMax() - this._valueMin(), a = this._valueMin() + s * n, this._trimAlignValue(a);
      }, _start: function _start(t, e) {
        var i = { handle: this.handles[e], value: this.value() };return this.options.values && this.options.values.length && (i.value = this.values(e), i.values = this.values()), this._trigger("start", t, i);
      }, _slide: function _slide(t, e, i) {
        var s, n, a;this.options.values && this.options.values.length ? (s = this.values(e ? 0 : 1), 2 === this.options.values.length && this.options.range === !0 && (0 === e && i > s || 1 === e && s > i) && (i = s), i !== this.values(e) && (n = this.values(), n[e] = i, a = this._trigger("slide", t, { handle: this.handles[e], value: i, values: n }), s = this.values(e ? 0 : 1), a !== !1 && this.values(e, i))) : i !== this.value() && (a = this._trigger("slide", t, { handle: this.handles[e], value: i }), a !== !1 && this.value(i));
      }, _stop: function _stop(t, e) {
        var i = { handle: this.handles[e], value: this.value() };this.options.values && this.options.values.length && (i.value = this.values(e), i.values = this.values()), this._trigger("stop", t, i);
      }, _change: function _change(t, e) {
        if (!this._keySliding && !this._mouseSliding) {
          var i = { handle: this.handles[e], value: this.value() };this.options.values && this.options.values.length && (i.value = this.values(e), i.values = this.values()), this._lastChangedValue = e, this._trigger("change", t, i);
        }
      }, value: function value(t) {
        return arguments.length ? (this.options.value = this._trimAlignValue(t), this._refreshValue(), this._change(null, 0), undefined) : this._value();
      }, values: function values(e, i) {
        var s, n, a;if (arguments.length > 1) return this.options.values[e] = this._trimAlignValue(i), this._refreshValue(), this._change(null, e), undefined;if (!arguments.length) return this._values();if (!t.isArray(arguments[0])) return this.options.values && this.options.values.length ? this._values(e) : this.value();for (s = this.options.values, n = arguments[0], a = 0; s.length > a; a += 1) {
          s[a] = this._trimAlignValue(n[a]), this._change(null, a);
        }this._refreshValue();
      }, _setOption: function _setOption(e, i) {
        var s,
            n = 0;switch ("range" === e && this.options.range === !0 && ("min" === i ? (this.options.value = this._values(0), this.options.values = null) : "max" === i && (this.options.value = this._values(this.options.values.length - 1), this.options.values = null)), t.isArray(this.options.values) && (n = this.options.values.length), t.Widget.prototype._setOption.apply(this, arguments), e) {case "orientation":
            this._detectOrientation(), this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation), this._refreshValue();break;case "value":
            this._animateOff = !0, this._refreshValue(), this._change(null, 0), this._animateOff = !1;break;case "values":
            for (this._animateOff = !0, this._refreshValue(), s = 0; n > s; s += 1) {
              this._change(null, s);
            }this._animateOff = !1;break;case "min":case "max":
            this._animateOff = !0, this._refreshValue(), this._animateOff = !1;break;case "range":
            this._animateOff = !0, this._refresh(), this._animateOff = !1;}
      }, _value: function _value() {
        var t = this.options.value;return t = this._trimAlignValue(t);
      }, _values: function _values(t) {
        var e, i, s;if (arguments.length) return e = this.options.values[t], e = this._trimAlignValue(e);if (this.options.values && this.options.values.length) {
          for (i = this.options.values.slice(), s = 0; i.length > s; s += 1) {
            i[s] = this._trimAlignValue(i[s]);
          }return i;
        }return [];
      }, _trimAlignValue: function _trimAlignValue(t) {
        if (this._valueMin() >= t) return this._valueMin();if (t >= this._valueMax()) return this._valueMax();var e = this.options.step > 0 ? this.options.step : 1,
            i = (t - this._valueMin()) % e,
            s = t - i;return 2 * Math.abs(i) >= e && (s += i > 0 ? e : -e), parseFloat(s.toFixed(5));
      }, _valueMin: function _valueMin() {
        return this.options.min;
      }, _valueMax: function _valueMax() {
        return this.options.max;
      }, _refreshValue: function _refreshValue() {
        var e,
            i,
            s,
            n,
            a,
            o = this.options.range,
            r = this.options,
            l = this,
            h = this._animateOff ? !1 : r.animate,
            u = {};this.options.values && this.options.values.length ? this.handles.each(function (s) {
          i = 100 * ((l.values(s) - l._valueMin()) / (l._valueMax() - l._valueMin())), u["horizontal" === l.orientation ? "left" : "bottom"] = i + "%", t(this).stop(1, 1)[h ? "animate" : "css"](u, r.animate), l.options.range === !0 && ("horizontal" === l.orientation ? (0 === s && l.range.stop(1, 1)[h ? "animate" : "css"]({ left: i + "%" }, r.animate), 1 === s && l.range[h ? "animate" : "css"]({ width: i - e + "%" }, { queue: !1, duration: r.animate })) : (0 === s && l.range.stop(1, 1)[h ? "animate" : "css"]({ bottom: i + "%" }, r.animate), 1 === s && l.range[h ? "animate" : "css"]({ height: i - e + "%" }, { queue: !1, duration: r.animate }))), e = i;
        }) : (s = this.value(), n = this._valueMin(), a = this._valueMax(), i = a !== n ? 100 * ((s - n) / (a - n)) : 0, u["horizontal" === this.orientation ? "left" : "bottom"] = i + "%", this.handle.stop(1, 1)[h ? "animate" : "css"](u, r.animate), "min" === o && "horizontal" === this.orientation && this.range.stop(1, 1)[h ? "animate" : "css"]({ width: i + "%" }, r.animate), "max" === o && "horizontal" === this.orientation && this.range[h ? "animate" : "css"]({ width: 100 - i + "%" }, { queue: !1, duration: r.animate }), "min" === o && "vertical" === this.orientation && this.range.stop(1, 1)[h ? "animate" : "css"]({ height: i + "%" }, r.animate), "max" === o && "vertical" === this.orientation && this.range[h ? "animate" : "css"]({ height: 100 - i + "%" }, { queue: !1, duration: r.animate }));
      }, _handleEvents: { keydown: function keydown(i) {
          var s,
              n,
              a,
              o,
              r = t(i.target).data("ui-slider-handle-index");switch (i.keyCode) {case t.ui.keyCode.HOME:case t.ui.keyCode.END:case t.ui.keyCode.PAGE_UP:case t.ui.keyCode.PAGE_DOWN:case t.ui.keyCode.UP:case t.ui.keyCode.RIGHT:case t.ui.keyCode.DOWN:case t.ui.keyCode.LEFT:
              if (i.preventDefault(), !this._keySliding && (this._keySliding = !0, t(i.target).addClass("ui-state-active"), s = this._start(i, r), s === !1)) return;}switch (o = this.options.step, n = a = this.options.values && this.options.values.length ? this.values(r) : this.value(), i.keyCode) {case t.ui.keyCode.HOME:
              a = this._valueMin();break;case t.ui.keyCode.END:
              a = this._valueMax();break;case t.ui.keyCode.PAGE_UP:
              a = this._trimAlignValue(n + (this._valueMax() - this._valueMin()) / e);break;case t.ui.keyCode.PAGE_DOWN:
              a = this._trimAlignValue(n - (this._valueMax() - this._valueMin()) / e);break;case t.ui.keyCode.UP:case t.ui.keyCode.RIGHT:
              if (n === this._valueMax()) return;a = this._trimAlignValue(n + o);break;case t.ui.keyCode.DOWN:case t.ui.keyCode.LEFT:
              if (n === this._valueMin()) return;a = this._trimAlignValue(n - o);}this._slide(i, r, a);
        }, click: function click(t) {
          t.preventDefault();
        }, keyup: function keyup(e) {
          var i = t(e.target).data("ui-slider-handle-index");this._keySliding && (this._keySliding = !1, this._stop(e, i), this._change(e, i), t(e.target).removeClass("ui-state-active"));
        } } });
  })(jQuery);
});
define('assets/js/test',[], function () {
  "use strict";

  console.log("It loaded! OMG");
});
define('gradebook/components/addAssignment',['exports', 'aurelia-framework', 'aurelia-validation', 'aurelia-event-aggregator', 'shared/services/currentService', 'shared/services/apiService', 'gradebook/models/assignment', 'moment'], function (exports, _aureliaFramework, _aureliaValidation, _aureliaEventAggregator, _currentService, _apiService, _assignment, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AddAssignment = undefined;

  var _moment2 = _interopRequireDefault(_moment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor;

  var AddAssignment = exports.AddAssignment = (_dec = (0, _aureliaFramework.inject)(_apiService.ApiService, _currentService.CurrentService, _aureliaEventAggregator.EventAggregator, _aureliaValidation.ValidationControllerFactory), _dec(_class = (_class2 = function () {
    function AddAssignment(api, current, eventaggregator, controllerFactory) {
      _classCallCheck(this, AddAssignment);

      _initDefineProp(this, 'mode', _descriptor, this);

      this.newAssignment = new _assignment.Assignment({ date: (0, _moment2.default)().format('YYYY-MM-DD') });

      this.api = api;
      this.current = current;
      this.ea = eventaggregator;
      this.controller = controllerFactory.createForCurrentScope();
    }

    AddAssignment.prototype.created = function created() {
      if (this.mode === 'edit') {
        this.newAssignment = this.current.assignment;
        this.title = 'Edit Assignment';
        this.btn = 'Save Changes';
      } else {
        this.title = 'Add Assignment';
        this.btn = this.title;
      }
    };

    AddAssignment.prototype.modeChanged = function modeChanged() {
      this.created();
    };

    AddAssignment.prototype.detached = function detached() {
      this.newAssignment = new _assignment.Assignment({ date: (0, _moment2.default)().format('YYYY-MM-DD') });
    };

    AddAssignment.prototype.submit = function submit() {
      var _this = this;

      this.controller.validate().then(function (result) {
        if (!result.valid) {
          return;
        }

        if (!_this.newAssignment.subject_id) {
          _this.newAssignment.subject_id = _this.current.subject.id;
        }

        _this.api.save(_this.newAssignment).then(function (data) {
          _this.ea.publish('assignmentAdded', data);
          _this.mode = false;
          _this.detached();
          _this.current.navigateTo('gradebook', { subject: _this.current.subject.id,
            assignment: data.id });
        });
      });
    };

    AddAssignment.prototype.cancel = function cancel() {
      this.mode = false;
      this.detached();
    };

    return AddAssignment;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mode', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('gradebook/components/assignmentlist',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'shared/services/currentService', 'moment'], function (exports, _aureliaFramework, _aureliaEventAggregator, _currentService, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AssignmentList = undefined;

  var _moment2 = _interopRequireDefault(_moment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AssignmentList = exports.AssignmentList = (_dec = (0, _aureliaFramework.inject)(_currentService.CurrentService, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function AssignmentList(current, eventaggregator) {
      _classCallCheck(this, AssignmentList);

      this.current = current;
      this.ea = eventaggregator;
    }

    AssignmentList.prototype.created = function created() {
      var _this = this;

      this.subsub = this.ea.subscribe('subjectSet', function (resp) {
        _this.current.setAssignmentList(_this.current.assignment.date);
      });

      this.reload = this.ea.subscribe('assignmentAdded', function (data) {
        _this.listWeek = (0, _moment2.default)(data.date).startOf('isoweek');
      });
    };

    AssignmentList.prototype.attached = function attached() {
      if (!this.current.assignment) {
        this.listWeek = (0, _moment2.default)().startOf('isoweek');
        this.current.setAssignmentList(this.listWeek);
      } else {
        this.listWeek = (0, _moment2.default)(this.current.assignment.date).startOf('isoweek');
      }
    };

    AssignmentList.prototype.jumpWeek = function jumpWeek() {
      var _this2 = this;

      console.log('changedate');
      this.current.setAssignmentList(this.listWeek).then(function (date) {
        _this2.listWeek = date.startOf('isoweek');
      });
    };

    AssignmentList.prototype.detached = function detached() {
      this.subsub.dispose();
      this.reload.dispose();
    };

    return AssignmentList;
  }()) || _class);
});
define('gradebook/components/quickEntry',['exports', 'aurelia-framework', 'aurelia-event-aggregator', '../../shared/services/currentService', '../../shared/services/apiService'], function (exports, _aureliaFramework, _aureliaEventAggregator, _currentService, _apiService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.QuickEntry = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var QuickEntry = exports.QuickEntry = (_dec = (0, _aureliaFramework.inject)(_apiService.ApiService, _currentService.CurrentService, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function QuickEntry(api, current, eventaggregator) {
      var _this = this;

      _classCallCheck(this, QuickEntry);

      this.suggestionService = {
        suggest: function suggest(value) {
          if (value === '') {
            return Promise.resolve([]);
          }
          value = value.toLowerCase();
          var suggestions = _this.notEntered.filter(function (x) {
            return x.student.first_name.toLowerCase().indexOf(value) === 0;
          }).sort();
          return Promise.resolve(suggestions);
        },

        getName: function getName(suggestion) {
          return suggestion.student.first_name;
        }
      };

      this.api = api;
      this.current = current;
      this.ea = eventaggregator;
    }

    QuickEntry.prototype.attached = function attached() {
      this.entered = [];
      this.notEntered = this.current.scores;

      this.nameFocus = true;
      this.scoreFocus = false;
    };

    QuickEntry.prototype.detached = function detached() {
      this.entered = [];
      this.notEntered = [];
    };

    QuickEntry.prototype.pushScore = function pushScore(score) {
      this.entered.push(score);

      this.notEntered = this.notEntered.filter(function (item) {
        return item.id !== score.id;
      });

      this.score = null;
      this.quickPoints = null;
      this.scoreFocus = false;
      this.nameFocus = true;
    };

    QuickEntry.prototype.parseKey = function parseKey(key) {
      if (key === 13) {
        if (!this.current.assignment.isPoints && key === 13) {
          this.score.value = 1;
          this.updateScore(this.score);
          this.pushScore(this.score);
        }

        if (this.quickPoints) {
          this.score.value = this.quickPoints;
          this.updateScore(this.score);
          this.pushScore(this.score);
        }
      } else {
        return true;
      }
    };

    QuickEntry.prototype.updateScore = function updateScore(score) {
      this.api.save(score);

      this.ea.publish('scoreUpdate');
    };

    return QuickEntry;
  }()) || _class);
});
define('gradebook/components/reportAssignment',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'shared/services/currentService', 'd3'], function (exports, _aureliaFramework, _aureliaEventAggregator, _currentService, _d) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ReportAssignment = undefined;

  var d3 = _interopRequireWildcard(_d);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var ReportAssignment = exports.ReportAssignment = (_dec = (0, _aureliaFramework.inject)(_currentService.CurrentService, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function ReportAssignment(current, eventaggregator) {
      _classCallCheck(this, ReportAssignment);

      this.current = current;
      this.ea = eventaggregator;
    }

    ReportAssignment.prototype.attached = function attached() {
      var _this = this;

      this.makePlot();
      this.subscriber = this.ea.subscribe('scoreUpdate', function (resp) {
        return _this.makePlot();
      });
    };

    ReportAssignment.prototype.detached = function detached() {
      this.subscriber.dispose();
    };

    ReportAssignment.prototype.makePlot = function makePlot() {
      d3.select('svg').remove();

      if (this.current.assignment.isPoints) {
        this.renderHistogram(this.current.scores, '#content');
      } else {
        this.renderDonut(this.current.scores, '#content');
      }
    };

    ReportAssignment.prototype.renderHistogram = function renderHistogram(data, divElement) {
      var _this2 = this;

      var formatCount = d3.format(',.0f');

      var margin = { top: 20, right: 20, bottom: 30, left: 50 };
      var width = 450 - margin.left - margin.right;
      var height = 300 - margin.top - margin.bottom;

      var svg = d3.select(divElement).append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);

      var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var x = d3.scaleLinear().range([0, width]);

      if (this.current.assignment.max !== 0) {
        x.domain([0, this.current.assignment.max]);
      } else {
        x.domain([0, d3.max(data, function (d) {
          return d.value;
        })]);
      }

      var bins = d3.histogram().value(function (d) {
        return d.value;
      }).domain(x.domain())(data);

      var y = d3.scaleLinear().domain([0, d3.max(bins, function (d) {
        return d.length;
      })]).range([height, 0]);

      var tooltip = d3.select(divElement).append('div').attr('class', 'chart-tooltip');
      tooltip.append('div').attr('class', 'students');

      var bar = g.selectAll('.bar').data(bins).enter().append('g').attr('class', 'bar').attr('transform', function (d) {
        return 'translate(' + x(d.x0) + ',' + y(d.length) + ')';
      });

      bar.on('mouseover', function (d) {
        tooltip.select('.students').html(d.map(function (score) {
          return score.student.first_name + ': ' + Math.round(score.value / score.assignment.max * 100) + '%<br>';
        }).join(''));
        tooltip.style('display', 'block');
      });

      bar.on('mouseout', function () {
        return tooltip.style('display', 'none');
      });

      bar.append('rect').attr('x', 1).attr('width', x(bins[0].x1) - x(bins[0].x0) - 1).attr('height', function (d) {
        return height - y(d.length);
      });

      bar.append('text').attr('dy', '.75em').attr('y', 6).attr('x', (x(bins[0].x1) - x(bins[0].x0)) / 2).attr('text-anchor', 'middle').text(function (d) {
        return formatCount(d.length);
      });

      if (this.current.assignment.max !== 0) {
        g.append('g').attr('class', 'axis axis--x').attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x).tickFormat(function (d) {
          return Math.round(d / _this2.current.assignment.max * 100) + '%';
        }));
      } else {
        g.append('g').attr('class', 'axis axis--x').attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x));
      }
    };

    ReportAssignment.prototype.renderDonut = function renderDonut(data, divElement) {
      var nestdata = d3.nest().key(function (d) {
        return d.value;
      }).sortKeys(d3.descending).rollup(function (g) {
        return { 'count': g.length,
          'names': g.map(function (item) {
            return item.student.first_name;
          })
        };
      }).entries(data).map(function (group) {
        return {
          'group': group.key === '1' ? 'Checked' : 'Missing',
          'count': group.value.count,
          'names': group.value.names
        };
      });

      var width = 450;
      var height = 300;
      var radius = Math.min(width, height) / 2;

      var tooltip = d3.select(divElement).append('div').attr('class', 'chart-tooltip');

      tooltip.append('div').attr('class', 'percent');

      tooltip.append('div').attr('class', 'students');

      var themeColors = ['#7AC29A', '#EB5E28'];

      var color = d3.scaleOrdinal(themeColors);
      if (nestdata.length === 1 && nestdata[0].group === 'Missing') {
        color = d3.scaleOrdinal(themeColors.slice(1, 2));
      }

      var svg = d3.select(divElement).append('svg').attr('width', width).attr('height', height).append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

      var donutWidth = 50;

      var arc = d3.arc().innerRadius(radius - donutWidth).outerRadius(radius);

      var pie = d3.pie().value(function (d) {
        return d.count;
      }).sort(function (a, b) {
        return a - b;
      });

      var legendRectSize = 18;
      var legendSpacing = 4;

      var path = svg.selectAll('path').data(pie(nestdata)).enter().append('path').attr('d', arc).attr('fill', function (d, i) {
        return color(d.data.group);
      });

      path.on('mouseover', function (d) {
        var percent = Math.round(1000 * d.data.count / data.length) / 10;

        tooltip.select('.students').html(d.data.names.map(function (name) {
          return name + '<br>';
        }).join(''));
        tooltip.select('.percent').html(percent + '%');
        tooltip.style('display', 'block');
      });

      path.on('mouseout', function () {
        tooltip.style('display', 'none');
      });

      var legend = svg.selectAll('.legend').data(color.domain()).enter().append('g').attr('class', 'legend').attr('transform', function (d, i) {
        var height2 = legendRectSize + legendSpacing;
        var offset = height2 * color.domain().length / 2;
        var horz = -2 * legendRectSize;
        var vert = i * height2 - offset;
        return 'translate(' + horz + ',' + vert + ')';
      });

      legend.append('rect').attr('width', legendRectSize).attr('height', legendRectSize).style('fill', color).style('stroke', color);

      legend.append('text').attr('x', legendRectSize + legendSpacing).attr('y', legendRectSize - legendSpacing).text(function (d, i) {
        return d;
      });
    };

    return ReportAssignment;
  }()) || _class);
});
define('gradebook/components/scoresList',['exports', 'aurelia-framework', 'aurelia-validation', 'aurelia-event-aggregator', '../../shared/services/currentService', '../../shared/services/apiService'], function (exports, _aureliaFramework, _aureliaValidation, _aureliaEventAggregator, _currentService, _apiService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ScoresList = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var ScoresList = exports.ScoresList = (_dec = (0, _aureliaFramework.inject)(_apiService.ApiService, _currentService.CurrentService, _aureliaEventAggregator.EventAggregator, _aureliaValidation.ValidationControllerFactory), _dec(_class = function () {
    function ScoresList(api, current, eventaggregator, controllerFactory) {
      _classCallCheck(this, ScoresList);

      this.api = api;
      this.ea = eventaggregator;
      this.current = current;
      this.controller = controllerFactory.createForCurrentScope();

      this.editScoreId = null;
    }

    ScoresList.prototype.editScore = function editScore(score) {
      if (this.current.assignment.isPoints) {
        this.editScoreId = score.id;
        this.editFocus = true;
      } else {
        score.value = 1 - score.value;
        this.updateScore(score);
      }
    };

    ScoresList.prototype.deFocus = function deFocus(key) {
      if (key === 13) {
        this.editFocus = false;
      } else {
        return true;
      }
    };

    ScoresList.prototype.updateScore = function updateScore(score) {
      var _this = this;

      this.controller.validate().then(function (result) {
        if (!result.valid) {
          return;
        }

        _this.api.save(score).then(function (resp) {
          _this.ea.publish('scoreUpdate');

          _this.editScoreId = null;
        });
      });
    };

    return ScoresList;
  }()) || _class);
});
define('gradebook/lib/autocomplete',['exports', 'aurelia-binding', 'aurelia-templating', 'aurelia-dependency-injection', 'aurelia-pal'], function (exports, _aureliaBinding, _aureliaTemplating, _aureliaDependencyInjection, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Autocomplete = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9;

  var nextID = 0;

  var Autocomplete = exports.Autocomplete = (_dec = (0, _aureliaDependencyInjection.inject)(Element), _dec2 = (0, _aureliaTemplating.bindable)({ defaultBindingMode: _aureliaBinding.bindingMode.twoWay }), _dec3 = (0, _aureliaTemplating.bindable)({ defaultBindingMode: _aureliaBinding.bindingMode.twoWay }), _dec4 = (0, _aureliaTemplating.bindable)({ defaultBindingMode: _aureliaBinding.bindingMode.twoWay }), _dec(_class = (_class2 = function () {
    function Autocomplete(element) {
      _classCallCheck(this, Autocomplete);

      _initDefineProp(this, 'service', _descriptor, this);

      _initDefineProp(this, 'value', _descriptor2, this);

      _initDefineProp(this, 'placeholder', _descriptor3, this);

      _initDefineProp(this, 'delay', _descriptor4, this);

      _initDefineProp(this, 'nameFocus', _descriptor5, this);

      _initDefineProp(this, 'scoreFocus', _descriptor6, this);

      _initDefineProp(this, 'isPoints', _descriptor7, this);

      _initDefineProp(this, 'checks', _descriptor8, this);

      this.id = nextID++;
      this.expanded = false;

      _initDefineProp(this, 'inputValue', _descriptor9, this);

      this.updatingInput = false;
      this.suggestions = [];
      this.index = -1;
      this.suggestionsUL = null;
      this.userInput = '';

      this.element = element;
    }

    Autocomplete.prototype.display = function display(name) {
      this.updatingInput = true;
      this.inputValue = name;
      this.updatingInput = false;
    };

    Autocomplete.prototype.getName = function getName(suggestion) {
      if (suggestion == null) {
        return '';
      }
      return this.service.getName(suggestion);
    };

    Autocomplete.prototype.collapse = function collapse() {
      this.expanded = false;
      this.index = -1;
    };

    Autocomplete.prototype.select = function select(suggestion, notify) {
      this.value = suggestion;
      var name = this.getName(this.value);
      this.userInput = name;
      this.display(name);
      this.collapse();
      if (notify) {
        var event = _aureliaPal.DOM.createCustomEvent('change', { bubbles: true });
        event.value = suggestion;
        event.autocomplete = this;
        this.element.dispatchEvent(event);
      }
    };

    Autocomplete.prototype.valueChanged = function valueChanged() {
      this.select(this.value, false);
    };

    Autocomplete.prototype.inputValueChanged = function inputValueChanged(value) {
      var _this = this;

      if (this.updatingInput) {
        return;
      }
      this.userInput = value;
      if (value === '') {
        this.value = null;
        this.collapse();
        return;
      }
      this.service.suggest(value).then(function (suggestions) {
        var _suggestions;

        _this.index = -1;
        (_suggestions = _this.suggestions).splice.apply(_suggestions, [0, _this.suggestions.length].concat(suggestions));
        if (suggestions.length === 1 && suggestions[0].student.first_name !== _this.value) {
          _this.select(suggestions[0], true);
        } else if (suggestions.length === 0) {
          _this.collapse();
        } else {
          _this.expanded = true;
        }
      });
    };

    Autocomplete.prototype.scroll = function scroll() {
      var ul = this.suggestionsUL;
      var li = ul.children.item(this.index === -1 ? 0 : this.index);
      if (li.offsetTop + li.offsetHeight > ul.offsetHeight) {
        ul.scrollTop += li.offsetHeight;
      } else if (li.offsetTop < ul.scrollTop) {
        ul.scrollTop = li.offsetTop;
      }
    };

    Autocomplete.prototype.keydown = function keydown(key) {
      if (!this.expanded) {
        if (key === 13) {
          if (this.isPoints) {
            this.nameFocus = false;
            this.scoreFocus = true;
          } else {
            this.checks({ key: key });
          }
        }
        return true;
      }

      if (key === 40) {
        if (this.index < this.suggestions.length - 1) {
          this.index++;
          this.display(this.getName(this.suggestions[this.index]));
        } else {
          this.index = -1;
          this.display(this.userInput);
        }
        this.scroll();
        return;
      }

      if (key === 38) {
        if (this.index === -1) {
          this.index = this.suggestions.length - 1;
          this.display(this.getName(this.suggestions[this.index]));
        } else if (this.index > 0) {
          this.index--;
          this.display(this.getName(this.suggestions[this.index]));
        } else {
          this.index = -1;
          this.display(this.userInput);
        }
        this.scroll();
        return;
      }

      if (key === 27) {
        this.display(this.userInput);
        this.collapse();
        return;
      }

      if (key === 13) {
        if (this.index >= 0) {
          this.select(this.suggestions[this.index], true);
        }
        this.quickNameFocus = false;
        this.quickScoreFocus = true;
        return;
      }

      return true;
    };

    Autocomplete.prototype.blur = function blur() {
      this.select(this.value, false);
      this.element.dispatchEvent(_aureliaPal.DOM.createCustomEvent('blur'));
    };

    Autocomplete.prototype.suggestionClicked = function suggestionClicked(suggestion) {
      this.select(suggestion, true);
    };

    Autocomplete.prototype.focus = function focus() {
      this.element.firstElementChild.focus();
    };

    return Autocomplete;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'service', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'value', [_dec2], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'placeholder', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'delay', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return 300;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'nameFocus', [_dec3], {
    enumerable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'scoreFocus', [_dec4], {
    enumerable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'isPoints', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'checks', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'inputValue', [_aureliaBinding.observable], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  })), _class2)) || _class);
});
define('gradebook/models/assignment',['exports', 'aurelia-validation'], function (exports, _aureliaValidation) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Assignment = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Assignment = exports.Assignment = function () {
    function Assignment(data) {
      _classCallCheck(this, Assignment);

      Object.assign(this, data);
    }

    _createClass(Assignment, [{
      key: 'source',
      get: function get() {
        return 'assignments';
      }
    }, {
      key: 'isPoints',
      get: function get() {
        return this.type === 'Points';
      }
    }]);

    return Assignment;
  }();

  _aureliaValidation.ValidationRules.ensure('name').displayName('Name').required().maxLength(255).ensure('date').displayName('Date').required().satisfiesRule('date').ensure('type').displayName('Type').required().ensure('max').displayName('Max Score').required().on(Assignment);
});
define('gradebook/models/score',['exports', 'aurelia-validation'], function (exports, _aureliaValidation) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Score = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Score = exports.Score = function () {
    function Score(data) {
      _classCallCheck(this, Score);

      Object.assign(this, data);
    }

    _createClass(Score, [{
      key: 'source',
      get: function get() {
        return 'scores';
      }
    }]);

    return Score;
  }();

  _aureliaValidation.ValidationRules.ensure('value').displayName('Score').required().on(Score);
});
define('gradebook/models/student',['exports', 'aurelia-validation'], function (exports, _aureliaValidation) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Student = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Student = exports.Student = function () {
    function Student(data) {
      _classCallCheck(this, Student);

      Object.assign(this, data);
    }

    _createClass(Student, [{
      key: 'source',
      get: function get() {
        return 'students';
      }
    }, {
      key: 'fullName',
      get: function get() {
        return this.first_name + ' ' + this.last_name;
      }
    }]);

    return Student;
  }();

  _aureliaValidation.ValidationRules.ensure('first_name').displayName('First Name').required().maxLength(255).ensure('last_name').displayName('Last Name').required().maxLength(255).on(Student);
});
define('gradebook/models/subject',['exports', 'aurelia-validation'], function (exports, _aureliaValidation) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Subject = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Subject = exports.Subject = function () {
    function Subject(data) {
      _classCallCheck(this, Subject);

      Object.assign(this, data);
    }

    _createClass(Subject, [{
      key: 'source',
      get: function get() {
        return 'subjects';
      }
    }]);

    return Subject;
  }();

  _aureliaValidation.ValidationRules.ensure('name').displayName('Name').required().maxLength(255).on(Subject);
});
define('gradebook/models/year',['exports', 'aurelia-validation'], function (exports, _aureliaValidation) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Year = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Year = exports.Year = function () {
    function Year(data) {
      _classCallCheck(this, Year);

      Object.assign(this, data);
    }

    _createClass(Year, [{
      key: 'source',
      get: function get() {
        return 'years';
      }
    }]);

    return Year;
  }();

  _aureliaValidation.ValidationRules.ensure('school').displayName('School Name').required().maxLength(255).ensure('first_day').displayName('First Day').required().satisfiesRule('date').ensure('last_day').displayName('Last Day').required().satisfiesRule('date').on(Year);
});
define('home/signup/firstTime',['exports', 'aurelia-framework', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.FirstTime = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var FirstTime = exports.FirstTime = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router), _dec(_class = function () {
    function FirstTime(router) {
      _classCallCheck(this, FirstTime);

      this.router = router;
    }

    FirstTime.prototype.created = function created() {
      this.completed = [];
      this.todo = ['Introduction', 'Profile', 'Years', 'Students', 'Subjects'];

      this.activeStep = 'Introduction';
    };

    FirstTime.prototype.nextStep = function nextStep(step) {
      var _this = this;

      if (step !== this.activeStep) {
        return;
      }

      this.completed.push(this.todo.shift());
      this.activeStep = this.todo[0];

      if (this.todo.length === 0) {
        setTimeout(function () {
          _this.router.navigate('gradebook');
        }, 800);
      }
    };

    return FirstTime;
  }()) || _class);
});
define('home/signup/payment',['exports', 'aurelia-framework', 'shared/services/apiService'], function (exports, _aureliaFramework, _apiService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.PaymentSetup = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var PaymentSetup = exports.PaymentSetup = (_dec = (0, _aureliaFramework.inject)(_apiService.ApiService), _dec(_class = function PaymentSetup(api) {
    _classCallCheck(this, PaymentSetup);

    this.api = api;
  }) || _class);
});
define('reports/attributes/timePlot',['exports', 'aurelia-framework', 'd3'], function (exports, _aureliaFramework, _d) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TimePlotCustomAttribute = undefined;

  var d3 = _interopRequireWildcard(_d);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2;

  var TimePlotCustomAttribute = exports.TimePlotCustomAttribute = (_dec = (0, _aureliaFramework.inject)(Element), _dec(_class = (_class2 = function () {
    function TimePlotCustomAttribute(element) {
      _classCallCheck(this, TimePlotCustomAttribute);

      _initDefineProp(this, 'scores', _descriptor, this);

      _initDefineProp(this, 'type', _descriptor2, this);

      this.element = element;
    }

    TimePlotCustomAttribute.prototype.bind = function bind() {
      this.timePlot(this.scores, this.type);
    };

    TimePlotCustomAttribute.prototype.timePlot = function timePlot(data, type) {
      var margin = { top: 20, right: 20, bottom: 50, left: 50 };
      var width = 320 - margin.left - margin.right;
      var height = 200 - margin.top - margin.bottom;

      var parseTime = d3.timeParse('%Y-%m-%d');

      var x = d3.scaleTime().range([0, width]);
      var y = d3.scaleLinear().range([height, 0]);

      var valueline = d3.line().x(function (d) {
        return x(d.assignment.date);
      });

      if (type === 'Points') {
        valueline = valueline.y(function (d) {
          return y(Math.round(d.value / d.assignment.max * 100));
        });
      } else if (type === 'Checks') {
        var _movingSum = 0;
        valueline = valueline.y(function (d, i) {
          _movingSum += d.value;
          return y(_movingSum / (i + 1));
        });
      }

      var svg = d3.select(this.element).append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      data = data.filter(function (d) {
        return d.assignment.type === type;
      });
      data.forEach(function (d) {
        return d.assignment.date = parseTime(d.assignment.date);
      });

      x.domain(d3.extent(data, function (d) {
        return d.assignment.date;
      }));
      if (type === 'Points') {
        y.domain([0, 100]);
      } else {
        y.domain([0, 1]);
      }

      svg.append('path').data([data]).attr('class', 'line').attr('d', valueline);

      svg.append('g').attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x).tickFormat(d3.timeFormat('%m/%d')).ticks(data.length));

      svg.append('g').call(d3.axisLeft(y));
    };

    return TimePlotCustomAttribute;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'scores', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'type', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('reports/components/studentReport',['exports', 'aurelia-framework', '../../shared/services/currentService', '../../shared/services/apiService', 'moment'], function (exports, _aureliaFramework, _currentService, _apiService, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.StudentReport = undefined;

  var _moment2 = _interopRequireDefault(_moment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var StudentReport = exports.StudentReport = (_dec = (0, _aureliaFramework.inject)(_currentService.CurrentService, _apiService.ApiService), _dec(_class = function () {
    function StudentReport(current, api) {
      _classCallCheck(this, StudentReport);

      this.current = current;
      this.api = api;
    }

    StudentReport.prototype.attached = function attached() {
      this.setStudentList();
      this.selected = { 'start': this.current.year.first_day, 'end': (0, _moment2.default)().format('YYYY-MM-DD') };
      this.reportGenerated = false;
    };

    StudentReport.prototype.setStudentList = function setStudentList() {
      var _this = this;

      var query = {
        filters: [{ 'name': 'year_id', 'op': 'eq', 'val': this.current.year.id }],
        order_by: [{ 'field': 'first_name', 'direction': 'asc' }]
      };

      this.api.find('students', query).then(function (data) {
        return _this.students = data.objects;
      });
    };

    StudentReport.prototype.generate = function generate() {
      var _this2 = this;

      this.reportGenerated = false;

      var query = {
        filters: [{ 'name': 'student_id', 'op': 'eq', 'val': this.selected.student.id }, { 'name': 'assignment', 'op': 'has', 'val': {
            'name': 'date', 'op': 'ge', 'val': this.selected.start } }, { 'name': 'assignment', 'op': 'has', 'val': {
            'name': 'date', 'op': 'le', 'val': this.selected.end } }],
        order_by: [{ 'field': 'assignment__date', 'direction': 'asc' }]
      };

      this.api.find('scores', query).then(function (data) {
        _this2.scores = data.objects;
        _this2.reportGenerated = true;
      });
    };

    return StudentReport;
  }()) || _class);
});
define('reports/converters/scoreFilter',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var scoreFilterValueConverter = exports.scoreFilterValueConverter = function () {
    function scoreFilterValueConverter() {
      _classCallCheck(this, scoreFilterValueConverter);
    }

    scoreFilterValueConverter.prototype.toView = function toView(scores, subjectid) {
      return scores.filter(function (score) {
        return score.assignment.subject_id === subjectid;
      });
    };

    return scoreFilterValueConverter;
  }();
});
define('shared/attributes/bootstrap-datepicker',['exports', 'aurelia-framework', 'src/assets/js/bootstrap-datepicker.js'], function (exports, _aureliaFramework, _bootstrapDatepicker) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BootstrapDatepickerCustomAttribute = undefined;

  var _bootstrapDatepicker2 = _interopRequireDefault(_bootstrapDatepicker);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var defaultOptions = {
    format: 'yyyy-mm-dd',
    color: 'blue'
  };

  var BootstrapDatepickerCustomAttribute = exports.BootstrapDatepickerCustomAttribute = (_dec = (0, _aureliaFramework.inject)(Element), _dec(_class = function () {
    function BootstrapDatepickerCustomAttribute(element) {
      _classCallCheck(this, BootstrapDatepickerCustomAttribute);

      this.element = element;
    }

    BootstrapDatepickerCustomAttribute.prototype.attached = function attached() {
      var options = Object.assign({}, defaultOptions, this.value || {});
      $(this.element).datepicker(options).on('changeDate', function (e) {
        return fireEvent(e.target, 'change');
      });
    };

    BootstrapDatepickerCustomAttribute.prototype.detached = function detached() {
      $(this.element).datepicker('hide');
    };

    return BootstrapDatepickerCustomAttribute;
  }()) || _class);


  function fireEvent(element, name) {
    var event = document.createEvent('Event');
    event.initEvent(name, true, true);
    element.dispatchEvent(event);
  }
});
define('shared/attributes/bootstrap-select',['exports', 'aurelia-framework', 'bootstrap-select'], function (exports, _aureliaFramework, _bootstrapSelect) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.BootstrapSelectCustomAttribute = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var defaultOptions = {};

  var BootstrapSelectCustomAttribute = exports.BootstrapSelectCustomAttribute = (_dec = (0, _aureliaFramework.inject)(Element), _dec(_class = function () {
    function BootstrapSelectCustomAttribute(element) {
      _classCallCheck(this, BootstrapSelectCustomAttribute);

      this.element = element;
    }

    BootstrapSelectCustomAttribute.prototype.attached = function attached() {
      var options = Object.assign({}, defaultOptions, this.value || {});
      $(this.element).selectpicker(options);
    };

    BootstrapSelectCustomAttribute.prototype.detached = function detached() {
      $(this.element).selectpicker('destroy');
    };

    return BootstrapSelectCustomAttribute;
  }()) || _class);
});
define('shared/components/footbar',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var FootBar = exports.FootBar = function FootBar() {
    _classCallCheck(this, FootBar);
  };
});
define('shared/components/navbar',['exports', 'aurelia-framework', 'aurelia-router', 'aurelia-validation', 'aurelia-auth', 'shared/services/currentService', 'shared/services/httpService', 'shared/models/user'], function (exports, _aureliaFramework, _aureliaRouter, _aureliaValidation, _aureliaAuth, _currentService, _httpService, _user) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NavBar = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var NavBar = exports.NavBar = (_dec = (0, _aureliaFramework.inject)(_currentService.CurrentService, _aureliaAuth.AuthService, _aureliaRouter.Router, _httpService.HttpService, _aureliaValidation.ValidationControllerFactory), _dec(_class = function () {
    function NavBar(current, auth, router, http, controllerFactory) {
      _classCallCheck(this, NavBar);

      this.user = new _user.User();

      this.current = current;
      this.auth = auth;
      this.router = router;
      this.http = http;
      this.controller = controllerFactory.createForCurrentScope();
    }

    NavBar.prototype.attached = function attached() {
      this.showReset = false;
    };

    NavBar.prototype.login = function login() {
      this.auth.login(this.user).then(function (resp) {
        return location.reload();
      });
    };

    NavBar.prototype.logout = function logout() {
      this.auth.logout().then(location.reload());
    };

    NavBar.prototype.toggleReset = function toggleReset() {
      this.showReset = true;
    };

    NavBar.prototype.sendReset = function sendReset() {
      this.http.send('auth/forgot_password', { email: this.loginData.email });
    };

    return NavBar;
  }()) || _class);
});
define('shared/components/scriptInjector',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.scriptinjector = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var scriptinjector = exports.scriptinjector = (_dec = (0, _aureliaFramework.noView)(), _dec2 = (0, _aureliaFramework.customElement)('scriptinjector'), _dec3 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.oneWay }), _dec(_class = _dec2(_class = (_class2 = function () {
    function scriptinjector() {
      _classCallCheck(this, scriptinjector);

      _initDefineProp(this, 'url', _descriptor, this);

      _initDefineProp(this, 'isAsync', _descriptor2, this);

      _initDefineProp(this, 'scripttag', _descriptor3, this);
    }

    scriptinjector.prototype.attached = function attached() {
      if (this.url) {
        this.scripttag = document.createElement('script');
        if (this.isAsync) {
          this.scripttag.async = true;
        }
        this.scripttag.setAttribute('src', this.url);
        document.body.appendChild(this.scripttag);
      }
    };

    scriptinjector.prototype.detached = function detached() {
      if (this.scripttag) {
        this.scripttag.remove();
      }
    };

    return scriptinjector;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'url', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'isAsync', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'scripttag', [_dec3], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class);
});
define('shared/converters/dateFormat',['exports', 'moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DateFormatValueConverter = undefined;

  var _moment2 = _interopRequireDefault(_moment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var DateFormatValueConverter = exports.DateFormatValueConverter = function () {
    function DateFormatValueConverter() {
      _classCallCheck(this, DateFormatValueConverter);
    }

    DateFormatValueConverter.prototype.toView = function toView(value, format) {
      return (0, _moment2.default)(value).format(format);
    };

    return DateFormatValueConverter;
  }();
});
define('shared/converters/scoreFormat',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var ScoreFormatValueConverter = exports.ScoreFormatValueConverter = function () {
    function ScoreFormatValueConverter() {
      _classCallCheck(this, ScoreFormatValueConverter);
    }

    ScoreFormatValueConverter.prototype.toView = function toView(score, meta) {
      if (meta.type === 'Checks') {
        return this.checks(score);
      } else if (meta.type === 'Points' & meta.max !== 0) {
        return this.percent(score, meta);
      }

      return score;
    };

    ScoreFormatValueConverter.prototype.checks = function checks(score) {
      if (score === 1) {
        return '<i class="fa fa-check-circle-o fa-2x" aria-hidden="true"></i>';
      }

      return '<i class="fa fa-circle-o fa-2x" aria-hidden="true"></i>';
    };

    ScoreFormatValueConverter.prototype.percent = function percent(score, meta) {
      return Math.round(score / meta.max * 100) + '%';
    };

    return ScoreFormatValueConverter;
  }();
});
define('shared/models/user',['exports', 'aurelia-validation'], function (exports, _aureliaValidation) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.User = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var User = exports.User = function () {
    function User(data) {
      _classCallCheck(this, User);

      Object.assign(this, data);
    }

    _createClass(User, [{
      key: 'source',
      get: function get() {
        return 'users';
      }
    }, {
      key: 'teacherName',
      get: function get() {
        if (this.title && this.last_name) {
          return this.title + ' ' + this.last_name;
        }
      }
    }]);

    return User;
  }();

  _aureliaValidation.ValidationRules.ensure('email').required().email().ensure('password').required().minLength(8).maxLength(50).ensure('first_name').displayName('First Name').maxLength(255).ensure('last_name').displayName('Last Name').required().maxLength(255).ensure('title').required().on(User);
});
define('shared/services/apiService',['exports', 'aurelia-http-client', 'aurelia-framework', 'aurelia-auth', 'shared/models/user', 'gradebook/models/year', 'gradebook/models/student', 'gradebook/models/subject', 'gradebook/models/assignment', 'gradebook/models/score'], function (exports, _aureliaHttpClient, _aureliaFramework, _aureliaAuth, _user, _year, _student, _subject, _assignment, _score) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ApiService = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var ApiService = exports.ApiService = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _aureliaAuth.AuthService), _dec(_class = function () {
    function ApiService(http, auth) {
      _classCallCheck(this, ApiService);

      http.configure(function (config) {
        config.withBaseUrl('http://localhost:5000/api/').withHeader('Authorization', 'Bearer ' + auth.auth.getToken()).withInterceptor({
          response: function response(message) {
            if (message.statusCode === 204) {
              return message;
            }

            var parsed = JSON.parse(message.response);
            var source = message.requestMessage.url.split('/')[0];

            if (parsed.objects) {
              parsed.objects = parsed.objects.map(function (item) {
                return new modelMap[source](item);
              });
              return parsed;
            }
            return new modelMap[source](parsed);
          }
        });
      });

      this.http = http;
    }

    ApiService.prototype.find = function find(source, query) {
      return this.http.createRequest(source).asGet().withParams({ q: JSON.stringify(query) }).send();
    };

    ApiService.prototype.findOne = function findOne(source, id) {
      return this.http.createRequest(source + '/' + id).asGet().send();
    };

    ApiService.prototype.save = function save(model) {
      if (model.id) {
        return this.http.createRequest(model.source + '/' + model.id).asPut().withContent(model).send();
      }

      return this.http.createRequest(model.source).asPost().withContent(model).send();
    };

    ApiService.prototype.delete = function _delete(model) {
      return this.http.createRequest(model.source + '/' + model.id).asDelete().send();
    };

    return ApiService;
  }()) || _class);

  var modelMap = { 'users': _user.User,
    'years': _year.Year,
    'students': _student.Student,
    'subjects': _subject.Subject,
    'assignments': _assignment.Assignment,
    'scores': _score.Score };
});
define('shared/services/currentService',['exports', 'aurelia-event-aggregator', 'aurelia-router', './apiService', 'aurelia-framework', 'moment'], function (exports, _aureliaEventAggregator, _aureliaRouter, _apiService, _aureliaFramework, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.CurrentService = undefined;

  var _moment2 = _interopRequireDefault(_moment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var CurrentService = exports.CurrentService = (_dec = (0, _aureliaFramework.inject)(_apiService.ApiService, _aureliaEventAggregator.EventAggregator, _aureliaRouter.Router), _dec(_class = function () {
    function CurrentService(api, eventaggregator, router) {
      _classCallCheck(this, CurrentService);

      this.api = api;
      this.ea = eventaggregator;
      this.router = router;

      this.subjectList = [];
    }

    CurrentService.prototype.setUser = function setUser(user) {
      this.user = user;
    };

    CurrentService.prototype.reviveUser = function reviveUser(userId) {
      var _this = this;

      this.api.findOne('users', userId).then(function (data) {
        _this.user = data;
        if (_this.user.active_year) {
          _this.reviveYear(_this.user.active_year);
        }
      });
    };

    CurrentService.prototype.setSubjectList = function setSubjectList() {
      var _this2 = this;

      var query = {
        filters: [{ 'name': 'year_id', 'op': 'eq', 'val': this.year.id }]
      };

      return this.api.find('subjects', query).then(function (data) {
        return _this2.subjectList = data.objects;
      });
    };

    CurrentService.prototype.setSubject = function setSubject(subject) {
      this.subject = subject;
      this.clearAssignment();
      this.ea.publish('subjectSet');
    };

    CurrentService.prototype.clearSubject = function clearSubject() {
      this.subject = false;
      this.clearAssignment();
    };

    CurrentService.prototype.setAssignmentList = function setAssignmentList(date) {
      var _this3 = this;

      console.log("assignment list set");

      date = (0, _moment2.default)(date);
      var weekStart = date.startOf('isoweek').format('YYYY-MM-DD');
      var weekEnd = date.endOf('isoweek').format('YYYY-MM-DD');

      var query = {
        filters: [{ 'name': 'subject_id', 'op': 'eq', 'val': this.subject.id }, { 'name': 'date', 'op': 'ge', 'val': weekStart }, { 'name': 'date', 'op': 'le', 'val': weekEnd }],
        order_by: [{ 'field': 'date', 'direction': 'desc' }]
      };

      return this.api.find('assignments', query).then(function (data) {
        _this3.assignmentList = data.objects;
        return date;
      });
    };

    CurrentService.prototype.setAssignment = function setAssignment(assignment) {
      this.assignment = assignment;
      this.setScores(assignment.id);
    };

    CurrentService.prototype.clearAssignment = function clearAssignment() {
      this.assignment = false;
      this.scores = false;
    };

    CurrentService.prototype.setScores = function setScores(assignId) {
      var _this4 = this;

      var query = {
        filters: [{ 'name': 'assignment_id', 'op': 'eq', 'val': assignId }],
        order_by: [{ 'field': 'student__first_name', 'direction': 'asc' }]
      };

      this.api.find('scores', query).then(function (data) {
        _this4.scores = data.objects;
        _this4.ea.publish('scoreUpdate');
      });
    };

    CurrentService.prototype.setYear = function setYear(year) {
      this.year = year;

      this.user.active_year = year.id;
      this.api.save(this.user);

      this.clearAssignment();
      this.subjectList = [];
      this.assignmentList = [];
    };

    CurrentService.prototype.reviveYear = function reviveYear(yearId) {
      var _this5 = this;

      this.api.findOne('years', yearId).then(function (data) {
        return _this5.year = data;
      });
    };

    CurrentService.prototype.navigateTo = function navigateTo(route, params) {
      this.router.navigateToRoute(route, params, { trigger: true });
    };

    return CurrentService;
  }()) || _class);
});
define('shared/services/httpService',['exports', 'aurelia-framework', 'aurelia-http-client', 'aurelia-auth'], function (exports, _aureliaFramework, _aureliaHttpClient, _aureliaAuth) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HttpService = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var HttpService = exports.HttpService = (_dec = (0, _aureliaFramework.inject)(_aureliaAuth.AuthService), _dec(_class = function () {
    function HttpService(auth) {
      _classCallCheck(this, HttpService);

      this.http = new _aureliaHttpClient.HttpClient();
      this.auth = auth;

      this.http.configure(function (config) {
        config.withBaseUrl('http://localhost:5000/').withInterceptor({
          response: function response(message) {
            return JSON.parse(message.response);
          }
        });
      });
    }

    HttpService.prototype.send = function send(url, body) {
      var withToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var req = this.http.createRequest(url).asPost().withContent(body);
      if (withToken) {
        req = req.withHeader('Authorization', 'Bearer ' + this.auth.auth.getToken());
      }

      return req.send();
    };

    return HttpService;
  }()) || _class);
});
define('shared/attributes/tooltip',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TooltipCustomAttribute = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var TooltipCustomAttribute = exports.TooltipCustomAttribute = (_dec = (0, _aureliaFramework.inject)(Element), _dec(_class = function () {
    function TooltipCustomAttribute(element) {
      _classCallCheck(this, TooltipCustomAttribute);

      this.element = element;
    }

    TooltipCustomAttribute.prototype.attached = function attached() {
      $(this.element).tooltip();
    };

    return TooltipCustomAttribute;
  }()) || _class);
});
define('shared/converters/weekFormat',['exports', 'moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.WeekFormatValueConverter = undefined;

  var _moment2 = _interopRequireDefault(_moment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var WeekFormatValueConverter = exports.WeekFormatValueConverter = function () {
    function WeekFormatValueConverter() {
      _classCallCheck(this, WeekFormatValueConverter);
    }

    WeekFormatValueConverter.prototype.toView = function toView(value) {
      return 'Week of ' + (0, _moment2.default)(value).format('MMMM Do');
    };

    return WeekFormatValueConverter;
  }();
});
define('gradebook/library/autocomplete',['exports', 'aurelia-binding', 'aurelia-templating', 'aurelia-dependency-injection', 'aurelia-pal'], function (exports, _aureliaBinding, _aureliaTemplating, _aureliaDependencyInjection, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Autocomplete = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9;

  var nextID = 0;

  var Autocomplete = exports.Autocomplete = (_dec = (0, _aureliaDependencyInjection.inject)(Element), _dec2 = (0, _aureliaTemplating.bindable)({ defaultBindingMode: _aureliaBinding.bindingMode.twoWay }), _dec3 = (0, _aureliaTemplating.bindable)({ defaultBindingMode: _aureliaBinding.bindingMode.twoWay }), _dec4 = (0, _aureliaTemplating.bindable)({ defaultBindingMode: _aureliaBinding.bindingMode.twoWay }), _dec(_class = (_class2 = function () {
    function Autocomplete(element) {
      _classCallCheck(this, Autocomplete);

      _initDefineProp(this, 'service', _descriptor, this);

      _initDefineProp(this, 'value', _descriptor2, this);

      _initDefineProp(this, 'placeholder', _descriptor3, this);

      _initDefineProp(this, 'delay', _descriptor4, this);

      _initDefineProp(this, 'nameFocus', _descriptor5, this);

      _initDefineProp(this, 'scoreFocus', _descriptor6, this);

      _initDefineProp(this, 'isPoints', _descriptor7, this);

      _initDefineProp(this, 'checks', _descriptor8, this);

      this.id = nextID++;
      this.expanded = false;

      _initDefineProp(this, 'inputValue', _descriptor9, this);

      this.updatingInput = false;
      this.suggestions = [];
      this.index = -1;
      this.suggestionsUL = null;
      this.userInput = '';

      this.element = element;
    }

    Autocomplete.prototype.display = function display(name) {
      this.updatingInput = true;
      this.inputValue = name;
      this.updatingInput = false;
    };

    Autocomplete.prototype.getName = function getName(suggestion) {
      if (suggestion == null) {
        return '';
      }
      return this.service.getName(suggestion);
    };

    Autocomplete.prototype.collapse = function collapse() {
      this.expanded = false;
      this.index = -1;
    };

    Autocomplete.prototype.select = function select(suggestion, notify) {
      this.value = suggestion;
      var name = this.getName(this.value);
      this.userInput = name;
      this.display(name);
      this.collapse();
      if (notify) {
        var event = _aureliaPal.DOM.createCustomEvent('change', { bubbles: true });
        event.value = suggestion;
        event.autocomplete = this;
        this.element.dispatchEvent(event);
      }
    };

    Autocomplete.prototype.valueChanged = function valueChanged() {
      this.select(this.value, false);
    };

    Autocomplete.prototype.inputValueChanged = function inputValueChanged(value) {
      var _this = this;

      if (this.updatingInput) {
        return;
      }
      this.userInput = value;
      if (value === '') {
        this.value = null;
        this.collapse();
        return;
      }
      this.service.suggest(value).then(function (suggestions) {
        var _suggestions;

        _this.index = -1;
        (_suggestions = _this.suggestions).splice.apply(_suggestions, [0, _this.suggestions.length].concat(suggestions));
        if (suggestions.length === 1 && suggestions[0].student.first_name !== _this.value) {
          _this.select(suggestions[0], true);
        } else if (suggestions.length === 0) {
          _this.collapse();
        } else {
          _this.expanded = true;
        }
      });
    };

    Autocomplete.prototype.scroll = function scroll() {
      var ul = this.suggestionsUL;
      var li = ul.children.item(this.index === -1 ? 0 : this.index);
      if (li.offsetTop + li.offsetHeight > ul.offsetHeight) {
        ul.scrollTop += li.offsetHeight;
      } else if (li.offsetTop < ul.scrollTop) {
        ul.scrollTop = li.offsetTop;
      }
    };

    Autocomplete.prototype.keydown = function keydown(key) {
      if (!this.expanded) {
        if (key === 13) {
          if (this.isPoints) {
            this.nameFocus = false;
            this.scoreFocus = true;
          } else {
            this.checks({ key: key });
          }
        }
        return true;
      }

      if (key === 40) {
        if (this.index < this.suggestions.length - 1) {
          this.index++;
          this.display(this.getName(this.suggestions[this.index]));
        } else {
          this.index = -1;
          this.display(this.userInput);
        }
        this.scroll();
        return;
      }

      if (key === 38) {
        if (this.index === -1) {
          this.index = this.suggestions.length - 1;
          this.display(this.getName(this.suggestions[this.index]));
        } else if (this.index > 0) {
          this.index--;
          this.display(this.getName(this.suggestions[this.index]));
        } else {
          this.index = -1;
          this.display(this.userInput);
        }
        this.scroll();
        return;
      }

      if (key === 27) {
        this.display(this.userInput);
        this.collapse();
        return;
      }

      if (key === 13) {
        if (this.index >= 0) {
          this.select(this.suggestions[this.index], true);
        }
        this.quickNameFocus = false;
        this.quickScoreFocus = true;
        return;
      }

      return true;
    };

    Autocomplete.prototype.blur = function blur() {
      this.select(this.value, false);
      this.element.dispatchEvent(_aureliaPal.DOM.createCustomEvent('blur'));
    };

    Autocomplete.prototype.suggestionClicked = function suggestionClicked(suggestion) {
      this.select(suggestion, true);
    };

    Autocomplete.prototype.focus = function focus() {
      this.element.firstElementChild.focus();
    };

    return Autocomplete;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'service', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'value', [_dec2], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'placeholder', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'delay', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return 300;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'nameFocus', [_dec3], {
    enumerable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'scoreFocus', [_dec4], {
    enumerable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'isPoints', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'checks', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'inputValue', [_aureliaBinding.observable], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  })), _class2)) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <!-- <require from=\"bootstrap-select/css/bootstrap-select.min.css\"></require> -->\n  <require from=\"assets/css/ct-paper.css\"></require>\n  <require from=\"assets/css/examples.css\"></require>\n  <require from=\"assets/css/demo.css\"></require>\n  <require from=\"css/marks.css\"></require>\n\n  <require from=\"shared/components/navbar\"></require>\n  <require from=\"shared/components/footbar\"></require>\n\n  <style>\n\n</style>\n\n  <!-- Navigation -->\n  <div class=\"section\">\n    <div class=\"container-fluid\">\n      <nav-bar></nav-bar>\n\n      <!-- Viewport -->\n      <router-view></router-view>\n\n      <!-- Footer -->\n      <foot-bar></foot-bar>\n    </div>\n  </div>\n</template>\n"; });
define('text!css/marks.css', ['module'], function(module) { module.exports = "#login-dp{\n  min-width: 250px;\n  padding: 14px 14px 0;\n  overflow:hidden;\n  background-color:rgba(255,255,255,.95);\n}\n#login-dp .help-block{\n  font-size:12px\n}\n#login-dp .bottom{\n  background-color:rgba(255,255,255,.8);\n  border-top:1px solid #ddd;\n  clear:both;\n  padding:14px;\n}\n#login-dp .social-buttons{\n  margin:12px 0\n}\n#login-dp .social-buttons a{\n  width: 49%;\n}\n#login-dp .form-group {\n  margin-bottom: 10px;\n}\n.btn-fb{\n  color: #fff;\n  background-color:#3b5998;\n}\n.btn-fb:hover{\n  color: #fff;\n  background-color:#496ebc\n}\n.btn-tw{\n  color: #fff;\n  background-color:#55acee;\n}\n.btn-tw:hover{\n  color: #fff;\n  background-color:#59b5fa;\n}\n@media(max-width:768px){\n  #login-dp{\n      background-color: inherit;\n      color: #fff;\n  }\n  #login-dp .bottom{\n      background-color: inherit;\n      border-top:0 none;\n  }\n}\n\n/*Scores Tables*/\n.scores tr {\n height: 70px;\n}\n"; });
define('text!admin/settings.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"admin/components/profile\"></require>\n  <require from=\"admin/components/password\"></require>\n\n  <div class=\"col-md-7 col-md-offset-3\">\n    <h1>Settings</h1>\n    <hr>\n    <profile></profile>\n    <hr>\n    <password></password>\n  </div>\n</template>\n"; });
define('text!assets/css/ct-paper.css', ['module'], function(module) { module.exports = "/*      light colors - used for select dropdown         */\n/*           Font Smoothing      */\nh1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6, p, .navbar, .brand, a, .td-name, td {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-family: 'Montserrat', \"Helvetica\", Arial, sans-serif;\n}\n\nh1, .h1, h2, .h2, h3, .h3, h4, .h4 {\n  font-weight: 400;\n  margin: 30px 0 15px;\n}\n\nh1, .h1 {\n  font-size: 4.5em;\n}\n\nh2, .h2 {\n  font-size: 3em;\n}\n\nh3, .h3 {\n  font-size: 1.825em;\n  line-height: 1.4;\n  margin: 20px 0 10px;\n}\n\nh4, .h4 {\n  font-size: 1.5em;\n  font-weight: 600;\n  line-height: 1.2em;\n}\n\nh5, .h5 {\n  font-size: 1.25em;\n  font-weight: 400;\n  line-height: 1.4em;\n  margin-bottom: 15px;\n}\n\nh6, .h6 {\n  font-size: 0.9em;\n  font-weight: 600;\n  text-transform: uppercase;\n}\n\np {\n  font-size: 16px;\n  line-height: 1.5em;\n}\n\nh1 small, h2 small, h3 small, h4 small, h5 small, h6 small, .h1 small, .h2 small, .h3 small, .h4 small, .h5 small, .h6 small, h1 .small, h2 .small, h3 .small, h4 .small, h5 .small, h6 .small, .h1 .small, .h2 .small, .h3 .small, .h4 .small, .h5 .small, .h6 .small {\n  color: #9A9A9A;\n  font-weight: 300;\n  line-height: 1.5em;\n}\n\nh1 small, h2 small, h3 small, h1 .small, h2 .small, h3 .small {\n  font-size: 60%;\n}\n\n.title-uppercase {\n  text-transform: uppercase;\n}\n\nblockquote {\n  font-style: italic;\n}\n\nblockquote small {\n  font-style: normal;\n}\n\n.text-muted {\n  color: #a49e93;\n}\n\n.text-primary, .text-primary:hover {\n  color: #427C89;\n}\n\n.text-info, .text-info:hover {\n  color: #3091B2;\n}\n\n.text-success, .text-success:hover {\n  color: #42A084;\n}\n\n.text-warning, .text-warning:hover {\n  color: #BB992F;\n}\n\n.text-danger, .text-danger:hover {\n  color: #B33C12;\n}\n\n.glyphicon {\n  line-height: 1;\n}\n\n.title-no-upper-margin {\n  margin-top: 0px;\n}\n\nstrong {\n  color: #403D39;\n}\n\n.chart-legend .text-primary, .chart-legend .text-primary:hover {\n  color: #7A9E9F;\n}\n.chart-legend .text-info, .chart-legend .text-info:hover {\n  color: #68B3C8;\n}\n.chart-legend .text-success, .chart-legend .text-success:hover {\n  color: #7AC29A;\n}\n.chart-legend .text-warning, .chart-legend .text-warning:hover {\n  color: #F3BB45;\n}\n.chart-legend .text-danger, .chart-legend .text-danger:hover {\n  color: #EB5E28;\n}\n\n/*     General overwrite     */\nbody {\n  color: #66615b;\n  font-size: 16px;\n  font-family: 'Montserrat', \"Helvetica\", Arial, sans-serif;\n}\n\na {\n  color: #68B3C8;\n  -webkit-transition: all 150ms linear;\n  -moz-transition: all 150ms linear;\n  -o-transition: all 150ms linear;\n  -ms-transition: all 150ms linear;\n  transition: all 150ms linear;\n}\na:hover, a:focus {\n  color: #3091B2;\n  text-decoration: none;\n}\n\nhr {\n  border-color: #F1EAE0;\n}\n\n.fa-base {\n  font-size: 1.25em !important;\n}\n\na:focus, a:active,\nbutton::-moz-focus-inner,\ninput[type=\"reset\"]::-moz-focus-inner,\ninput[type=\"button\"]::-moz-focus-inner,\ninput[type=\"submit\"]::-moz-focus-inner,\nselect::-moz-focus-inner,\ninput[type=\"file\"] > input[type=\"button\"]::-moz-focus-inner {\n  outline: 0;\n}\n\n.ui-slider-handle:focus,\n.navbar-toggle {\n  outline: 0 !important;\n}\n\n/*           Animations              */\n.form-control,\n.input-group-addon,\n.tagsinput,\n.navbar,\n.navbar .alert {\n  -webkit-transition: all 300ms linear;\n  -moz-transition: all 300ms linear;\n  -o-transition: all 300ms linear;\n  -ms-transition: all 300ms linear;\n  transition: all 300ms linear;\n}\n\n.tagsinput .tag,\n.tagsinput-remove-link,\n.filter,\n.btn-hover,\n[data-toggle=\"collapse\"] i {\n  -webkit-transition: all 150ms linear;\n  -moz-transition: all 150ms linear;\n  -o-transition: all 150ms linear;\n  -ms-transition: all 150ms linear;\n  transition: all 150ms linear;\n}\n\n.btn-morphing .fa,\n.btn-morphing .circle,\n.gsdk-collapse {\n  -webkit-transition: all 300ms linear;\n  -moz-transition: all 300ms linear;\n  -o-transition: all 300ms linear;\n  -ms-transition: all 300ms linear;\n  transition: all 300ms linear;\n}\n\n.fa {\n  width: 15px;\n  text-align: center;\n}\n\n.margin-top {\n  margin-top: 50px;\n}\n\n/*       CT colors          */\n.ct-blue,\n.checkbox-blue.checkbox.checked .second-icon,\n.checkbox-blue.checkbox.checked,\n.radio-blue.radio.checked .second-icon,\n.radio-blue.radio.checked {\n  color: #7A9E9F;\n}\n\n.ct-azure,\n.checkbox-azure.checkbox.checked .second-icon,\n.radio-azure.radio.checked .second-icon,\n.checkbox-azure.checkbox.checked,\n.radio-azure.radio.checked {\n  color: #68B3C8;\n}\n\n.ct-green,\n.checkbox-green.checkbox.checked .second-icon,\n.radio-green.radio.checked .second-icon,\n.checkbox-green.checkbox.checked,\n.radio-green.radio.checked {\n  color: #7AC29A;\n}\n\n.ct-orange,\n.checkbox-orange.checkbox.checked .second-icon,\n.radio-orange.radio.checked .second-icon,\n.checkbox-orange.checkbox.checked,\n.radio-orange.radio.checked {\n  color: #F3BB45;\n}\n\n.ct-red,\n.checkbox-red.checkbox.checked .second-icon,\n.radio-red.radio.checked .second-icon,\n.checkbox-red.checkbox.checked,\n.radio-red.radio.checked {\n  color: #EB5E28;\n}\n\ninput.ct-blue + span.switch-left,\ninput.ct-blue + span + label + span.switch-right {\n  background-color: #7A9E9F;\n}\n\ninput.ct-azure + span.switch-left,\ninput.ct-azure + span + label + span.switch-right {\n  background-color: #68B3C8;\n}\n\ninput.ct-green + span.switch-left,\ninput.ct-green + span + label + span.switch-right {\n  background-color: #7AC29A;\n}\n\ninput.ct-orange + span.switch-left,\ninput.ct-orange + span + label + span.switch-right {\n  background-color: #F3BB45;\n}\n\ninput.ct-red + span.switch-left,\ninput.ct-red + span + label + span.switch-right {\n  background-color: #EB5E28;\n}\n\n.btn,\n.navbar .navbar-nav > li > a.btn {\n  border-radius: 20px;\n  box-sizing: border-box;\n  border-width: 2px;\n  background-color: transparent;\n  font-size: 16px;\n  font-weight: 500;\n  padding: 7px 18px;\n  border-color: #66615B;\n  color: #66615B;\n  -webkit-transition: all 150ms linear;\n  -moz-transition: all 150ms linear;\n  -o-transition: all 150ms linear;\n  -ms-transition: all 150ms linear;\n  transition: all 150ms linear;\n}\n.btn:hover, .btn:focus, .btn:active, .btn:active:hover, .btn:active:focus, .btn.active, .open > .btn.dropdown-toggle:focus, .open > .btn.dropdown-toggle:hover, .open > .btn.dropdown-toggle,\n.navbar .navbar-nav > li > a.btn:hover,\n.navbar .navbar-nav > li > a.btn:focus,\n.navbar .navbar-nav > li > a.btn:active,\n.navbar .navbar-nav > li > a.btn:active:hover,\n.navbar .navbar-nav > li > a.btn:active:focus,\n.navbar .navbar-nav > li > a.btn.active, .open >\n.navbar .navbar-nav > li > a.btn.dropdown-toggle:focus, .open >\n.navbar .navbar-nav > li > a.btn.dropdown-toggle:hover, .open >\n.navbar .navbar-nav > li > a.btn.dropdown-toggle {\n  background-color: #66615B;\n  color: rgba(255, 255, 255, 0.7);\n  border-color: #66615B;\n}\n.btn:hover .caret, .btn:focus .caret, .btn:active .caret, .btn:active:hover .caret, .btn:active:focus .caret, .btn.active .caret, .open > .btn.dropdown-toggle:focus .caret, .open > .btn.dropdown-toggle:hover .caret, .open > .btn.dropdown-toggle .caret,\n.navbar .navbar-nav > li > a.btn:hover .caret,\n.navbar .navbar-nav > li > a.btn:focus .caret,\n.navbar .navbar-nav > li > a.btn:active .caret,\n.navbar .navbar-nav > li > a.btn:active:hover .caret,\n.navbar .navbar-nav > li > a.btn:active:focus .caret,\n.navbar .navbar-nav > li > a.btn.active .caret, .open >\n.navbar .navbar-nav > li > a.btn.dropdown-toggle:focus .caret, .open >\n.navbar .navbar-nav > li > a.btn.dropdown-toggle:hover .caret, .open >\n.navbar .navbar-nav > li > a.btn.dropdown-toggle .caret {\n  border-top-color: rgba(255, 255, 255, 0.7);\n}\n.btn:hover i, .btn:focus i, .btn:active i, .btn:active:hover i, .btn:active:focus i, .btn.active i, .open > .btn.dropdown-toggle:focus i, .open > .btn.dropdown-toggle:hover i, .open > .btn.dropdown-toggle i,\n.navbar .navbar-nav > li > a.btn:hover i,\n.navbar .navbar-nav > li > a.btn:focus i,\n.navbar .navbar-nav > li > a.btn:active i,\n.navbar .navbar-nav > li > a.btn:active:hover i,\n.navbar .navbar-nav > li > a.btn:active:focus i,\n.navbar .navbar-nav > li > a.btn.active i, .open >\n.navbar .navbar-nav > li > a.btn.dropdown-toggle:focus i, .open >\n.navbar .navbar-nav > li > a.btn.dropdown-toggle:hover i, .open >\n.navbar .navbar-nav > li > a.btn.dropdown-toggle i {\n  color: rgba(255, 255, 255, 0.7);\n  opacity: 0.7;\n}\n.btn.disabled, .btn.disabled:hover, .btn.disabled:focus, .btn.disabled.focus, .btn.disabled:active, .btn.disabled.active, .btn:disabled, .btn:disabled:hover, .btn:disabled:focus, .btn:disabled.focus, .btn:disabled:active, .btn:disabled.active, .btn[disabled], .btn[disabled]:hover, .btn[disabled]:focus, .btn[disabled].focus, .btn[disabled]:active, .btn[disabled].active, fieldset[disabled] .btn, fieldset[disabled] .btn:hover, fieldset[disabled] .btn:focus, fieldset[disabled] .btn.focus, fieldset[disabled] .btn:active, fieldset[disabled] .btn.active,\n.navbar .navbar-nav > li > a.btn.disabled,\n.navbar .navbar-nav > li > a.btn.disabled:hover,\n.navbar .navbar-nav > li > a.btn.disabled:focus,\n.navbar .navbar-nav > li > a.btn.disabled.focus,\n.navbar .navbar-nav > li > a.btn.disabled:active,\n.navbar .navbar-nav > li > a.btn.disabled.active,\n.navbar .navbar-nav > li > a.btn:disabled,\n.navbar .navbar-nav > li > a.btn:disabled:hover,\n.navbar .navbar-nav > li > a.btn:disabled:focus,\n.navbar .navbar-nav > li > a.btn:disabled.focus,\n.navbar .navbar-nav > li > a.btn:disabled:active,\n.navbar .navbar-nav > li > a.btn:disabled.active,\n.navbar .navbar-nav > li > a.btn[disabled],\n.navbar .navbar-nav > li > a.btn[disabled]:hover,\n.navbar .navbar-nav > li > a.btn[disabled]:focus,\n.navbar .navbar-nav > li > a.btn[disabled].focus,\n.navbar .navbar-nav > li > a.btn[disabled]:active,\n.navbar .navbar-nav > li > a.btn[disabled].active, fieldset[disabled]\n.navbar .navbar-nav > li > a.btn, fieldset[disabled]\n.navbar .navbar-nav > li > a.btn:hover, fieldset[disabled]\n.navbar .navbar-nav > li > a.btn:focus, fieldset[disabled]\n.navbar .navbar-nav > li > a.btn.focus, fieldset[disabled]\n.navbar .navbar-nav > li > a.btn:active, fieldset[disabled]\n.navbar .navbar-nav > li > a.btn.active {\n  background-color: transparent;\n  border-color: #66615B;\n}\n.btn.btn-fill,\n.navbar .navbar-nav > li > a.btn.btn-fill {\n  color: #FFFFFF;\n  background-color: #66615B;\n  opacity: 1;\n}\n.btn.btn-fill:hover, .btn.btn-fill:focus, .btn.btn-fill:active, .btn.btn-fill.active, .open > .btn.btn-fill.dropdown-toggle,\n.navbar .navbar-nav > li > a.btn.btn-fill:hover,\n.navbar .navbar-nav > li > a.btn.btn-fill:focus,\n.navbar .navbar-nav > li > a.btn.btn-fill:active,\n.navbar .navbar-nav > li > a.btn.btn-fill.active, .open >\n.navbar .navbar-nav > li > a.btn.btn-fill.dropdown-toggle {\n  background-color: #403D39;\n  color: #FFFFFF;\n  border-color: #403D39;\n}\n.btn.btn-fill .caret,\n.navbar .navbar-nav > li > a.btn.btn-fill .caret {\n  border-top-color: #FFFFFF;\n}\n.btn.btn-fill i,\n.navbar .navbar-nav > li > a.btn.btn-fill i {\n  color: #FFFFFF;\n  opacity: 1;\n}\n.btn.btn-simple:hover, .btn.btn-simple:focus, .btn.btn-simple:active, .btn.btn-simple.active, .open > .btn.btn-simple.dropdown-toggle,\n.navbar .navbar-nav > li > a.btn.btn-simple:hover,\n.navbar .navbar-nav > li > a.btn.btn-simple:focus,\n.navbar .navbar-nav > li > a.btn.btn-simple:active,\n.navbar .navbar-nav > li > a.btn.btn-simple.active, .open >\n.navbar .navbar-nav > li > a.btn.btn-simple.dropdown-toggle {\n  background-color: transparent;\n  color: #403D39;\n}\n.btn.btn-simple:hover i, .btn.btn-simple:focus i, .btn.btn-simple:active i, .btn.btn-simple.active i, .open > .btn.btn-simple.dropdown-toggle i,\n.navbar .navbar-nav > li > a.btn.btn-simple:hover i,\n.navbar .navbar-nav > li > a.btn.btn-simple:focus i,\n.navbar .navbar-nav > li > a.btn.btn-simple:active i,\n.navbar .navbar-nav > li > a.btn.btn-simple.active i, .open >\n.navbar .navbar-nav > li > a.btn.btn-simple.dropdown-toggle i {\n  color: #403D39;\n  opacity: 1;\n}\n.btn.btn-simple:hover .caret, .btn.btn-simple:focus .caret, .btn.btn-simple:active .caret, .btn.btn-simple.active .caret, .open > .btn.btn-simple.dropdown-toggle .caret,\n.navbar .navbar-nav > li > a.btn.btn-simple:hover .caret,\n.navbar .navbar-nav > li > a.btn.btn-simple:focus .caret,\n.navbar .navbar-nav > li > a.btn.btn-simple:active .caret,\n.navbar .navbar-nav > li > a.btn.btn-simple.active .caret, .open >\n.navbar .navbar-nav > li > a.btn.btn-simple.dropdown-toggle .caret {\n  border-top-color: #403D39;\n}\n.btn.btn-simple .caret,\n.navbar .navbar-nav > li > a.btn.btn-simple .caret {\n  border-top-color: #66615B;\n}\n.btn .caret,\n.navbar .navbar-nav > li > a.btn .caret {\n  border-top-color: #66615B;\n}\n.btn:hover, .btn:focus,\n.navbar .navbar-nav > li > a.btn:hover,\n.navbar .navbar-nav > li > a.btn:focus {\n  outline: 0 !important;\n}\n.btn:active, .btn.active, .open > .btn.dropdown-toggle,\n.navbar .navbar-nav > li > a.btn:active,\n.navbar .navbar-nav > li > a.btn.active, .open >\n.navbar .navbar-nav > li > a.btn.dropdown-toggle {\n  -webkit-box-shadow: none;\n  box-shadow: none;\n  outline: 0 !important;\n}\n.btn i,\n.navbar .navbar-nav > li > a.btn i {\n  margin-right: 5px;\n}\n.btn.btn-icon,\n.navbar .navbar-nav > li > a.btn.btn-icon {\n  border-radius: 25px;\n  padding: 6px 11px;\n}\n.btn.btn-icon i,\n.navbar .navbar-nav > li > a.btn.btn-icon i {\n  margin-right: 0px;\n}\n\n.btn-group .btn + .btn,\n.btn-group .btn + .btn-group,\n.btn-group .btn-group + .btn,\n.btn-group .btn-group + .btn-group {\n  margin-left: -2px;\n}\n\n.navbar .navbar-nav > li > a.btn.btn-primary, .btn-primary {\n  border-color: #7A9E9F;\n  color: #7A9E9F;\n}\n.navbar .navbar-nav > li > a.btn.btn-primary:hover, .navbar .navbar-nav > li > a.btn.btn-primary:focus, .navbar .navbar-nav > li > a.btn.btn-primary:active, .navbar .navbar-nav > li > a.btn.btn-primary:active:hover, .navbar .navbar-nav > li > a.btn.btn-primary:active:focus, .navbar .navbar-nav > li > a.btn.btn-primary.active, .open > .navbar .navbar-nav > li > a.btn.btn-primary.dropdown-toggle:focus, .open > .navbar .navbar-nav > li > a.btn.btn-primary.dropdown-toggle:hover, .open > .navbar .navbar-nav > li > a.btn.btn-primary.dropdown-toggle, .btn-primary:hover, .btn-primary:focus, .btn-primary:active, .btn-primary:active:hover, .btn-primary:active:focus, .btn-primary.active, .open > .btn-primary.dropdown-toggle:focus, .open > .btn-primary.dropdown-toggle:hover, .open > .btn-primary.dropdown-toggle {\n  background-color: #7A9E9F;\n  color: rgba(255, 255, 255, 0.7);\n  border-color: #7A9E9F;\n}\n.navbar .navbar-nav > li > a.btn.btn-primary:hover .caret, .navbar .navbar-nav > li > a.btn.btn-primary:focus .caret, .navbar .navbar-nav > li > a.btn.btn-primary:active .caret, .navbar .navbar-nav > li > a.btn.btn-primary:active:hover .caret, .navbar .navbar-nav > li > a.btn.btn-primary:active:focus .caret, .navbar .navbar-nav > li > a.btn.btn-primary.active .caret, .open > .navbar .navbar-nav > li > a.btn.btn-primary.dropdown-toggle:focus .caret, .open > .navbar .navbar-nav > li > a.btn.btn-primary.dropdown-toggle:hover .caret, .open > .navbar .navbar-nav > li > a.btn.btn-primary.dropdown-toggle .caret, .btn-primary:hover .caret, .btn-primary:focus .caret, .btn-primary:active .caret, .btn-primary:active:hover .caret, .btn-primary:active:focus .caret, .btn-primary.active .caret, .open > .btn-primary.dropdown-toggle:focus .caret, .open > .btn-primary.dropdown-toggle:hover .caret, .open > .btn-primary.dropdown-toggle .caret {\n  border-top-color: rgba(255, 255, 255, 0.7);\n}\n.navbar .navbar-nav > li > a.btn.btn-primary:hover i, .navbar .navbar-nav > li > a.btn.btn-primary:focus i, .navbar .navbar-nav > li > a.btn.btn-primary:active i, .navbar .navbar-nav > li > a.btn.btn-primary:active:hover i, .navbar .navbar-nav > li > a.btn.btn-primary:active:focus i, .navbar .navbar-nav > li > a.btn.btn-primary.active i, .open > .navbar .navbar-nav > li > a.btn.btn-primary.dropdown-toggle:focus i, .open > .navbar .navbar-nav > li > a.btn.btn-primary.dropdown-toggle:hover i, .open > .navbar .navbar-nav > li > a.btn.btn-primary.dropdown-toggle i, .btn-primary:hover i, .btn-primary:focus i, .btn-primary:active i, .btn-primary:active:hover i, .btn-primary:active:focus i, .btn-primary.active i, .open > .btn-primary.dropdown-toggle:focus i, .open > .btn-primary.dropdown-toggle:hover i, .open > .btn-primary.dropdown-toggle i {\n  color: rgba(255, 255, 255, 0.7);\n  opacity: 0.7;\n}\n.navbar .navbar-nav > li > a.btn.btn-primary.disabled, .navbar .navbar-nav > li > a.btn.btn-primary.disabled:hover, .navbar .navbar-nav > li > a.btn.btn-primary.disabled:focus, .navbar .navbar-nav > li > a.btn.btn-primary.disabled.focus, .navbar .navbar-nav > li > a.btn.btn-primary.disabled:active, .navbar .navbar-nav > li > a.btn.btn-primary.disabled.active, .navbar .navbar-nav > li > a.btn.btn-primary:disabled, .navbar .navbar-nav > li > a.btn.btn-primary:disabled:hover, .navbar .navbar-nav > li > a.btn.btn-primary:disabled:focus, .navbar .navbar-nav > li > a.btn.btn-primary:disabled.focus, .navbar .navbar-nav > li > a.btn.btn-primary:disabled:active, .navbar .navbar-nav > li > a.btn.btn-primary:disabled.active, .navbar .navbar-nav > li > a.btn.btn-primary[disabled], .navbar .navbar-nav > li > a.btn.btn-primary[disabled]:hover, .navbar .navbar-nav > li > a.btn.btn-primary[disabled]:focus, .navbar .navbar-nav > li > a.btn.btn-primary[disabled].focus, .navbar .navbar-nav > li > a.btn.btn-primary[disabled]:active, .navbar .navbar-nav > li > a.btn.btn-primary[disabled].active, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-primary, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-primary:hover, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-primary:focus, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-primary.focus, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-primary:active, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-primary.active, .btn-primary.disabled, .btn-primary.disabled:hover, .btn-primary.disabled:focus, .btn-primary.disabled.focus, .btn-primary.disabled:active, .btn-primary.disabled.active, .btn-primary:disabled, .btn-primary:disabled:hover, .btn-primary:disabled:focus, .btn-primary:disabled.focus, .btn-primary:disabled:active, .btn-primary:disabled.active, .btn-primary[disabled], .btn-primary[disabled]:hover, .btn-primary[disabled]:focus, .btn-primary[disabled].focus, .btn-primary[disabled]:active, .btn-primary[disabled].active, fieldset[disabled] .btn-primary, fieldset[disabled] .btn-primary:hover, fieldset[disabled] .btn-primary:focus, fieldset[disabled] .btn-primary.focus, fieldset[disabled] .btn-primary:active, fieldset[disabled] .btn-primary.active {\n  background-color: transparent;\n  border-color: #7A9E9F;\n}\n.navbar .navbar-nav > li > a.btn.btn-primary.btn-fill, .btn-primary.btn-fill {\n  color: #FFFFFF;\n  background-color: #7A9E9F;\n  opacity: 1;\n}\n.navbar .navbar-nav > li > a.btn.btn-primary.btn-fill:hover, .navbar .navbar-nav > li > a.btn.btn-primary.btn-fill:focus, .navbar .navbar-nav > li > a.btn.btn-primary.btn-fill:active, .navbar .navbar-nav > li > a.btn.btn-primary.btn-fill.active, .open > .navbar .navbar-nav > li > a.btn.btn-primary.btn-fill.dropdown-toggle, .btn-primary.btn-fill:hover, .btn-primary.btn-fill:focus, .btn-primary.btn-fill:active, .btn-primary.btn-fill.active, .open > .btn-primary.btn-fill.dropdown-toggle {\n  background-color: #427C89;\n  color: #FFFFFF;\n  border-color: #427C89;\n}\n.navbar .navbar-nav > li > a.btn.btn-primary.btn-fill .caret, .btn-primary.btn-fill .caret {\n  border-top-color: #FFFFFF;\n}\n.navbar .navbar-nav > li > a.btn.btn-primary.btn-fill i, .btn-primary.btn-fill i {\n  color: #FFFFFF;\n  opacity: 1;\n}\n.navbar .navbar-nav > li > a.btn.btn-primary.btn-simple:hover, .navbar .navbar-nav > li > a.btn.btn-primary.btn-simple:focus, .navbar .navbar-nav > li > a.btn.btn-primary.btn-simple:active, .navbar .navbar-nav > li > a.btn.btn-primary.btn-simple.active, .open > .navbar .navbar-nav > li > a.btn.btn-primary.btn-simple.dropdown-toggle, .btn-primary.btn-simple:hover, .btn-primary.btn-simple:focus, .btn-primary.btn-simple:active, .btn-primary.btn-simple.active, .open > .btn-primary.btn-simple.dropdown-toggle {\n  background-color: transparent;\n  color: #427C89;\n}\n.navbar .navbar-nav > li > a.btn.btn-primary.btn-simple:hover i, .navbar .navbar-nav > li > a.btn.btn-primary.btn-simple:focus i, .navbar .navbar-nav > li > a.btn.btn-primary.btn-simple:active i, .navbar .navbar-nav > li > a.btn.btn-primary.btn-simple.active i, .open > .navbar .navbar-nav > li > a.btn.btn-primary.btn-simple.dropdown-toggle i, .btn-primary.btn-simple:hover i, .btn-primary.btn-simple:focus i, .btn-primary.btn-simple:active i, .btn-primary.btn-simple.active i, .open > .btn-primary.btn-simple.dropdown-toggle i {\n  color: #427C89;\n  opacity: 1;\n}\n.navbar .navbar-nav > li > a.btn.btn-primary.btn-simple:hover .caret, .navbar .navbar-nav > li > a.btn.btn-primary.btn-simple:focus .caret, .navbar .navbar-nav > li > a.btn.btn-primary.btn-simple:active .caret, .navbar .navbar-nav > li > a.btn.btn-primary.btn-simple.active .caret, .open > .navbar .navbar-nav > li > a.btn.btn-primary.btn-simple.dropdown-toggle .caret, .btn-primary.btn-simple:hover .caret, .btn-primary.btn-simple:focus .caret, .btn-primary.btn-simple:active .caret, .btn-primary.btn-simple.active .caret, .open > .btn-primary.btn-simple.dropdown-toggle .caret {\n  border-top-color: #427C89;\n}\n.navbar .navbar-nav > li > a.btn.btn-primary.btn-simple .caret, .btn-primary.btn-simple .caret {\n  border-top-color: #7A9E9F;\n}\n.navbar .navbar-nav > li > a.btn.btn-primary .caret, .btn-primary .caret {\n  border-top-color: #7A9E9F;\n}\n\n.navbar .navbar-nav > li > a.btn.btn-success, .btn-success {\n  border-color: #7AC29A;\n  color: #7AC29A;\n}\n.navbar .navbar-nav > li > a.btn.btn-success:hover, .navbar .navbar-nav > li > a.btn.btn-success:focus, .navbar .navbar-nav > li > a.btn.btn-success:active, .navbar .navbar-nav > li > a.btn.btn-success:active:hover, .navbar .navbar-nav > li > a.btn.btn-success:active:focus, .navbar .navbar-nav > li > a.btn.btn-success.active, .open > .navbar .navbar-nav > li > a.btn.btn-success.dropdown-toggle:focus, .open > .navbar .navbar-nav > li > a.btn.btn-success.dropdown-toggle:hover, .open > .navbar .navbar-nav > li > a.btn.btn-success.dropdown-toggle, .btn-success:hover, .btn-success:focus, .btn-success:active, .btn-success:active:hover, .btn-success:active:focus, .btn-success.active, .open > .btn-success.dropdown-toggle:focus, .open > .btn-success.dropdown-toggle:hover, .open > .btn-success.dropdown-toggle {\n  background-color: #7AC29A;\n  color: rgba(255, 255, 255, 0.7);\n  border-color: #7AC29A;\n}\n.navbar .navbar-nav > li > a.btn.btn-success:hover .caret, .navbar .navbar-nav > li > a.btn.btn-success:focus .caret, .navbar .navbar-nav > li > a.btn.btn-success:active .caret, .navbar .navbar-nav > li > a.btn.btn-success:active:hover .caret, .navbar .navbar-nav > li > a.btn.btn-success:active:focus .caret, .navbar .navbar-nav > li > a.btn.btn-success.active .caret, .open > .navbar .navbar-nav > li > a.btn.btn-success.dropdown-toggle:focus .caret, .open > .navbar .navbar-nav > li > a.btn.btn-success.dropdown-toggle:hover .caret, .open > .navbar .navbar-nav > li > a.btn.btn-success.dropdown-toggle .caret, .btn-success:hover .caret, .btn-success:focus .caret, .btn-success:active .caret, .btn-success:active:hover .caret, .btn-success:active:focus .caret, .btn-success.active .caret, .open > .btn-success.dropdown-toggle:focus .caret, .open > .btn-success.dropdown-toggle:hover .caret, .open > .btn-success.dropdown-toggle .caret {\n  border-top-color: rgba(255, 255, 255, 0.7);\n}\n.navbar .navbar-nav > li > a.btn.btn-success:hover i, .navbar .navbar-nav > li > a.btn.btn-success:focus i, .navbar .navbar-nav > li > a.btn.btn-success:active i, .navbar .navbar-nav > li > a.btn.btn-success:active:hover i, .navbar .navbar-nav > li > a.btn.btn-success:active:focus i, .navbar .navbar-nav > li > a.btn.btn-success.active i, .open > .navbar .navbar-nav > li > a.btn.btn-success.dropdown-toggle:focus i, .open > .navbar .navbar-nav > li > a.btn.btn-success.dropdown-toggle:hover i, .open > .navbar .navbar-nav > li > a.btn.btn-success.dropdown-toggle i, .btn-success:hover i, .btn-success:focus i, .btn-success:active i, .btn-success:active:hover i, .btn-success:active:focus i, .btn-success.active i, .open > .btn-success.dropdown-toggle:focus i, .open > .btn-success.dropdown-toggle:hover i, .open > .btn-success.dropdown-toggle i {\n  color: rgba(255, 255, 255, 0.7);\n  opacity: 0.7;\n}\n.navbar .navbar-nav > li > a.btn.btn-success.disabled, .navbar .navbar-nav > li > a.btn.btn-success.disabled:hover, .navbar .navbar-nav > li > a.btn.btn-success.disabled:focus, .navbar .navbar-nav > li > a.btn.btn-success.disabled.focus, .navbar .navbar-nav > li > a.btn.btn-success.disabled:active, .navbar .navbar-nav > li > a.btn.btn-success.disabled.active, .navbar .navbar-nav > li > a.btn.btn-success:disabled, .navbar .navbar-nav > li > a.btn.btn-success:disabled:hover, .navbar .navbar-nav > li > a.btn.btn-success:disabled:focus, .navbar .navbar-nav > li > a.btn.btn-success:disabled.focus, .navbar .navbar-nav > li > a.btn.btn-success:disabled:active, .navbar .navbar-nav > li > a.btn.btn-success:disabled.active, .navbar .navbar-nav > li > a.btn.btn-success[disabled], .navbar .navbar-nav > li > a.btn.btn-success[disabled]:hover, .navbar .navbar-nav > li > a.btn.btn-success[disabled]:focus, .navbar .navbar-nav > li > a.btn.btn-success[disabled].focus, .navbar .navbar-nav > li > a.btn.btn-success[disabled]:active, .navbar .navbar-nav > li > a.btn.btn-success[disabled].active, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-success, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-success:hover, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-success:focus, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-success.focus, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-success:active, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-success.active, .btn-success.disabled, .btn-success.disabled:hover, .btn-success.disabled:focus, .btn-success.disabled.focus, .btn-success.disabled:active, .btn-success.disabled.active, .btn-success:disabled, .btn-success:disabled:hover, .btn-success:disabled:focus, .btn-success:disabled.focus, .btn-success:disabled:active, .btn-success:disabled.active, .btn-success[disabled], .btn-success[disabled]:hover, .btn-success[disabled]:focus, .btn-success[disabled].focus, .btn-success[disabled]:active, .btn-success[disabled].active, fieldset[disabled] .btn-success, fieldset[disabled] .btn-success:hover, fieldset[disabled] .btn-success:focus, fieldset[disabled] .btn-success.focus, fieldset[disabled] .btn-success:active, fieldset[disabled] .btn-success.active {\n  background-color: transparent;\n  border-color: #7AC29A;\n}\n.navbar .navbar-nav > li > a.btn.btn-success.btn-fill, .btn-success.btn-fill {\n  color: #FFFFFF;\n  background-color: #7AC29A;\n  opacity: 1;\n}\n.navbar .navbar-nav > li > a.btn.btn-success.btn-fill:hover, .navbar .navbar-nav > li > a.btn.btn-success.btn-fill:focus, .navbar .navbar-nav > li > a.btn.btn-success.btn-fill:active, .navbar .navbar-nav > li > a.btn.btn-success.btn-fill.active, .open > .navbar .navbar-nav > li > a.btn.btn-success.btn-fill.dropdown-toggle, .btn-success.btn-fill:hover, .btn-success.btn-fill:focus, .btn-success.btn-fill:active, .btn-success.btn-fill.active, .open > .btn-success.btn-fill.dropdown-toggle {\n  background-color: #42A084;\n  color: #FFFFFF;\n  border-color: #42A084;\n}\n.navbar .navbar-nav > li > a.btn.btn-success.btn-fill .caret, .btn-success.btn-fill .caret {\n  border-top-color: #FFFFFF;\n}\n.navbar .navbar-nav > li > a.btn.btn-success.btn-fill i, .btn-success.btn-fill i {\n  color: #FFFFFF;\n  opacity: 1;\n}\n.navbar .navbar-nav > li > a.btn.btn-success.btn-simple:hover, .navbar .navbar-nav > li > a.btn.btn-success.btn-simple:focus, .navbar .navbar-nav > li > a.btn.btn-success.btn-simple:active, .navbar .navbar-nav > li > a.btn.btn-success.btn-simple.active, .open > .navbar .navbar-nav > li > a.btn.btn-success.btn-simple.dropdown-toggle, .btn-success.btn-simple:hover, .btn-success.btn-simple:focus, .btn-success.btn-simple:active, .btn-success.btn-simple.active, .open > .btn-success.btn-simple.dropdown-toggle {\n  background-color: transparent;\n  color: #42A084;\n}\n.navbar .navbar-nav > li > a.btn.btn-success.btn-simple:hover i, .navbar .navbar-nav > li > a.btn.btn-success.btn-simple:focus i, .navbar .navbar-nav > li > a.btn.btn-success.btn-simple:active i, .navbar .navbar-nav > li > a.btn.btn-success.btn-simple.active i, .open > .navbar .navbar-nav > li > a.btn.btn-success.btn-simple.dropdown-toggle i, .btn-success.btn-simple:hover i, .btn-success.btn-simple:focus i, .btn-success.btn-simple:active i, .btn-success.btn-simple.active i, .open > .btn-success.btn-simple.dropdown-toggle i {\n  color: #42A084;\n  opacity: 1;\n}\n.navbar .navbar-nav > li > a.btn.btn-success.btn-simple:hover .caret, .navbar .navbar-nav > li > a.btn.btn-success.btn-simple:focus .caret, .navbar .navbar-nav > li > a.btn.btn-success.btn-simple:active .caret, .navbar .navbar-nav > li > a.btn.btn-success.btn-simple.active .caret, .open > .navbar .navbar-nav > li > a.btn.btn-success.btn-simple.dropdown-toggle .caret, .btn-success.btn-simple:hover .caret, .btn-success.btn-simple:focus .caret, .btn-success.btn-simple:active .caret, .btn-success.btn-simple.active .caret, .open > .btn-success.btn-simple.dropdown-toggle .caret {\n  border-top-color: #42A084;\n}\n.navbar .navbar-nav > li > a.btn.btn-success.btn-simple .caret, .btn-success.btn-simple .caret {\n  border-top-color: #7AC29A;\n}\n.navbar .navbar-nav > li > a.btn.btn-success .caret, .btn-success .caret {\n  border-top-color: #7AC29A;\n}\n\n.navbar .navbar-nav > li > a.btn.btn-info, .btn-info {\n  border-color: #68B3C8;\n  color: #68B3C8;\n}\n.navbar .navbar-nav > li > a.btn.btn-info:hover, .navbar .navbar-nav > li > a.btn.btn-info:focus, .navbar .navbar-nav > li > a.btn.btn-info:active, .navbar .navbar-nav > li > a.btn.btn-info:active:hover, .navbar .navbar-nav > li > a.btn.btn-info:active:focus, .navbar .navbar-nav > li > a.btn.btn-info.active, .open > .navbar .navbar-nav > li > a.btn.btn-info.dropdown-toggle:focus, .open > .navbar .navbar-nav > li > a.btn.btn-info.dropdown-toggle:hover, .open > .navbar .navbar-nav > li > a.btn.btn-info.dropdown-toggle, .btn-info:hover, .btn-info:focus, .btn-info:active, .btn-info:active:hover, .btn-info:active:focus, .btn-info.active, .open > .btn-info.dropdown-toggle:focus, .open > .btn-info.dropdown-toggle:hover, .open > .btn-info.dropdown-toggle {\n  background-color: #68B3C8;\n  color: rgba(255, 255, 255, 0.7);\n  border-color: #68B3C8;\n}\n.navbar .navbar-nav > li > a.btn.btn-info:hover .caret, .navbar .navbar-nav > li > a.btn.btn-info:focus .caret, .navbar .navbar-nav > li > a.btn.btn-info:active .caret, .navbar .navbar-nav > li > a.btn.btn-info:active:hover .caret, .navbar .navbar-nav > li > a.btn.btn-info:active:focus .caret, .navbar .navbar-nav > li > a.btn.btn-info.active .caret, .open > .navbar .navbar-nav > li > a.btn.btn-info.dropdown-toggle:focus .caret, .open > .navbar .navbar-nav > li > a.btn.btn-info.dropdown-toggle:hover .caret, .open > .navbar .navbar-nav > li > a.btn.btn-info.dropdown-toggle .caret, .btn-info:hover .caret, .btn-info:focus .caret, .btn-info:active .caret, .btn-info:active:hover .caret, .btn-info:active:focus .caret, .btn-info.active .caret, .open > .btn-info.dropdown-toggle:focus .caret, .open > .btn-info.dropdown-toggle:hover .caret, .open > .btn-info.dropdown-toggle .caret {\n  border-top-color: rgba(255, 255, 255, 0.7);\n}\n.navbar .navbar-nav > li > a.btn.btn-info:hover i, .navbar .navbar-nav > li > a.btn.btn-info:focus i, .navbar .navbar-nav > li > a.btn.btn-info:active i, .navbar .navbar-nav > li > a.btn.btn-info:active:hover i, .navbar .navbar-nav > li > a.btn.btn-info:active:focus i, .navbar .navbar-nav > li > a.btn.btn-info.active i, .open > .navbar .navbar-nav > li > a.btn.btn-info.dropdown-toggle:focus i, .open > .navbar .navbar-nav > li > a.btn.btn-info.dropdown-toggle:hover i, .open > .navbar .navbar-nav > li > a.btn.btn-info.dropdown-toggle i, .btn-info:hover i, .btn-info:focus i, .btn-info:active i, .btn-info:active:hover i, .btn-info:active:focus i, .btn-info.active i, .open > .btn-info.dropdown-toggle:focus i, .open > .btn-info.dropdown-toggle:hover i, .open > .btn-info.dropdown-toggle i {\n  color: rgba(255, 255, 255, 0.7);\n  opacity: 0.7;\n}\n.navbar .navbar-nav > li > a.btn.btn-info.disabled, .navbar .navbar-nav > li > a.btn.btn-info.disabled:hover, .navbar .navbar-nav > li > a.btn.btn-info.disabled:focus, .navbar .navbar-nav > li > a.btn.btn-info.disabled.focus, .navbar .navbar-nav > li > a.btn.btn-info.disabled:active, .navbar .navbar-nav > li > a.btn.btn-info.disabled.active, .navbar .navbar-nav > li > a.btn.btn-info:disabled, .navbar .navbar-nav > li > a.btn.btn-info:disabled:hover, .navbar .navbar-nav > li > a.btn.btn-info:disabled:focus, .navbar .navbar-nav > li > a.btn.btn-info:disabled.focus, .navbar .navbar-nav > li > a.btn.btn-info:disabled:active, .navbar .navbar-nav > li > a.btn.btn-info:disabled.active, .navbar .navbar-nav > li > a.btn.btn-info[disabled], .navbar .navbar-nav > li > a.btn.btn-info[disabled]:hover, .navbar .navbar-nav > li > a.btn.btn-info[disabled]:focus, .navbar .navbar-nav > li > a.btn.btn-info[disabled].focus, .navbar .navbar-nav > li > a.btn.btn-info[disabled]:active, .navbar .navbar-nav > li > a.btn.btn-info[disabled].active, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-info, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-info:hover, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-info:focus, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-info.focus, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-info:active, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-info.active, .btn-info.disabled, .btn-info.disabled:hover, .btn-info.disabled:focus, .btn-info.disabled.focus, .btn-info.disabled:active, .btn-info.disabled.active, .btn-info:disabled, .btn-info:disabled:hover, .btn-info:disabled:focus, .btn-info:disabled.focus, .btn-info:disabled:active, .btn-info:disabled.active, .btn-info[disabled], .btn-info[disabled]:hover, .btn-info[disabled]:focus, .btn-info[disabled].focus, .btn-info[disabled]:active, .btn-info[disabled].active, fieldset[disabled] .btn-info, fieldset[disabled] .btn-info:hover, fieldset[disabled] .btn-info:focus, fieldset[disabled] .btn-info.focus, fieldset[disabled] .btn-info:active, fieldset[disabled] .btn-info.active {\n  background-color: transparent;\n  border-color: #68B3C8;\n}\n.navbar .navbar-nav > li > a.btn.btn-info.btn-fill, .btn-info.btn-fill {\n  color: #FFFFFF;\n  background-color: #68B3C8;\n  opacity: 1;\n}\n.navbar .navbar-nav > li > a.btn.btn-info.btn-fill:hover, .navbar .navbar-nav > li > a.btn.btn-info.btn-fill:focus, .navbar .navbar-nav > li > a.btn.btn-info.btn-fill:active, .navbar .navbar-nav > li > a.btn.btn-info.btn-fill.active, .open > .navbar .navbar-nav > li > a.btn.btn-info.btn-fill.dropdown-toggle, .btn-info.btn-fill:hover, .btn-info.btn-fill:focus, .btn-info.btn-fill:active, .btn-info.btn-fill.active, .open > .btn-info.btn-fill.dropdown-toggle {\n  background-color: #3091B2;\n  color: #FFFFFF;\n  border-color: #3091B2;\n}\n.navbar .navbar-nav > li > a.btn.btn-info.btn-fill .caret, .btn-info.btn-fill .caret {\n  border-top-color: #FFFFFF;\n}\n.navbar .navbar-nav > li > a.btn.btn-info.btn-fill i, .btn-info.btn-fill i {\n  color: #FFFFFF;\n  opacity: 1;\n}\n.navbar .navbar-nav > li > a.btn.btn-info.btn-simple:hover, .navbar .navbar-nav > li > a.btn.btn-info.btn-simple:focus, .navbar .navbar-nav > li > a.btn.btn-info.btn-simple:active, .navbar .navbar-nav > li > a.btn.btn-info.btn-simple.active, .open > .navbar .navbar-nav > li > a.btn.btn-info.btn-simple.dropdown-toggle, .btn-info.btn-simple:hover, .btn-info.btn-simple:focus, .btn-info.btn-simple:active, .btn-info.btn-simple.active, .open > .btn-info.btn-simple.dropdown-toggle {\n  background-color: transparent;\n  color: #3091B2;\n}\n.navbar .navbar-nav > li > a.btn.btn-info.btn-simple:hover i, .navbar .navbar-nav > li > a.btn.btn-info.btn-simple:focus i, .navbar .navbar-nav > li > a.btn.btn-info.btn-simple:active i, .navbar .navbar-nav > li > a.btn.btn-info.btn-simple.active i, .open > .navbar .navbar-nav > li > a.btn.btn-info.btn-simple.dropdown-toggle i, .btn-info.btn-simple:hover i, .btn-info.btn-simple:focus i, .btn-info.btn-simple:active i, .btn-info.btn-simple.active i, .open > .btn-info.btn-simple.dropdown-toggle i {\n  color: #3091B2;\n  opacity: 1;\n}\n.navbar .navbar-nav > li > a.btn.btn-info.btn-simple:hover .caret, .navbar .navbar-nav > li > a.btn.btn-info.btn-simple:focus .caret, .navbar .navbar-nav > li > a.btn.btn-info.btn-simple:active .caret, .navbar .navbar-nav > li > a.btn.btn-info.btn-simple.active .caret, .open > .navbar .navbar-nav > li > a.btn.btn-info.btn-simple.dropdown-toggle .caret, .btn-info.btn-simple:hover .caret, .btn-info.btn-simple:focus .caret, .btn-info.btn-simple:active .caret, .btn-info.btn-simple.active .caret, .open > .btn-info.btn-simple.dropdown-toggle .caret {\n  border-top-color: #3091B2;\n}\n.navbar .navbar-nav > li > a.btn.btn-info.btn-simple .caret, .btn-info.btn-simple .caret {\n  border-top-color: #68B3C8;\n}\n.navbar .navbar-nav > li > a.btn.btn-info .caret, .btn-info .caret {\n  border-top-color: #68B3C8;\n}\n\n.navbar .navbar-nav > li > a.btn.btn-warning, .btn-warning {\n  border-color: #F3BB45;\n  color: #F3BB45;\n}\n.navbar .navbar-nav > li > a.btn.btn-warning:hover, .navbar .navbar-nav > li > a.btn.btn-warning:focus, .navbar .navbar-nav > li > a.btn.btn-warning:active, .navbar .navbar-nav > li > a.btn.btn-warning:active:hover, .navbar .navbar-nav > li > a.btn.btn-warning:active:focus, .navbar .navbar-nav > li > a.btn.btn-warning.active, .open > .navbar .navbar-nav > li > a.btn.btn-warning.dropdown-toggle:focus, .open > .navbar .navbar-nav > li > a.btn.btn-warning.dropdown-toggle:hover, .open > .navbar .navbar-nav > li > a.btn.btn-warning.dropdown-toggle, .btn-warning:hover, .btn-warning:focus, .btn-warning:active, .btn-warning:active:hover, .btn-warning:active:focus, .btn-warning.active, .open > .btn-warning.dropdown-toggle:focus, .open > .btn-warning.dropdown-toggle:hover, .open > .btn-warning.dropdown-toggle {\n  background-color: #F3BB45;\n  color: rgba(255, 255, 255, 0.7);\n  border-color: #F3BB45;\n}\n.navbar .navbar-nav > li > a.btn.btn-warning:hover .caret, .navbar .navbar-nav > li > a.btn.btn-warning:focus .caret, .navbar .navbar-nav > li > a.btn.btn-warning:active .caret, .navbar .navbar-nav > li > a.btn.btn-warning:active:hover .caret, .navbar .navbar-nav > li > a.btn.btn-warning:active:focus .caret, .navbar .navbar-nav > li > a.btn.btn-warning.active .caret, .open > .navbar .navbar-nav > li > a.btn.btn-warning.dropdown-toggle:focus .caret, .open > .navbar .navbar-nav > li > a.btn.btn-warning.dropdown-toggle:hover .caret, .open > .navbar .navbar-nav > li > a.btn.btn-warning.dropdown-toggle .caret, .btn-warning:hover .caret, .btn-warning:focus .caret, .btn-warning:active .caret, .btn-warning:active:hover .caret, .btn-warning:active:focus .caret, .btn-warning.active .caret, .open > .btn-warning.dropdown-toggle:focus .caret, .open > .btn-warning.dropdown-toggle:hover .caret, .open > .btn-warning.dropdown-toggle .caret {\n  border-top-color: rgba(255, 255, 255, 0.7);\n}\n.navbar .navbar-nav > li > a.btn.btn-warning:hover i, .navbar .navbar-nav > li > a.btn.btn-warning:focus i, .navbar .navbar-nav > li > a.btn.btn-warning:active i, .navbar .navbar-nav > li > a.btn.btn-warning:active:hover i, .navbar .navbar-nav > li > a.btn.btn-warning:active:focus i, .navbar .navbar-nav > li > a.btn.btn-warning.active i, .open > .navbar .navbar-nav > li > a.btn.btn-warning.dropdown-toggle:focus i, .open > .navbar .navbar-nav > li > a.btn.btn-warning.dropdown-toggle:hover i, .open > .navbar .navbar-nav > li > a.btn.btn-warning.dropdown-toggle i, .btn-warning:hover i, .btn-warning:focus i, .btn-warning:active i, .btn-warning:active:hover i, .btn-warning:active:focus i, .btn-warning.active i, .open > .btn-warning.dropdown-toggle:focus i, .open > .btn-warning.dropdown-toggle:hover i, .open > .btn-warning.dropdown-toggle i {\n  color: rgba(255, 255, 255, 0.7);\n  opacity: 0.7;\n}\n.navbar .navbar-nav > li > a.btn.btn-warning.disabled, .navbar .navbar-nav > li > a.btn.btn-warning.disabled:hover, .navbar .navbar-nav > li > a.btn.btn-warning.disabled:focus, .navbar .navbar-nav > li > a.btn.btn-warning.disabled.focus, .navbar .navbar-nav > li > a.btn.btn-warning.disabled:active, .navbar .navbar-nav > li > a.btn.btn-warning.disabled.active, .navbar .navbar-nav > li > a.btn.btn-warning:disabled, .navbar .navbar-nav > li > a.btn.btn-warning:disabled:hover, .navbar .navbar-nav > li > a.btn.btn-warning:disabled:focus, .navbar .navbar-nav > li > a.btn.btn-warning:disabled.focus, .navbar .navbar-nav > li > a.btn.btn-warning:disabled:active, .navbar .navbar-nav > li > a.btn.btn-warning:disabled.active, .navbar .navbar-nav > li > a.btn.btn-warning[disabled], .navbar .navbar-nav > li > a.btn.btn-warning[disabled]:hover, .navbar .navbar-nav > li > a.btn.btn-warning[disabled]:focus, .navbar .navbar-nav > li > a.btn.btn-warning[disabled].focus, .navbar .navbar-nav > li > a.btn.btn-warning[disabled]:active, .navbar .navbar-nav > li > a.btn.btn-warning[disabled].active, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-warning, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-warning:hover, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-warning:focus, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-warning.focus, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-warning:active, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-warning.active, .btn-warning.disabled, .btn-warning.disabled:hover, .btn-warning.disabled:focus, .btn-warning.disabled.focus, .btn-warning.disabled:active, .btn-warning.disabled.active, .btn-warning:disabled, .btn-warning:disabled:hover, .btn-warning:disabled:focus, .btn-warning:disabled.focus, .btn-warning:disabled:active, .btn-warning:disabled.active, .btn-warning[disabled], .btn-warning[disabled]:hover, .btn-warning[disabled]:focus, .btn-warning[disabled].focus, .btn-warning[disabled]:active, .btn-warning[disabled].active, fieldset[disabled] .btn-warning, fieldset[disabled] .btn-warning:hover, fieldset[disabled] .btn-warning:focus, fieldset[disabled] .btn-warning.focus, fieldset[disabled] .btn-warning:active, fieldset[disabled] .btn-warning.active {\n  background-color: transparent;\n  border-color: #F3BB45;\n}\n.navbar .navbar-nav > li > a.btn.btn-warning.btn-fill, .btn-warning.btn-fill {\n  color: #FFFFFF;\n  background-color: #F3BB45;\n  opacity: 1;\n}\n.navbar .navbar-nav > li > a.btn.btn-warning.btn-fill:hover, .navbar .navbar-nav > li > a.btn.btn-warning.btn-fill:focus, .navbar .navbar-nav > li > a.btn.btn-warning.btn-fill:active, .navbar .navbar-nav > li > a.btn.btn-warning.btn-fill.active, .open > .navbar .navbar-nav > li > a.btn.btn-warning.btn-fill.dropdown-toggle, .btn-warning.btn-fill:hover, .btn-warning.btn-fill:focus, .btn-warning.btn-fill:active, .btn-warning.btn-fill.active, .open > .btn-warning.btn-fill.dropdown-toggle {\n  background-color: #BB992F;\n  color: #FFFFFF;\n  border-color: #BB992F;\n}\n.navbar .navbar-nav > li > a.btn.btn-warning.btn-fill .caret, .btn-warning.btn-fill .caret {\n  border-top-color: #FFFFFF;\n}\n.navbar .navbar-nav > li > a.btn.btn-warning.btn-fill i, .btn-warning.btn-fill i {\n  color: #FFFFFF;\n  opacity: 1;\n}\n.navbar .navbar-nav > li > a.btn.btn-warning.btn-simple:hover, .navbar .navbar-nav > li > a.btn.btn-warning.btn-simple:focus, .navbar .navbar-nav > li > a.btn.btn-warning.btn-simple:active, .navbar .navbar-nav > li > a.btn.btn-warning.btn-simple.active, .open > .navbar .navbar-nav > li > a.btn.btn-warning.btn-simple.dropdown-toggle, .btn-warning.btn-simple:hover, .btn-warning.btn-simple:focus, .btn-warning.btn-simple:active, .btn-warning.btn-simple.active, .open > .btn-warning.btn-simple.dropdown-toggle {\n  background-color: transparent;\n  color: #BB992F;\n}\n.navbar .navbar-nav > li > a.btn.btn-warning.btn-simple:hover i, .navbar .navbar-nav > li > a.btn.btn-warning.btn-simple:focus i, .navbar .navbar-nav > li > a.btn.btn-warning.btn-simple:active i, .navbar .navbar-nav > li > a.btn.btn-warning.btn-simple.active i, .open > .navbar .navbar-nav > li > a.btn.btn-warning.btn-simple.dropdown-toggle i, .btn-warning.btn-simple:hover i, .btn-warning.btn-simple:focus i, .btn-warning.btn-simple:active i, .btn-warning.btn-simple.active i, .open > .btn-warning.btn-simple.dropdown-toggle i {\n  color: #BB992F;\n  opacity: 1;\n}\n.navbar .navbar-nav > li > a.btn.btn-warning.btn-simple:hover .caret, .navbar .navbar-nav > li > a.btn.btn-warning.btn-simple:focus .caret, .navbar .navbar-nav > li > a.btn.btn-warning.btn-simple:active .caret, .navbar .navbar-nav > li > a.btn.btn-warning.btn-simple.active .caret, .open > .navbar .navbar-nav > li > a.btn.btn-warning.btn-simple.dropdown-toggle .caret, .btn-warning.btn-simple:hover .caret, .btn-warning.btn-simple:focus .caret, .btn-warning.btn-simple:active .caret, .btn-warning.btn-simple.active .caret, .open > .btn-warning.btn-simple.dropdown-toggle .caret {\n  border-top-color: #BB992F;\n}\n.navbar .navbar-nav > li > a.btn.btn-warning.btn-simple .caret, .btn-warning.btn-simple .caret {\n  border-top-color: #F3BB45;\n}\n.navbar .navbar-nav > li > a.btn.btn-warning .caret, .btn-warning .caret {\n  border-top-color: #F3BB45;\n}\n\n.navbar .navbar-nav > li > a.btn.btn-danger, .btn-danger {\n  border-color: #EB5E28;\n  color: #EB5E28;\n}\n.navbar .navbar-nav > li > a.btn.btn-danger:hover, .navbar .navbar-nav > li > a.btn.btn-danger:focus, .navbar .navbar-nav > li > a.btn.btn-danger:active, .navbar .navbar-nav > li > a.btn.btn-danger:active:hover, .navbar .navbar-nav > li > a.btn.btn-danger:active:focus, .navbar .navbar-nav > li > a.btn.btn-danger.active, .open > .navbar .navbar-nav > li > a.btn.btn-danger.dropdown-toggle:focus, .open > .navbar .navbar-nav > li > a.btn.btn-danger.dropdown-toggle:hover, .open > .navbar .navbar-nav > li > a.btn.btn-danger.dropdown-toggle, .btn-danger:hover, .btn-danger:focus, .btn-danger:active, .btn-danger:active:hover, .btn-danger:active:focus, .btn-danger.active, .open > .btn-danger.dropdown-toggle:focus, .open > .btn-danger.dropdown-toggle:hover, .open > .btn-danger.dropdown-toggle {\n  background-color: #EB5E28;\n  color: rgba(255, 255, 255, 0.7);\n  border-color: #EB5E28;\n}\n.navbar .navbar-nav > li > a.btn.btn-danger:hover .caret, .navbar .navbar-nav > li > a.btn.btn-danger:focus .caret, .navbar .navbar-nav > li > a.btn.btn-danger:active .caret, .navbar .navbar-nav > li > a.btn.btn-danger:active:hover .caret, .navbar .navbar-nav > li > a.btn.btn-danger:active:focus .caret, .navbar .navbar-nav > li > a.btn.btn-danger.active .caret, .open > .navbar .navbar-nav > li > a.btn.btn-danger.dropdown-toggle:focus .caret, .open > .navbar .navbar-nav > li > a.btn.btn-danger.dropdown-toggle:hover .caret, .open > .navbar .navbar-nav > li > a.btn.btn-danger.dropdown-toggle .caret, .btn-danger:hover .caret, .btn-danger:focus .caret, .btn-danger:active .caret, .btn-danger:active:hover .caret, .btn-danger:active:focus .caret, .btn-danger.active .caret, .open > .btn-danger.dropdown-toggle:focus .caret, .open > .btn-danger.dropdown-toggle:hover .caret, .open > .btn-danger.dropdown-toggle .caret {\n  border-top-color: rgba(255, 255, 255, 0.7);\n}\n.navbar .navbar-nav > li > a.btn.btn-danger:hover i, .navbar .navbar-nav > li > a.btn.btn-danger:focus i, .navbar .navbar-nav > li > a.btn.btn-danger:active i, .navbar .navbar-nav > li > a.btn.btn-danger:active:hover i, .navbar .navbar-nav > li > a.btn.btn-danger:active:focus i, .navbar .navbar-nav > li > a.btn.btn-danger.active i, .open > .navbar .navbar-nav > li > a.btn.btn-danger.dropdown-toggle:focus i, .open > .navbar .navbar-nav > li > a.btn.btn-danger.dropdown-toggle:hover i, .open > .navbar .navbar-nav > li > a.btn.btn-danger.dropdown-toggle i, .btn-danger:hover i, .btn-danger:focus i, .btn-danger:active i, .btn-danger:active:hover i, .btn-danger:active:focus i, .btn-danger.active i, .open > .btn-danger.dropdown-toggle:focus i, .open > .btn-danger.dropdown-toggle:hover i, .open > .btn-danger.dropdown-toggle i {\n  color: rgba(255, 255, 255, 0.7);\n  opacity: 0.7;\n}\n.navbar .navbar-nav > li > a.btn.btn-danger.disabled, .navbar .navbar-nav > li > a.btn.btn-danger.disabled:hover, .navbar .navbar-nav > li > a.btn.btn-danger.disabled:focus, .navbar .navbar-nav > li > a.btn.btn-danger.disabled.focus, .navbar .navbar-nav > li > a.btn.btn-danger.disabled:active, .navbar .navbar-nav > li > a.btn.btn-danger.disabled.active, .navbar .navbar-nav > li > a.btn.btn-danger:disabled, .navbar .navbar-nav > li > a.btn.btn-danger:disabled:hover, .navbar .navbar-nav > li > a.btn.btn-danger:disabled:focus, .navbar .navbar-nav > li > a.btn.btn-danger:disabled.focus, .navbar .navbar-nav > li > a.btn.btn-danger:disabled:active, .navbar .navbar-nav > li > a.btn.btn-danger:disabled.active, .navbar .navbar-nav > li > a.btn.btn-danger[disabled], .navbar .navbar-nav > li > a.btn.btn-danger[disabled]:hover, .navbar .navbar-nav > li > a.btn.btn-danger[disabled]:focus, .navbar .navbar-nav > li > a.btn.btn-danger[disabled].focus, .navbar .navbar-nav > li > a.btn.btn-danger[disabled]:active, .navbar .navbar-nav > li > a.btn.btn-danger[disabled].active, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-danger, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-danger:hover, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-danger:focus, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-danger.focus, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-danger:active, fieldset[disabled] .navbar .navbar-nav > li > a.btn.btn-danger.active, .btn-danger.disabled, .btn-danger.disabled:hover, .btn-danger.disabled:focus, .btn-danger.disabled.focus, .btn-danger.disabled:active, .btn-danger.disabled.active, .btn-danger:disabled, .btn-danger:disabled:hover, .btn-danger:disabled:focus, .btn-danger:disabled.focus, .btn-danger:disabled:active, .btn-danger:disabled.active, .btn-danger[disabled], .btn-danger[disabled]:hover, .btn-danger[disabled]:focus, .btn-danger[disabled].focus, .btn-danger[disabled]:active, .btn-danger[disabled].active, fieldset[disabled] .btn-danger, fieldset[disabled] .btn-danger:hover, fieldset[disabled] .btn-danger:focus, fieldset[disabled] .btn-danger.focus, fieldset[disabled] .btn-danger:active, fieldset[disabled] .btn-danger.active {\n  background-color: transparent;\n  border-color: #EB5E28;\n}\n.navbar .navbar-nav > li > a.btn.btn-danger.btn-fill, .btn-danger.btn-fill {\n  color: #FFFFFF;\n  background-color: #EB5E28;\n  opacity: 1;\n}\n.navbar .navbar-nav > li > a.btn.btn-danger.btn-fill:hover, .navbar .navbar-nav > li > a.btn.btn-danger.btn-fill:focus, .navbar .navbar-nav > li > a.btn.btn-danger.btn-fill:active, .navbar .navbar-nav > li > a.btn.btn-danger.btn-fill.active, .open > .navbar .navbar-nav > li > a.btn.btn-danger.btn-fill.dropdown-toggle, .btn-danger.btn-fill:hover, .btn-danger.btn-fill:focus, .btn-danger.btn-fill:active, .btn-danger.btn-fill.active, .open > .btn-danger.btn-fill.dropdown-toggle {\n  background-color: #B33C12;\n  color: #FFFFFF;\n  border-color: #B33C12;\n}\n.navbar .navbar-nav > li > a.btn.btn-danger.btn-fill .caret, .btn-danger.btn-fill .caret {\n  border-top-color: #FFFFFF;\n}\n.navbar .navbar-nav > li > a.btn.btn-danger.btn-fill i, .btn-danger.btn-fill i {\n  color: #FFFFFF;\n  opacity: 1;\n}\n.navbar .navbar-nav > li > a.btn.btn-danger.btn-simple:hover, .navbar .navbar-nav > li > a.btn.btn-danger.btn-simple:focus, .navbar .navbar-nav > li > a.btn.btn-danger.btn-simple:active, .navbar .navbar-nav > li > a.btn.btn-danger.btn-simple.active, .open > .navbar .navbar-nav > li > a.btn.btn-danger.btn-simple.dropdown-toggle, .btn-danger.btn-simple:hover, .btn-danger.btn-simple:focus, .btn-danger.btn-simple:active, .btn-danger.btn-simple.active, .open > .btn-danger.btn-simple.dropdown-toggle {\n  background-color: transparent;\n  color: #B33C12;\n}\n.navbar .navbar-nav > li > a.btn.btn-danger.btn-simple:hover i, .navbar .navbar-nav > li > a.btn.btn-danger.btn-simple:focus i, .navbar .navbar-nav > li > a.btn.btn-danger.btn-simple:active i, .navbar .navbar-nav > li > a.btn.btn-danger.btn-simple.active i, .open > .navbar .navbar-nav > li > a.btn.btn-danger.btn-simple.dropdown-toggle i, .btn-danger.btn-simple:hover i, .btn-danger.btn-simple:focus i, .btn-danger.btn-simple:active i, .btn-danger.btn-simple.active i, .open > .btn-danger.btn-simple.dropdown-toggle i {\n  color: #B33C12;\n  opacity: 1;\n}\n.navbar .navbar-nav > li > a.btn.btn-danger.btn-simple:hover .caret, .navbar .navbar-nav > li > a.btn.btn-danger.btn-simple:focus .caret, .navbar .navbar-nav > li > a.btn.btn-danger.btn-simple:active .caret, .navbar .navbar-nav > li > a.btn.btn-danger.btn-simple.active .caret, .open > .navbar .navbar-nav > li > a.btn.btn-danger.btn-simple.dropdown-toggle .caret, .btn-danger.btn-simple:hover .caret, .btn-danger.btn-simple:focus .caret, .btn-danger.btn-simple:active .caret, .btn-danger.btn-simple.active .caret, .open > .btn-danger.btn-simple.dropdown-toggle .caret {\n  border-top-color: #B33C12;\n}\n.navbar .navbar-nav > li > a.btn.btn-danger.btn-simple .caret, .btn-danger.btn-simple .caret {\n  border-top-color: #EB5E28;\n}\n.navbar .navbar-nav > li > a.btn.btn-danger .caret, .btn-danger .caret {\n  border-top-color: #EB5E28;\n}\n\n.btn-neutral {\n  border-color: #FFFFFF;\n  color: #FFFFFF;\n}\n.btn-neutral:hover, .btn-neutral:focus, .btn-neutral:active, .btn-neutral:active:hover, .btn-neutral:active:focus, .btn-neutral.active, .open > .btn-neutral.dropdown-toggle:focus, .open > .btn-neutral.dropdown-toggle:hover, .open > .btn-neutral.dropdown-toggle {\n  background-color: #FFFFFF;\n  color: rgba(255, 255, 255, 0.7);\n  border-color: #FFFFFF;\n}\n.btn-neutral:hover .caret, .btn-neutral:focus .caret, .btn-neutral:active .caret, .btn-neutral:active:hover .caret, .btn-neutral:active:focus .caret, .btn-neutral.active .caret, .open > .btn-neutral.dropdown-toggle:focus .caret, .open > .btn-neutral.dropdown-toggle:hover .caret, .open > .btn-neutral.dropdown-toggle .caret {\n  border-top-color: rgba(255, 255, 255, 0.7);\n}\n.btn-neutral:hover i, .btn-neutral:focus i, .btn-neutral:active i, .btn-neutral:active:hover i, .btn-neutral:active:focus i, .btn-neutral.active i, .open > .btn-neutral.dropdown-toggle:focus i, .open > .btn-neutral.dropdown-toggle:hover i, .open > .btn-neutral.dropdown-toggle i {\n  color: rgba(255, 255, 255, 0.7);\n  opacity: 0.7;\n}\n.btn-neutral.disabled, .btn-neutral.disabled:hover, .btn-neutral.disabled:focus, .btn-neutral.disabled.focus, .btn-neutral.disabled:active, .btn-neutral.disabled.active, .btn-neutral:disabled, .btn-neutral:disabled:hover, .btn-neutral:disabled:focus, .btn-neutral:disabled.focus, .btn-neutral:disabled:active, .btn-neutral:disabled.active, .btn-neutral[disabled], .btn-neutral[disabled]:hover, .btn-neutral[disabled]:focus, .btn-neutral[disabled].focus, .btn-neutral[disabled]:active, .btn-neutral[disabled].active, fieldset[disabled] .btn-neutral, fieldset[disabled] .btn-neutral:hover, fieldset[disabled] .btn-neutral:focus, fieldset[disabled] .btn-neutral.focus, fieldset[disabled] .btn-neutral:active, fieldset[disabled] .btn-neutral.active {\n  background-color: transparent;\n  border-color: #FFFFFF;\n}\n.btn-neutral.btn-fill {\n  color: #FFFFFF;\n  background-color: #FFFFFF;\n  opacity: 1;\n}\n.btn-neutral.btn-fill:hover, .btn-neutral.btn-fill:focus, .btn-neutral.btn-fill:active, .btn-neutral.btn-fill.active, .open > .btn-neutral.btn-fill.dropdown-toggle {\n  background-color: #FFFFFF;\n  color: #FFFFFF;\n  border-color: #FFFFFF;\n}\n.btn-neutral.btn-fill .caret {\n  border-top-color: #FFFFFF;\n}\n.btn-neutral.btn-fill i {\n  color: #FFFFFF;\n  opacity: 1;\n}\n.btn-neutral.btn-simple:hover, .btn-neutral.btn-simple:focus, .btn-neutral.btn-simple:active, .btn-neutral.btn-simple.active, .open > .btn-neutral.btn-simple.dropdown-toggle {\n  background-color: transparent;\n  color: #FFFFFF;\n}\n.btn-neutral.btn-simple:hover i, .btn-neutral.btn-simple:focus i, .btn-neutral.btn-simple:active i, .btn-neutral.btn-simple.active i, .open > .btn-neutral.btn-simple.dropdown-toggle i {\n  color: #FFFFFF;\n  opacity: 1;\n}\n.btn-neutral.btn-simple:hover .caret, .btn-neutral.btn-simple:focus .caret, .btn-neutral.btn-simple:active .caret, .btn-neutral.btn-simple.active .caret, .open > .btn-neutral.btn-simple.dropdown-toggle .caret {\n  border-top-color: #FFFFFF;\n}\n.btn-neutral.btn-simple .caret {\n  border-top-color: #FFFFFF;\n}\n.btn-neutral .caret {\n  border-top-color: #FFFFFF;\n}\n.btn-neutral:hover, .btn-neutral:focus {\n  color: #66615B;\n}\n.btn-neutral:hover i, .btn-neutral:focus i {\n  color: #66615B;\n  opacity: 1;\n}\n.btn-neutral:active, .btn-neutral.active, .open > .btn-neutral.dropdown-toggle {\n  background-color: #FFFFFF;\n  color: #66615B;\n}\n.btn-neutral:active i, .btn-neutral.active i, .open > .btn-neutral.dropdown-toggle i {\n  color: #66615B;\n  opacity: 1;\n}\n.btn-neutral.btn-fill {\n  color: #66615B;\n}\n.btn-neutral.btn-fill i {\n  color: #66615B;\n  opacity: 1;\n}\n.btn-neutral.btn-fill:hover, .btn-neutral.btn-fill:focus {\n  color: #403D39;\n}\n.btn-neutral.btn-fill:hover i, .btn-neutral.btn-fill:focus i {\n  color: #403D39;\n  opacity: 1;\n}\n.btn-neutral.btn-simple:active, .btn-neutral.btn-simple.active {\n  background-color: transparent;\n}\n\n.btn:disabled, .btn[disabled], .btn.disabled, .btn.btn-disabled {\n  opacity: 0.5;\n}\n\n.btn-disabled {\n  cursor: default;\n}\n\n.btn-simple {\n  border: 0;\n  padding: 7px 18px;\n}\n\n.navbar .navbar-nav > li > a.btn.btn-lg, .btn-lg {\n  font-size: 20px;\n  border-radius: 50px;\n  /*    line-height: $line-height; */\n  padding: 11px 30px;\n  font-weight: 400;\n}\n.navbar .navbar-nav > li > a.btn.btn-lg.btn-simple, .btn-lg.btn-simple {\n  padding: 13px 30px;\n}\n.navbar .navbar-nav > li > a.btn.btn-lg.btn-icon, .btn-lg.btn-icon {\n  border-radius: 30px;\n  padding: 9px 16px;\n}\n\n.navbar .navbar-nav > li > a.btn.btn-sm, .btn-sm {\n  font-size: 14px;\n  border-radius: 26px;\n  /*    line-height: $line-height; */\n  padding: 4px 10px;\n}\n.navbar .navbar-nav > li > a.btn.btn-sm.btn-simple, .btn-sm.btn-simple {\n  padding: 6px 10px;\n}\n.navbar .navbar-nav > li > a.btn.btn-sm.btn-icon, .btn-sm.btn-icon {\n  padding: 3px 7px;\n}\n.navbar .navbar-nav > li > a.btn.btn-sm.btn-icon .fa, .btn-sm.btn-icon .fa {\n  line-height: 1.6;\n  width: 15px;\n}\n\n.navbar .navbar-nav > li > a.btn.btn-xs, .btn-xs {\n  font-size: 12px;\n  border-radius: 26px;\n  /*    line-height: $line-height; */\n  padding: 2px 5px;\n}\n.navbar .navbar-nav > li > a.btn.btn-xs.btn-simple, .btn-xs.btn-simple {\n  padding: 4px 5px;\n}\n.navbar .navbar-nav > li > a.btn.btn-xs.btn-icon, .btn-xs.btn-icon {\n  padding: 1px 5px;\n}\n.navbar .navbar-nav > li > a.btn.btn-xs.btn-icon .fa, .btn-xs.btn-icon .fa {\n  width: 10px;\n}\n\n.navbar .navbar-nav > li > a.btn.btn-wd, .btn-wd {\n  min-width: 140px;\n}\n\n.btn-group.select {\n  width: 100%;\n}\n\n.btn-group.select .btn {\n  text-align: left;\n}\n\n.btn-group.select .caret {\n  position: absolute;\n  top: 50%;\n  margin-top: -1px;\n  right: 8px;\n}\n\n.btn-tooltip {\n  white-space: nowrap;\n}\n\n.form-control::-moz-placeholder {\n  color: #DDDDDD;\n  opacity: 1;\n}\n\n.form-control:-moz-placeholder {\n  color: #DDDDDD;\n  opacity: 1;\n}\n\n.form-control::-webkit-input-placeholder {\n  color: #DDDDDD;\n  opacity: 1;\n}\n\n.form-control:-ms-input-placeholder {\n  color: #DDDDDD;\n  opacity: 1;\n}\n\n.form-control {\n  background-color: #fffcf5;\n  border: medium none;\n  border-radius: 4px;\n  color: #66615b;\n  font-size: 16px;\n  transition: background-color 0.3s ease 0s;\n  padding: 7px 18px;\n  height: 40px;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\n.form-control:focus {\n  background-color: #FFFFFF;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n  outline: 0 !important;\n}\n.has-success .form-control, .has-error .form-control, .has-success .form-control:focus, .has-error .form-control:focus {\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\n.has-success .form-control {\n  background-color: #ABF3CB;\n  color: #7AC29A;\n}\n.has-success .form-control.border-input {\n  border: 1px solid #7AC29A;\n}\n.has-success .form-control:focus {\n  background-color: #FFFFFF;\n}\n.has-error .form-control {\n  background-color: #FFC0A4;\n  color: #EB5E28;\n}\n.has-error .form-control.border-input {\n  border: 1px solid #EB5E28;\n}\n.has-error .form-control:focus {\n  background-color: #FFFFFF;\n}\n.form-control + .form-control-feedback {\n  border-radius: 6px;\n  font-size: 16px;\n  margin-top: -7px;\n  position: absolute;\n  right: 10px;\n  top: 50%;\n  vertical-align: middle;\n}\n.form-control.border-input {\n  border: 1px solid #CCC5B9;\n}\n.open .form-control {\n  border-bottom-color: transparent;\n}\n\n.input-lg {\n  height: 55px;\n  padding: 11px 30px;\n}\n\n.has-error .form-control-feedback, .has-error .control-label {\n  color: #EB5E28;\n}\n\n.has-success .form-control-feedback, .has-success .control-label {\n  color: #7AC29A;\n}\n\n.input-group-addon {\n  background-color: #fffcf5;\n  border: medium none;\n  border-radius: 4px;\n}\n.has-success .input-group-addon, .has-error .input-group-addon {\n  background-color: #FFFFFF;\n}\n.has-error .form-control:focus + .input-group-addon {\n  color: #EB5E28;\n}\n.has-success .form-control:focus + .input-group-addon {\n  color: #7AC29A;\n}\n.form-control:focus + .input-group-addon, .form-control:focus ~ .input-group-addon {\n  background-color: #FFFFFF;\n}\n\n.border-input .input-group-addon {\n  border: solid 1px #CCC5B9;\n}\n\n.input-group {\n  margin-bottom: 15px;\n}\n\n.input-group[disabled] .input-group-addon {\n  background-color: #E3E3E3;\n}\n\n.input-group .form-control:first-child,\n.input-group-addon:first-child,\n.input-group-btn:first-child > .dropdown-toggle,\n.input-group-btn:last-child > .btn:not(:last-child):not(.dropdown-toggle) {\n  border-right: 0 none;\n}\n\n.input-group .form-control:last-child,\n.input-group-addon:last-child,\n.input-group-btn:last-child > .dropdown-toggle,\n.input-group-btn:first-child > .btn:not(:first-child) {\n  border-left: 0 none;\n}\n\n.form-control[disabled], .form-control[readonly], fieldset[disabled] .form-control {\n  background-color: #E3E3E3;\n  cursor: not-allowed;\n  color: #9A9A9A;\n  opacity: 1;\n}\n\n.form-control[disabled]::-moz-placeholder {\n  color: #9A9A9A;\n  opacity: 1;\n}\n\n.form-control[disabled]:-moz-placeholder {\n  color: #DDDDDD;\n  opacity: 1;\n}\n\n.form-control[disabled]::-webkit-input-placeholder {\n  color: #DDDDDD;\n  opacity: 1;\n}\n\n.form-control[disabled]:-ms-input-placeholder {\n  color: #DDDDDD;\n  opacity: 1;\n}\n\n.input-group-btn .btn {\n  border-width: 1px;\n  padding: 9px 18px;\n}\n\n.input-group-btn .btn-default:not(.btn-fill) {\n  border-color: #DDDDDD;\n}\n\n.input-group-btn:last-child > .btn {\n  margin-left: 0;\n}\n\ntextarea.form-control {\n  max-width: 100%;\n  padding: 10px 18px;\n  resize: none;\n}\n\n.progress {\n  background-color: #DDDDDD;\n  border-radius: 3px;\n  box-shadow: none;\n  height: 8px;\n}\n\n.progress-thin {\n  height: 4px;\n}\n\n.progress-bar {\n  background-color: #7A9E9F;\n}\n\n.progress-bar-primary {\n  background-color: #7A9E9F;\n}\n\n.progress-bar-info {\n  background-color: #68B3C8;\n}\n\n.progress-bar-success {\n  background-color: #7AC29A;\n}\n\n.progress-bar-warning {\n  background-color: #F3BB45;\n}\n\n.progress-bar-danger {\n  background-color: #EB5E28;\n}\n\n/*!\n * jQuery UI Slider 1.10.4\n * http://jqueryui.com\n *\n * Copyright 2014 jQuery Foundation and other contributors\n * Released under the MIT license.\n * http://jquery.org/license\n *\n * http://api.jqueryui.com/slider/#theming\n */\n.ui-slider {\n  border-radius: 3px;\n  position: relative;\n  text-align: left;\n}\n\n.ui-slider .ui-slider-handle {\n  position: absolute;\n  z-index: 2;\n  width: 1.2em;\n  height: 1.2em;\n  cursor: default;\n  transition: none;\n  -webkit-transition: none;\n}\n\n.ui-slider .ui-slider-range {\n  background-position: 0 0;\n  border: 0;\n  border-radius: 3px;\n  display: block;\n  font-size: .7em;\n  position: absolute;\n  z-index: 1;\n}\n\n/* For IE8 - See #6727 */\n.ui-slider.ui-state-disabled .ui-slider-handle,\n.ui-slider.ui-state-disabled .ui-slider-range {\n  filter: inherit;\n}\n\n.ui-slider-horizontal {\n  height: 8px;\n}\n\n.ui-slider-horizontal .ui-slider-handle {\n  margin-left: -10px;\n  top: -4px;\n}\n\n.ui-slider-horizontal .ui-slider-range {\n  top: 0;\n  height: 100%;\n}\n\n.ui-slider-horizontal .ui-slider-range-min {\n  left: 0;\n}\n\n.ui-slider-horizontal .ui-slider-range-max {\n  right: 0;\n}\n\n.ui-slider-vertical {\n  width: .8em;\n  height: 100px;\n}\n\n.ui-slider-vertical .ui-slider-handle {\n  left: -.3em;\n  margin-left: 0;\n  margin-bottom: -.6em;\n}\n\n.ui-slider-vertical .ui-slider-range {\n  left: 0;\n  width: 100%;\n}\n\n.ui-slider-vertical .ui-slider-range-min {\n  bottom: 0;\n}\n\n.ui-slider-vertical .ui-slider-range-max {\n  top: 0;\n}\n\n/* Component containers\n----------------------------------*/\n.ui-widget {\n  font-size: 1.1em;\n}\n\n.ui-widget .ui-widget {\n  font-size: 1em;\n}\n\n.ui-widget input,\n.ui-widget select,\n.ui-widget textarea,\n.ui-widget button {\n  font-size: 1em;\n}\n\n.ui-widget-content {\n  background-color: #E5E5E5;\n}\n\n.ui-widget-content a {\n  color: #222222;\n}\n\n.ui-widget-header {\n  background: #DDDDDD;\n  color: #222222;\n  font-weight: bold;\n}\n\n.ui-widget-header a {\n  color: #222222;\n}\n\n.slider-primary .ui-widget-header {\n  background-color: #7A9E9F;\n}\n\n.slider-info .ui-widget-header {\n  background-color: #68B3C8;\n}\n\n.slider-success .ui-widget-header {\n  background-color: #7AC29A;\n}\n\n.slider-warning .ui-widget-header {\n  background-color: #F3BB45;\n}\n\n.slider-danger .ui-widget-header {\n  background-color: #EB5E28;\n}\n\n/* Interaction states\n----------------------------------*/\n.ui-state-default,\n.ui-widget-content .ui-state-default,\n.ui-widget-header .ui-state-default {\n  background: white;\n  /* Old browsers */\n  background: -moz-linear-gradient(top, white 0%, #f1f1f2 100%);\n  /* FF3.6+ */\n  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, white), color-stop(100%, #f1f1f2));\n  /* Chrome,Safari4+ */\n  background: -webkit-linear-gradient(top, white 0%, #f1f1f2 100%);\n  /* Chrome10+,Safari5.1+ */\n  background: -o-linear-gradient(top, white 0%, #f1f1f2 100%);\n  /* Opera 11.10+ */\n  background: -ms-linear-gradient(top, white 0%, #f1f1f2 100%);\n  /* IE10+ */\n  background: linear-gradient(to bottom, white 0%, #f1f1f2 100%);\n  /* W3C */\n  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#f1f1f2',GradientType=0 );\n  /* IE6-9 */\n  border-radius: 50%;\n  box-shadow: 0 1px 1px #FFFFFF inset, 0 1px 2px rgba(0, 0, 0, 0.4);\n  height: 15px;\n  width: 15px;\n  cursor: pointer;\n}\n\n.ui-state-default a,\n.ui-state-default a:link,\n.ui-state-default a:visited {\n  color: #555555;\n  text-decoration: none;\n}\n\n.ui-state-hover a,\n.ui-state-hover a:hover,\n.ui-state-hover a:link,\n.ui-state-hover a:visited,\n.ui-state-focus a,\n.ui-state-focus a:hover,\n.ui-state-focus a:link,\n.ui-state-focus a:visited {\n  color: #212121;\n  text-decoration: none;\n}\n\n.ui-state-active a,\n.ui-state-active a:link,\n.ui-state-active a:visited {\n  color: #212121;\n  text-decoration: none;\n}\n\n/* Interaction Cues\n----------------------------------*/\n.ui-state-highlight,\n.ui-widget-content .ui-state-highlight,\n.ui-widget-header .ui-state-highlight {\n  border: 1px solid #fcefa1;\n  background: #fbf9ee;\n  color: #363636;\n}\n\n.ui-state-highlight a,\n.ui-widget-content .ui-state-highlight a,\n.ui-widget-header .ui-state-highlight a {\n  color: #363636;\n}\n\n.ui-state-error,\n.ui-widget-content .ui-state-error,\n.ui-widget-header .ui-state-error {\n  border: 1px solid #EB5E28;\n  background-color: #EB5E28;\n  color: #EB5E28;\n}\n\n.ui-state-error a,\n.ui-widget-content .ui-state-error a,\n.ui-widget-header .ui-state-error a {\n  color: #EB5E28;\n}\n\n.ui-state-error-text,\n.ui-widget-content .ui-state-error-text,\n.ui-widget-header .ui-state-error-text {\n  color: #EB5E28;\n}\n\n.ui-priority-primary,\n.ui-widget-content .ui-priority-primary,\n.ui-widget-header .ui-priority-primary {\n  font-weight: bold;\n}\n\n.ui-priority-secondary,\n.ui-widget-content .ui-priority-secondary,\n.ui-widget-header .ui-priority-secondary {\n  opacity: .7;\n  filter: Alpha(Opacity=70);\n  font-weight: normal;\n}\n\n.ui-state-disabled,\n.ui-widget-content .ui-state-disabled,\n.ui-widget-header .ui-state-disabled {\n  opacity: .35;\n  filter: Alpha(Opacity=35);\n  background-image: none;\n}\n\n.ui-state-disabled .ui-icon {\n  filter: Alpha(Opacity=35);\n  /* For IE8 - See #6059 */\n}\n\n.alert {\n  border: 0;\n  border-radius: 0;\n  color: #FFFFFF;\n  padding: 10px 15px;\n  font-size: 14px;\n}\n.container .alert {\n  border-radius: 4px;\n}\n.navbar .alert {\n  border-radius: 0;\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 85px;\n  width: 100%;\n  z-index: 3;\n}\n.navbar:not(.navbar-transparent) .alert {\n  top: 70px;\n}\n.alert .close {\n  vertical-align: top;\n  text-shadow: none;\n}\n.alert .alert-wrapper {\n  padding: 5px 0;\n  position: relative;\n}\n.alert .alert-wrapper .close {\n  top: 6px;\n  position: absolute;\n  right: 0px;\n}\n.alert .alert-wrapper .message {\n  padding-left: 60px;\n  padding-right: 60px;\n}\n.alert .alert-icon {\n  display: block;\n  font-size: 30px;\n  left: 15px;\n  position: absolute;\n  top: 50%;\n  margin-top: -22px;\n}\n[class*=\"col-\"] .alert .container {\n  width: auto;\n}\n\n.alert-info {\n  background-color: #7CE4FE;\n  color: #3091B2;\n}\n.alert-info .close {\n  color: #3091B2;\n  opacity: 0.7;\n}\n.alert-info .close:hover {\n  opacity: 1;\n}\n\n.alert-success {\n  background-color: #8EF3C5;\n  color: #42A084;\n}\n.alert-success .close {\n  color: #42A084;\n  opacity: 0.7;\n}\n.alert-success .close:hover {\n  opacity: 1;\n}\n\n.alert-warning {\n  background-color: #FFE28C;\n  color: #BB992F;\n}\n.alert-warning .close {\n  color: #BB992F;\n  opacity: 0.7;\n}\n.alert-warning .close:hover {\n  opacity: 1;\n}\n\n.alert-danger {\n  background-color: #FF8F5E;\n  color: #B33C12;\n}\n.alert-danger .close {\n  color: #B33C12;\n  opacity: 0.7;\n}\n.alert-danger .close:hover {\n  opacity: 1;\n}\n\n/*           Labels & Progress-bar              */\n.label {\n  padding: 0.4em 0.9em;\n  border-radius: 10px;\n  color: #FFFFFF;\n  font-weight: 500;\n  font-size: 0.75em;\n  line-height: 1;\n  text-transform: uppercase;\n  display: inline-block;\n}\n\n.label-icon {\n  padding: 0.4em 0.55em;\n}\n.label-icon i {\n  font-size: 0.8em;\n  line-height: 1;\n}\n\n.label-default {\n  background-color: #66615b;\n}\n\n.label-primary {\n  background-color: #7A9E9F;\n}\n\n.label-info {\n  background-color: #68B3C8;\n}\n\n.label-success {\n  background-color: #7AC29A;\n}\n\n.label-warning {\n  background-color: #F3BB45;\n}\n\n.label-danger {\n  background-color: #EB5E28;\n}\n\n.tooltip {\n  font-size: 14px;\n  font-weight: 400;\n}\n.tooltip.top {\n  margin-top: -11px;\n  padding: 0;\n}\n.tooltip.top .tooltip-inner:after {\n  border-top: 11px solid #FFFFFF;\n  border-left: 11px solid transparent;\n  border-right: 11px solid transparent;\n  bottom: -10px;\n}\n.tooltip.top .tooltip-inner:before {\n  border-top: 11px solid rgba(0, 0, 0, 0.2);\n  border-left: 11px solid transparent;\n  border-right: 11px solid transparent;\n  bottom: -11px;\n}\n.tooltip.bottom {\n  margin-top: 11px;\n  padding: 0;\n}\n.tooltip.bottom .tooltip-inner:after {\n  border-bottom: 11px solid #FFFFFF;\n  border-left: 11px solid transparent;\n  border-right: 11px solid transparent;\n  top: -10px;\n}\n.tooltip.bottom .tooltip-inner:before {\n  border-bottom: 11px solid rgba(0, 0, 0, 0.2);\n  border-left: 11px solid transparent;\n  border-right: 11px solid transparent;\n  top: -11px;\n}\n.tooltip.left {\n  margin-left: -11px;\n  padding: 0;\n}\n.tooltip.left .tooltip-inner:after {\n  border-left: 11px solid #FFFFFF;\n  border-top: 11px solid transparent;\n  border-bottom: 11px solid transparent;\n  right: -10px;\n  left: auto;\n  margin-left: 0;\n}\n.tooltip.left .tooltip-inner:before {\n  border-left: 11px solid rgba(0, 0, 0, 0.2);\n  border-top: 11px solid transparent;\n  border-bottom: 11px solid transparent;\n  right: -11px;\n  left: auto;\n  margin-left: 0;\n}\n.tooltip.right {\n  margin-left: 11px;\n  padding: 0;\n}\n.tooltip.right .tooltip-inner:after {\n  border-right: 11px solid #FFFFFF;\n  border-top: 11px solid transparent;\n  border-bottom: 11px solid transparent;\n  left: -10px;\n  top: 10px;\n  margin-left: 0;\n}\n.tooltip.right .tooltip-inner:before {\n  border-right: 11px solid rgba(0, 0, 0, 0.2);\n  border-top: 11px solid transparent;\n  border-bottom: 11px solid transparent;\n  left: -11px;\n  top: 11px;\n  margin-left: 0;\n}\n\n.tooltip-arrow {\n  display: none;\n  opacity: 0;\n}\n\n.tooltip-inner {\n  background-color: #FFFFFF;\n  border-radius: 8px;\n  box-shadow: 0 1px 13px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(115, 71, 38, 0.23);\n  color: #66615B;\n  max-width: 200px;\n  padding: 10px 10px;\n  text-align: center;\n  text-decoration: none;\n}\n\n.tooltip-inner:after {\n  content: \"\";\n  display: inline-block;\n  left: 100%;\n  margin-left: -60%;\n  position: absolute;\n}\n\n.tooltip-inner:before {\n  content: \"\";\n  display: inline-block;\n  left: 100%;\n  margin-left: -60%;\n  position: absolute;\n}\n\n.popover {\n  border: 0;\n  border-radius: 4px;\n  background-color: #FFFCF5;\n  color: #66615b;\n  font-weight: 400;\n  padding: 0;\n  z-index: 1031;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\n.popover .popover-title {\n  background-color: #FFFCF5;\n  border-bottom: 0 none;\n  font-size: 16px;\n  font-weight: normal;\n  line-height: 22px;\n  padding: 15px 15px 8px 15px;\n  margin: 0;\n  color: #66615b;\n  text-align: center;\n  border-radius: 4px 4px 0 0;\n}\n.popover .popover-content {\n  padding: 10px 15px 20px 15px;\n  text-align: center;\n}\n.popover .arrow {\n  border: 0;\n}\n\n.popover .popover.top .arrow {\n  margin-left: 0;\n}\n\n.popover.bottom .arrow:after {\n  border-bottom-color: #FFFCF5;\n}\n\n.popover.left > .arrow::after {\n  border-left-color: #FFFCF5;\n  bottom: -20px;\n}\n\n.popover.top > .arrow::after {\n  border-top-color: #FFFCF5;\n}\n\n.popover.right > .arrow::after {\n  border-right-color: #FFFCF5;\n}\n\n.popover-filter {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1030;\n  background-color: #000000;\n  opacity: 0;\n  visibility: hidden;\n  transition: visibility 0s linear 0.3s,opacity 0.3s linear;\n}\n\n.popover-filter.in {\n  visibility: visible;\n  opacity: 0.2;\n  transition-delay: 0s;\n}\n\n.popover-primary {\n  background-color: #8ECFD5;\n  color: #FFFFFF;\n}\n.popover-primary .popover-title {\n  background-color: #8ECFD5;\n  color: #427C89;\n}\n.popover-primary.bottom .arrow:after {\n  border-bottom-color: #8ECFD5;\n}\n.popover-primary.left > .arrow::after {\n  border-left-color: #8ECFD5;\n}\n.popover-primary.top > .arrow::after {\n  border-top-color: #8ECFD5;\n}\n.popover-primary.right > .arrow::after {\n  border-right-color: #8ECFD5;\n}\n\n.popover-info {\n  background-color: #7CE4FE;\n  color: #FFFFFF;\n}\n.popover-info .popover-title {\n  background-color: #7CE4FE;\n  color: #3091B2;\n}\n.popover-info.bottom .arrow:after {\n  border-bottom-color: #7CE4FE;\n}\n.popover-info.left > .arrow::after {\n  border-left-color: #7CE4FE;\n}\n.popover-info.top > .arrow::after {\n  border-top-color: #7CE4FE;\n}\n.popover-info.right > .arrow::after {\n  border-right-color: #7CE4FE;\n}\n\n.popover-success {\n  background-color: #8EF3C5;\n  color: #FFFFFF;\n}\n.popover-success .popover-title {\n  background-color: #8EF3C5;\n  color: #42A084;\n}\n.popover-success.bottom .arrow:after {\n  border-bottom-color: #8EF3C5;\n}\n.popover-success.left > .arrow::after {\n  border-left-color: #8EF3C5;\n}\n.popover-success.top > .arrow::after {\n  border-top-color: #8EF3C5;\n}\n.popover-success.right > .arrow::after {\n  border-right-color: #8EF3C5;\n}\n\n.popover-warning {\n  background-color: #FFE28C;\n  color: #FFFFFF;\n}\n.popover-warning .popover-title {\n  background-color: #FFE28C;\n  color: #BB992F;\n}\n.popover-warning.bottom .arrow:after {\n  border-bottom-color: #FFE28C;\n}\n.popover-warning.left > .arrow::after {\n  border-left-color: #FFE28C;\n}\n.popover-warning.top > .arrow::after {\n  border-top-color: #FFE28C;\n}\n.popover-warning.right > .arrow::after {\n  border-right-color: #FFE28C;\n}\n\n.popover-danger {\n  background-color: #FF8F5E;\n  color: #FFFFFF;\n}\n.popover-danger .popover-title {\n  background-color: #FF8F5E;\n  color: #B33C12;\n}\n.popover-danger.bottom .arrow:after {\n  border-bottom-color: #FF8F5E;\n}\n.popover-danger.left > .arrow::after {\n  border-left-color: #FF8F5E;\n}\n.popover-danger.top > .arrow::after {\n  border-top-color: #FF8F5E;\n}\n.popover-danger.right > .arrow::after {\n  border-right-color: #FF8F5E;\n}\n\n.section {\n  padding: 30px 0;\n  position: relative;\n  background-color: #f4f3ef;\n  background-image: linear-gradient(to bottom, transparent 0%, rgba(112, 112, 112, 0) 60%, rgba(186, 186, 186, 0.15) 100%);\n}\n\n.section-with-space {\n  padding: 60px 0;\n}\n\n.section-white {\n  background-color: #FFFFFF;\n}\n\n.section-nude {\n  background-color: #FFFCF5;\n}\n\n.section-gray {\n  background-color: #F3F2EE;\n}\n\n.section-nude-gray {\n  background-color: #e8e7e3;\n}\n\n.section-white-gray {\n  background-color: #F9F9F7;\n}\n\n.section-light-brown {\n  background-color: #D8C1AB;\n  color: #FFFFFF;\n}\n\n.section-brown {\n  background-color: #A59E94;\n  color: #FFFFFF;\n}\n\n.section-light-blue {\n  background-color: #7A9E9F;\n  color: #FFFFFF;\n}\n\n.section-dark-blue {\n  background-color: #506367;\n  color: #FFFFFF;\n}\n\n.section-dark {\n  background-color: #1a1817;\n  color: #FFFFFF;\n}\n\n/*      Checkbox and radio         */\n.checkbox,\n.radio {\n  margin-bottom: 12px;\n  padding-left: 30px;\n  position: relative;\n  -webkit-transition: color,opacity 0.25s linear;\n  transition: color,opacity 0.25s linear;\n  font-size: 16px;\n  font-weight: normal;\n  line-height: 1.5;\n  color: #66615b;\n  cursor: pointer;\n}\n.checkbox .icons,\n.radio .icons {\n  color: #66615b;\n  display: block;\n  height: 20px;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 20px;\n  text-align: center;\n  line-height: 21px;\n  font-size: 20px;\n  cursor: pointer;\n  -webkit-transition: color,opacity 0.15s linear;\n  transition: color,opacity 0.15s linear;\n  opacity: .50;\n}\n.checkbox.checked .icons,\n.radio.checked .icons {\n  opacity: 1;\n}\n.checkbox input,\n.radio input {\n  outline: none !important;\n  display: none;\n}\n\n.checkbox .icons .first-icon,\n.radio .icons .first-icon,\n.checkbox .icons .second-icon,\n.radio .icons .second-icon {\n  display: inline-table;\n  position: absolute;\n  left: 0;\n  top: 0;\n  background-color: transparent;\n  margin: 0;\n  opacity: 1;\n}\n\n.checkbox .icons .second-icon,\n.radio .icons .second-icon {\n  opacity: 0;\n}\n\n.checkbox:hover,\n.radio:hover {\n  -webkit-transition: color 0.2s linear;\n  transition: color 0.2s linear;\n}\n\n.checkbox:hover .first-icon,\n.radio:hover .first-icon {\n  opacity: 0;\n}\n\n.checkbox:hover .second-icon,\n.radio:hover .second-icon {\n  opacity: 1;\n}\n\n.checkbox.checked .first-icon,\n.radio.checked .first-icon {\n  opacity: 0;\n  filter: alpha(opacity=0);\n}\n\n.checkbox.checked .second-icon,\n.radio.checked .second-icon {\n  opacity: 1;\n  filter: alpha(opacity=100);\n  -webkit-transition: color 0.2s linear;\n  transition: color 0.2s linear;\n}\n\n.checkbox.disabled,\n.radio.disabled {\n  cursor: default;\n  color: #DDDDDD;\n}\n\n.checkbox.disabled .icons,\n.radio.disabled .icons {\n  color: #DDDDDD;\n}\n\n.checkbox.disabled .first-icon,\n.radio.disabled .first-icon {\n  opacity: 1;\n  filter: alpha(opacity=100);\n}\n\n.checkbox.disabled .second-icon,\n.radio.disabled .second-icon {\n  opacity: 0;\n  filter: alpha(opacity=0);\n}\n\n.checkbox.disabled.checked .icons,\n.radio.disabled.checked .icons {\n  color: #DDDDDD;\n}\n\n.checkbox.disabled.checked .first-icon,\n.radio.disabled.checked .first-icon {\n  opacity: 0;\n  filter: alpha(opacity=0);\n}\n\n.checkbox.disabled.checked .second-icon,\n.radio.disabled.checked .second-icon {\n  opacity: 1;\n  color: #DDDDDD;\n  filter: alpha(opacity=100);\n}\n\n.nav > li > a:hover,\n.nav > li > a:focus {\n  background-color: transparent;\n}\n\n.navbar {\n  border: 0;\n  font-size: 16px;\n  padding: 10px;\n  margin-bottom: 0px;\n  z-index: 3;\n}\n.navbar .navbar-brand {\n  font-weight: 600;\n  margin: 5px 0px;\n  padding: 20px 15px;\n  font-size: 22px;\n}\n.navbar .navbar-nav > li > a {\n  line-height: 1.42857;\n  margin: 15px 3px;\n  padding: 10px 15px;\n}\n.navbar .navbar-nav > li > a.btn {\n  margin: 15px 3px;\n  padding: 7px 18px;\n}\n.navbar .navbar-nav > li > a.btn-xs {\n  margin: 25px 5px;\n}\n.navbar .navbar-nav > li > a.btn-sm {\n  margin: 20px 5px;\n}\n.navbar .btn {\n  margin: 15px 3px;\n  font-size: 16px;\n}\n.navbar .btn-simple {\n  font-size: 18px;\n}\n\n.navbar-nav > li > .dropdown-menu {\n  border-radius: 8px;\n  margin-top: -4px;\n}\n\n.navbar-transparent .navbar-brand, [class*=\"navbar-ct\"] .navbar-brand {\n  opacity: 0.9;\n}\n.navbar-transparent .navbar-brand:focus, .navbar-transparent .navbar-brand:hover, [class*=\"navbar-ct\"] .navbar-brand:focus, [class*=\"navbar-ct\"] .navbar-brand:hover {\n  background-color: transparent;\n  opacity: 1;\n}\n.navbar-transparent .navbar-brand:not([class*=\"text\"]), [class*=\"navbar-ct\"] .navbar-brand:not([class*=\"text\"]) {\n  color: #FFFFFF;\n}\n.navbar-transparent .navbar-nav > li > a:not(.btn), [class*=\"navbar-ct\"] .navbar-nav > li > a:not(.btn) {\n  color: #FFFFFF;\n  border-color: #FFFFFF;\n  opacity: 0.8;\n}\n.navbar-transparent .navbar-nav > .active > a:not(.btn),\n.navbar-transparent .navbar-nav > .active > a:hover:not(.btn),\n.navbar-transparent .navbar-nav > .active > a:focus:not(.btn),\n.navbar-transparent .navbar-nav > li > a:hover:not(.btn),\n.navbar-transparent .navbar-nav > li > a:focus:not(.btn), [class*=\"navbar-ct\"] .navbar-nav > .active > a:not(.btn),\n[class*=\"navbar-ct\"] .navbar-nav > .active > a:hover:not(.btn),\n[class*=\"navbar-ct\"] .navbar-nav > .active > a:focus:not(.btn),\n[class*=\"navbar-ct\"] .navbar-nav > li > a:hover:not(.btn),\n[class*=\"navbar-ct\"] .navbar-nav > li > a:focus:not(.btn) {\n  background-color: transparent;\n  border-radius: 3px;\n  color: #FFFFFF;\n  opacity: 1;\n}\n.navbar-transparent .navbar-nav .nav > li > a.btn:hover, [class*=\"navbar-ct\"] .navbar-nav .nav > li > a.btn:hover {\n  background-color: transparent;\n}\n.navbar-transparent .navbar-nav > .dropdown > a .caret,\n.navbar-transparent .navbar-nav > .dropdown > a:hover .caret,\n.navbar-transparent .navbar-nav > .dropdown > a:focus .caret, [class*=\"navbar-ct\"] .navbar-nav > .dropdown > a .caret,\n[class*=\"navbar-ct\"] .navbar-nav > .dropdown > a:hover .caret,\n[class*=\"navbar-ct\"] .navbar-nav > .dropdown > a:focus .caret {\n  border-bottom-color: #FFFFFF;\n  border-top-color: #FFFFFF;\n}\n.navbar-transparent .navbar-nav > .open > a,\n.navbar-transparent .navbar-nav > .open > a:hover,\n.navbar-transparent .navbar-nav > .open > a:focus, [class*=\"navbar-ct\"] .navbar-nav > .open > a,\n[class*=\"navbar-ct\"] .navbar-nav > .open > a:hover,\n[class*=\"navbar-ct\"] .navbar-nav > .open > a:focus {\n  background-color: transparent;\n  color: #FFFFFF;\n  opacity: 1;\n}\n.navbar-transparent .btn-default, [class*=\"navbar-ct\"] .btn-default {\n  color: #FFFFFF;\n  border-color: #FFFFFF;\n}\n.navbar-transparent .btn-default.btn-fill, [class*=\"navbar-ct\"] .btn-default.btn-fill {\n  color: #9A9A9A;\n  background-color: #FFFFFF;\n  opacity: 0.9;\n}\n.navbar-transparent .btn-default.btn-fill:hover,\n.navbar-transparent .btn-default.btn-fill:focus,\n.navbar-transparent .btn-default.btn-fill:active,\n.navbar-transparent .btn-default.btn-fill.active,\n.navbar-transparent .open .dropdown-toggle.btn-fill.btn-default, [class*=\"navbar-ct\"] .btn-default.btn-fill:hover,\n[class*=\"navbar-ct\"] .btn-default.btn-fill:focus,\n[class*=\"navbar-ct\"] .btn-default.btn-fill:active,\n[class*=\"navbar-ct\"] .btn-default.btn-fill.active,\n[class*=\"navbar-ct\"] .open .dropdown-toggle.btn-fill.btn-default {\n  border-color: #FFFFFF;\n  opacity: 1;\n}\n\n.navbar-transparent .dropdown-menu .divider {\n  background-color: rgba(255, 255, 255, 0.2);\n}\n\n.navbar-default {\n  background-color: #FFFCF5;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.1);\n}\n.navbar-default .brand {\n  color: #66615b !important;\n}\n.navbar-default .navbar-nav > li > a:not(.btn) {\n  color: #9A9A9A;\n}\n.navbar-default .navbar-nav > .active > a,\n.navbar-default .navbar-nav > .active > a:not(.btn):hover,\n.navbar-default .navbar-nav > .active > a:not(.btn):focus,\n.navbar-default .navbar-nav > li > a:not(.btn):hover,\n.navbar-default .navbar-nav > li > a:not(.btn):focus {\n  background-color: transparent;\n  border-radius: 3px;\n  color: #68B3C8;\n  opacity: 1;\n}\n.navbar-default .navbar-nav > .dropdown > a:hover .caret,\n.navbar-default .navbar-nav > .dropdown > a:focus .caret {\n  border-bottom-color: #68B3C8;\n  border-top-color: #68B3C8;\n}\n.navbar-default .navbar-nav > .open > a,\n.navbar-default .navbar-nav > .open > a:hover,\n.navbar-default .navbar-nav > .open > a:focus {\n  background-color: transparent;\n  color: #68B3C8;\n}\n.navbar-default .navbar-nav .navbar-toggle:hover, .navbar-default .navbar-nav .navbar-toggle:focus {\n  background-color: transparent;\n}\n.navbar-default:not(.navbar-transparent) .btn-default:hover {\n  color: #68B3C8;\n  border-color: #68B3C8;\n}\n.navbar-default:not(.navbar-transparent) .btn-neutral, .navbar-default:not(.navbar-transparent) .btn-neutral:hover, .navbar-default:not(.navbar-transparent) .btn-neutral:active {\n  color: #9A9A9A;\n}\n\n/*      Navbar with icons            */\n.navbar-icons.navbar .navbar-brand {\n  margin-top: 12px;\n  margin-bottom: 12px;\n}\n.navbar-icons .navbar-nav > li > a {\n  text-align: center;\n  padding: 6px 15px;\n  margin: 6px 3px;\n}\n.navbar-icons .navbar-nav [class^=\"pe\"] {\n  font-size: 30px;\n  position: relative;\n}\n.navbar-icons .navbar-nav p {\n  margin: 3px 0 0;\n}\n\n.navbar-form {\n  margin: 15px 3px;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\n.navbar-form .btn {\n  margin: 0px 0px 0px 5px;\n}\n.navbar-form .form-control {\n  border-radius: 0;\n  border: 0;\n  padding: 0;\n  background-color: transparent;\n  height: 22px;\n  font-size: 16px;\n  line-height: 1.5em;\n  color: #E3E3E3;\n}\n.navbar-transparent .navbar-form .form-control, [class*=\"navbar-ct\"] .navbar-form .form-control {\n  color: #FFFFFF;\n  border: 0;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.6);\n}\n\n.navbar-ct-primary {\n  background-color: #8ECFD5;\n}\n\n.navbar-ct-info {\n  background-color: #7CE4FE;\n}\n\n.navbar-ct-success {\n  background-color: #8EF3C5;\n}\n\n.navbar-ct-warning {\n  background-color: #FFE28C;\n}\n\n.navbar-ct-danger {\n  background-color: #FF8F5E;\n}\n\n.navbar-transparent {\n  padding-top: 15px;\n  background-color: transparent;\n  border-bottom: 1px solid transparent;\n}\n\n.navbar-toggle {\n  margin-top: 19px;\n  margin-bottom: 19px;\n  border: 0;\n}\n.navbar-toggle .icon-bar {\n  background-color: #FFFFFF;\n}\n.navbar-toggle .navbar-collapse,\n.navbar-toggle .navbar-form {\n  border-color: transparent;\n}\n.navbar-toggle.navbar-default .navbar-toggle:hover, .navbar-toggle.navbar-default .navbar-toggle:focus {\n  background-color: transparent;\n}\n\n.navbar .navbar-nav > li > a.profile-photo {\n  padding: 0px 0px 0px 5px;\n}\n\n.profile-photo-small {\n  height: 40px;\n  width: 40px;\n}\n\n.img-rounded {\n  border-radius: 8px;\n  box-shadow: 0 2px 2px rgba(204, 197, 185, 0.5);\n  transition: opacity 0.5s ease 0s;\n}\n\n.img-details {\n  min-height: 50px;\n  padding: 0 4px 0.5em;\n}\n\n.img-details .author {\n  margin-left: 10px;\n  margin-top: -21px;\n  width: 40px;\n}\n\n.img-circle {\n  background-color: #FFFFFF;\n  margin-bottom: 10px;\n  padding: 4px;\n}\n\n.img-thumbnail {\n  border: 0 none;\n  border-radius: 8px;\n  box-shadow: 0 1px 2px rgba(164, 158, 147, 0.6);\n  margin-bottom: 10px;\n}\n\n.img-no-padding {\n  padding: 0px;\n}\n\n.btn-facebook {\n  border-color: #3b5998;\n  color: #3b5998;\n}\n.btn-facebook:hover, .btn-facebook:focus, .btn-facebook:active, .btn-facebook.active, .open > .btn-facebook.dropdown-toggle {\n  background-color: #3b5998;\n  border-color: #3b5998;\n  color: rgba(255, 255, 255, 0.7);\n}\n.btn-facebook:disabled, .btn-facebook[disabled], .btn-facebook.disabled {\n  background-color: transparent;\n  border-color: #3b5998;\n}\n.btn-facebook.btn-fill {\n  color: #FFFFFF;\n  background-color: #3b5998;\n  opacity: 0.8;\n}\n.btn-facebook.btn-fill:hover, .btn-facebook.btn-fill:focus, .btn-facebook.btn-fill:active, .btn-facebook.btn-fill.active, .open > .btn-facebook.btn-fill.dropdown-toggle {\n  background-color: #3b5998;\n  border-color: #3b5998;\n  color: #FFFFFF;\n  opacity: 1;\n}\n.btn-facebook.btn-simple {\n  color: #3b5998;\n  opacity: 0.8;\n}\n.btn-facebook.btn-simple:hover, .btn-facebook.btn-simple:focus, .btn-facebook.btn-simple:active, .btn-facebook.btn-simple.active, .open > .btn-facebook.btn-simple.dropdown-toggle {\n  background-color: transparent;\n  color: #3b5998;\n  opacity: 1;\n}\n.btn-facebook.btn-simple:hover i, .btn-facebook.btn-simple:focus i, .btn-facebook.btn-simple:active i, .btn-facebook.btn-simple.active i, .open > .btn-facebook.btn-simple.dropdown-toggle i {\n  color: #3b5998;\n  opacity: 1;\n}\n\n.btn-twitter {\n  border-color: #55acee;\n  color: #55acee;\n}\n.btn-twitter:hover, .btn-twitter:focus, .btn-twitter:active, .btn-twitter.active, .open > .btn-twitter.dropdown-toggle {\n  background-color: #55acee;\n  border-color: #55acee;\n  color: rgba(255, 255, 255, 0.7);\n}\n.btn-twitter:disabled, .btn-twitter[disabled], .btn-twitter.disabled {\n  background-color: transparent;\n  border-color: #55acee;\n}\n.btn-twitter.btn-fill {\n  color: #FFFFFF;\n  background-color: #55acee;\n  opacity: 0.8;\n}\n.btn-twitter.btn-fill:hover, .btn-twitter.btn-fill:focus, .btn-twitter.btn-fill:active, .btn-twitter.btn-fill.active, .open > .btn-twitter.btn-fill.dropdown-toggle {\n  background-color: #55acee;\n  border-color: #55acee;\n  color: #FFFFFF;\n  opacity: 1;\n}\n.btn-twitter.btn-simple {\n  color: #55acee;\n  opacity: 0.8;\n}\n.btn-twitter.btn-simple:hover, .btn-twitter.btn-simple:focus, .btn-twitter.btn-simple:active, .btn-twitter.btn-simple.active, .open > .btn-twitter.btn-simple.dropdown-toggle {\n  background-color: transparent;\n  color: #55acee;\n  opacity: 1;\n}\n.btn-twitter.btn-simple:hover i, .btn-twitter.btn-simple:focus i, .btn-twitter.btn-simple:active i, .btn-twitter.btn-simple.active i, .open > .btn-twitter.btn-simple.dropdown-toggle i {\n  color: #55acee;\n  opacity: 1;\n}\n\n.btn-pinterest {\n  border-color: #cc2127;\n  color: #cc2127;\n}\n.btn-pinterest:hover, .btn-pinterest:focus, .btn-pinterest:active, .btn-pinterest.active, .open > .btn-pinterest.dropdown-toggle {\n  background-color: #cc2127;\n  border-color: #cc2127;\n  color: rgba(255, 255, 255, 0.7);\n}\n.btn-pinterest:disabled, .btn-pinterest[disabled], .btn-pinterest.disabled {\n  background-color: transparent;\n  border-color: #cc2127;\n}\n.btn-pinterest.btn-fill {\n  color: #FFFFFF;\n  background-color: #cc2127;\n  opacity: 0.8;\n}\n.btn-pinterest.btn-fill:hover, .btn-pinterest.btn-fill:focus, .btn-pinterest.btn-fill:active, .btn-pinterest.btn-fill.active, .open > .btn-pinterest.btn-fill.dropdown-toggle {\n  background-color: #cc2127;\n  border-color: #cc2127;\n  color: #FFFFFF;\n  opacity: 1;\n}\n.btn-pinterest.btn-simple {\n  color: #cc2127;\n  opacity: 0.8;\n}\n.btn-pinterest.btn-simple:hover, .btn-pinterest.btn-simple:focus, .btn-pinterest.btn-simple:active, .btn-pinterest.btn-simple.active, .open > .btn-pinterest.btn-simple.dropdown-toggle {\n  background-color: transparent;\n  color: #cc2127;\n  opacity: 1;\n}\n.btn-pinterest.btn-simple:hover i, .btn-pinterest.btn-simple:focus i, .btn-pinterest.btn-simple:active i, .btn-pinterest.btn-simple.active i, .open > .btn-pinterest.btn-simple.dropdown-toggle i {\n  color: #cc2127;\n  opacity: 1;\n}\n\n.btn-google {\n  border-color: #dd4b39;\n  color: #dd4b39;\n}\n.btn-google:hover, .btn-google:focus, .btn-google:active, .btn-google.active, .open > .btn-google.dropdown-toggle {\n  background-color: #dd4b39;\n  border-color: #dd4b39;\n  color: rgba(255, 255, 255, 0.7);\n}\n.btn-google:disabled, .btn-google[disabled], .btn-google.disabled {\n  background-color: transparent;\n  border-color: #dd4b39;\n}\n.btn-google.btn-fill {\n  color: #FFFFFF;\n  background-color: #dd4b39;\n  opacity: 0.8;\n}\n.btn-google.btn-fill:hover, .btn-google.btn-fill:focus, .btn-google.btn-fill:active, .btn-google.btn-fill.active, .open > .btn-google.btn-fill.dropdown-toggle {\n  background-color: #dd4b39;\n  border-color: #dd4b39;\n  color: #FFFFFF;\n  opacity: 1;\n}\n.btn-google.btn-simple {\n  color: #dd4b39;\n  opacity: 0.8;\n}\n.btn-google.btn-simple:hover, .btn-google.btn-simple:focus, .btn-google.btn-simple:active, .btn-google.btn-simple.active, .open > .btn-google.btn-simple.dropdown-toggle {\n  background-color: transparent;\n  color: #dd4b39;\n  opacity: 1;\n}\n.btn-google.btn-simple:hover i, .btn-google.btn-simple:focus i, .btn-google.btn-simple:active i, .btn-google.btn-simple.active i, .open > .btn-google.btn-simple.dropdown-toggle i {\n  color: #dd4b39;\n  opacity: 1;\n}\n\n.btn-linkedin {\n  border-color: #0976b4;\n  color: #0976b4;\n}\n.btn-linkedin:hover, .btn-linkedin:focus, .btn-linkedin:active, .btn-linkedin.active, .open > .btn-linkedin.dropdown-toggle {\n  background-color: #0976b4;\n  border-color: #0976b4;\n  color: rgba(255, 255, 255, 0.7);\n}\n.btn-linkedin:disabled, .btn-linkedin[disabled], .btn-linkedin.disabled {\n  background-color: transparent;\n  border-color: #0976b4;\n}\n.btn-linkedin.btn-fill {\n  color: #FFFFFF;\n  background-color: #0976b4;\n  opacity: 0.8;\n}\n.btn-linkedin.btn-fill:hover, .btn-linkedin.btn-fill:focus, .btn-linkedin.btn-fill:active, .btn-linkedin.btn-fill.active, .open > .btn-linkedin.btn-fill.dropdown-toggle {\n  background-color: #0976b4;\n  border-color: #0976b4;\n  color: #FFFFFF;\n  opacity: 1;\n}\n.btn-linkedin.btn-simple {\n  color: #0976b4;\n  opacity: 0.8;\n}\n.btn-linkedin.btn-simple:hover, .btn-linkedin.btn-simple:focus, .btn-linkedin.btn-simple:active, .btn-linkedin.btn-simple.active, .open > .btn-linkedin.btn-simple.dropdown-toggle {\n  background-color: transparent;\n  color: #0976b4;\n  opacity: 1;\n}\n.btn-linkedin.btn-simple:hover i, .btn-linkedin.btn-simple:focus i, .btn-linkedin.btn-simple:active i, .btn-linkedin.btn-simple.active i, .open > .btn-linkedin.btn-simple.dropdown-toggle i {\n  color: #0976b4;\n  opacity: 1;\n}\n\n.btn-dribbble {\n  border-color: #ea4c89;\n  color: #ea4c89;\n}\n.btn-dribbble:hover, .btn-dribbble:focus, .btn-dribbble:active, .btn-dribbble.active, .open > .btn-dribbble.dropdown-toggle {\n  background-color: #ea4c89;\n  border-color: #ea4c89;\n  color: rgba(255, 255, 255, 0.7);\n}\n.btn-dribbble:disabled, .btn-dribbble[disabled], .btn-dribbble.disabled {\n  background-color: transparent;\n  border-color: #ea4c89;\n}\n.btn-dribbble.btn-fill {\n  color: #FFFFFF;\n  background-color: #ea4c89;\n  opacity: 0.8;\n}\n.btn-dribbble.btn-fill:hover, .btn-dribbble.btn-fill:focus, .btn-dribbble.btn-fill:active, .btn-dribbble.btn-fill.active, .open > .btn-dribbble.btn-fill.dropdown-toggle {\n  background-color: #ea4c89;\n  border-color: #ea4c89;\n  color: #FFFFFF;\n  opacity: 1;\n}\n.btn-dribbble.btn-simple {\n  color: #ea4c89;\n  opacity: 0.8;\n}\n.btn-dribbble.btn-simple:hover, .btn-dribbble.btn-simple:focus, .btn-dribbble.btn-simple:active, .btn-dribbble.btn-simple.active, .open > .btn-dribbble.btn-simple.dropdown-toggle {\n  background-color: transparent;\n  color: #ea4c89;\n  opacity: 1;\n}\n.btn-dribbble.btn-simple:hover i, .btn-dribbble.btn-simple:focus i, .btn-dribbble.btn-simple:active i, .btn-dribbble.btn-simple.active i, .open > .btn-dribbble.btn-simple.dropdown-toggle i {\n  color: #ea4c89;\n  opacity: 1;\n}\n\n.btn-github {\n  border-color: #333333;\n  color: #333333;\n}\n.btn-github:hover, .btn-github:focus, .btn-github:active, .btn-github.active, .open > .btn-github.dropdown-toggle {\n  background-color: #333333;\n  border-color: #333333;\n  color: rgba(255, 255, 255, 0.7);\n}\n.btn-github:disabled, .btn-github[disabled], .btn-github.disabled {\n  background-color: transparent;\n  border-color: #333333;\n}\n.btn-github.btn-fill {\n  color: #FFFFFF;\n  background-color: #333333;\n  opacity: 0.8;\n}\n.btn-github.btn-fill:hover, .btn-github.btn-fill:focus, .btn-github.btn-fill:active, .btn-github.btn-fill.active, .open > .btn-github.btn-fill.dropdown-toggle {\n  background-color: #333333;\n  border-color: #333333;\n  color: #FFFFFF;\n  opacity: 1;\n}\n.btn-github.btn-simple {\n  color: #333333;\n  opacity: 0.8;\n}\n.btn-github.btn-simple:hover, .btn-github.btn-simple:focus, .btn-github.btn-simple:active, .btn-github.btn-simple.active, .open > .btn-github.btn-simple.dropdown-toggle {\n  background-color: transparent;\n  color: #333333;\n  opacity: 1;\n}\n.btn-github.btn-simple:hover i, .btn-github.btn-simple:focus i, .btn-github.btn-simple:active i, .btn-github.btn-simple.active i, .open > .btn-github.btn-simple.dropdown-toggle i {\n  color: #333333;\n  opacity: 1;\n}\n\n.btn-youtube {\n  border-color: #e52d27;\n  color: #e52d27;\n}\n.btn-youtube:hover, .btn-youtube:focus, .btn-youtube:active, .btn-youtube.active, .open > .btn-youtube.dropdown-toggle {\n  background-color: #e52d27;\n  border-color: #e52d27;\n  color: rgba(255, 255, 255, 0.7);\n}\n.btn-youtube:disabled, .btn-youtube[disabled], .btn-youtube.disabled {\n  background-color: transparent;\n  border-color: #e52d27;\n}\n.btn-youtube.btn-fill {\n  color: #FFFFFF;\n  background-color: #e52d27;\n  opacity: 0.8;\n}\n.btn-youtube.btn-fill:hover, .btn-youtube.btn-fill:focus, .btn-youtube.btn-fill:active, .btn-youtube.btn-fill.active, .open > .btn-youtube.btn-fill.dropdown-toggle {\n  background-color: #e52d27;\n  border-color: #e52d27;\n  color: #FFFFFF;\n  opacity: 1;\n}\n.btn-youtube.btn-simple {\n  color: #e52d27;\n  opacity: 0.8;\n}\n.btn-youtube.btn-simple:hover, .btn-youtube.btn-simple:focus, .btn-youtube.btn-simple:active, .btn-youtube.btn-simple.active, .open > .btn-youtube.btn-simple.dropdown-toggle {\n  background-color: transparent;\n  color: #e52d27;\n  opacity: 1;\n}\n.btn-youtube.btn-simple:hover i, .btn-youtube.btn-simple:focus i, .btn-youtube.btn-simple:active i, .btn-youtube.btn-simple.active i, .open > .btn-youtube.btn-simple.dropdown-toggle i {\n  color: #e52d27;\n  opacity: 1;\n}\n\n.btn-instagram {\n  border-color: #125688;\n  color: #125688;\n}\n.btn-instagram:hover, .btn-instagram:focus, .btn-instagram:active, .btn-instagram.active, .open > .btn-instagram.dropdown-toggle {\n  background-color: #125688;\n  border-color: #125688;\n  color: rgba(255, 255, 255, 0.7);\n}\n.btn-instagram:disabled, .btn-instagram[disabled], .btn-instagram.disabled {\n  background-color: transparent;\n  border-color: #125688;\n}\n.btn-instagram.btn-fill {\n  color: #FFFFFF;\n  background-color: #125688;\n  opacity: 0.8;\n}\n.btn-instagram.btn-fill:hover, .btn-instagram.btn-fill:focus, .btn-instagram.btn-fill:active, .btn-instagram.btn-fill.active, .open > .btn-instagram.btn-fill.dropdown-toggle {\n  background-color: #125688;\n  border-color: #125688;\n  color: #FFFFFF;\n  opacity: 1;\n}\n.btn-instagram.btn-simple {\n  color: #125688;\n  opacity: 0.8;\n}\n.btn-instagram.btn-simple:hover, .btn-instagram.btn-simple:focus, .btn-instagram.btn-simple:active, .btn-instagram.btn-simple.active, .open > .btn-instagram.btn-simple.dropdown-toggle {\n  background-color: transparent;\n  color: #125688;\n  opacity: 1;\n}\n.btn-instagram.btn-simple:hover i, .btn-instagram.btn-simple:focus i, .btn-instagram.btn-simple:active i, .btn-instagram.btn-simple.active i, .open > .btn-instagram.btn-simple.dropdown-toggle i {\n  color: #125688;\n  opacity: 1;\n}\n\n.btn-reddit {\n  border-color: #ff4500;\n  color: #ff4500;\n}\n.btn-reddit:hover, .btn-reddit:focus, .btn-reddit:active, .btn-reddit.active, .open > .btn-reddit.dropdown-toggle {\n  background-color: #ff4500;\n  border-color: #ff4500;\n  color: rgba(255, 255, 255, 0.7);\n}\n.btn-reddit:disabled, .btn-reddit[disabled], .btn-reddit.disabled {\n  background-color: transparent;\n  border-color: #ff4500;\n}\n.btn-reddit.btn-fill {\n  color: #FFFFFF;\n  background-color: #ff4500;\n  opacity: 0.8;\n}\n.btn-reddit.btn-fill:hover, .btn-reddit.btn-fill:focus, .btn-reddit.btn-fill:active, .btn-reddit.btn-fill.active, .open > .btn-reddit.btn-fill.dropdown-toggle {\n  background-color: #ff4500;\n  border-color: #ff4500;\n  color: #FFFFFF;\n  opacity: 1;\n}\n.btn-reddit.btn-simple {\n  color: #ff4500;\n  opacity: 0.8;\n}\n.btn-reddit.btn-simple:hover, .btn-reddit.btn-simple:focus, .btn-reddit.btn-simple:active, .btn-reddit.btn-simple.active, .open > .btn-reddit.btn-simple.dropdown-toggle {\n  background-color: transparent;\n  color: #ff4500;\n  opacity: 1;\n}\n.btn-reddit.btn-simple:hover i, .btn-reddit.btn-simple:focus i, .btn-reddit.btn-simple:active i, .btn-reddit.btn-simple.active i, .open > .btn-reddit.btn-simple.dropdown-toggle i {\n  color: #ff4500;\n  opacity: 1;\n}\n\n.btn-tumblr {\n  border-color: #35465c;\n  color: #35465c;\n}\n.btn-tumblr:hover, .btn-tumblr:focus, .btn-tumblr:active, .btn-tumblr.active, .open > .btn-tumblr.dropdown-toggle {\n  background-color: #35465c;\n  border-color: #35465c;\n  color: rgba(255, 255, 255, 0.7);\n}\n.btn-tumblr:disabled, .btn-tumblr[disabled], .btn-tumblr.disabled {\n  background-color: transparent;\n  border-color: #35465c;\n}\n.btn-tumblr.btn-fill {\n  color: #FFFFFF;\n  background-color: #35465c;\n  opacity: 0.8;\n}\n.btn-tumblr.btn-fill:hover, .btn-tumblr.btn-fill:focus, .btn-tumblr.btn-fill:active, .btn-tumblr.btn-fill.active, .open > .btn-tumblr.btn-fill.dropdown-toggle {\n  background-color: #35465c;\n  border-color: #35465c;\n  color: #FFFFFF;\n  opacity: 1;\n}\n.btn-tumblr.btn-simple {\n  color: #35465c;\n  opacity: 0.8;\n}\n.btn-tumblr.btn-simple:hover, .btn-tumblr.btn-simple:focus, .btn-tumblr.btn-simple:active, .btn-tumblr.btn-simple.active, .open > .btn-tumblr.btn-simple.dropdown-toggle {\n  background-color: transparent;\n  color: #35465c;\n  opacity: 1;\n}\n.btn-tumblr.btn-simple:hover i, .btn-tumblr.btn-simple:focus i, .btn-tumblr.btn-simple:active i, .btn-tumblr.btn-simple.active i, .open > .btn-tumblr.btn-simple.dropdown-toggle i {\n  color: #35465c;\n  opacity: 1;\n}\n\n.label-facebook {\n  background-color: #3b5998;\n}\n\n.label-twitter {\n  background-color: #55acee;\n}\n\n.label-pinterest {\n  background-color: #cc2127;\n}\n\n.label-google {\n  background-color: #dd4b39;\n}\n\n.label-linkedin {\n  background-color: #0976b4;\n}\n\n.label-dribbble {\n  background-color: #ea4c89;\n}\n\n.label-github {\n  background-color: #333333;\n}\n\n.label-youtube {\n  background-color: #e52d27;\n}\n\n.label-instagram {\n  background-color: #125688;\n}\n\n.label-reddit {\n  background-color: #ff4500;\n}\n\n.label-tumblr {\n  background-color: #35465c;\n}\n\n.icon-facebook {\n  color: #3b5998;\n}\n\n.icon-twitter {\n  color: #55acee;\n}\n\n.icon-pinterest {\n  color: #cc2127;\n}\n\n.icon-google {\n  color: #dd4b39;\n}\n\n.icon-linkedin {\n  color: #0976b4;\n}\n\n.icon-dribbble {\n  color: #ea4c89;\n}\n\n.icon-github {\n  color: #333333;\n}\n\n.icon-youtube {\n  color: #e52d27;\n}\n\n.icon-instagram {\n  color: #125688;\n}\n\n.icon-reddit {\n  color: #ff4500;\n}\n\n.icon-tumblr {\n  color: #35465c;\n}\n\n.icon-property, .btn-rotate i, .btn-magnify i, .btn-move-left i, .btn-move-right i {\n  -webkit-transition: all 300ms cubic-bezier(0.34, 1.61, 0.7, 1);\n  -moz-transition: all 300ms cubic-bezier(0.34, 1.61, 0.7, 1);\n  -o-transition: all 300ms cubic-bezier(0.34, 1.61, 0.7, 1);\n  -ms-transition: all 300ms cubic-bezier(0.34, 1.61, 0.7, 1);\n  transition: all 300ms cubic-bezier(0.34, 1.61, 0.7, 1);\n  position: relative;\n  display: inline-block;\n}\n\n.btn-rotate:hover i, .btn-rotate:focus i {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);\n  -webkit-transform: rotate(53deg);\n  -ms-transform: rotate(53deg);\n  transform: rotate(53deg);\n}\n\n.btn-magnify:hover i, .btn-magnify:focus i {\n  -webkit-transform: scale(1.22);\n  -moz-transform: scale(1.22);\n  -o-transform: scale(1.22);\n  -ms-transform: scale(1.22);\n  transform: scale(1.22);\n}\n\n.btn-move-left i {\n  margin-right: 0;\n}\n.btn-move-left:hover i, .btn-move-left:focus i {\n  -webkit-transform: translateX(-5px);\n  -moz-transform: translateX(-5px);\n  -o-transform: translateX(-5px);\n  -ms-transform: translateX(-5px);\n  transform: translateX(-5px);\n}\n\n.btn-move-right i {\n  margin-right: 0;\n}\n.btn-move-right:hover i, .btn-move-right:focus i {\n  -webkit-transform: translateX(5px);\n  -moz-transform: translateX(5px);\n  -o-transform: translateX(5px);\n  -ms-transform: translateX(5px);\n  transform: translateX(5px);\n}\n\n/* ============================================================\n * bootstrapSwitch v1.3 by Larentis Mattia @spiritualGuru\n * http://www.larentis.eu/switch/\n * ============================================================\n * Licensed under the Apache License, Version 2.0\n * http://www.apache.org/licenses/LICENSE-2.0\n * ============================================================ */\n.has-switch {\n  border-radius: 30px;\n  cursor: pointer;\n  display: inline-block;\n  line-height: 1.72222;\n  overflow: hidden;\n  position: relative;\n  text-align: left;\n  width: 61px;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  -o-user-select: none;\n  user-select: none;\n  /*   this code is for fixing safari bug with hidden overflow for border-radius   */\n  -webkit-mask: url(\"../img/mask.png\") 0 0 no-repeat;\n  -webkit-mask-size: 61px 28px;\n  mask: url(\"../img/mask.png\") 0 0 no-repeat;\n  mask-size: 61px 28px;\n}\n\n.has-switch.deactivate {\n  opacity: 0.5;\n  filter: alpha(opacity=50);\n  cursor: default !important;\n}\n\n.has-switch.deactivate label,\n.has-switch.deactivate span {\n  cursor: default !important;\n}\n\n.has-switch > div {\n  position: relative;\n  top: 0;\n  width: 100px;\n}\n\n.has-switch > div.switch-animate {\n  -webkit-transition: left 0.25s ease-out;\n  transition: left 0.25s ease-out;\n}\n\n.has-switch > div.switch-off {\n  left: -35px;\n}\n\n.has-switch > div.switch-on {\n  left: 0;\n}\n\n.has-switch > div label {\n  background-color: #FFFFFF;\n  box-shadow: 0 1px 1px #FFFFFF inset, 0 1px 1px rgba(0, 0, 0, 0.25);\n  cursor: pointer;\n}\n\n.has-switch input[type=checkbox] {\n  display: none;\n}\n\n.has-switch span {\n  cursor: pointer;\n  float: left;\n  font-size: 11px;\n  font-weight: 500;\n  height: 26px;\n  line-height: 15px;\n  margin: 0;\n  padding-bottom: 6px;\n  padding-top: 5px;\n  position: relative;\n  text-align: center;\n  text-indent: -10px;\n  width: 50%;\n  z-index: 1;\n  -webkit-transition: 0.25s ease-out;\n  transition: 0.25s ease-out;\n}\n\n.has-switch span.switch-left {\n  background-color: #66615b;\n  border-left: 1px solid transparent;\n  border-radius: 30px 0 0 30px;\n  color: #FFFFFF;\n}\n\n.has-switch .switch-off span.switch-left {\n  background-color: #DDDDDD;\n}\n\n.has-switch span.switch-right {\n  background-color: #66615b;\n  border-radius: 0 30px 30px 0;\n  color: #ffffff;\n  text-indent: 1px;\n}\n\n.has-switch .switch-off span.switch-right {\n  background-color: #DDDDDD;\n}\n\n.has-switch label {\n  border-radius: 12px;\n  float: left;\n  height: 22px;\n  margin: 2px -13px;\n  padding: 0;\n  position: relative;\n  transition: all 0.25s ease-out 0s;\n  vertical-align: middle;\n  width: 22px;\n  z-index: 100;\n  -webkit-transition: 0.25s ease-out;\n  transition: 0.25s ease-out;\n}\n\n.has-switch .switch-on .fa-check:before {\n  margin-left: 10px;\n}\n\n.has-switch:hover .switch-on label {\n  margin: 2px -17px;\n  width: 26px;\n}\n\n.has-switch:hover .switch-off label {\n  margin: 2px -13px;\n  width: 26px;\n}\n\ninput.ct-primary + span.switch-left,\ninput.ct-primary + span + label + span.switch-right {\n  background-color: #7A9E9F;\n}\n\ninput.ct-info + span.switch-left,\ninput.ct-info + span + label + span.switch-right {\n  background-color: #68B3C8;\n}\n\ninput.ct-success + span.switch-left,\ninput.ct-success + span + label + span.switch-right {\n  background-color: #7AC29A;\n}\n\ninput.ct-warning + span.switch-left,\ninput.ct-warning + span + label + span.switch-right {\n  background-color: #F3BB45;\n}\n\ninput.ct-danger + span.switch-left,\ninput.ct-danger + span + label + span.switch-right {\n  background-color: #EB5E28;\n}\n\n.dropdown-menu {\n  background-color: #FFFCF5;\n  border: 0 none;\n  border-radius: 8px;\n  margin-top: 23px;\n  padding: 0px;\n  -webkit-box-shadow: 0 2px rgba(17, 16, 15, 0.1), 0 2px 10px rgba(17, 16, 15, 0.1);\n  box-shadow: 0 2px rgba(17, 16, 15, 0.1), 0 2px 10px rgba(17, 16, 15, 0.1);\n}\n.dropdown-menu .divider {\n  background-color: #F1EAE0;\n  margin: 0px;\n}\n.dropdown-menu .dropdown-header {\n  color: #9A9A9A;\n  font-size: 14px;\n  padding: 10px 15px;\n}\n.dropdown-menu > li > a {\n  color: #66615b;\n  font-size: 16px;\n  padding: 10px 15px;\n  -webkit-transition: none;\n  -moz-transition: none;\n  -o-transition: none;\n  -ms-transition: none;\n  transition: none;\n}\n.dropdown-menu > li > a img {\n  margin-top: -3px;\n}\n.dropdown-menu > li > a:focus {\n  outline: 0 !important;\n}\n.btn-group.select .dropdown-menu {\n  min-width: 100%;\n}\n.dropdown-menu > li:first-child > a {\n  border-top-left-radius: 8px;\n  border-top-right-radius: 8px;\n}\n.dropdown-menu > li:last-child > a {\n  border-bottom-left-radius: 8px;\n  border-bottom-right-radius: 8px;\n}\n.dropdown-menu > li > a:hover,\n.dropdown-menu > li > a:focus {\n  background-color: #66615B;\n  color: rgba(255, 255, 255, 0.7);\n  opacity: 1;\n  text-decoration: none;\n}\n.dropdown-menu.dropdown-primary > li:not(.disabled) > a:hover,\n.dropdown-menu.dropdown-primary > li:not(.disabled) > a:focus {\n  background-color: #7A9E9F;\n}\n.dropdown-menu.dropdown-info > li:not(.disabled) > a:hover,\n.dropdown-menu.dropdown-info > li:not(.disabled) > a:focus {\n  background-color: #68B3C8;\n}\n.dropdown-menu.dropdown-success > li:not(.disabled) > a:hover,\n.dropdown-menu.dropdown-success > li:not(.disabled) > a:focus {\n  background-color: #7AC29A;\n}\n.dropdown-menu.dropdown-warning > li:not(.disabled) > a:hover,\n.dropdown-menu.dropdown-warning > li:not(.disabled) > a:focus {\n  background-color: #F3BB45;\n}\n.dropdown-menu.dropdown-danger > li:not(.disabled) > a:hover,\n.dropdown-menu.dropdown-danger > li:not(.disabled) > a:focus {\n  background-color: #EB5E28;\n}\n.dropdown-menu > li.dropdown-footer {\n  background-color: #E8E7E3;\n  border-radius: 0 0 8px 8px;\n}\n.dropdown-menu > li.dropdown-footer > ul {\n  list-style: outside none none;\n  padding: 0px 5px;\n}\n.dropdown-menu > li.dropdown-footer > ul > li {\n  display: inline-block;\n  text-align: left;\n  padding: 0 10px;\n}\n.dropdown-menu > li.dropdown-footer > ul > li > a {\n  color: #9C9B99;\n  font-size: 0.9em;\n  line-height: 35px;\n}\n.dropdown-menu > li.dropdown-footer > ul > li:hover a {\n  color: #5E5E5C;\n}\n\n.select .no-style:hover,\n.select .no-style:active,\n.select .no-style:focus {\n  background-color: #FFFFFF;\n  color: #66615b;\n}\n.select .no-style:hover .caret,\n.select .no-style:active .caret,\n.select .no-style:focus .caret {\n  border-top-color: #66615b;\n}\n\n.open .no-style {\n  background-color: #FFFFFF !important;\n  color: #66615b !important;\n}\n.open .no-style .caret {\n  border-top-color: #66615b !important;\n}\n\n.btn-group.select {\n  overflow: hidden;\n}\n\n.btn-group.select.open {\n  overflow: visible;\n}\n\n.notification-bubble {\n  left: 25px;\n  position: absolute;\n  top: 13px;\n}\n\n.dropdown-notification .dropdown-header {\n  border-bottom: 1px solid #F1EAE0;\n}\n.dropdown-notification .no-notification {\n  color: #9A9A9A;\n  font-size: 1.2em;\n  padding: 30px 30px;\n  text-align: center;\n}\n\n.dropdown-notification-list > li {\n  border-bottom: 1px solid #F1EAE0;\n  color: #66615b;\n  font-size: 16px;\n  padding: 10px 5px;\n}\n.dropdown-notification-list > li > a {\n  color: #66615b;\n  white-space: normal;\n}\n.dropdown-notification-list > li > a .notification-text {\n  padding-left: 40px;\n  position: relative;\n}\n.dropdown-notification-list > li > a .label {\n  display: block;\n  position: absolute;\n  top: 50%;\n  margin-top: -12px;\n  left: 7px;\n}\n.dropdown-notification-list > li > a .message {\n  font-size: 0.9em;\n  line-height: 0.7;\n}\n.dropdown-notification-list > li > a .time {\n  color: #9A9A9A;\n  font-size: 0.7em;\n}\n.dropdown-notification-list > li > a .read-notification {\n  font-size: 12px;\n  opacity: 0;\n  position: absolute;\n  right: 5px;\n  top: 50%;\n  margin-top: -12px;\n}\n.dropdown-notification-list > li:hover,\n.dropdown-notification-list > li:focus {\n  background-color: #F0EFEB;\n  color: #66615b;\n  opacity: 1;\n  text-decoration: none;\n}\n.dropdown-notification-list > li:hover .read-notification,\n.dropdown-notification-list > li:focus .read-notification {\n  opacity: 1;\n}\n\n.scroll-area {\n  max-height: 310px;\n  overflow-y: scroll;\n  list-style: outside none none;\n  padding: 0px;\n}\n\n.dropdown-sharing li {\n  color: #66615b;\n  font-size: 16px;\n}\n.dropdown-sharing li .social-line {\n  line-height: 28px;\n  padding: 10px 20px 5px 20px;\n}\n.dropdown-sharing li .social-line [class*=\"icon-\"] {\n  font-size: 20px;\n}\n.dropdown-sharing li:hover .social-line,\n.dropdown-sharing li:hover a,\n.dropdown-sharing li:hover .action-line,\n.dropdown-sharing li:focus .social-line,\n.dropdown-sharing li:focus a,\n.dropdown-sharing li:focus .action-line {\n  background-color: #FFFCF5;\n  color: #66615b;\n  opacity: 1;\n  text-decoration: none;\n}\n\n.dropdown-actions li .action-line {\n  line-height: 24px;\n  padding: 10px 20px;\n  font-weight: bold;\n}\n.dropdown-actions li .action-line [class*=\"icon-\"] {\n  font-size: 24px;\n}\n.dropdown-actions li .action-line .col-xs-9 {\n  line-height: 34px;\n}\n.dropdown-actions li .link-danger {\n  color: #EB5E28;\n}\n.dropdown-actions li .link-danger:hover, .dropdown-actions li .link-danger:active, .dropdown-actions li .link-danger:focus {\n  color: #EB5E28;\n}\n.dropdown-actions li:hover a,\n.dropdown-actions li:focus a {\n  background-color: #F0EFEB;\n  color: #66615b;\n  opacity: 1;\n  text-decoration: none;\n}\n\n.tagsinput {\n  height: 40px;\n  overflow-y: auto;\n  text-align: left;\n  /*\n      &.tag-primary .tag,\n      &.tag-primary .tagsinput-remove-link{\n           background-color: $primary-color;\n      }\n  */\n}\n.tagsinput .tag {\n  background-color: #66615b;\n  cursor: pointer;\n  margin: 5px 3px 5px 0;\n  position: relative;\n  padding: 0.4em 0.9em;\n  border-radius: 10px;\n  color: #FFFFFF;\n  font-weight: 500;\n  font-size: 0.75em;\n  line-height: 1;\n  text-transform: uppercase;\n  display: inline-block;\n  padding-left: 0.8em;\n}\n.tagsinput .tag:hover {\n  padding-right: 14px;\n}\n.tagsinput .tagsinput-remove-link {\n  color: #FFFFFF;\n  cursor: pointer;\n  font-size: 0.75em;\n  margin-top: 3px;\n  padding: 0.4em 0.6em;\n  position: absolute;\n  right: 0;\n  opacity: 0;\n  text-align: right;\n  text-decoration: none;\n  top: 0;\n  width: 100%;\n  z-index: 2;\n}\n.tagsinput .tag:hover .tagsinput-remove-link {\n  opacity: 1;\n  padding-right: 6px;\n}\n.tagsinput .tagsinput-remove-link:before {\n  content: \"\\e646\";\n  font-family: \"themify\";\n  font-weight: bolder;\n}\n.tagsinput .tagsinput-add-container {\n  display: inline-block;\n  line-height: 1;\n  margin-top: -6px;\n  vertical-align: middle;\n}\n.tagsinput .tagsinput-add {\n  color: #66615b;\n  cursor: pointer;\n  display: inline-block;\n  font-size: 0.9em;\n  padding: 5px 6px;\n  margin: 7px 0 0;\n  vertical-align: top;\n  opacity: 0.8;\n}\n.tagsinput .tagsinput-add:hover, .tagsinput .tagsinput-add:focus {\n  opacity: 1;\n}\n.tagsinput .tagsinput-add:before {\n  content: \"\\e61a\";\n  font-family: \"themify\";\n  font-weight: bolder;\n}\n.tagsinput input {\n  background: transparent;\n  border: none;\n  color: #66615b !important;\n  font-size: 0.9em;\n  margin: 2px 0 0 0;\n  outline: medium none !important;\n  padding-top: 7px;\n  vertical-align: middle;\n  width: 40px;\n  height: 30px;\n}\n.tagsinput.tag-primary .tag {\n  background-color: #7A9E9F;\n}\n.tagsinput.tag-primary .tagsinput-add {\n  color: #7A9E9F;\n}\n.tagsinput.tag-info .tag {\n  background-color: #68B3C8;\n}\n.tagsinput.tag-success .tag {\n  background-color: #7AC29A;\n}\n.tagsinput.tag-warning .tag {\n  background-color: #F3BB45;\n}\n.tagsinput.tag-danger .tag {\n  background-color: #EB5E28;\n}\n\n@-webkit-keyframes uil-reload-css {\n  0% {\n    -ms-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  50% {\n    -ms-transform: rotate(180deg);\n    -moz-transform: rotate(180deg);\n    -webkit-transform: rotate(180deg);\n    -o-transform: rotate(180deg);\n    transform: rotate(180deg);\n  }\n  100% {\n    -ms-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -webkit-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n@-webkit-keyframes uil-reload-css {\n  0% {\n    -ms-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  50% {\n    -ms-transform: rotate(180deg);\n    -moz-transform: rotate(180deg);\n    -webkit-transform: rotate(180deg);\n    -o-transform: rotate(180deg);\n    transform: rotate(180deg);\n  }\n  100% {\n    -ms-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -webkit-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n@-moz-keyframes uil-reload-css {\n  0% {\n    -ms-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  50% {\n    -ms-transform: rotate(180deg);\n    -moz-transform: rotate(180deg);\n    -webkit-transform: rotate(180deg);\n    -o-transform: rotate(180deg);\n    transform: rotate(180deg);\n  }\n  100% {\n    -ms-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -webkit-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n@-ms-keyframes uil-reload-css {\n  0% {\n    -ms-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  50% {\n    -ms-transform: rotate(180deg);\n    -moz-transform: rotate(180deg);\n    -webkit-transform: rotate(180deg);\n    -o-transform: rotate(180deg);\n    transform: rotate(180deg);\n  }\n  100% {\n    -ms-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -webkit-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n@-moz-keyframes uil-reload-css {\n  0% {\n    -ms-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  50% {\n    -ms-transform: rotate(180deg);\n    -moz-transform: rotate(180deg);\n    -webkit-transform: rotate(180deg);\n    -o-transform: rotate(180deg);\n    transform: rotate(180deg);\n  }\n  100% {\n    -ms-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -webkit-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n@-webkit-keyframes uil-reload-css {\n  0% {\n    -ms-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  50% {\n    -ms-transform: rotate(180deg);\n    -moz-transform: rotate(180deg);\n    -webkit-transform: rotate(180deg);\n    -o-transform: rotate(180deg);\n    transform: rotate(180deg);\n  }\n  100% {\n    -ms-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -webkit-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n@-o-keyframes uil-reload-css {\n  0% {\n    -ms-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  50% {\n    -ms-transform: rotate(180deg);\n    -moz-transform: rotate(180deg);\n    -webkit-transform: rotate(180deg);\n    -o-transform: rotate(180deg);\n    transform: rotate(180deg);\n  }\n  100% {\n    -ms-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -webkit-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n@keyframes uil-reload-css {\n  0% {\n    -ms-transform: rotate(0deg);\n    -moz-transform: rotate(0deg);\n    -webkit-transform: rotate(0deg);\n    -o-transform: rotate(0deg);\n    transform: rotate(0deg);\n  }\n  50% {\n    -ms-transform: rotate(180deg);\n    -moz-transform: rotate(180deg);\n    -webkit-transform: rotate(180deg);\n    -o-transform: rotate(180deg);\n    transform: rotate(180deg);\n  }\n  100% {\n    -ms-transform: rotate(360deg);\n    -moz-transform: rotate(360deg);\n    -webkit-transform: rotate(360deg);\n    -o-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n.uil-reload-css {\n  display: inline-block;\n  position: relative;\n  width: 80px;\n  height: 80px;\n  vertical-align: middle;\n}\n.uil-reload-css > div {\n  -ms-animation: uil-reload-css 1.4s linear infinite;\n  -moz-animation: uil-reload-css 1.4s linear infinite;\n  -webkit-animation: uil-reload-css 1.4s linear infinite;\n  -o-animation: uil-reload-css 1.4s linear infinite;\n  animation: uil-reload-css 1.4s linear infinite;\n  display: block;\n  position: absolute;\n  top: 18px;\n  left: 18px;\n  width: 45px;\n  height: 45px;\n  border-radius: 100px;\n  border: 7px solid #D8D1C9;\n  border-top: 7px solid transparent;\n  border-right: 7px solid #D8D1C9;\n  border-bottom: 7px solid #D8D1C9;\n}\n.uil-reload-css > div:after {\n  content: \" \";\n  width: 0px;\n  height: 0px;\n  border-style: solid;\n  border-width: 0 8px 8px 8px;\n  border-color: transparent transparent #D8D1C9 transparent;\n  display: block;\n  -ms-transform: translate(-3px, -5px) rotate(45deg);\n  -moz-transform: translate(-3px, -5px) rotate(45deg);\n  -webkit-transform: translate(-3px, -5px) rotate(45deg);\n  -o-transform: translate(-3px, -5px) rotate(45deg);\n  transform: translate(-3px, -5px) rotate(45deg);\n}\n\n.uil-reload-css.reload-small {\n  height: 20px;\n  width: 20px;\n}\n.uil-reload-css.reload-small > div {\n  top: 0;\n  left: 0;\n  border: 3px solid #D8D1C9;\n  border-top: 3px solid transparent;\n  border-right: 3px solid #D8D1C9;\n  border-bottom: 3px solid #D8D1C9;\n  height: 20px;\n  width: 20px;\n}\n.uil-reload-css.reload-small > div:after {\n  border-width: 0 5px 5px 5px;\n  -ms-transform: translate(-2px, -3px) rotate(45deg);\n  -moz-transform: translate(-2px, -3px) rotate(45deg);\n  -webkit-transform: translate(-2px, -3px) rotate(45deg);\n  -o-transform: translate(-2px, -3px) rotate(45deg);\n  transform: translate(-2px, -3px) rotate(45deg);\n}\n\n.uil-reload-css.reload-background {\n  background-color: #DDDDDD;\n  border-radius: 50%;\n}\n.uil-reload-css.reload-background > div {\n  border: 7px solid #FFFFFF;\n  border-top: 7px solid transparent;\n  border-right: 7px solid #FFFFFF;\n  border-bottom: 7px solid #FFFFFF;\n}\n.uil-reload-css.reload-background > div:after {\n  border-color: transparent transparent #FFFFFF transparent;\n}\n\n.uil-reload-css.reload-background.reload-small {\n  height: 40px;\n  width: 40px;\n}\n.uil-reload-css.reload-background.reload-small > div {\n  left: 10px;\n  top: 10px;\n  border: 3px solid #FFFFFF;\n  border-top: 3px solid transparent;\n  border-right: 3px solid #FFFFFF;\n  border-bottom: 3px solid #FFFFFF;\n}\n\n#bodyClick {\n  height: 100%;\n  width: 100%;\n  position: fixed;\n  opacity: 0;\n  top: 0;\n  left: auto;\n  right: 300px;\n  content: \"\";\n  z-index: 1029;\n  overflow-x: hidden;\n}\n\nbody {\n  position: relative;\n}\n\nbody > .navbar-collapse {\n  position: fixed;\n  display: block;\n  top: 0;\n  height: 100vh;\n  width: 300px;\n  right: 0;\n  z-index: 1032;\n  visibility: visible;\n  background-color: #FFFFFF;\n  overflow-y: visible;\n  border-top: none;\n  text-align: left;\n  border-left: 1px solid #CCC5B9;\n  padding-top: 15px;\n  -webkit-transform: translateX(300px);\n  -moz-transform: translateX(300px);\n  -o-transform: translateX(300px);\n  -ms-transform: translateX(300px);\n  transform: translateX(300px);\n  -webkit-transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);\n  -moz-transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);\n  -o-transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);\n  -ms-transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);\n  transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);\n}\nbody > .navbar-collapse ul {\n  position: relative;\n  z-index: 3;\n  overflow-y: auto;\n  height: 100%;\n}\nbody > .navbar-collapse .nav > li:last-child {\n  border-bottom: 0;\n}\nbody > .navbar-collapse .nav > li > a {\n  margin: 0px 0px;\n  color: #66615B;\n  text-transform: uppercase;\n  font-weight: 600;\n  font-size: 14px;\n  line-height: 1.5em;\n  padding: 15px;\n}\nbody > .navbar-collapse .nav > li > a:hover, body > .navbar-collapse .nav > li > a.active {\n  color: #403D39;\n}\nbody > .navbar-collapse .nav > li > a span {\n  display: inline-block !important;\n  margin-left: 5px;\n}\nbody > .navbar-collapse .nav > li.social-links {\n  text-align: center;\n  margin-left: -40px;\n}\nbody > .navbar-collapse .nav > li.social-links > a {\n  font-size: 20px;\n  padding: 15px 15px;\n}\nbody > .navbar-collapse .scroll-area {\n  max-height: none;\n}\nbody > .navbar-collapse::after {\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n  position: absolute;\n  background-color: #FFFCF5;\n  background-image: linear-gradient(to bottom, transparent 0%, rgba(112, 112, 112, 0) 60%, rgba(186, 186, 186, 0.15) 100%);\n  display: block;\n  content: \"\";\n  z-index: 1;\n}\nbody > .navbar-collapse.navbar-white-collapse::after {\n  background-color: #FFFFFF;\n}\nbody > .navbar-collapse.has-image::after {\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n  position: absolute;\n  background-color: rgba(17, 17, 17, 0.8);\n  display: block;\n  content: \"\";\n  z-index: 1;\n}\nbody > .navbar-collapse .dropdown-menu {\n  display: none;\n}\nbody > .navbar-collapse .open .dropdown-menu {\n  position: static;\n  float: none;\n  width: auto;\n  margin-top: 0;\n  background-color: transparent;\n  border: 0;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n  display: block;\n  min-width: auto !important;\n}\nbody > .navbar-collapse .caret {\n  border-bottom-color: #403D39;\n  border-top-color: #403D39;\n}\nbody > .navbar-collapse .nav .open > a,\nbody > .navbar-collapse .nav .open > a:hover,\nbody > .navbar-collapse .nav .open > a:focus {\n  background-color: transparent;\n}\n\nbody > .navbar-collapse.collapse {\n  height: 100vh !important;\n}\n\n.wrapper {\n  -webkit-transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);\n  -moz-transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);\n  -o-transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);\n  -ms-transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);\n  transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);\n  left: 0;\n  background-color: white;\n}\n.wrapper.transition {\n  -webkit-transform: translateX(0px);\n  -moz-transform: translateX(0px);\n  -o-transform: translateX(0px);\n  -ms-transform: translateX(0px);\n  transform: translateX(0px);\n}\n\n.navbar-burger .navbar-toggle .icon-bar {\n  display: block;\n  position: relative;\n  width: 24px;\n  height: 2px;\n  border-radius: 1px;\n}\n.navbar-burger.navbar-transparent .navbar-toggle .icon-bar {\n  background: #fff;\n}\n.navbar-burger .container {\n  -webkit-transform: translateX(0px);\n  -moz-transform: translateX(0px);\n  -o-transform: translateX(0px);\n  -ms-transform: translateX(0px);\n  transform: translateX(0px);\n  -webkit-transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);\n  -moz-transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);\n  -o-transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);\n  -ms-transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);\n  transition: all 0.5s cubic-bezier(0.685, 0.0473, 0.346, 1);\n  position: relative;\n}\n.navbar-burger .navbar-header .navbar-toggle {\n  margin-top: 12px;\n  margin-bottom: 8px;\n  width: 40px;\n  height: 40px;\n}\n.navbar-burger .bar1,\n.navbar-burger .bar2,\n.navbar-burger .bar3 {\n  outline: 1px solid transparent;\n}\n.navbar-burger .bar1 {\n  top: 0px;\n  -webkit-animation: topbar-back 500ms linear 0s;\n  -moz-animation: topbar-back 500ms linear 0s;\n  animation: topbar-back 500ms 0s;\n  -webkit-animation-fill-mode: forwards;\n  -moz-animation-fill-mode: forwards;\n  animation-fill-mode: forwards;\n}\n.navbar-burger .bar2 {\n  opacity: 1;\n}\n.navbar-burger .bar3 {\n  bottom: 0px;\n  -webkit-animation: bottombar-back 500ms linear 0s;\n  -moz-animation: bottombar-back 500ms linear 0s;\n  animation: bottombar-back 500ms 0s;\n  -webkit-animation-fill-mode: forwards;\n  -moz-animation-fill-mode: forwards;\n  animation-fill-mode: forwards;\n}\n.navbar-burger .toggled .bar1 {\n  top: 6px;\n  -webkit-animation: topbar-x 500ms linear 0s;\n  -moz-animation: topbar-x 500ms linear 0s;\n  animation: topbar-x 500ms 0s;\n  -webkit-animation-fill-mode: forwards;\n  -moz-animation-fill-mode: forwards;\n  animation-fill-mode: forwards;\n}\n.navbar-burger .toggled .bar2 {\n  opacity: 0;\n}\n.navbar-burger .toggled .bar3 {\n  bottom: 6px;\n  -webkit-animation: bottombar-x 500ms linear 0s;\n  -moz-animation: bottombar-x 500ms linear 0s;\n  animation: bottombar-x 500ms 0s;\n  -webkit-animation-fill-mode: forwards;\n  -moz-animation-fill-mode: forwards;\n  animation-fill-mode: forwards;\n}\n@keyframes topbar-x {\n  0% {\n    top: 0px;\n    transform: rotate(0deg);\n  }\n  45% {\n    top: 6px;\n    transform: rotate(145deg);\n  }\n  75% {\n    transform: rotate(130deg);\n  }\n  100% {\n    transform: rotate(135deg);\n  }\n}\n@-webkit-keyframes topbar-x {\n  0% {\n    top: 0px;\n    -webkit-transform: rotate(0deg);\n  }\n  45% {\n    top: 6px;\n    -webkit-transform: rotate(145deg);\n  }\n  75% {\n    -webkit-transform: rotate(130deg);\n  }\n  100% {\n    -webkit-transform: rotate(135deg);\n  }\n}\n@-moz-keyframes topbar-x {\n  0% {\n    top: 0px;\n    -moz-transform: rotate(0deg);\n  }\n  45% {\n    top: 6px;\n    -moz-transform: rotate(145deg);\n  }\n  75% {\n    -moz-transform: rotate(130deg);\n  }\n  100% {\n    -moz-transform: rotate(135deg);\n  }\n}\n@keyframes topbar-back {\n  0% {\n    top: 6px;\n    transform: rotate(135deg);\n  }\n  45% {\n    transform: rotate(-10deg);\n  }\n  75% {\n    transform: rotate(5deg);\n  }\n  100% {\n    top: 0px;\n    transform: rotate(0);\n  }\n}\n@-webkit-keyframes topbar-back {\n  0% {\n    top: 6px;\n    -webkit-transform: rotate(135deg);\n  }\n  45% {\n    -webkit-transform: rotate(-10deg);\n  }\n  75% {\n    -webkit-transform: rotate(5deg);\n  }\n  100% {\n    top: 0px;\n    -webkit-transform: rotate(0);\n  }\n}\n@-moz-keyframes topbar-back {\n  0% {\n    top: 6px;\n    -moz-transform: rotate(135deg);\n  }\n  45% {\n    -moz-transform: rotate(-10deg);\n  }\n  75% {\n    -moz-transform: rotate(5deg);\n  }\n  100% {\n    top: 0px;\n    -moz-transform: rotate(0);\n  }\n}\n@keyframes bottombar-x {\n  0% {\n    bottom: 0px;\n    transform: rotate(0deg);\n  }\n  45% {\n    bottom: 6px;\n    transform: rotate(-145deg);\n  }\n  75% {\n    transform: rotate(-130deg);\n  }\n  100% {\n    transform: rotate(-135deg);\n  }\n}\n@-webkit-keyframes bottombar-x {\n  0% {\n    bottom: 0px;\n    -webkit-transform: rotate(0deg);\n  }\n  45% {\n    bottom: 6px;\n    -webkit-transform: rotate(-145deg);\n  }\n  75% {\n    -webkit-transform: rotate(-130deg);\n  }\n  100% {\n    -webkit-transform: rotate(-135deg);\n  }\n}\n@-moz-keyframes bottombar-x {\n  0% {\n    bottom: 0px;\n    -moz-transform: rotate(0deg);\n  }\n  45% {\n    bottom: 6px;\n    -moz-transform: rotate(-145deg);\n  }\n  75% {\n    -moz-transform: rotate(-130deg);\n  }\n  100% {\n    -moz-transform: rotate(-135deg);\n  }\n}\n@keyframes bottombar-back {\n  0% {\n    bottom: 6px;\n    transform: rotate(-135deg);\n  }\n  45% {\n    transform: rotate(10deg);\n  }\n  75% {\n    transform: rotate(-5deg);\n  }\n  100% {\n    bottom: 0px;\n    transform: rotate(0);\n  }\n}\n@-webkit-keyframes bottombar-back {\n  0% {\n    bottom: 6px;\n    -webkit-transform: rotate(-135deg);\n  }\n  45% {\n    -webkit-transform: rotate(10deg);\n  }\n  75% {\n    -webkit-transform: rotate(-5deg);\n  }\n  100% {\n    bottom: 0px;\n    -webkit-transform: rotate(0);\n  }\n}\n@-moz-keyframes bottombar-back {\n  0% {\n    bottom: 6px;\n    -moz-transform: rotate(-135deg);\n  }\n  45% {\n    -moz-transform: rotate(10deg);\n  }\n  75% {\n    -moz-transform: rotate(-5deg);\n  }\n  100% {\n    bottom: 0px;\n    -moz-transform: rotate(0);\n  }\n}\n/* Bootstrap-select v1.8.1 (http://silviomoreto.github.io/bootstrap-select)\n*\n* Copyright 2013-2015 bootstrap-select\n* Licensed under MIT (https://github.com/silviomoreto/bootstrap-select/blob/master/LICENSE)\n*/\n.bootstrap-select {\n  width: 220px \\0;\n  /*IE9 and below*/\n}\n\n.bootstrap-select > .dropdown-toggle {\n  width: 100%;\n  padding-right: 25px;\n  z-index: 1;\n}\n\n.bootstrap-select > select {\n  position: absolute;\n  bottom: 0;\n  left: 50%;\n  width: 0.11px;\n  height: 100%;\n  opacity: 0;\n  border: none;\n}\n\n.bootstrap-select > select.mobile-device {\n  position: absolute !important;\n  top: 0;\n  left: 0;\n  display: block !important;\n  width: 100%;\n  height: 100% !important;\n  opacity: 0;\n  z-index: 2;\n}\n\n.has-error .bootstrap-select .dropdown-toggle,\n.error .bootstrap-select .dropdown-toggle {\n  border-color: #b94a48;\n}\n\n.bootstrap-select.fit-width {\n  width: auto !important;\n}\n\n.bootstrap-select:not([class*=\"col-\"]):not([class*=\"form-control\"]):not(.input-group-btn) {\n  width: 100%;\n}\n\n.bootstrap-select.form-control {\n  margin-bottom: 0;\n  padding: 0;\n  border: none;\n}\n\n.bootstrap-select.form-control:not([class*=\"col-\"]) {\n  width: 100%;\n}\n\n.bootstrap-select.form-control.input-group-btn {\n  z-index: auto;\n}\n\n.bootstrap-select.btn-group:not(.input-group-btn),\n.bootstrap-select.btn-group[class*=\"col-\"] {\n  float: none;\n  display: inline-block;\n  margin-left: 0;\n}\n\n.bootstrap-select.btn-group.dropdown-menu-right,\n.bootstrap-select.btn-group[class*=\"col-\"].dropdown-menu-right,\n.row .bootstrap-select.btn-group[class*=\"col-\"].dropdown-menu-right {\n  float: right;\n}\n\n.form-inline .bootstrap-select.btn-group,\n.form-horizontal .bootstrap-select.btn-group,\n.form-group .bootstrap-select.btn-group {\n  margin-bottom: 0;\n}\n\n.form-group-lg .bootstrap-select.btn-group.form-control,\n.form-group-sm .bootstrap-select.btn-group.form-control {\n  padding: 0;\n}\n\n.form-inline .bootstrap-select.btn-group .form-control {\n  width: 100%;\n}\n\n.bootstrap-select.btn-group.disabled,\n.bootstrap-select.btn-group > .disabled {\n  cursor: not-allowed;\n}\n\n.bootstrap-select.btn-group.disabled:focus,\n.bootstrap-select.btn-group > .disabled:focus {\n  outline: none !important;\n}\n\n.bootstrap-select.btn-group.bs-container {\n  position: absolute;\n}\n\n.bootstrap-select.btn-group.bs-container .dropdown-menu {\n  z-index: 1060;\n}\n\n.bootstrap-select.btn-group .dropdown-toggle .filter-option {\n  display: inline-block;\n  overflow: hidden;\n  width: 100%;\n  text-align: left;\n}\n\n.bootstrap-select.btn-group .dropdown-toggle .caret {\n  position: absolute;\n  top: 50%;\n  right: 12px;\n  margin-top: -2px;\n  vertical-align: middle;\n}\n\n.bootstrap-select.btn-group[class*=\"col-\"] .dropdown-toggle {\n  width: 100%;\n}\n\n.bootstrap-select.btn-group .dropdown-menu {\n  min-width: 100%;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\n.bootstrap-select.btn-group .dropdown-menu.inner {\n  position: static;\n  float: none;\n  border: 0;\n  padding: 0;\n  margin: 0;\n  border-radius: 0;\n  -webkit-box-shadow: none;\n  box-shadow: none;\n}\n\n.bootstrap-select.btn-group .dropdown-menu li {\n  position: relative;\n}\n\n.bootstrap-select.btn-group .dropdown-menu li.active small {\n  color: #fff;\n}\n\n.bootstrap-select.btn-group .dropdown-menu li.disabled a {\n  cursor: not-allowed;\n}\n\n.bootstrap-select.btn-group .dropdown-menu li a {\n  cursor: pointer;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\n.bootstrap-select.btn-group .dropdown-menu li a.opt {\n  position: relative;\n  padding-left: 2.25em;\n}\n\n.bootstrap-select.btn-group .dropdown-menu li a span.check-mark {\n  display: none;\n}\n\n.bootstrap-select.btn-group .dropdown-menu li a span.text {\n  display: inline-block;\n}\n\n.bootstrap-select.btn-group .dropdown-menu li small {\n  padding-left: 0.5em;\n}\n\n.bootstrap-select.btn-group .dropdown-menu .notify {\n  position: absolute;\n  bottom: 5px;\n  width: 96%;\n  margin: 0 2%;\n  min-height: 26px;\n  padding: 3px 5px;\n  background: #f5f5f5;\n  border: 1px solid #e3e3e3;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);\n  pointer-events: none;\n  opacity: 0.9;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\n.bootstrap-select.btn-group .no-results {\n  padding: 3px;\n  background: #f5f5f5;\n  margin: 0 5px;\n  white-space: nowrap;\n}\n\n.bootstrap-select.btn-group.fit-width .dropdown-toggle .filter-option {\n  position: static;\n}\n\n.bootstrap-select.btn-group.fit-width .dropdown-toggle .caret {\n  position: static;\n  top: auto;\n  margin-top: -1px;\n}\n\n.bootstrap-select.btn-group.show-tick .dropdown-menu li.selected a span.check-mark {\n  position: absolute;\n  display: inline-block;\n  right: 15px;\n  margin-top: 2px;\n}\n\n.bootstrap-select.btn-group.show-tick .dropdown-menu li a span.text {\n  margin-right: 34px;\n}\n\n.bootstrap-select.show-menu-arrow.open > .dropdown-toggle {\n  z-index: 1061;\n}\n\n.bootstrap-select.show-menu-arrow .dropdown-toggle:before {\n  content: '';\n  border-left: 7px solid transparent;\n  border-right: 7px solid transparent;\n  border-bottom: 7px solid rgba(204, 204, 204, 0.2);\n  position: absolute;\n  bottom: -4px;\n  left: 9px;\n  display: none;\n}\n\n.bootstrap-select.show-menu-arrow .dropdown-toggle:after {\n  content: '';\n  border-left: 6px solid transparent;\n  border-right: 6px solid transparent;\n  border-bottom: 6px solid white;\n  position: absolute;\n  bottom: -4px;\n  left: 10px;\n  display: none;\n}\n\n.bootstrap-select.show-menu-arrow.dropup .dropdown-toggle:before {\n  bottom: auto;\n  top: -3px;\n  border-top: 7px solid rgba(204, 204, 204, 0.2);\n  border-bottom: 0;\n}\n\n.bootstrap-select.show-menu-arrow.dropup .dropdown-toggle:after {\n  bottom: auto;\n  top: -3px;\n  border-top: 6px solid white;\n  border-bottom: 0;\n}\n\n.bootstrap-select.show-menu-arrow.pull-right .dropdown-toggle:before {\n  right: 12px;\n  left: auto;\n}\n\n.bootstrap-select.show-menu-arrow.pull-right .dropdown-toggle:after {\n  right: 13px;\n  left: auto;\n}\n\n.bootstrap-select.show-menu-arrow.open > .dropdown-toggle:before,\n.bootstrap-select.show-menu-arrow.open > .dropdown-toggle:after {\n  display: block;\n}\n\n.bs-searchbox,\n.bs-actionsbox,\n.bs-donebutton {\n  padding: 8px 8px;\n}\n\n.bs-actionsbox {\n  width: 100%;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\n.bs-actionsbox .btn-group button {\n  width: 50%;\n}\n\n.bs-donebutton {\n  float: left;\n  width: 100%;\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n\n.bs-donebutton .btn-group button {\n  width: 100%;\n}\n\n.bs-searchbox + .bs-actionsbox {\n  padding: 0 8px 4px;\n}\n\n.bs-searchbox .form-control {\n  margin-bottom: 0;\n  width: 100%;\n  float: none;\n}\n\n.bootstrap-select .dropdown-menu {\n  -webkit-box-shadow: none;\n  box-shadow: none;\n  -webkit-transition: all 150ms linear;\n  -moz-transition: all 150ms linear;\n  -o-transition: all 150ms linear;\n  -ms-transition: all 150ms linear;\n  transition: all 150ms linear;\n  margin-top: -20px;\n}\n.bootstrap-select.open .dropdown-menu {\n  margin-top: -1px;\n}\n.bootstrap-select.dropup .dropdown-menu {\n  border-radius: 10px 10px 0 0;\n  margin-bottom: -1px;\n}\n.bootstrap-select.dropup .dropdown-menu:after, .bootstrap-select.dropup .dropdown-menu:before {\n  display: none;\n}\n.bootstrap-select.dropup.open .dropdown-menu {\n  margin-bottom: -10px;\n}\n.bootstrap-select.open .btn.form-control, .bootstrap-select.open .btn.form-control:focus, .bootstrap-select.open .btn.form-control:hover {\n  color: #66615B;\n}\n.bootstrap-select.open .btn.form-control .caret, .bootstrap-select.open .btn.form-control:focus .caret, .bootstrap-select.open .btn.form-control:hover .caret {\n  border-top-color: #66615B;\n}\n.bootstrap-select .btn.form-control:focus {\n  color: #66615B;\n}\n\n.btn-group.bootstrap-select .dropdown-menu {\n  min-width: 100%;\n}\n\n.header-wrapper {\n  position: relative;\n  height: 650px;\n}\n.header-wrapper .navbar {\n  border-radius: 0;\n  position: absolute;\n  width: 100%;\n  z-index: 3;\n}\n.header-wrapper .header {\n  background-color: #B2AFAB;\n  background-position: center center;\n  background-size: cover;\n  height: 550px;\n  overflow: hidden;\n  position: absolute;\n  width: 100%;\n  z-index: 1;\n}\n.header-wrapper .header .filter::after {\n  background-color: rgba(0, 0, 0, 0.5);\n  content: \"\";\n  display: block;\n  height: 550px;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  z-index: 2;\n}\n.header-wrapper .header .filter-primary::after {\n  background-color: rgba(96, 133, 134, 0.5);\n}\n.header-wrapper .header .filter-info::after {\n  background-color: rgba(68, 160, 185, 0.5);\n}\n.header-wrapper .header .filter-success::after {\n  background-color: rgba(87, 178, 127, 0.5);\n}\n.header-wrapper .header .filter-warning::after {\n  background-color: rgba(240, 169, 21, 0.5);\n}\n.header-wrapper .header .filter-danger::after {\n  background-color: rgba(205, 71, 19, 0.5);\n}\n.header-wrapper .header .container {\n  color: #FFFFFF;\n  position: relative;\n  top: 200px;\n  z-index: 3;\n}\n.header-wrapper .header .upper-container {\n  top: 150px;\n}\n.header-wrapper .header-video {\n  max-height: 550px;\n  overflow: hidden;\n}\n.header-wrapper .header-video.state-play .filter::after {\n  opacity: 0;\n}\n.header-wrapper .header-video.state-play .video-text {\n  opacity: 0;\n}\n.header-wrapper .header-video.state-play .btn {\n  opacity: 0;\n}\n.header-wrapper .header-video.state-play:hover .btn {\n  opacity: 1;\n}\n.header-wrapper video {\n  position: absolute;\n  width: 100%;\n}\n\n.footer {\n  background-color: #FFFCF5;\n  line-height: 36px;\n  padding-top: 30px;\n  padding-bottom: 30px;\n}\n.footer .links {\n  display: inline-block;\n}\n.footer .links ul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  font-weight: 600;\n}\n.footer .links ul > li {\n  display: inline-block;\n  padding-right: 20px;\n}\n.footer .links ul > li:last-child {\n  padding-right: 0px;\n}\n.footer .links ul a:not(.btn) {\n  color: #66615b;\n  display: block;\n  font-size: 0.9em;\n  margin-bottom: 3px;\n}\n.footer .links ul a:not(.btn):hover, .footer .links ul a:not(.btn):focus {\n  color: #403D39;\n}\n.footer .links ul.uppercase-links {\n  text-transform: uppercase;\n}\n.footer .links ul.stacked-links {\n  margin-top: 15px;\n}\n.footer .links ul.stacked-links > li {\n  display: block;\n  line-height: 26px;\n}\n.footer .links ul.stacked-links h4 {\n  margin-top: 0px;\n}\n.footer .social-area {\n  padding: 15px 0;\n}\n.footer .social-area .btn {\n  margin-bottom: 3px;\n}\n.footer hr {\n  border-color: #66615b;\n  border-width: 1px 0 0;\n  margin-top: 5px;\n  margin-bottom: 5px;\n}\n.footer .copyright {\n  color: #A49E9E;\n  font-size: 0.9em;\n}\n.footer .copyright ul > li {\n  padding-right: 0px;\n}\n.footer .title {\n  color: #403D39;\n}\n\n.footer-black,\n.footer-transparent,\n.subscribe-line-transparent {\n  background-color: #252422;\n  color: #DDDDDD;\n}\n.footer-black .links ul a:not(.btn),\n.footer-transparent .links ul a:not(.btn),\n.subscribe-line-transparent .links ul a:not(.btn) {\n  color: #A49E9E;\n}\n.footer-black .links ul a:not(.btn):hover, .footer-black .links ul a:not(.btn):focus,\n.footer-transparent .links ul a:not(.btn):hover,\n.subscribe-line-transparent .links ul a:not(.btn):hover,\n.footer-transparent .links ul a:not(.btn):focus,\n.subscribe-line-transparent .links ul a:not(.btn):focus {\n  color: #F1EAE0;\n}\n.footer-black .copyright,\n.footer-transparent .copyright,\n.subscribe-line-transparent .copyright {\n  color: #66615b;\n}\n.footer-black .copyright ul > li a:not(.btn),\n.footer-transparent .copyright ul > li a:not(.btn),\n.subscribe-line-transparent .copyright ul > li a:not(.btn) {\n  color: #66615b;\n}\n.footer-black hr,\n.footer-transparent hr,\n.subscribe-line-transparent hr {\n  border-color: #66615b;\n}\n\n.footer-transparent, .subscribe-line-transparent {\n  background-size: cover;\n  position: relative;\n}\n.footer-transparent .container, .subscribe-line-transparent .container {\n  z-index: 2;\n  position: relative;\n}\n.footer-transparent hr, .subscribe-line-transparent hr {\n  border-color: #A49E9E;\n}\n.footer-transparent .copyright, .subscribe-line-transparent .copyright {\n  color: #A49E9E;\n}\n.footer-transparent .copyright ul > li a:not(.btn), .subscribe-line-transparent .copyright ul > li a:not(.btn) {\n  color: #A49E9E;\n}\n.footer-transparent::after, .subscribe-line-transparent::after {\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n  position: absolute;\n  background-color: rgba(17, 17, 17, 0.5);\n  display: block;\n  content: \"\";\n  z-index: 1;\n}\n\n.footer-big {\n  padding-top: 30px;\n}\n.footer-big hr {\n  margin-top: 20px;\n}\n.footer-big .copyright {\n  margin: 10px 0px 20px;\n}\n.footer-big .form-group {\n  margin-top: 15px;\n}\n\n.subscribe-line {\n  background-color: #FFFCF5;\n  padding: 35px 0;\n}\n.subscribe-line .form-group {\n  margin: 0;\n}\n.subscribe-line .form-control {\n  height: auto;\n  font-size: 1.825em;\n  border: 0;\n  padding: 0;\n  font-weight: 300;\n  line-height: 54px;\n  background-color: transparent;\n}\n.subscribe-line .btn:not(.btn-lg) {\n  margin-top: 7px;\n}\n\n.subscribe-line-black {\n  background-color: #252422;\n}\n.subscribe-line-black .form-control {\n  color: #FFFFFF;\n}\n\n.subscribe-line-transparent .form-control {\n  color: #FFFFFF;\n}\n\n.social-line {\n  padding: 30px 0;\n  background-color: #FFFCF5;\n}\n.social-line .title {\n  margin: 0;\n  line-height: 40px;\n  font-size: 1.5em;\n}\n.social-line .title-with-lg {\n  padding-top: 5px;\n}\n.social-line .btn {\n  width: 100%;\n}\n\n.social-line-black {\n  background-color: #252422;\n  color: #FFFFFF;\n}\n\n.icon-primary {\n  color: #7A9E9F;\n}\n\n.icon-info {\n  color: #68B3C8;\n}\n\n.icon-success {\n  color: #7AC29A;\n}\n\n.icon-warning {\n  color: #F3BB45;\n}\n\n.icon-danger {\n  color: #EB5E28;\n}\n\n.icon-neutral {\n  color: #FFFFFF;\n}\n\n.info {\n  margin-top: 20px;\n  margin-bottom: 30px;\n  padding: 10px;\n  text-align: center;\n}\n.info .icon {\n  margin-top: 0;\n  font-size: 3em;\n}\n.info .icon.icon-sm {\n  font-size: 1.5em;\n}\n.info h4,\n.info .h4 {\n  margin-top: 20px;\n  margin-bottom: 5px;\n}\n\n.info-horizontal {\n  text-align: left;\n  margin-top: 0;\n}\n.info-horizontal .icon {\n  float: left;\n  margin-top: 15px;\n  margin-right: 20px;\n}\n.info-horizontal .icon .fa {\n  width: 48px;\n}\n.info-horizontal .description {\n  overflow: hidden;\n}\n.info-horizontal .btn {\n  margin-left: -19px;\n}\n\n.info .icon .fa {\n  width: 48px;\n}\n\n.table thead tr > th,\n.table thead tr > td,\n.table tbody tr > th,\n.table tbody tr > td,\n.table tfoot tr > th,\n.table tfoot tr > td {\n  border-top: 1px solid #CCC5B9;\n}\n.table > thead > tr > th {\n  border-bottom-width: 0;\n  font-size: 1.25em;\n  font-weight: 300;\n}\n.table .radio,\n.table .checkbox {\n  margin-top: 0;\n  margin-bottom: 22px;\n  padding: 0;\n  width: 15px;\n}\n.table > thead > tr > th,\n.table > tbody > tr > th,\n.table > tfoot > tr > th,\n.table > thead > tr > td,\n.table > tbody > tr > td,\n.table > tfoot > tr > td {\n  padding: 12px 8px;\n  vertical-align: middle;\n}\n.table .th-description {\n  max-width: 150px;\n}\n.table .td-price {\n  font-size: 26px;\n  font-weight: 300;\n  margin-top: 5px;\n  text-align: right;\n}\n.table .td-total {\n  font-weight: 600;\n  font-size: 1.25em;\n  padding-top: 20px;\n  text-align: right;\n}\n.table .td-actions .btn.btn-sm, .table .td-actions .btn.btn-xs {\n  padding-left: 3px;\n  padding-right: 3px;\n}\n.table > tbody > tr {\n  position: relative;\n}\n\n.table-striped tbody > tr:nth-of-type(2n+1) {\n  background-color: #fff;\n}\n.table-striped > thead > tr > th,\n.table-striped > tbody > tr > th,\n.table-striped > tfoot > tr > th,\n.table-striped > thead > tr > td,\n.table-striped > tbody > tr > td,\n.table-striped > tfoot > tr > td {\n  padding: 15px 8px;\n}\n\n.table-shopping > thead > tr > th {\n  color: #a49e93;\n  font-size: 1.1em;\n  font-weight: 300;\n}\n.table-shopping > tbody > tr > td {\n  font-size: 16px;\n  padding: 30px 5px;\n}\n.table-shopping > tbody > tr > td b {\n  display: block;\n  margin-bottom: 5px;\n}\n.table-shopping .td-number,\n.table-shopping .td-price,\n.table-shopping .td-total {\n  font-size: 1.2em;\n  font-weight: 300;\n  min-width: 130px;\n  text-align: right;\n}\n.table-shopping .td-number small,\n.table-shopping .td-price small,\n.table-shopping .td-total small {\n  margin-right: 3px;\n}\n.table-shopping .td-product {\n  min-width: 170px;\n  padding-left: 30px;\n}\n.table-shopping .td-product strong {\n  color: #403D39;\n  font-size: 1.2em;\n  font-weight: 600;\n}\n.table-shopping .td-number,\n.table-shopping .td-total {\n  color: #403D39;\n  font-weight: 600;\n}\n.table-shopping .td-quantity {\n  min-width: 200px;\n}\n.table-shopping .td-quantity .btn-group {\n  margin-left: 10px;\n}\n.table-shopping .img-container {\n  border-radius: 6px;\n  display: block;\n  height: 100px;\n  overflow: hidden;\n  width: 100px;\n}\n.table-shopping .img-container img {\n  width: 100%;\n}\n.table-shopping .tr-actions > td {\n  border-top: 0;\n}\n\n.media {\n  border-bottom: 1px solid #a49e93;\n  padding-bottom: 30px;\n  margin-top: 30px;\n}\n.media .avatar {\n  margin: 0 auto;\n  width: 64px;\n  height: 64px;\n  overflow: hidden;\n  border-radius: 50%;\n  margin-right: 15px;\n  border: 3px solid #FFFFFF;\n}\n.media .avatar img {\n  width: 100%;\n}\n.media .media-heading {\n  color: #403D39;\n  display: inline-block;\n  font-weight: 600;\n  margin-bottom: 10px;\n  margin-top: 5px;\n}\n.media .btn-simple {\n  padding: 0px 5px;\n}\n.media .media {\n  margin-top: 30px;\n}\n.media .media-footer {\n  margin-top: 20px;\n}\n.media .media:last-child {\n  border: 0;\n}\n\n.media-post {\n  color: #555;\n  border: 0;\n}\n.media-post .media-heading {\n  display: block;\n  text-align: center;\n}\n.media-post .author {\n  width: 15%;\n}\n.media-post .media-body {\n  width: 85%;\n  float: left;\n  display: inline-block;\n}\n.media-post textarea {\n  margin: 0 0 10px 0;\n  font-size: 16px;\n}\n\n.media-area .media:last-child {\n  border: 0;\n}\n.media-area .pagination-area {\n  padding: 10px 0;\n  text-align: center;\n}\n\n.media-area-small p {\n  font-size: 14px;\n}\n.media-area-small .btn-simple {\n  font-size: 14px;\n}\n.media-area-small .avatar {\n  width: 58px;\n  height: 58px;\n}\n\n/*             Navigation menu                */\n/*             Navigation Tabs                 */\n.nav-tabs-navigation {\n  text-align: center;\n  border-bottom: 1px solid #F1EAE0;\n  margin-bottom: 30px;\n}\n.nav-tabs-navigation .nav > li > a {\n  padding-bottom: 20px;\n}\n\n.nav-tabs-wrapper {\n  display: inline-block;\n  margin-bottom: -6px;\n  margin-left: 1.25%;\n  margin-right: 1.25%;\n  position: relative;\n  width: auto;\n}\n\n.nav-tabs {\n  border-bottom: 0 none;\n  font-size: 16px;\n  font-weight: 600;\n}\n.nav-tabs > li > a {\n  border: 0 none;\n  color: #A49E93;\n}\n.nav-tabs > li > a:hover {\n  color: #66615b;\n}\n.nav-tabs > li.active {\n  color: #66615b;\n  position: relative;\n}\n.nav-tabs > li.active > a,\n.nav-tabs > li.active > a:hover,\n.nav-tabs > li.active > a:focus {\n  background-color: transparent;\n  border: 0 none;\n}\n.nav-tabs > li.active :after {\n  border-bottom: 11px solid #FFFCF5;\n  border-left: 11px solid transparent;\n  border-right: 11px solid transparent;\n  content: \"\";\n  display: inline-block;\n  position: absolute;\n  right: 40%;\n  bottom: -1px;\n}\n.nav-tabs > li.active :before {\n  border-bottom: 11px solid #F1EAE0;\n  border-left: 11px solid transparent;\n  border-right: 11px solid transparent;\n  content: \"\";\n  display: inline-block;\n  position: absolute;\n  right: 40%;\n  bottom: 1px;\n}\n\n.nav-stacked {\n  border-right: 1px solid #F1EAE0;\n  font-size: 16px;\n  font-weight: 600;\n  padding: 20px 0;\n}\n.nav-stacked > li > a {\n  color: #A49E93;\n  padding: 7px 25px;\n  text-align: right;\n}\n.nav-stacked > li > a:hover {\n  color: #66615b;\n}\n.nav-stacked > li.active > a {\n  color: #66615b;\n}\n.nav-stacked > li.active :after {\n  border-right: 11px solid #FFFCF5;\n  border-top: 11px solid transparent;\n  border-bottom: 11px solid transparent;\n  content: \"\";\n  display: inline-block;\n  position: absolute;\n  right: -1px;\n  bottom: 7px;\n}\n.nav-stacked > li.active :before {\n  border-right: 11px solid #F1EAE0;\n  border-top: 11px solid transparent;\n  border-bottom: 11px solid transparent;\n  content: \"\";\n  display: inline-block;\n  position: absolute;\n  right: 0;\n  bottom: 7px;\n}\n\n/*             Navigation Pills               */\n.nav-pills > li + li {\n  margin-left: 0;\n}\n.nav-pills > li > a {\n  border: 2px solid #66615B;\n  border-radius: 0;\n  color: #66615B;\n  font-weight: 600;\n  margin-left: -1px;\n  padding: 5px 20px;\n}\n.nav-pills > li.active > a,\n.nav-pills > li.active > a:hover,\n.nav-pills > li.active > a:focus {\n  background-color: #66615B;\n  color: #FFFFFF;\n}\n.nav-pills > li:first-child > a {\n  border-radius: 30px 0 0 30px;\n  margin: 0;\n}\n.nav-pills > li:last-child > a {\n  border-radius: 0 30px 30px 0;\n}\n\n.pagination > li > a,\n.pagination > li > span,\n.pagination > li:first-child > a,\n.pagination > li:first-child > span,\n.pagination > li:last-child > a,\n.pagination > li:last-child > span {\n  background-color: transparent;\n  border: 2px solid #66615B;\n  border-radius: 20px;\n  color: #66615B;\n  height: 36px;\n  margin: 0 2px;\n  min-width: 36px;\n  padding: 5px 12px;\n}\n\n.pagination > li > a:hover,\n.pagination > li > a:focus,\n.pagination > li > a:active,\n.pagination > li.active > a,\n.pagination > li.active > span,\n.pagination > li.active > a:hover,\n.pagination > li.active > span:hover,\n.pagination > li.active > a:focus,\n.pagination > li.active > span:focus {\n  background-color: #66615B;\n  border-color: #66615B;\n  color: #FFFFFF;\n}\n\n.nav-pills-primary > li > a,\n.pagination-primary > li > a,\n.pagination-primary > li > span,\n.pagination-primary > li:first-child > a,\n.pagination-primary > li:first-child > span,\n.pagination-primary > li:last-child > a,\n.pagination-primary > li:last-child > span {\n  border: 2px solid #7A9E9F;\n  color: #7A9E9F;\n}\n\n.nav-pills-primary > li.active > a,\n.nav-pills-primary > li.active > a:hover,\n.nav-pills-primary > li.active > a:focus,\n.pagination-primary > li > a:hover,\n.pagination-primary > li > a:focus,\n.pagination-primary > li > a:active,\n.pagination-primary > li.active > a,\n.pagination-primary > li.active > span,\n.pagination-primary > li.active > a:hover,\n.pagination-primary > li.active > span:hover,\n.pagination-primary > li.active > a:focus,\n.pagination-primary > li.active > span:focus {\n  background-color: #7A9E9F;\n  border-color: #7A9E9F;\n  color: #FFFFFF;\n}\n\n.nav-pills-info > li > a,\n.pagination-info > li > a,\n.pagination-info > li > span,\n.pagination-info > li:first-child > a,\n.pagination-info > li:first-child > span,\n.pagination-info > li:last-child > a,\n.pagination-info > li:last-child > span {\n  border: 2px solid #68B3C8;\n  color: #68B3C8;\n}\n\n.nav-pills-info > li.active > a,\n.nav-pills-info > li.active > a:hover,\n.nav-pills-info > li.active > a:focus,\n.pagination-info > li > a:hover,\n.pagination-info > li > a:focus,\n.pagination-info > li > a:active,\n.pagination-info > li.active > a,\n.pagination-info > li.active > span,\n.pagination-info > li.active > a:hover,\n.pagination-info > li.active > span:hover,\n.pagination-info > li.active > a:focus,\n.pagination-info > li.active > span:focus {\n  background-color: #68B3C8;\n  border-color: #68B3C8;\n  color: #FFFFFF;\n}\n\n.nav-pills-success > li > a,\n.pagination-success > li > a,\n.pagination-success > li > span,\n.pagination-success > li:first-child > a,\n.pagination-success > li:first-child > span,\n.pagination-success > li:last-child > a,\n.pagination-success > li:last-child > span {\n  border: 2px solid #7AC29A;\n  color: #7AC29A;\n}\n\n.nav-pills-success > li.active > a,\n.nav-pills-success > li.active > a:hover,\n.nav-pills-success > li.active > a:focus,\n.pagination-success > li > a:hover,\n.pagination-success > li > a:focus,\n.pagination-success > li > a:active,\n.pagination-success > li.active > a,\n.pagination-success > li.active > span,\n.pagination-success > li.active > a:hover,\n.pagination-success > li.active > span:hover,\n.pagination-success > li.active > a:focus,\n.pagination-success > li.active > span:focus {\n  background-color: #7AC29A;\n  border-color: #7AC29A;\n  color: #FFFFFF;\n}\n\n.nav-pills-warning > li > a,\n.pagination-warning > li > a,\n.pagination-warning > li > span,\n.pagination-warning > li:first-child > a,\n.pagination-warning > li:first-child > span,\n.pagination-warning > li:last-child > a,\n.pagination-warning > li:last-child > span {\n  border: 2px solid #F3BB45;\n  color: #F3BB45;\n}\n\n.nav-pills-warning > li.active > a,\n.nav-pills-warning > li.active > a:hover,\n.nav-pills-warning > li.active > a:focus,\n.pagination-warning > li > a:hover,\n.pagination-warning > li > a:focus,\n.pagination-warning > li > a:active,\n.pagination-warning > li.active > a,\n.pagination-warning > li.active > span,\n.pagination-warning > li.active > a:hover,\n.pagination-warning > li.active > span:hover,\n.pagination-warning > li.active > a:focus,\n.pagination-warning > li.active > span:focus {\n  background-color: #F3BB45;\n  border-color: #F3BB45;\n  color: #FFFFFF;\n}\n\n.nav-pills-danger > li > a,\n.pagination-danger > li > a,\n.pagination-danger > li > span,\n.pagination-danger > li:first-child > a,\n.pagination-danger > li:first-child > span,\n.pagination-danger > li:last-child > a,\n.pagination-danger > li:last-child > span {\n  border: 2px solid #EB5E28;\n  color: #EB5E28;\n}\n\n.nav-pills-danger > li.active > a,\n.nav-pills-danger > li.active > a:hover,\n.nav-pills-danger > li.active > a:focus,\n.pagination-danger > li > a:hover,\n.pagination-danger > li > a:focus,\n.pagination-danger > li > a:active,\n.pagination-danger > li.active > a,\n.pagination-danger > li.active > span,\n.pagination-danger > li.active > a:hover,\n.pagination-danger > li.active > span:hover,\n.pagination-danger > li.active > a:focus,\n.pagination-danger > li.active > span:focus {\n  background-color: #EB5E28;\n  border-color: #EB5E28;\n  color: #FFFFFF;\n}\n\n.panel {\n  background-color: #FFFCF5;\n  border: 0 none;\n  border-radius: 3px;\n  font-size: 18;\n  font-weight: 300;\n  line-height: 1.6em;\n  margin-top: 10px;\n  padding: 7px 10px;\n}\n\n.panel-border {\n  border: 1px solid #CCC5B9;\n}\n\n.panel-default .panel-heading {\n  background-color: #FFFCF5;\n  border: 0 none;\n  border-radius: 3px;\n}\n.panel-default a {\n  color: #66615b;\n}\n.panel-default a:hover, .panel-default a:active, .panel-default a:focus {\n  color: #EB5E28;\n}\n.panel-default a .panel-title > i {\n  float: right;\n}\n.panel-default a[aria-expanded=\"true\"] .panel-title > i,\n.panel-default a.expanded .panel-title > i {\n  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);\n  -webkit-transform: rotate(180deg);\n  -ms-transform: rotate(180deg);\n  transform: rotate(180deg);\n}\n\n.panel-default > .panel-heading + .panel-collapse > .panel-body {\n  border: 0 none;\n}\n\n.carousel-control {\n  background-color: #EB5E28;\n  border-radius: 50%;\n  opacity: 1;\n  text-shadow: none;\n}\n.carousel-control:hover, .carousel-control:focus {\n  opacity: 1;\n  background-color: #B33C12;\n}\n\n.carousel-control.left {\n  height: 30px;\n  top: 50%;\n  width: 30px;\n  left: 8%;\n}\n\n.carousel-control.right {\n  height: 30px;\n  right: 8%;\n  top: 50%;\n  width: 30px;\n}\n\n.carousel-control .icon-prev, .carousel-control .icon-next, .carousel-control .fa, .carousel-control .fa {\n  display: inline-block;\n  z-index: 5;\n}\n\n.carousel-control .fa {\n  font-size: 26px;\n  margin: 2px;\n}\n\n.carousel-control.left, .carousel-control.right {\n  background-image: none;\n}\n\n.carousel-inner {\n  background-color: #d6d2cc;\n}\n\n.carousel-inner > .item {\n  padding: 50px;\n}\n\n.carousel-inner > .item > img,\n.carousel-inner > .item > a > img {\n  border-radius: 8px;\n  box-shadow: 0 2px 2px rgba(204, 197, 185, 0.5);\n  margin-left: 25%;\n  max-width: 50%;\n}\n\n.carousel-indicators {\n  bottom: 0px;\n}\n\n.carousel-indicators > li {\n  background-color: #FFFFFF;\n  border: 0 none;\n}\n\n.carousel-indicators .active {\n  background-color: #EB5E28;\n}\n\n.modal-header {\n  border-bottom: 1px solid #DDDDDD;\n  padding: 20px;\n  text-align: center;\n}\n.modal-header.no-border-header {\n  border-bottom: 0 none;\n}\n.modal-header.no-border-header .modal-title {\n  margin-top: 20px;\n}\n\n.modal-content {\n  border: 0 none;\n  border-radius: 10px;\n  box-shadow: 0 0 15px rgba(0, 0, 0, 0.15), 0 0 1px 1px rgba(0, 0, 0, 0.1);\n}\n\n.modal-body {\n  padding: 20px 50px;\n}\n\n.modal-footer {\n  border-top: 1px solid #DDDDDD;\n  padding: 0px;\n}\n.modal-footer.no-border-footer {\n  border-top: 0 none;\n}\n\n.modal-footer .left-side, .modal-footer .right-side {\n  display: inline-block;\n  text-align: center;\n  width: 49%;\n}\n\n.modal-footer .btn-simple {\n  padding: 20px;\n  width: 100%;\n}\n\n.modal-footer .divider {\n  background-color: #DDDDDD;\n  display: inline-block;\n  float: inherit;\n  height: 63px;\n  margin: 0px -3px;\n  position: absolute;\n  width: 1px;\n}\n\n.modal.fade .modal-dialog {\n  transform: none;\n  -webkit-transform: none;\n  -moz-transform: none;\n}\n\n.modal.in .modal-dialog {\n  transform: none;\n  -webkit-transform: none;\n  -moz-transform: none;\n}\n\n.modal-backdrop.in {\n  opacity: 0.25;\n}\n\n.modal-notice {\n  padding-top: 60px;\n}\n.modal-notice .instruction {\n  margin-bottom: 30px;\n}\n.modal-notice .picture {\n  max-width: 150px;\n}\n\n.modal-small {\n  margin-top: 15%;\n  width: 300px;\n}\n\n.modal-medium {\n  width: 400px;\n}\n.modal-medium .modal-footer {\n  text-align: center;\n  margin-bottom: 25px;\n  padding: 30px 0;\n}\n\n.modal-register .modal-content {\n  background-color: #FFFCF5;\n  background-image: linear-gradient(to bottom, transparent 0%, rgba(112, 112, 112, 0) 60%, rgba(186, 186, 186, 0.15) 100%);\n}\n.modal-register .modal-header {\n  margin-top: 0px;\n}\n.modal-register .btn {\n  margin-top: 10px;\n}\n\n/*!\n * Datepicker for Bootstrap\n *\n * Copyright 2012 Stefan Petre\n * Licensed under the Apache License v2.0\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n */\n/*\n *\n *   SCSS by Creative Tim\n *   http://www.creative-tim.com\n *\n */\n.datepicker {\n  top: 0;\n  left: 0;\n  padding: 4px;\n  /*margin-top: 1px;*/\n  margin-top: 0px;\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n}\n.datepicker > div {\n  display: none;\n}\n.datepicker table {\n  width: 100%;\n  margin: 0;\n}\n.datepicker td,\n.datepicker th {\n  text-align: center;\n  width: 20px;\n  height: 20px;\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n}\n.datepicker td {\n  border-top: 1px solid #DDDDDD;\n  text-align: center;\n}\n.datepicker td p {\n  font-size: 14px;\n  font-weight: 400;\n  border-radius: 50%;\n  height: 29px;\n  line-height: 29px;\n  margin: 3px 0 8px;\n  width: 29px;\n}\n.datepicker td :hover {\n  cursor: pointer;\n}\n.datepicker th {\n  font-weight: 300;\n}\n.datepicker th.switch-datepicker {\n  font-size: 16px;\n}\n.datepicker .prev p,\n.datepicker .next p {\n  font-size: 1.825em;\n}\n.datepicker p:hover {\n  background: #eeeeee;\n}\n.datepicker .day.disabled {\n  color: #eeeeee;\n}\n.datepicker td.old,\n.datepicker td.new {\n  color: #999999;\n  border-top: 0;\n}\n.datepicker td.active p,\n.datepicker td.active:hover p {\n  color: #ffffff;\n  background-color: #68B3C8;\n}\n.datepicker td.blue p,\n.datepicker td.blue:hover p {\n  background-color: #7A9E9F;\n}\n.datepicker td.azure p,\n.datepicker td.azure:hover p {\n  background-color: #68B3C8;\n}\n.datepicker td.green p,\n.datepicker td.green:hover p {\n  background-color: #7AC29A;\n}\n.datepicker td.orange p,\n.datepicker td.orange:hover p {\n  background-color: #F3BB45;\n}\n.datepicker td.red p,\n.datepicker td.red:hover p {\n  background-color: #EB5E28;\n}\n.datepicker span {\n  display: block;\n  width: 55px;\n  height: 54px;\n  line-height: 54px;\n  float: left;\n  margin: 2px;\n  cursor: pointer;\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n}\n.datepicker span.old {\n  color: #999999;\n}\n.datepicker span.active,\n.datepicker span:focus,\n.datepicker span:hover,\n.datepicker span:active {\n  background-color: #68B3C8;\n}\n.datepicker span.active {\n  color: #FFFFFF;\n}\n.datepicker span:hover {\n  background: #eeeeee;\n}\n.datepicker span.blue,\n.datepicker span.blue:hover {\n  background-color: #7A9E9F;\n}\n.datepicker span.azure,\n.datepicker span.azure:hover {\n  background-color: #68B3C8;\n}\n.datepicker span.green,\n.datepicker span.green:hover {\n  background-color: #7AC29A;\n}\n.datepicker span.orange,\n.datepicker span.orange:hover {\n  background-color: #F3BB45;\n}\n.datepicker span.red,\n.datepicker span.red:hover {\n  background-color: #EB5E28;\n}\n.datepicker th.switch-datepicker {\n  width: 145px;\n}\n.datepicker th.next,\n.datepicker th.prev {\n  font-size: 21px;\n}\n.datepicker thead tr:first-child th {\n  cursor: pointer;\n}\n.datepicker thead tr:first-child th:hover {\n  background: #eeeeee;\n}\n.datepicker.dropdown-menu {\n  border-radius: 0 0 10px 10px;\n  -webkit-transform: translate3d(0, -40px, 0);\n  -moz-transform: translate3d(0, -40px, 0);\n  -o-transform: translate3d(0, -40px, 0);\n  -ms-transform: translate3d(0, -40px, 0);\n  transform: translate3d(0, -40px, 0);\n  transition: transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1) 0s;\n  opacity: 0;\n  visibility: hidden;\n  display: block;\n}\n.datepicker.dropdown-menu.open {\n  -webkit-transform: translate3d(0, 0, 0);\n  -moz-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  opacity: 1;\n  visibility: visible;\n}\n.datepicker .table-condensed > tbody > tr > td {\n  padding: 2px;\n}\n.datepicker .table-condensed > thead > tr > th {\n  padding: 0;\n}\n\n.input-append.date .add-on i,\n.input-prepend.date .add-on i {\n  display: block;\n  cursor: pointer;\n  width: 16px;\n  height: 16px;\n}\n\n.datepicker-months thead {\n  padding: 0 0 3px;\n  display: block;\n}\n\n@media (min-width: 768px) {\n  .navbar-search-form {\n    display: none;\n  }\n\n  .navbar-nav > li > .dropdown-menu,\n  .dropdown .dropdown-menu {\n    -webkit-transform: translate3d(0, -40px, 0);\n    -moz-transform: translate3d(0, -40px, 0);\n    -o-transform: translate3d(0, -40px, 0);\n    -ms-transform: translate3d(0, -40px, 0);\n    transform: translate3d(0, -40px, 0);\n    transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1) 0s, opacity 0.3s ease 0s, height 0s linear 0.35s;\n    opacity: 0;\n    visibility: hidden;\n    display: block;\n  }\n\n  .navbar-nav > li.open > .dropdown-menu,\n  .dropdown.open .dropdown-menu {\n    -webkit-transform: translate3d(0, 0, 0);\n    -moz-transform: translate3d(0, 0, 0);\n    -o-transform: translate3d(0, 0, 0);\n    -ms-transform: translate3d(0, 0, 0);\n    transform: translate3d(0, 0, 0);\n    opacity: 1;\n    visibility: visible;\n  }\n\n  .navbar-nav > li > .dropdown-menu:before,\n  .dropdown .dropdown-menu:before {\n    border-bottom: 11px solid #F1EAE0;\n    border-left: 11px solid transparent;\n    border-right: 11px solid transparent;\n    content: \"\";\n    display: inline-block;\n    position: absolute;\n    right: 12px;\n    top: -11px;\n  }\n\n  .navbar-nav > li > .dropdown-menu:after,\n  .dropdown .dropdown-menu:after {\n    border-bottom: 11px solid #FFFCF5;\n    border-left: 11px solid transparent;\n    border-right: 11px solid transparent;\n    content: \"\";\n    display: inline-block;\n    position: absolute;\n    right: 12px;\n    top: -10px;\n  }\n\n  .navbar-nav.navbar-right > li > .dropdown-menu:before {\n    left: auto;\n    right: 12px;\n  }\n\n  .navbar-nav.navbar-right > li > .dropdown-menu:after {\n    left: auto;\n    right: 12px;\n  }\n\n  .footer:not(.footer-big) nav > ul li:first-child {\n    margin-left: 0;\n  }\n\n  .dropup .dropdown-menu {\n    transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1) 0s, opacity 0.3s ease 0s, height 0s linear 0.35s;\n    -webkit-transform: translate3d(0, 30px, 0);\n    -moz-transform: translate3d(0, 30px, 0);\n    -o-transform: translate3d(0, 30px, 0);\n    -ms-transform: translate3d(0, 30px, 0);\n    transform: translate3d(0, 30px, 0);\n    opacity: 0;\n    visibility: hidden;\n    display: block;\n  }\n\n  .dropup.open .dropdown-menu {\n    -webkit-transform: translate3d(0, -10px, 0);\n    -moz-transform: translate3d(0, -10px, 0);\n    -o-transform: translate3d(0, -10px, 0);\n    -ms-transform: translate3d(0, -10px, 0);\n    transform: translate3d(0, -10px, 0);\n    opacity: 1;\n    visibility: visible;\n  }\n\n  .dropup .dropdown-menu:before {\n    border-top: 11px solid #DCD9D1;\n    border-left: 11px solid transparent;\n    border-right: 11px solid transparent;\n    content: \"\";\n    display: inline-block;\n    position: absolute;\n    right: 12px;\n    bottom: -11px;\n  }\n\n  .dropup .dropdown-menu:after {\n    border-top: 11px solid #FFFCF5;\n    border-left: 11px solid transparent;\n    border-right: 11px solid transparent;\n    content: \"\";\n    display: inline-block;\n    position: absolute;\n    right: 12px;\n    bottom: -10px;\n  }\n\n  .nav-open .navbar-collapse {\n    -webkit-transform: translateX(0px);\n    -moz-transform: translateX(0px);\n    -o-transform: translateX(0px);\n    -ms-transform: translateX(0px);\n    transform: translateX(0px);\n  }\n\n  .nav-open .navbar .container {\n    -webkit-transform: translateX(-200px);\n    -moz-transform: translateX(-200px);\n    -o-transform: translateX(-200px);\n    -ms-transform: translateX(-200px);\n    transform: translateX(-200px);\n  }\n\n  .nav-open .wrapper {\n    -webkit-transform: translateX(-150px);\n    -moz-transform: translateX(-150px);\n    -o-transform: translateX(-150px);\n    -ms-transform: translateX(-150px);\n    transform: translateX(-150px);\n  }\n\n  .navbar-burger .container {\n    padding: 0 15px;\n  }\n  .navbar-burger .navbar-header {\n    width: 100%;\n  }\n  .navbar-burger .navbar-toggle {\n    display: block;\n    margin-right: 0;\n  }\n  .navbar-burger.navbar .navbar-collapse.collapse, .navbar-burger.navbar .navbar-collapse.collapse.in, .navbar-burger.navbar .navbar-collapse.collapsing {\n    display: none !important;\n  }\n\n  body > .navbar-collapse .navbar-nav,\n  body > .navbar-collapse .navbar-nav > li {\n    float: none;\n  }\n  body > .navbar-collapse .navbar-nav > li {\n    float: none;\n  }\n\n  .dropdown-wide {\n    min-width: 360px;\n  }\n\n  .dropdown-medium {\n    min-width: 250px;\n  }\n}\nbody > .navbar-collapse.collapse {\n  height: 100vh !important;\n}\n\n@media (min-width: 992px) {\n  .nav-open .navbar .container {\n    -webkit-transform: translateX(-300px);\n    -moz-transform: translateX(-300px);\n    -o-transform: translateX(-300px);\n    -ms-transform: translateX(-300px);\n    transform: translateX(-300px);\n  }\n}\n/*          Changes for small display      */\n@media (max-width: 767px) {\n  .navbar-ct-transparent .navbar-toggle .icon-bar {\n    background: #66615b;\n  }\n\n  body {\n    position: relative;\n    font-size: 14px;\n  }\n\n  h6 {\n    font-size: 1em;\n  }\n\n  .wrapper {\n    -webkit-transform: translateX(0px);\n    -moz-transform: translateX(0px);\n    -o-transform: translateX(0px);\n    -ms-transform: translateX(0px);\n    transform: translateX(0px);\n    -webkit-transition: all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1);\n    -moz-transition: all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1);\n    -o-transition: all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1);\n    -ms-transition: all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1);\n    transition: all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1);\n    left: 0;\n    background-color: white;\n  }\n\n  .navbar .container {\n    left: 0;\n    width: 100%;\n    -webkit-transition: all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1);\n    -moz-transition: all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1);\n    -o-transition: all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1);\n    -ms-transition: all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1);\n    transition: all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1);\n    position: relative;\n  }\n\n  .navbar .navbar-collapse.collapse,\n  .navbar .navbar-collapse.collapse.in,\n  .navbar .navbar-collapse.collapsing {\n    display: none !important;\n  }\n\n  .nav-open .navbar-collapse {\n    -webkit-transform: translateX(0px);\n    -moz-transform: translateX(0px);\n    -o-transform: translateX(0px);\n    -ms-transform: translateX(0px);\n    transform: translateX(0px);\n  }\n\n  .nav-open .navbar .container {\n    left: -230px;\n  }\n\n  .nav-open .wrapper {\n    left: 0;\n    -webkit-transform: translateX(-230px);\n    -moz-transform: translateX(-230px);\n    -o-transform: translateX(-230px);\n    -ms-transform: translateX(-230px);\n    transform: translateX(-230px);\n  }\n\n  .navbar-toggle .icon-bar {\n    display: block;\n    position: relative;\n    background: #fff;\n    width: 24px;\n    height: 2px;\n    border-radius: 1px;\n    margin: 0 auto;\n  }\n\n  .navbar-header .navbar-toggle {\n    margin-top: 12px;\n    width: 40px;\n    height: 40px;\n  }\n\n  .bar1,\n  .bar2,\n  .bar3 {\n    outline: 1px solid transparent;\n  }\n\n  .bar1 {\n    top: 0px;\n    -webkit-animation: topbar-back 500ms linear 0s;\n    -moz-animation: topbar-back 500ms linear 0s;\n    animation: topbar-back 500ms 0s;\n    -webkit-animation-fill-mode: forwards;\n    -moz-animation-fill-mode: forwards;\n    animation-fill-mode: forwards;\n  }\n\n  .bar2 {\n    opacity: 1;\n  }\n\n  .bar3 {\n    bottom: 0px;\n    -webkit-animation: bottombar-back 500ms linear 0s;\n    -moz-animation: bottombar-back 500ms linear 0s;\n    animation: bottombar-back 500ms 0s;\n    -webkit-animation-fill-mode: forwards;\n    -moz-animation-fill-mode: forwards;\n    animation-fill-mode: forwards;\n  }\n\n  .toggled .bar1 {\n    top: 6px;\n    -webkit-animation: topbar-x 500ms linear 0s;\n    -moz-animation: topbar-x 500ms linear 0s;\n    animation: topbar-x 500ms 0s;\n    -webkit-animation-fill-mode: forwards;\n    -moz-animation-fill-mode: forwards;\n    animation-fill-mode: forwards;\n  }\n\n  .toggled .bar2 {\n    opacity: 0;\n  }\n\n  .toggled .bar3 {\n    bottom: 6px;\n    -webkit-animation: bottombar-x 500ms linear 0s;\n    -moz-animation: bottombar-x 500ms linear 0s;\n    animation: bottombar-x 500ms 0s;\n    -webkit-animation-fill-mode: forwards;\n    -moz-animation-fill-mode: forwards;\n    animation-fill-mode: forwards;\n  }\n\n  @keyframes topbar-x {\n    0% {\n      top: 0px;\n      transform: rotate(0deg);\n    }\n    45% {\n      top: 6px;\n      transform: rotate(145deg);\n    }\n    75% {\n      transform: rotate(130deg);\n    }\n    100% {\n      transform: rotate(135deg);\n    }\n  }\n  @-webkit-keyframes topbar-x {\n    0% {\n      top: 0px;\n      -webkit-transform: rotate(0deg);\n    }\n    45% {\n      top: 6px;\n      -webkit-transform: rotate(145deg);\n    }\n    75% {\n      -webkit-transform: rotate(130deg);\n    }\n    100% {\n      -webkit-transform: rotate(135deg);\n    }\n  }\n  @-moz-keyframes topbar-x {\n    0% {\n      top: 0px;\n      -moz-transform: rotate(0deg);\n    }\n    45% {\n      top: 6px;\n      -moz-transform: rotate(145deg);\n    }\n    75% {\n      -moz-transform: rotate(130deg);\n    }\n    100% {\n      -moz-transform: rotate(135deg);\n    }\n  }\n  @keyframes topbar-back {\n    0% {\n      top: 6px;\n      transform: rotate(135deg);\n    }\n    45% {\n      transform: rotate(-10deg);\n    }\n    75% {\n      transform: rotate(5deg);\n    }\n    100% {\n      top: 0px;\n      transform: rotate(0);\n    }\n  }\n  @-webkit-keyframes topbar-back {\n    0% {\n      top: 6px;\n      -webkit-transform: rotate(135deg);\n    }\n    45% {\n      -webkit-transform: rotate(-10deg);\n    }\n    75% {\n      -webkit-transform: rotate(5deg);\n    }\n    100% {\n      top: 0px;\n      -webkit-transform: rotate(0);\n    }\n  }\n  @-moz-keyframes topbar-back {\n    0% {\n      top: 6px;\n      -moz-transform: rotate(135deg);\n    }\n    45% {\n      -moz-transform: rotate(-10deg);\n    }\n    75% {\n      -moz-transform: rotate(5deg);\n    }\n    100% {\n      top: 0px;\n      -moz-transform: rotate(0);\n    }\n  }\n  @keyframes bottombar-x {\n    0% {\n      bottom: 0px;\n      transform: rotate(0deg);\n    }\n    45% {\n      bottom: 6px;\n      transform: rotate(-145deg);\n    }\n    75% {\n      transform: rotate(-130deg);\n    }\n    100% {\n      transform: rotate(-135deg);\n    }\n  }\n  @-webkit-keyframes bottombar-x {\n    0% {\n      bottom: 0px;\n      -webkit-transform: rotate(0deg);\n    }\n    45% {\n      bottom: 6px;\n      -webkit-transform: rotate(-145deg);\n    }\n    75% {\n      -webkit-transform: rotate(-130deg);\n    }\n    100% {\n      -webkit-transform: rotate(-135deg);\n    }\n  }\n  @-moz-keyframes bottombar-x {\n    0% {\n      bottom: 0px;\n      -moz-transform: rotate(0deg);\n    }\n    45% {\n      bottom: 6px;\n      -moz-transform: rotate(-145deg);\n    }\n    75% {\n      -moz-transform: rotate(-130deg);\n    }\n    100% {\n      -moz-transform: rotate(-135deg);\n    }\n  }\n  @keyframes bottombar-back {\n    0% {\n      bottom: 6px;\n      transform: rotate(-135deg);\n    }\n    45% {\n      transform: rotate(10deg);\n    }\n    75% {\n      transform: rotate(-5deg);\n    }\n    100% {\n      bottom: 0px;\n      transform: rotate(0);\n    }\n  }\n  @-webkit-keyframes bottombar-back {\n    0% {\n      bottom: 6px;\n      -webkit-transform: rotate(-135deg);\n    }\n    45% {\n      -webkit-transform: rotate(10deg);\n    }\n    75% {\n      -webkit-transform: rotate(-5deg);\n    }\n    100% {\n      bottom: 0px;\n      -webkit-transform: rotate(0);\n    }\n  }\n  @-moz-keyframes bottombar-back {\n    0% {\n      bottom: 6px;\n      -moz-transform: rotate(-135deg);\n    }\n    45% {\n      -moz-transform: rotate(10deg);\n    }\n    75% {\n      -moz-transform: rotate(-5deg);\n    }\n    100% {\n      bottom: 0px;\n      -moz-transform: rotate(0);\n    }\n  }\n  @-webkit-keyframes fadeIn {\n    0% {\n      opacity: 0;\n    }\n    100% {\n      opacity: 1;\n    }\n  }\n  @-moz-keyframes fadeIn {\n    0% {\n      opacity: 0;\n    }\n    100% {\n      opacity: 1;\n    }\n  }\n  @keyframes fadeIn {\n    0% {\n      opacity: 0;\n    }\n    100% {\n      opacity: 1;\n    }\n  }\n  .navbar-nav {\n    margin: 1px -15px;\n  }\n  .navbar-nav .open .dropdown-menu .dropdown-header {\n    padding: 5px 15px 5px 20px;\n  }\n  .navbar-nav .open .dropdown-menu > li > a {\n    padding: 15px 15px 5px 20px;\n  }\n  .navbar-nav .open .dropdown-menu > li:first-child > a {\n    padding: 5px 15px 5px 20px;\n  }\n  .navbar-nav .open .dropdown-menu > li:last-child > a {\n    padding: 15px 15px 25px 20px;\n  }\n\n  [class*=\"navbar-\"] .navbar-nav > li > a,\n  [class*=\"navbar-\"] .navbar-nav > li > a:hover,\n  [class*=\"navbar-\"] .navbar-nav > li > a:focus,\n  [class*=\"navbar-\"] .navbar-nav .active > a,\n  [class*=\"navbar-\"] .navbar-nav .active > a:hover,\n  [class*=\"navbar-\"] .navbar-nav .active > a:focus {\n    color: white;\n  }\n  [class*=\"navbar-\"] .navbar-nav > li > a,\n  [class*=\"navbar-\"] .navbar-nav > li > a:hover,\n  [class*=\"navbar-\"] .navbar-nav > li > a:focus,\n  [class*=\"navbar-\"] .navbar-nav .open .dropdown-menu > li > a,\n  [class*=\"navbar-\"] .navbar-nav .open .dropdown-menu > li > a:hover,\n  [class*=\"navbar-\"] .navbar-nav .open .dropdown-menu > li > a:focus {\n    opacity: .7;\n    background: transparent;\n    color: #403D39;\n  }\n  [class*=\"navbar-\"] .navbar-nav.navbar-nav .open .dropdown-menu > li > a:active {\n    opacity: 1;\n  }\n  [class*=\"navbar-\"] .navbar-nav .dropdown > a:hover .caret {\n    border-bottom-color: #777;\n    border-top-color: #777;\n  }\n  [class*=\"navbar-\"] .navbar-nav .dropdown > a:active .caret {\n    border-bottom-color: white;\n    border-top-color: white;\n  }\n\n  .dropdown-menu {\n    display: none;\n  }\n\n  .navbar-fixed-top {\n    -webkit-backface-visibility: hidden;\n  }\n\n  .nav-open .navbar-collapse {\n    -webkit-transform: translateX(0px);\n    -moz-transform: translateX(0px);\n    -o-transform: translateX(0px);\n    -ms-transform: translateX(0px);\n    transform: translateX(0px);\n  }\n\n  .nav-open .wrapper {\n    left: 0;\n    -webkit-transform: translateX(-115px);\n    -moz-transform: translateX(-115px);\n    -o-transform: translateX(-115px);\n    -ms-transform: translateX(-115px);\n    transform: translateX(-115px);\n  }\n\n  .social-line .btn {\n    margin: 0 0 10px 0;\n  }\n\n  .subscribe-line .form-control {\n    margin: 0 0 10px 0;\n  }\n\n  .social-line.pull-right {\n    float: none;\n  }\n\n  .footer nav.pull-left {\n    float: none !important;\n  }\n\n  .footer:not(.footer-big) nav > ul li {\n    float: none;\n  }\n\n  .social-area.pull-right {\n    float: none !important;\n  }\n\n  .form-control + .form-control-feedback {\n    margin-top: -8px;\n  }\n\n  .navbar-toggle:hover, .navbar-toggle:focus {\n    background-color: transparent !important;\n  }\n\n  .btn.dropdown-toggle {\n    margin-bottom: 0;\n  }\n\n  .media-post .author {\n    width: 20%;\n    float: none !important;\n    display: block;\n    margin: 0 auto 10px;\n  }\n\n  .media-post .media-body {\n    width: 100%;\n  }\n\n  .modal-footer .btn-simple {\n    padding: 15px;\n  }\n\n  .table-responsive {\n    width: 100%;\n    margin-bottom: 15px;\n    overflow-x: scroll;\n    overflow-y: hidden;\n    border: 1px solid #dddddd;\n    -ms-overflow-style: -ms-autohiding-scrollbar;\n    -webkit-overflow-scrolling: touch;\n  }\n}\n@media (max-width: 991px) {\n  .header-video .video-image {\n    position: absolute;\n    z-index: 1;\n    width: 100%;\n    height: 100%;\n    content: \"\";\n    display: block;\n    background-size: cover;\n    background-position: center center;\n  }\n}\n/*! PhotoSwipe main CSS by Dmitry Semenov | photoswipe.com | MIT license */\n/*\n\tStyles for basic PhotoSwipe functionality (sliding area, open/close transitions)\n*/\n/* pswp = photoswipe */\n.pswp {\n  display: none;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  left: 0;\n  top: 0;\n  overflow: hidden;\n  -ms-touch-action: none;\n  touch-action: none;\n  z-index: 1500;\n  -webkit-text-size-adjust: 100%;\n  /* create separate layer, to avoid paint on window.onscroll in webkit/blink */\n  -webkit-backface-visibility: hidden;\n  outline: none;\n}\n.pswp * {\n  box-sizing: border-box;\n}\n.pswp img {\n  max-width: none;\n}\n\n/* style is added when JS option showHideOpacity is set to true */\n.pswp--animate_opacity {\n  /* 0.001, because opacity:0 doesn't trigger Paint action, which causes lag at start of transition */\n  opacity: 0.001;\n  will-change: opacity;\n  /* for open/close transition */\n  transition: opacity 333ms cubic-bezier(0.4, 0, 0.22, 1);\n}\n\n.pswp--open {\n  display: block;\n}\n\n.pswp--zoom-allowed .pswp__img {\n  /* autoprefixer: off */\n  cursor: -webkit-zoom-in;\n  cursor: -moz-zoom-in;\n  cursor: zoom-in;\n}\n\n.pswp--zoomed-in .pswp__img {\n  /* autoprefixer: off */\n  cursor: -webkit-grab;\n  cursor: -moz-grab;\n  cursor: grab;\n}\n\n.pswp--dragging .pswp__img {\n  /* autoprefixer: off */\n  cursor: -webkit-grabbing;\n  cursor: -moz-grabbing;\n  cursor: grabbing;\n}\n\n/*\n\tBackground is added as a separate element.\n\tAs animating opacity is much faster than animating rgba() background-color.\n*/\n.pswp__bg {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(232, 231, 227, 0.96);\n  opacity: 0;\n  -webkit-backface-visibility: hidden;\n  will-change: opacity;\n}\n\n.pswp__scroll-wrap {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n}\n\n.pswp__container,\n.pswp__zoom-wrap {\n  -ms-touch-action: none;\n  touch-action: none;\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n}\n\n/* Prevent selection and tap highlights */\n.pswp__container,\n.pswp__img {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  user-select: none;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\n.pswp__zoom-wrap {\n  position: absolute;\n  width: 100%;\n  -webkit-transform-origin: left top;\n  -moz-transform-origin: left top;\n  -ms-transform-origin: left top;\n  transform-origin: left top;\n  /* for open/close transition */\n  transition: transform 333ms cubic-bezier(0.4, 0, 0.22, 1);\n}\n\n.pswp__bg {\n  will-change: opacity;\n  /* for open/close transition */\n  transition: opacity 333ms cubic-bezier(0.4, 0, 0.22, 1);\n}\n\n.pswp--animated-in .pswp__bg,\n.pswp--animated-in .pswp__zoom-wrap {\n  -webkit-transition: none;\n  transition: none;\n}\n\n.pswp__container,\n.pswp__zoom-wrap {\n  -webkit-backface-visibility: hidden;\n  will-change: transform;\n}\n\n.pswp__item {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  overflow: hidden;\n}\n\n.pswp__img {\n  border-radius: 8px;\n  box-shadow: 0 2px 2px rgba(204, 197, 185, 0.5);\n  position: absolute;\n  width: auto;\n  height: auto;\n  top: 0;\n  left: 0;\n}\n\n/*\n\tstretched thumbnail or div placeholder element (see below)\n\tstyle is added to avoid flickering in webkit/blink when layers overlap\n*/\n.pswp__img--placeholder {\n  -webkit-backface-visibility: hidden;\n}\n\n/*\n\tdiv element that matches size of large image\n\tlarge image loads on top of it\n*/\n.pswp__img--placeholder--blank {\n  background: #222;\n}\n\n.pswp--ie .pswp__img {\n  width: 100% !important;\n  height: auto !important;\n  left: 0;\n  top: 0;\n}\n\n/*\n\tError message appears when image is not loaded\n\t(JS option errorMsg controls markup)\n*/\n.pswp__error-msg {\n  position: absolute;\n  left: 0;\n  top: 50%;\n  width: 100%;\n  text-align: center;\n  font-size: 14px;\n  line-height: 16px;\n  margin-top: -8px;\n  color: #CCC;\n}\n\n.pswp__error-msg a {\n  color: #CCC;\n  text-decoration: underline;\n}\n\n/*! PhotoSwipe Default UI CSS by Dmitry Semenov | photoswipe.com | MIT license */\n/*\n\n\tContents:\n\n\t1. Buttons\n\t2. Share modal and links\n\t3. Index indicator (\"1 of X\" counter)\n\t4. Caption\n\t5. Loading indicator\n\t6. Additional styles (root element, top bar, idle state, hidden state, etc.)\n\n*/\n/*\n\n\t1. Buttons\n\n */\n/* <button> css reset */\n.pswp__button {\n  width: 44px;\n  height: 44px;\n  position: relative;\n  background: none;\n  cursor: pointer;\n  overflow: visible;\n  -webkit-appearance: none;\n  display: block;\n  border: 0;\n  padding: 0;\n  margin: 0;\n  float: right;\n  opacity: 0.75;\n  transition: opacity 0.2s;\n  box-shadow: none;\n}\n.pswp__button:focus, .pswp__button:hover {\n  opacity: 1;\n}\n.pswp__button:active {\n  outline: none;\n  opacity: 0.9;\n}\n.pswp__button::-moz-focus-inner {\n  padding: 0;\n  border: 0;\n}\n\n/* pswp__ui--over-close class it added when mouse is over element that should close gallery */\n.pswp__ui--over-close .pswp__button--close {\n  opacity: 1;\n}\n\n.pswp__button,\n.pswp__button--arrow--left:before,\n.pswp__button--arrow--right:before {\n  background: url(../../assets/img/photo_swipe/default-skin.png) 0 0 no-repeat;\n  background-size: 264px 88px;\n  width: 44px;\n  height: 44px;\n}\n\n@media (-webkit-min-device-pixel-ratio: 1.1), (min-resolution: 105dpi), (min-resolution: 1.1dppx) {\n  /* Serve SVG sprite if browser supports SVG and resolution is more than 105dpi */\n  .pswp--svg .pswp__button,\n  .pswp--svg .pswp__button--arrow--left:before,\n  .pswp--svg .pswp__button--arrow--right:before {\n    background-image: url(../../assets/img/photo_swipe/default-skin.svg);\n  }\n\n  .pswp--svg .pswp__button--arrow--left,\n  .pswp--svg .pswp__button--arrow--right {\n    background: none;\n  }\n}\n.pswp__button--close {\n  background-position: 0 -44px;\n}\n\n.pswp__button--share {\n  background-position: -44px -44px;\n}\n\n.pswp__button--fs {\n  display: none;\n}\n\n.pswp--supports-fs .pswp__button--fs {\n  display: block;\n}\n\n.pswp--fs .pswp__button--fs {\n  background-position: -44px 0;\n}\n\n.pswp__button--zoom {\n  background-position: -88px 0;\n  display: none;\n}\n\n.pswp--zoom-allowed .pswp__button--zoom {\n  display: block;\n}\n\n.pswp--zoomed-in .pswp__button--zoom {\n  background-position: -132px 0;\n}\n\n/* no arrows on touch screens */\n.pswp--touch .pswp__button--arrow--left,\n.pswp--touch .pswp__button--arrow--right {\n  visibility: hidden;\n}\n\n/*\n\tArrow buttons hit area\n\t(icon is added to :before pseudo-element)\n*/\n.pswp__button--arrow--left,\n.pswp__button--arrow--right {\n  background: none;\n  top: 50%;\n  margin-top: -50px;\n  width: 70px;\n  height: 100px;\n  position: absolute;\n}\n\n.pswp__button--arrow--left {\n  left: 0;\n}\n\n.pswp__button--arrow--right {\n  right: 0;\n}\n\n.pswp__button--arrow--left:before,\n.pswp__button--arrow--right:before {\n  content: '';\n  top: 35px;\n  background-color: transparent;\n  height: 30px;\n  width: 32px;\n  position: absolute;\n}\n\n.pswp__button--arrow--left:before {\n  left: 6px;\n  background-position: -138px -44px;\n}\n\n.pswp__button--arrow--right:before {\n  right: 6px;\n  background-position: -94px -44px;\n}\n\n/*\n\n\t2. Share modal/popup and links\n\n */\n.pswp__counter,\n.pswp__share-modal {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  user-select: none;\n}\n\n.pswp__share-modal {\n  display: block;\n  background: rgba(0, 0, 0, 0.5);\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  padding: 10px;\n  position: absolute;\n  z-index: 1600;\n  opacity: 0;\n  transition: opacity 0.25s ease-out;\n  -webkit-backface-visibility: hidden;\n  will-change: opacity;\n}\n\n.pswp__share-modal--hidden {\n  display: none;\n}\n\n.pswp__share-tooltip {\n  z-index: 1620;\n  position: absolute;\n  background: #FFF;\n  top: 56px;\n  border-radius: 2px;\n  display: block;\n  width: auto;\n  right: 44px;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);\n  transform: translateY(6px);\n  transition: transform 0.25s;\n  -webkit-backface-visibility: hidden;\n  will-change: transform;\n}\n.pswp__share-tooltip a {\n  display: block;\n  padding: 8px 12px;\n  color: #000;\n  text-decoration: none;\n  font-size: 14px;\n  line-height: 18px;\n}\n.pswp__share-tooltip a:hover {\n  text-decoration: none;\n  color: #000;\n}\n.pswp__share-tooltip a:first-child {\n  /* round corners on the first/last list item */\n  border-radius: 2px 2px 0 0;\n}\n.pswp__share-tooltip a:last-child {\n  border-radius: 0 0 2px 2px;\n}\n\n.pswp__share-modal--fade-in {\n  opacity: 1;\n}\n.pswp__share-modal--fade-in .pswp__share-tooltip {\n  transform: translateY(0);\n}\n\n/* increase size of share links on touch devices */\n.pswp--touch .pswp__share-tooltip a {\n  padding: 16px 12px;\n}\n\na.pswp__share--facebook:before {\n  content: '';\n  display: block;\n  width: 0;\n  height: 0;\n  position: absolute;\n  top: -12px;\n  right: 15px;\n  border: 6px solid transparent;\n  border-bottom-color: #FFF;\n  -webkit-pointer-events: none;\n  -moz-pointer-events: none;\n  pointer-events: none;\n}\na.pswp__share--facebook:hover {\n  background: #3E5C9A;\n  color: #FFF;\n}\na.pswp__share--facebook:hover:before {\n  border-bottom-color: #3E5C9A;\n}\n\na.pswp__share--twitter:hover {\n  background: #55ACEE;\n  color: #FFF;\n}\n\na.pswp__share--pinterest:hover {\n  background: #CCC;\n  color: #CE272D;\n}\n\na.pswp__share--download:hover {\n  background: #DDD;\n}\n\n/*\n\n\t3. Index indicator (\"1 of X\" counter)\n\n */\n.pswp__counter {\n  position: absolute;\n  left: 0;\n  top: 0;\n  height: 44px;\n  font-size: 16px;\n  line-height: 44px;\n  color: #66615b;\n  opacity: 1;\n  padding: 5px 20px;\n}\n\n/*\n\n\t4. Caption\n\n */\n.pswp__caption {\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  min-height: 44px;\n}\n.pswp__caption small {\n  font-size: 12px;\n  color: #a49e93;\n}\n\n.pswp__caption__center {\n  text-align: left;\n  max-width: 420px;\n  margin: 0 auto;\n  font-size: 1.25em;\n  padding: 30px;\n  line-height: 1.5em;\n  color: #66615b;\n  text-align: center;\n}\n\n.pswp__caption--empty {\n  display: none;\n}\n\n/* Fake caption element, used to calculate height of next/prev image */\n.pswp__caption--fake {\n  visibility: hidden;\n}\n\n/*\n\n\t5. Loading indicator (preloader)\n\n\tYou can play with it here - http://codepen.io/dimsemenov/pen/yyBWoR\n\n */\n.pswp__preloader {\n  width: 44px;\n  height: 44px;\n  position: absolute;\n  top: 0;\n  left: 50%;\n  margin-left: -22px;\n  opacity: 0;\n  transition: opacity 0.25s ease-out;\n  will-change: opacity;\n  direction: ltr;\n}\n\n.pswp__preloader__icn {\n  width: 20px;\n  height: 20px;\n  margin: 12px;\n}\n\n.pswp__preloader--active {\n  opacity: 1;\n}\n.pswp__preloader--active .pswp__preloader__icn {\n  /* We use .gif in browsers that don't support CSS animation */\n  background: url(../../assets/img/photo_swipe/preloader.gif) 0 0 no-repeat;\n}\n\n.pswp--css_animation .pswp__preloader--active {\n  opacity: 1;\n}\n.pswp--css_animation .pswp__preloader--active .pswp__preloader__icn {\n  animation: clockwise 500ms linear infinite;\n}\n.pswp--css_animation .pswp__preloader--active .pswp__preloader__donut {\n  animation: donut-rotate 1000ms cubic-bezier(0.4, 0, 0.22, 1) infinite;\n}\n.pswp--css_animation .pswp__preloader__icn {\n  background: none;\n  opacity: 0.75;\n  width: 14px;\n  height: 14px;\n  position: absolute;\n  left: 15px;\n  top: 15px;\n  margin: 0;\n}\n.pswp--css_animation .pswp__preloader__cut {\n  /*\n  \tThe idea of animating inner circle is based on Polymer (\"material\") loading indicator\n  \t by Keanu Lee https://blog.keanulee.com/2014/10/20/the-tale-of-three-spinners.html\n  */\n  position: relative;\n  width: 7px;\n  height: 14px;\n  overflow: hidden;\n}\n.pswp--css_animation .pswp__preloader__donut {\n  box-sizing: border-box;\n  width: 14px;\n  height: 14px;\n  border: 2px solid #FFF;\n  border-radius: 50%;\n  border-left-color: transparent;\n  border-bottom-color: transparent;\n  position: absolute;\n  top: 0;\n  left: 0;\n  background: none;\n  margin: 0;\n}\n\n@media screen and (max-width: 1024px) {\n  .pswp__preloader {\n    position: relative;\n    left: auto;\n    top: auto;\n    margin: 0;\n    float: right;\n  }\n}\n@keyframes clockwise {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@keyframes donut-rotate {\n  0% {\n    transform: rotate(0);\n  }\n  50% {\n    transform: rotate(-140deg);\n  }\n  100% {\n    transform: rotate(0);\n  }\n}\n/*\n\n\t6. Additional styles\n\n */\n/* root element of UI */\n.pswp__ui {\n  -webkit-font-smoothing: auto;\n  visibility: visible;\n  opacity: 1;\n  z-index: 1550;\n}\n\n/* top black bar with buttons and \"1 of X\" indicator */\n.pswp__top-bar {\n  position: absolute;\n  left: 0;\n  top: 0;\n  height: 44px;\n  width: 100%;\n}\n\n.pswp__caption,\n.pswp__top-bar,\n.pswp--has_mouse .pswp__button--arrow--left,\n.pswp--has_mouse .pswp__button--arrow--right {\n  -webkit-backface-visibility: hidden;\n  will-change: opacity;\n  transition: opacity 333ms cubic-bezier(0.4, 0, 0.22, 1);\n}\n\n/* pswp--has_mouse class is added only when two subsequent mousemove events occur */\n.pswp--has_mouse .pswp__button--arrow--left,\n.pswp--has_mouse .pswp__button--arrow--right {\n  visibility: visible;\n}\n\n.pswp__top-bar,\n.pswp__caption {\n  background-color: rgba(232, 231, 227, 0.96);\n}\n\n/* pswp__ui--fit class is added when main image \"fits\" between top bar and bottom bar (caption) */\n.pswp__ui--fit .pswp__top-bar,\n.pswp__ui--fit .pswp__caption {\n  background-color: rgba(232, 231, 227, 0.96);\n}\n\n/* pswp__ui--idle class is added when mouse isn't moving for several seconds (JS option timeToIdle) */\n.pswp__ui--idle .pswp__top-bar {\n  opacity: 0;\n}\n.pswp__ui--idle .pswp__button--arrow--left,\n.pswp__ui--idle .pswp__button--arrow--right {\n  opacity: 0;\n}\n\n/*\n\tpswp__ui--hidden class is added when controls are hidden\n\te.g. when user taps to toggle visibility of controls\n*/\n.pswp__ui--hidden .pswp__top-bar,\n.pswp__ui--hidden .pswp__caption,\n.pswp__ui--hidden .pswp__button--arrow--left,\n.pswp__ui--hidden .pswp__button--arrow--right {\n  /* Force paint & create composition layer for controls. */\n  opacity: 0.001;\n}\n\n/* pswp__ui--one-slide class is added when there is just one item in gallery */\n.pswp__ui--one-slide .pswp__button--arrow--left,\n.pswp__ui--one-slide .pswp__button--arrow--right,\n.pswp__ui--one-slide .pswp__counter {\n  display: none;\n}\n\n.pswp__element--disabled {\n  display: none !important;\n}\n\n.pswp--minimal--dark .pswp__top-bar {\n  background: none;\n}\n\n.gallery-item {\n  /*\n          display: block;\n          float: left;\n      margin-right: 20px;\n  */\n  margin-bottom: 40px;\n  /*\n      .horizontal-image{\n          height: 350px;\n          max-width: 600px;\n      }\n  */\n}\n.gallery-item .vertical-image {\n  height: 350px;\n}\n.gallery-item .small-image {\n  height: 175px;\n}\n.gallery-item .gallery-caption {\n  margin-top: 15px;\n  text-align: center;\n}\n\n/*\n$ct-series-colors: (\n  $info-navbar,\n  $green-navbar,\n  $orange-navbar,\n  $red-navbar,\n  $blue-navbar,\n  rgba($azure-navbar,.8),\n  rgba($green-navbar,.8),\n  rgba($orange-navbar,.8),\n  rgba($red-navbar,.8),\n  rgba($blue-navbar,.8),\n  rgba($azure-navbar,.6),\n  rgba($green-navbar,.6),\n  rgba($orange-navbar,.6),\n  rgba($red-navbar,.6),\n  rgba($blue-navbar,.6)\n\n) !default;\n*/\n.ct-label {\n  fill: rgba(0, 0, 0, 0.4);\n  color: rgba(0, 0, 0, 0.4);\n  font-size: 1em;\n  line-height: 1;\n}\n\n.ct-chart-line .ct-label,\n.ct-chart-bar .ct-label {\n  display: block;\n  display: -webkit-box;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n}\n\n.ct-label.ct-horizontal.ct-start {\n  -webkit-box-align: flex-end;\n  -webkit-align-items: flex-end;\n  -ms-flex-align: flex-end;\n  align-items: flex-end;\n  -webkit-box-pack: flex-start;\n  -webkit-justify-content: flex-start;\n  -ms-flex-pack: flex-start;\n  justify-content: flex-start;\n  text-align: left;\n  text-anchor: start;\n}\n\n.ct-label.ct-horizontal.ct-end {\n  -webkit-box-align: flex-start;\n  -webkit-align-items: flex-start;\n  -ms-flex-align: flex-start;\n  align-items: flex-start;\n  -webkit-box-pack: flex-start;\n  -webkit-justify-content: flex-start;\n  -ms-flex-pack: flex-start;\n  justify-content: flex-start;\n  text-align: left;\n  text-anchor: start;\n}\n\n.ct-label.ct-vertical.ct-start {\n  -webkit-box-align: flex-end;\n  -webkit-align-items: flex-end;\n  -ms-flex-align: flex-end;\n  align-items: flex-end;\n  -webkit-box-pack: flex-end;\n  -webkit-justify-content: flex-end;\n  -ms-flex-pack: flex-end;\n  justify-content: flex-end;\n  text-align: right;\n  text-anchor: end;\n}\n\n.ct-label.ct-vertical.ct-end {\n  -webkit-box-align: flex-end;\n  -webkit-align-items: flex-end;\n  -ms-flex-align: flex-end;\n  align-items: flex-end;\n  -webkit-box-pack: flex-start;\n  -webkit-justify-content: flex-start;\n  -ms-flex-pack: flex-start;\n  justify-content: flex-start;\n  text-align: left;\n  text-anchor: start;\n}\n\n.ct-chart-bar .ct-label.ct-horizontal.ct-start {\n  -webkit-box-align: flex-end;\n  -webkit-align-items: flex-end;\n  -ms-flex-align: flex-end;\n  align-items: flex-end;\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  text-align: center;\n  text-anchor: start;\n}\n\n.ct-chart-bar .ct-label.ct-horizontal.ct-end {\n  -webkit-box-align: flex-start;\n  -webkit-align-items: flex-start;\n  -ms-flex-align: flex-start;\n  align-items: flex-start;\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n  -ms-flex-pack: center;\n  justify-content: center;\n  text-align: center;\n  text-anchor: start;\n}\n\n.ct-chart-bar.ct-horizontal-bars .ct-label.ct-horizontal.ct-start {\n  -webkit-box-align: flex-end;\n  -webkit-align-items: flex-end;\n  -ms-flex-align: flex-end;\n  align-items: flex-end;\n  -webkit-box-pack: flex-start;\n  -webkit-justify-content: flex-start;\n  -ms-flex-pack: flex-start;\n  justify-content: flex-start;\n  text-align: left;\n  text-anchor: start;\n}\n\n.ct-chart-bar.ct-horizontal-bars .ct-label.ct-horizontal.ct-end {\n  -webkit-box-align: flex-start;\n  -webkit-align-items: flex-start;\n  -ms-flex-align: flex-start;\n  align-items: flex-start;\n  -webkit-box-pack: flex-start;\n  -webkit-justify-content: flex-start;\n  -ms-flex-pack: flex-start;\n  justify-content: flex-start;\n  text-align: left;\n  text-anchor: start;\n}\n\n.ct-chart-bar.ct-horizontal-bars .ct-label.ct-vertical.ct-start {\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n  -webkit-box-pack: flex-end;\n  -webkit-justify-content: flex-end;\n  -ms-flex-pack: flex-end;\n  justify-content: flex-end;\n  text-align: right;\n  text-anchor: end;\n}\n\n.ct-chart-bar.ct-horizontal-bars .ct-label.ct-vertical.ct-end {\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n  -webkit-box-pack: flex-start;\n  -webkit-justify-content: flex-start;\n  -ms-flex-pack: flex-start;\n  justify-content: flex-start;\n  text-align: left;\n  text-anchor: end;\n}\n\n.ct-grid {\n  stroke: rgba(0, 0, 0, 0.2);\n  stroke-width: 1px;\n  stroke-dasharray: 2px;\n}\n\n.ct-point {\n  stroke-width: 10px;\n  stroke-linecap: round;\n}\n\n.ct-line {\n  fill: none;\n  stroke-width: 4px;\n}\n\n.ct-area {\n  stroke: none;\n  fill-opacity: 0.1;\n}\n\n.ct-bar {\n  fill: none;\n  stroke-width: 10px;\n}\n\n.ct-slice-donut {\n  fill: none;\n  stroke-width: 60px;\n}\n\n.ct-series-a .ct-point, .ct-series-a .ct-line, .ct-series-a .ct-bar, .ct-series-a .ct-slice-donut {\n  stroke: #68B3C8;\n}\n.ct-series-a .ct-slice-pie, .ct-series-a .ct-area {\n  fill: #68B3C8;\n}\n\n.ct-series-b .ct-point, .ct-series-b .ct-line, .ct-series-b .ct-bar, .ct-series-b .ct-slice-donut {\n  stroke: #7AC29A;\n}\n.ct-series-b .ct-slice-pie, .ct-series-b .ct-area {\n  fill: #7AC29A;\n}\n\n.ct-series-c .ct-point, .ct-series-c .ct-line, .ct-series-c .ct-bar, .ct-series-c .ct-slice-donut {\n  stroke: #F3BB45;\n}\n.ct-series-c .ct-slice-pie, .ct-series-c .ct-area {\n  fill: #F3BB45;\n}\n\n.ct-series-d .ct-point, .ct-series-d .ct-line, .ct-series-d .ct-bar, .ct-series-d .ct-slice-donut {\n  stroke: #EB5E28;\n}\n.ct-series-d .ct-slice-pie, .ct-series-d .ct-area {\n  fill: #EB5E28;\n}\n\n.ct-series-e .ct-point, .ct-series-e .ct-line, .ct-series-e .ct-bar, .ct-series-e .ct-slice-donut {\n  stroke: #7A9E9F;\n}\n.ct-series-e .ct-slice-pie, .ct-series-e .ct-area {\n  fill: #7A9E9F;\n}\n\n.ct-series-f .ct-point, .ct-series-f .ct-line, .ct-series-f .ct-bar, .ct-series-f .ct-slice-donut {\n  stroke: rgba(104, 179, 200, 0.8);\n}\n.ct-series-f .ct-slice-pie, .ct-series-f .ct-area {\n  fill: rgba(104, 179, 200, 0.8);\n}\n\n.ct-series-g .ct-point, .ct-series-g .ct-line, .ct-series-g .ct-bar, .ct-series-g .ct-slice-donut {\n  stroke: rgba(122, 194, 154, 0.8);\n}\n.ct-series-g .ct-slice-pie, .ct-series-g .ct-area {\n  fill: rgba(122, 194, 154, 0.8);\n}\n\n.ct-series-h .ct-point, .ct-series-h .ct-line, .ct-series-h .ct-bar, .ct-series-h .ct-slice-donut {\n  stroke: rgba(243, 187, 69, 0.8);\n}\n.ct-series-h .ct-slice-pie, .ct-series-h .ct-area {\n  fill: rgba(243, 187, 69, 0.8);\n}\n\n.ct-series-i .ct-point, .ct-series-i .ct-line, .ct-series-i .ct-bar, .ct-series-i .ct-slice-donut {\n  stroke: rgba(235, 94, 40, 0.8);\n}\n.ct-series-i .ct-slice-pie, .ct-series-i .ct-area {\n  fill: rgba(235, 94, 40, 0.8);\n}\n\n.ct-series-j .ct-point, .ct-series-j .ct-line, .ct-series-j .ct-bar, .ct-series-j .ct-slice-donut {\n  stroke: rgba(122, 158, 159, 0.8);\n}\n.ct-series-j .ct-slice-pie, .ct-series-j .ct-area {\n  fill: rgba(122, 158, 159, 0.8);\n}\n\n.ct-series-k .ct-point, .ct-series-k .ct-line, .ct-series-k .ct-bar, .ct-series-k .ct-slice-donut {\n  stroke: rgba(104, 179, 200, 0.6);\n}\n.ct-series-k .ct-slice-pie, .ct-series-k .ct-area {\n  fill: rgba(104, 179, 200, 0.6);\n}\n\n.ct-series-l .ct-point, .ct-series-l .ct-line, .ct-series-l .ct-bar, .ct-series-l .ct-slice-donut {\n  stroke: rgba(122, 194, 154, 0.6);\n}\n.ct-series-l .ct-slice-pie, .ct-series-l .ct-area {\n  fill: rgba(122, 194, 154, 0.6);\n}\n\n.ct-series-m .ct-point, .ct-series-m .ct-line, .ct-series-m .ct-bar, .ct-series-m .ct-slice-donut {\n  stroke: rgba(243, 187, 69, 0.6);\n}\n.ct-series-m .ct-slice-pie, .ct-series-m .ct-area {\n  fill: rgba(243, 187, 69, 0.6);\n}\n\n.ct-series-n .ct-point, .ct-series-n .ct-line, .ct-series-n .ct-bar, .ct-series-n .ct-slice-donut {\n  stroke: rgba(235, 94, 40, 0.6);\n}\n.ct-series-n .ct-slice-pie, .ct-series-n .ct-area {\n  fill: rgba(235, 94, 40, 0.6);\n}\n\n.ct-series-o .ct-point, .ct-series-o .ct-line, .ct-series-o .ct-bar, .ct-series-o .ct-slice-donut {\n  stroke: rgba(122, 158, 159, 0.6);\n}\n.ct-series-o .ct-slice-pie, .ct-series-o .ct-area {\n  fill: rgba(122, 158, 159, 0.6);\n}\n\n.ct-square {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.ct-square:before {\n  display: block;\n  float: left;\n  content: \"\";\n  width: 0;\n  height: 0;\n  padding-bottom: 100%;\n}\n.ct-square:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.ct-square > svg {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ct-minor-second {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.ct-minor-second:before {\n  display: block;\n  float: left;\n  content: \"\";\n  width: 0;\n  height: 0;\n  padding-bottom: 93.75%;\n}\n.ct-minor-second:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.ct-minor-second > svg {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ct-major-second {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.ct-major-second:before {\n  display: block;\n  float: left;\n  content: \"\";\n  width: 0;\n  height: 0;\n  padding-bottom: 88.88889%;\n}\n.ct-major-second:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.ct-major-second > svg {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ct-minor-third {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.ct-minor-third:before {\n  display: block;\n  float: left;\n  content: \"\";\n  width: 0;\n  height: 0;\n  padding-bottom: 83.33333%;\n}\n.ct-minor-third:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.ct-minor-third > svg {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ct-major-third {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.ct-major-third:before {\n  display: block;\n  float: left;\n  content: \"\";\n  width: 0;\n  height: 0;\n  padding-bottom: 80%;\n}\n.ct-major-third:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.ct-major-third > svg {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ct-perfect-fourth {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.ct-perfect-fourth:before {\n  display: block;\n  float: left;\n  content: \"\";\n  width: 0;\n  height: 0;\n  padding-bottom: 75%;\n}\n.ct-perfect-fourth:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.ct-perfect-fourth > svg {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ct-perfect-fifth {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.ct-perfect-fifth:before {\n  display: block;\n  float: left;\n  content: \"\";\n  width: 0;\n  height: 0;\n  padding-bottom: 66.66667%;\n}\n.ct-perfect-fifth:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.ct-perfect-fifth > svg {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ct-minor-sixth {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.ct-minor-sixth:before {\n  display: block;\n  float: left;\n  content: \"\";\n  width: 0;\n  height: 0;\n  padding-bottom: 62.5%;\n}\n.ct-minor-sixth:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.ct-minor-sixth > svg {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ct-golden-section {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.ct-golden-section:before {\n  display: block;\n  float: left;\n  content: \"\";\n  width: 0;\n  height: 0;\n  padding-bottom: 61.8047%;\n}\n.ct-golden-section:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.ct-golden-section > svg {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ct-major-sixth {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.ct-major-sixth:before {\n  display: block;\n  float: left;\n  content: \"\";\n  width: 0;\n  height: 0;\n  padding-bottom: 60%;\n}\n.ct-major-sixth:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.ct-major-sixth > svg {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ct-minor-seventh {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.ct-minor-seventh:before {\n  display: block;\n  float: left;\n  content: \"\";\n  width: 0;\n  height: 0;\n  padding-bottom: 56.25%;\n}\n.ct-minor-seventh:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.ct-minor-seventh > svg {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ct-major-seventh {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.ct-major-seventh:before {\n  display: block;\n  float: left;\n  content: \"\";\n  width: 0;\n  height: 0;\n  padding-bottom: 53.33333%;\n}\n.ct-major-seventh:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.ct-major-seventh > svg {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ct-octave {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.ct-octave:before {\n  display: block;\n  float: left;\n  content: \"\";\n  width: 0;\n  height: 0;\n  padding-bottom: 50%;\n}\n.ct-octave:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.ct-octave > svg {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ct-major-tenth {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.ct-major-tenth:before {\n  display: block;\n  float: left;\n  content: \"\";\n  width: 0;\n  height: 0;\n  padding-bottom: 40%;\n}\n.ct-major-tenth:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.ct-major-tenth > svg {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ct-major-eleventh {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.ct-major-eleventh:before {\n  display: block;\n  float: left;\n  content: \"\";\n  width: 0;\n  height: 0;\n  padding-bottom: 37.5%;\n}\n.ct-major-eleventh:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.ct-major-eleventh > svg {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ct-major-twelfth {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.ct-major-twelfth:before {\n  display: block;\n  float: left;\n  content: \"\";\n  width: 0;\n  height: 0;\n  padding-bottom: 33.33333%;\n}\n.ct-major-twelfth:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.ct-major-twelfth > svg {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ct-double-octave {\n  display: block;\n  position: relative;\n  width: 100%;\n}\n.ct-double-octave:before {\n  display: block;\n  float: left;\n  content: \"\";\n  width: 0;\n  height: 0;\n  padding-bottom: 25%;\n}\n.ct-double-octave:after {\n  content: \"\";\n  display: table;\n  clear: both;\n}\n.ct-double-octave > svg {\n  display: block;\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.ct-blue {\n  stroke: #7A9E9F !important;\n}\n\n.ct-azure {\n  stroke: #68B3C8 !important;\n}\n\n.ct-green {\n  stroke: #7AC29A !important;\n}\n\n.ct-orange {\n  stroke: #F3BB45 !important;\n}\n\n.ct-red {\n  stroke: #EB5E28 !important;\n}\n\n.card {\n  border-radius: 8px;\n  box-shadow: 0 2px 2px rgba(204, 197, 185, 0.5);\n  background-color: #FFFFFF;\n  color: #252422;\n  margin-bottom: 20px;\n  position: relative;\n  z-index: 1;\n}\n.card .title,\n.card .stats,\n.card .category,\n.card .description,\n.card .social-line,\n.card .actions,\n.card .content,\n.card .card-footer,\n.card small,\n.card a {\n  position: relative;\n  z-index: 3;\n}\n.card a {\n  color: #444444;\n}\n.card a:hover, .card a:focus {\n  color: #333333;\n}\n.card img {\n  max-width: 100%;\n  height: auto;\n}\n.card[data-radius=\"none\"] {\n  border-radius: 0px;\n}\n.card[data-radius=\"none\"] .header {\n  border-radius: 0px 0px 0 0;\n}\n.card[data-radius=\"none\"] .header img {\n  border-radius: 0px 0px 0 0;\n}\n.card.card-plain {\n  background-color: transparent;\n  box-shadow: none;\n  border-radius: 0;\n}\n.card.card-with-shadow {\n  box-shadow: 0 20px 16px -15px rgba(165, 165, 165, 0.57);\n}\n.card .btn {\n  text-shadow: none;\n  font-weight: bold;\n}\n.card .title-uppercase {\n  text-transform: uppercase;\n}\n.card .header {\n  position: relative;\n  border-radius: 3px 3px 0 0;\n  z-index: 3;\n}\n.card .header.header-with-icon {\n  height: 150px;\n}\n.card .header img {\n  width: 100%;\n  /*\n              @include opacity(0);\n              display: none;\n  */\n}\n.card .header .category {\n  padding: 15px;\n}\n.card .content .price {\n  border: 2px solid rgba(255, 255, 255, 0.7);\n  color: white;\n  border-radius: 50%;\n  width: 152px;\n  height: 152px;\n  margin: 30px auto;\n  text-align: center;\n  vertical-align: middle;\n  line-height: 200px;\n}\n.card .content .price h4 {\n  margin: 5px 0 0;\n  font-size: 36px;\n}\n.card .content .price h6 {\n  margin-top: 45px;\n  font-size: 16px;\n}\n.card .content .price .currency {\n  font-size: 22px;\n  font-weight: normal;\n}\n.card .actions {\n  padding: 10px 15px;\n}\n.card .more {\n  float: right;\n  z-index: 4;\n  display: block;\n  padding-top: 10px;\n  padding-right: 10px;\n  position: relative;\n}\n.card .filter,\n.card .header .actions {\n  position: absolute;\n  z-index: 2;\n  background-color: rgba(0, 0, 0, 0.76);\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  text-align: center;\n  opacity: 0;\n}\n.card .header .actions {\n  background-color: transparent;\n  z-index: 3;\n}\n.card .header .actions .btn {\n  position: relative;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n  -ms-transform: translateY(-50%);\n  transform: translateY(-50%);\n}\n.card:hover .filter {\n  opacity: 0.7;\n}\n.card:hover .header .social-line,\n.card:hover .header .actions {\n  opacity: 1;\n}\n.card .category,\n.card .label {\n  font-size: 14px;\n  margin-bottom: 0px;\n}\n.card .category i,\n.card .label i {\n  font-size: 16px;\n}\n.card .category {\n  color: #ccc5b9;\n}\n.card .label {\n  text-shadow: none;\n}\n.card .title {\n  color: #252422;\n}\n.card > .title {\n  margin: 0;\n  padding: 30px 0 0;\n}\n.card .content {\n  padding: 20px 20px 10px 20px;\n}\n.card .content .title {\n  margin: 10px 0 20px 0;\n}\n.card .content .category ~ .title {\n  margin-top: 10px;\n}\n.card .content .description ~ .title {\n  margin-top: -10px;\n}\n.card .description {\n  font-size: 16px;\n  color: #66615b;\n}\n.card h6 {\n  font-size: 14px;\n  margin: 0;\n}\n.card .card-footer {\n  padding: 0 15px 20px;\n}\n.card .card-footer .social-line .btn:first-child {\n  border-radius: 0 0 0 6px;\n}\n.card .card-footer .social-line .btn:last-child {\n  border-radius: 0 0 6px 0;\n}\n.card.card-separator:after {\n  height: 100%;\n  right: -15px;\n  top: 0;\n  width: 1px;\n  background-color: #DDDDDD;\n  content: \"\";\n  position: absolute;\n}\n.card .icon {\n  display: block;\n  margin: 0 auto;\n  top: 60%;\n  position: relative;\n  transform: translateY(-50%);\n  -webkit-transform: translateY(-50%);\n  text-align: center;\n}\n.card .icon i {\n  font-size: 60px;\n  padding: 18px;\n  width: 110px;\n  border: 2px solid #ccc5b9;\n  border-radius: 50%;\n  height: 110px;\n}\n.col-lg-4 .card .icon i {\n  font-size: 80px;\n  padding: 22px;\n}\n.card.card-with-border .content {\n  padding: 15px 15px 25px 15px;\n}\n.card.card-with-border .card-footer {\n  padding-bottom: 25px;\n}\n.card.card-with-border:after {\n  position: absolute;\n  display: block;\n  width: calc(100% - 10px);\n  height: calc(100% - 10px);\n  content: \"\";\n  top: 5px;\n  left: 5px;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  z-index: 1;\n  border-radius: 5px;\n}\n.card.card-just-text .content {\n  padding: 50px 65px;\n  text-align: center;\n}\n.card[data-background=\"image\"] .image, .card[data-background=\"color\"] .image {\n  border-radius: 6px;\n}\n.card[data-background=\"image\"] .title, .card[data-background=\"color\"] .title {\n  font-weight: bold;\n}\n.card[data-background=\"image\"] .filter, .card[data-background=\"color\"] .filter {\n  border-radius: 6px;\n}\n.card[data-background=\"image\"] .title,\n.card[data-background=\"image\"] .stats,\n.card[data-background=\"image\"] .category,\n.card[data-background=\"image\"] .description,\n.card[data-background=\"image\"] .content,\n.card[data-background=\"image\"] .card-footer,\n.card[data-background=\"image\"] small,\n.card[data-background=\"image\"] .content a, .card[data-background=\"color\"] .title,\n.card[data-background=\"color\"] .stats,\n.card[data-background=\"color\"] .category,\n.card[data-background=\"color\"] .description,\n.card[data-background=\"color\"] .content,\n.card[data-background=\"color\"] .card-footer,\n.card[data-background=\"color\"] small,\n.card[data-background=\"color\"] .content a {\n  color: #FFFFFF;\n}\n.card[data-background=\"image\"] .content a:hover,\n.card[data-background=\"image\"] .content a:focus, .card[data-background=\"color\"] .content a:hover,\n.card[data-background=\"color\"] .content a:focus {\n  color: #FFFFFF;\n}\n.card[data-background=\"image\"] .icon i, .card[data-background=\"color\"] .icon i {\n  color: #FFFFFF;\n  border: 2px solid rgba(255, 255, 255, 0.6);\n}\n.card[data-background=\"image\"].card-with-border:after, .card[data-background=\"color\"].card-with-border:after {\n  border: 1px solid rgba(255, 255, 255, 0.45);\n}\n.card[data-background=\"image\"] {\n  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);\n}\n.card[data-background=\"image\"] .filter {\n  opacity: 0.55;\n}\n.card[data-background=\"image\"]:hover .filter {\n  opacity: 0.75;\n}\n.card[data-color=\"blue\"] {\n  background: #b8d8d8;\n}\n.card[data-color=\"blue\"] .category {\n  color: #7a9e9f;\n}\n.card[data-color=\"blue\"] .description {\n  color: #506568;\n}\n.card[data-color=\"blue\"] .icon i {\n  color: #506568;\n  border: 2px solid #7a9e9f;\n}\n.card[data-color=\"green\"] {\n  background: #d5e5a3;\n}\n.card[data-color=\"green\"] .category {\n  color: #92ac56;\n}\n.card[data-color=\"green\"] .description {\n  color: #60773d;\n}\n.card[data-color=\"green\"] .icon i {\n  color: #60773d;\n  border: 2px solid #92ac56;\n}\n.card[data-color=\"yellow\"] {\n  background: #ffe28c;\n}\n.card[data-color=\"yellow\"] .category {\n  color: #d88715;\n}\n.card[data-color=\"yellow\"] .description {\n  color: #b25825;\n}\n.card[data-color=\"yellow\"] .icon i {\n  color: #b25825;\n  border: 2px solid #d88715;\n}\n.card[data-color=\"brown\"] {\n  background: #d6c1ab;\n}\n.card[data-color=\"brown\"] .category {\n  color: #a47e65;\n}\n.card[data-color=\"brown\"] .description {\n  color: #75442e;\n}\n.card[data-color=\"brown\"] .icon i {\n  color: #75442e;\n  border: 2px solid #a47e65;\n}\n.card[data-color=\"purple\"] {\n  background: #baa9ba;\n}\n.card[data-color=\"purple\"] .category {\n  color: #5a283d;\n}\n.card[data-color=\"purple\"] .description {\n  color: #3a283d;\n}\n.card[data-color=\"purple\"] .icon i {\n  color: #3a283d;\n  border: 2px solid #5a283d;\n}\n.card[data-color=\"orange\"] {\n  background: #ff8f5e;\n}\n.card[data-color=\"orange\"] .category {\n  color: #e95e37;\n}\n.card[data-color=\"orange\"] .description {\n  color: #772510;\n}\n.card[data-color=\"orange\"] .icon i {\n  color: #772510;\n  border: 2px solid #e95e37;\n}\n\n.btn-center {\n  text-align: center;\n}\n\n.card-big-shadow {\n  max-width: 320px;\n  position: relative;\n}\n.card-big-shadow:before {\n  background-image: url(\"http://static.tumblr.com/i21wc39/coTmrkw40/shadow.png\");\n  background-position: center bottom;\n  background-repeat: no-repeat;\n  background-size: 100% 100%;\n  bottom: -12%;\n  content: \"\";\n  display: block;\n  left: -12%;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: 0;\n}\n\n.card-image.card-big-shadow {\n  max-width: 100%;\n}\n.card-image .card {\n  background-size: cover;\n  min-height: 430px;\n  width: 100%;\n}\n\n.card-hover-effect {\n  cursor: pointer;\n  -webkit-transition: transform 300ms cubic-bezier(0.34, 2, 0.6, 1), box-shadow 200ms ease;\n  -moz-transition: transform 300ms cubic-bezier(0.34, 2, 0.6, 1), box-shadow 200ms ease;\n  -o-transition: transform 300ms cubic-bezier(0.34, 2, 0.6, 1), box-shadow 200ms ease;\n  -ms-transition: transform 300ms cubic-bezier(0.34, 2, 0.6, 1), box-shadow 200ms ease;\n  transition: transform 300ms cubic-bezier(0.34, 2, 0.6, 1), box-shadow 200ms ease;\n}\n.card-hover-effect:hover {\n  box-shadow: 0px 12px 17px -7px rgba(0, 0, 0, 0.3);\n  transform: translateY(-10px);\n  -webkit-transform: translateY(-10px);\n  -ms-transform: translateY(-10px);\n  -moz-transform: translateY(-10px);\n}\n\n.card-user .image {\n  border-radius: 8px 8px 0 0;\n  height: 150px;\n  position: relative;\n  overflow: hidden;\n}\n.card-user .image img {\n  width: 100%;\n  height: 150px;\n}\n.card-user .image-plain {\n  height: 0;\n  margin-top: 110px;\n}\n.card-user .author {\n  text-align: center;\n  text-transform: none;\n  margin-top: -65px;\n}\n.card-user .author .title {\n  color: #403D39;\n}\n.card-user .author .title small {\n  color: #ccc5b9;\n}\n.card-user .avatar {\n  width: 100px;\n  height: 100px;\n  border-radius: 50%;\n  position: relative;\n  margin-bottom: 15px;\n}\n.card-user .avatar.border-white {\n  border: 5px solid #FFFFFF;\n}\n.card-user .avatar.border-gray {\n  border: 5px solid #ccc5b9;\n}\n.card-user .title {\n  line-height: 24px;\n}\n.card-user .content {\n  min-height: 240px;\n}\n.card-user.card-plain .avatar {\n  height: 190px;\n  width: 190px;\n}\n\n.card-image .details {\n  margin-left: 4px;\n  min-height: 50px;\n  padding: 0 4px 0.5em;\n  position: relative;\n}\n.card-image .details .author {\n  margin-top: -21px;\n}\n.card-image .details .author .name {\n  color: #66615b;\n  font-size: 1.1em;\n  font-weight: bold;\n  line-height: 1.15;\n  max-width: 11em;\n  overflow: hidden;\n  padding-top: 3px;\n  text-overflow: ellipsis;\n}\n.card-image .details .author .name:hover, .card-image .details .author .name:active, .card-image .details .author .name:focus {\n  color: #403D39;\n}\n.card-image .details .author img {\n  height: 40px;\n  width: 40px;\n  margin-bottom: 5px;\n}\n.card-image .details .meta {\n  color: #ccc5b9;\n  font-size: 0.8em;\n}\n.card-image .details .actions {\n  float: right;\n  font-size: 0.875em;\n  line-height: 2.6;\n  position: absolute;\n  right: 4px;\n  top: 36px;\n  z-index: 1;\n}\n.card-image .details .actions .btn.btn-simple {\n  padding-left: 2px;\n}\n.card-image .details-center {\n  text-align: center;\n}\n.card-image .details-center .author {\n  position: relative;\n  display: inline-block;\n  text-align: left;\n  margin: 20px auto 0;\n}\n.card-image .details-center .author img {\n  position: absolute;\n  left: 0;\n  top: 0;\n}\n.card-image .details-center .author .text {\n  padding-left: 50px;\n}\n\n.card-product .details .name {\n  margin-top: 20px;\n}\n.card-product .details .description {\n  display: inline-block;\n  margin-right: 60px;\n}\n.card-product .details .actions {\n  top: 20px;\n}\n.card-product .details .actions h5 {\n  color: #403D39;\n}\n\n.btn-file {\n  position: relative;\n  overflow: hidden;\n  vertical-align: middle;\n}\n\n.btn-file > input {\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  font-size: 23px;\n  cursor: pointer;\n  filter: alpha(opacity=0);\n  opacity: 0;\n  direction: ltr;\n}\n\n.fileinput {\n  display: inline-block;\n  margin-bottom: 9px;\n}\n\n.fileinput .form-control {\n  display: inline-block;\n  padding-top: 7px;\n  padding-bottom: 5px;\n  margin-bottom: 0;\n  vertical-align: middle;\n  cursor: text;\n}\n\n.fileinput .thumbnail {\n  display: inline-block;\n  margin-bottom: 10px;\n  overflow: hidden;\n  text-align: center;\n  vertical-align: middle;\n}\n.fileinput .thumbnail.img-circle {\n  border-radius: 50%;\n}\n\n.fileinput .thumbnail > img {\n  max-height: 100%;\n  width: 100%;\n}\n\n.fileinput .btn {\n  vertical-align: middle;\n}\n\n.fileinput-exists .fileinput-new,\n.fileinput-new .fileinput-exists {\n  display: none;\n}\n\n.fileinput-inline .fileinput-controls {\n  display: inline;\n}\n\n.fileinput-filename {\n  display: inline-block;\n  overflow: hidden;\n  vertical-align: middle;\n}\n\n.form-control .fileinput-filename {\n  vertical-align: bottom;\n}\n\n.fileinput.input-group {\n  display: table;\n}\n\n.fileinput.input-group > * {\n  position: relative;\n  z-index: 2;\n}\n\n.fileinput.input-group > .btn-file {\n  z-index: 1;\n}\n\n.fileinput-new.input-group .btn-file,\n.fileinput-new .input-group .btn-file {\n  border-radius: 0 4px 4px 0;\n}\n\n.fileinput-new.input-group .btn-file.btn-xs,\n.fileinput-new .input-group .btn-file.btn-xs,\n.fileinput-new.input-group .btn-file.btn-sm,\n.fileinput-new .input-group .btn-file.btn-sm {\n  border-radius: 0 3px 3px 0;\n}\n\n.fileinput-new.input-group .btn-file.btn-lg,\n.fileinput-new .input-group .btn-file.btn-lg {\n  border-radius: 0 6px 6px 0;\n}\n\n.form-group.has-warning .fileinput .fileinput-preview {\n  color: #8a6d3b;\n}\n\n.form-group.has-warning .fileinput .thumbnail {\n  border-color: #faebcc;\n}\n\n.form-group.has-error .fileinput .fileinput-preview {\n  color: #a94442;\n}\n\n.form-group.has-error .fileinput .thumbnail {\n  border-color: #ebccd1;\n}\n\n.form-group.has-success .fileinput .fileinput-preview {\n  color: #3c763d;\n}\n\n.form-group.has-success .fileinput .thumbnail {\n  border-color: #d6e9c6;\n}\n\n.input-group-addon:not(:first-child) {\n  border-left: 0;\n}\n\n.thumbnail {\n  border: 0 none;\n}\n"; });
define('text!gradebook/addStudent.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"col-md-6\">\n    <h3>${ title }</h3>\n    <form submit.delegate=\"submit()\" class=\"form-horizontal\" validation-renderer=\"bootstrap-form\">\n\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">First Name:</label>\n        <div class=\"col-md-6\">\n          <input type=\"text\" class=\"form-control\" value.bind=\"newStudent.first_name & validate\" focus.bind=\"formStart\">\n        </div>\n      </div>\n\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">Last Name:</label>\n        <div class=\"col-md-6\">\n          <input type=\"text\" class=\"form-control\" value.bind=\"newStudent.last_name & validate\">\n        </div>\n      </div>\n\n      <div class=\"form-group\">\n        <div class=\"col-md-offset-4 col-md-6 text-center\">\n          <button type=\"submit\" class=\"btn btn-primary\">\n            ${ bttn }\n          </button>\n          <button click.delegate=\"reset()\" class=\"btn btn-danger\">\n            Cancel\n          </button>\n        </div>\n      </div>\n\n    </form>\n  </div>\n\n  <div class=\"col-md-6\">\n    <h3>Saved</h3>\n    <table class=\"table table-hover\">\n      <thead>\n      <tr>\n        <th>Name\n          <small>(Total: ${ students.objects.length })</small>\n        </th>\n        <th></th>\n      </tr>\n      </thead>\n      <tr repeat.for=\"student of students.objects\">\n        <td>${ student.fullName & oneTime}</td>\n        <td>\n          <div class=\"btn-group btn-group-xs\" role=\"group\">\n            <button type=\"button\" class=\"btn btn-default ${ newStudent.id === student.id ? 'active' : '' }\"\n                    click.delegate=\"edit(student)\">\n              <i class=\"fa fa-pencil\"></i> Edit\n            </button>\n            <button type=\"button\" class=\"btn btn-default\"\n                    click.delegate=\"delete(student)\">\n              <i class=\"fa fa-eraser\"></i> Delete\n            </button>\n          </div>\n        </td>\n      </tr>\n    </table>\n  </div>\n</template>\n"; });
define('text!assets/css/demo.css', ['module'], function(module) { module.exports = ".tim-row{\n    margin-bottom: 20px;\n}\n\n.tim-white-buttons {\n    background-color: #777777;\n}\n.tim-title{\n    margin-top: 30px;\n    margin-bottom: 25px;\n    min-height: 32px;\n}\n.tim-title.text-center{\n    margin-bottom: 50px;\n}\n.tim-typo{\n    padding-left: 25%;\n    margin-bottom: 40px;\n    position: relative;\n}\n.tim-typo .tim-note{\n    bottom: 10px;\n    color: #c0c1c2;\n    display: block;\n    font-weight: 400;\n    font-size: 13px;\n    line-height: 13px;\n    left: 0;\n    margin-left: 20px;\n    position: absolute;\n    width: 260px;\n}\n.tim-row{\n    padding-top: 50px;\n}\n.tim-row h3{\n    margin-top: 0;\n}\n.switch{\n    margin-right: 20px;\n}\n#navbar-full .navbar{\n    border-radius: 0 !important;\n    margin-bottom: 0;\n    z-index: 2;\n}\n.space-300{\n    height: 300px;\n    display: block;\n}\n.space{\n    height: 130px;\n    display: block;\n}\n.space-110{\n    height: 110px;\n    display: block;\n}\n.space-50{\n    height: 50px;\n    display: block;\n}\n.space-70{\n    height: 70px;\n    display: block;\n}\n.navigation-example .img-src{\n    background-attachment: scroll;\n}\n\n.main{\n    background-color: #fff;\n/*     position: relative; */\n\n}\n.navigation-example{\n    background-image: url('../paper_img/red.jpg');\n    background-position: center center;\n    background-size: cover;\n    background-attachment: fixed;\n    margin-top:0;\n}\n#notifications{\n    background-color: #FFFFFF;\n    display: block;\n    width: 100%;\n    position: relative;\n}\n.tim-note{\n    text-transform: capitalize;\n}\n.subscribe-form{\n    padding-top: 20px;\n}\n.subscribe-form .form-control{\n\n}\n\n.space-100{\n    height: 100px;\n    display: block;\n    width: 100%;\n}\n\n.be-social{\n    padding-bottom: 20px;\n/*     border-bottom: 1px solid #aaa; */\n    margin: 0 auto 40px;\n}\n.txt-white{\n    color: #FFFFFF;\n}\n.txt-gray{\n    color: #ddd !important;\n}\n.footer-demo{\n    background-attachment: fixed;\n    position: relative;\n    line-height: 20px;\n}\n.footer-demo nav > ul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  font-weight: normal;\n}\n.footer-demo nav > ul > li{\n    display: inline-block;\n    padding: 10px 15px;\n    margin: 15px 3px;\n    line-height: 20px;\n    text-align: center;\n}\n.footer-demo nav > ul > li:first-child{\n    margin: 0;\n    padding: 0;\n}\n.footer-demo nav > ul a:not(.btn) {\n  color: #777777;\n  display: block;\n  margin-bottom: 3px;\n}\n.footer-demo nav > ul a:not(.btn):hover, .footer nav > ul a:not(.btn):focus {\n  color: #E3E3E3;\n}\n.footer-demo .copyright {\n  color: #777777;\n  padding: 10px 15px;\n  font-size: 14px;\n  margin: 15px 3px;\n  line-height: 20px;\n  text-align: center;\n}\n.footer-demo .heart{\n    color: #EB5E28;\n}\n\n.social-share{\n    float: left;\n    margin-right: 8px;\n}\n.social-share a{\n    color: #FFFFFF;\n}\n#subscribe_email{\n    border-radius: 0;\n    border-left: 0;\n    border-right: 0;\n}\n.pick-class-label{\n    border-radius: 8px;\n    border: 1px solid #CCC5B9;\n    color: #ffffff;\n    cursor: pointer;\n    display: inline-block;\n    font-size: 75%;\n    font-weight: bold;\n    line-height: 1;\n    margin-right: 10px;\n    padding: 23px;\n    text-align: center;\n    vertical-align: baseline;\n    white-space: nowrap;\n}\n\n.parallax{\n  width:100%;\n  height:570px;\n\n  display: block;\n  background-attachment: fixed;\n    background-repeat:no-repeat;\n    background-size:cover;\n    background-position: center center;\n\n}\n\n.logo-container .logo{\n    overflow: hidden;\n    border-radius: 50%;\n    border: 1px solid #333333;\n    width: 50px;\n    float: left;\n}\n\n.logo-container .brand{\n    font-size: 18px;\n    color: #FFFFFF;\n    line-height: 20px;\n    float: left;\n    margin-left: 10px;\n    margin-top: 5px;\n    width: 50px;\n    height: 50px;\n}\n.logo-container{\n    margin-top: 10px;\n}\n.logo-container .logo img{\n    width: 100%;\n}\n.navbar-small .logo-container .brand{\n    color: #333333;\n}\n.demo-header{\n    background-size: cover;\n    background-color: #FF8F5E;\n    background-position: center top;\n    margin-top: -100px;\n    min-height: 600px;\n}\n.demo-header-image{\n    background-image: url('../paper_img/city.jpg');\n}\n.demo-header .motto{\n    color: #FFFFFF;\n    padding-top: 25vh;\n    text-align: center;\n    z-index: 3;\n}\n.demo-header .motto h3{\n    margin-bottom: 0;\n}\n.separator{\n    content: \"Separator\";\n    background-color: #f4f3ef;\n    display: block;\n    width: 100%;\n    padding: 20px;\n}\n.separator-line{\n    background-color: #EEE;\n    height: 1px;\n    width: 100%;\n    display: block;\n}\n.separator.separator-gray{\n    background-color: #EEEEEE;\n}\n.social-buttons-demo .btn{\n    margin-right: 5px;\n    margin-bottom: 7px;\n}\n\n.img-container{\n    width: 100%;\n    overflow: hidden;\n}\n.img-container img{\n    width: 100%;\n}\n.lightbox img{\n    width: 100%;\n}\n.lightbox .modal-content{\n    overflow: hidden;\n}\n.lightbox .modal-body{\n    padding: 0;\n}\n@media screen and (min-width: 991px){\n    .lightbox .modal-dialog{\n        width: 960px;\n    }\n}\n\n@media (max-width: 768px){\n    .btn, .btn-morphing{\n        margin-bottom: 10px;\n    }\n    .parallax .motto{\n        top: 170px;\n        margin-top: 0;\n        font-size: 60px;\n        width: 270px;\n    }\n}\n\n.presentation .loader{\n    opacity: 0;\n    display: block;\n    transition: all 0.4s;\n    -webkit-transition: all 0.4s;\n    position: fixed;\n    left: 50%;\n    top: 50%;\n    z-index: 1031;\n    margin-left: -32px;\n    margin-top: -32px;\n}\n.presentation  .loader.visible{\n    display: block;\n    opacity: 1;\n}\n.presentation  .modal-content{\n    background-color: transparent;\n    box-shadow: 0 0 0;\n}\n.presentation .modal-backdrop.in{\n    opacity: 0.45;\n}\n.presentation .preload-image{\n    display: none;\n    box-shadow: 0 0 15px rgba(0, 0, 0, 0.15), 0 0 1px 1px rgba(0, 0, 0, 0.1);\n}\n/*       Loading dots  */\n\n/*      transitions */\n.presentation .front, .presentation .front:after, .presentation .front .btn, .logo-container .logo, .logo-container .brand{\n     -webkit-transition: all .2s;\n    -moz-transition: all .2s;\n    -o-transition: all .2s;\n    transition: all .2s;\n}\n.presentation{\n\n}\n.presentation .section{\n    padding: 100px 0;\n}\n.presentation .colors{\n    padding: 100px 0;\n}\n.presentation > .description{\n    padding-top: 20px;\n}\n.presentation .section-rotation{\n    padding: 140px 0;\n}\n.presentation .section-images{\n    padding: 80px 0;\n}\n.presentation .section-thin{\n    padding: 0;\n}\n.presentation .section-pay{\n    padding-top: 20px;\n}\n.presentation .colors{\n    padding: 70px 0;\n    z-index: 7;\n    position: relative;\n    margin-top: -300px;\n}\n.presentation .colors{\n    border-top: 1px solid #DDDDDD;\n}\n.presentation .card-container{\n     -webkit-perspective: 800px;\n    -moz-perspective: 800px;\n    -o-perspective: 800px;\n    perspective: 800px;\n    min-height: 500px;\n    width: 300px;\n    position: relative;\n    margin-top: 90px;\n}\n.presentation .card-component{\n    -webkit-transform-style: preserve-3d;\n   -moz-transform-style: preserve-3d;\n     -o-transform-style: preserve-3d;\n        transform-style: preserve-3d;\n\tposition: relative;\n\theight: 600px;\n}\n.presentation .card-component .front{\n    -webkit-backface-visibility: hidden;\n    -moz-backface-visibility: hidden;\n    -o-backface-visibility: hidden;\n    backface-visibility: hidden;\n    -webkit-transform: rotateY( -28deg );\n    -moz-transform: rotateY( -28deg );\n    -o-transform: rotateY( -28deg );\n    transform: rotateY( -28deg );\n\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\tbackground-color: #FFF;\n    width: 100%;\n    cursor: pointer;\n    box-shadow: 10px 4px 14px rgba(0, 0, 0, 0.12);\n    border-radius: 10px;\n    overflow: hidden;\n    border: 1px solid rgba(0,0,0,.12);\n}\n\n.presentation .front img{\n    z-index: 2;\n    position: relative;\n}\n\n.presentation .card-container:hover .front{\n    top: -10px;\n}\n\n.presentation .card-component img{\n    width: 100%;\n}\n.presentation .description .col-md-3{\n    width: 16%;\n    margin-left: 4%;\n}\n.presentation .first-card{\n    z-index: 6;\n}\n.presentation .second-card{\n    z-index: 5;\n}\n.presentation .third-card{\n    z-index: 4;\n}\n.presentation .fourth-card{\n    z-index: 3;\n}\n.presentation h1,\n.presentation h2{\n    font-weight: 200;\n}\n.presentation h4,\n.presentation h5,\n.presentation h6{\n    font-weight: 300;\n}\n.presentation h4{\n    font-size: 18px;\n    line-height: 24px;\n}\n.presentation .info h4{\n    font-size: 24px;\n    line-height: 28px;\n}\n\n.presentation .section-gray h1 small{\n    color: #888888;\n}\n.presentation .color-container{\n    text-align: center;\n}\n.presentation .color-container img{\n    width: 100%;\n    margin-bottom: 10px;\n}\n.presentation .circle-color{\n    width: 40px;\n    height: 40px;\n    border-radius: 10px;\n    display: block;\n    background-color: #cccccc;\n    margin: 0 auto;\n}\n.presentation .circle-red{\n    background-color: #ff3b30;\n}\n.presentation .circle-blue{\n    background-color: #3472f7;\n}\n.presentation .circle-azure{\n    background-color: #2ca8ff;\n}\n.presentation .circle-green{\n    background-color: #05ae0e;\n}\n.presentation .circle-orange{\n    background-color: #ff9500;\n}\n\n.presentation .section-gray-gradient{\n    background: rgb(255,255,255); /* Old browsers */\n    background: -moz-linear-gradient(top,  rgba(255,255,255,1) 25%, rgba(231,231,231,1) 100%); /* FF3.6+ */\n    background: -webkit-gradient(linear, left top, left bottom, color-stop(25%,rgba(255,255,255,1)), color-stop(100%,rgba(231,231,231,1))); /* Chrome,Safari4+ */\n    background: -webkit-linear-gradient(top,  rgba(255,255,255,1) 25%,rgba(231,231,231,1) 100%); /* Chrome10+,Safari5.1+ */\n    background: -o-linear-gradient(top,  rgba(255,255,255,1) 25%,rgba(231,231,231,1) 100%); /* Opera 11.10+ */\n    background: -ms-linear-gradient(top,  rgba(255,255,255,1) 25%,rgba(231,231,231,1) 100%); /* IE10+ */\n    background: linear-gradient(to bottom,  rgba(255,255,255,1) 25%,rgba(231,231,231,1) 100%); /* W3C */\n    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#e7e7e7',GradientType=0 ); /* IE6-9 */\n}\n.presentation .section-black{\n    background-color: #333;\n}\n\n.rotating-card-container {\n    -webkit-perspective: 900px;\n   -moz-perspective: 900px;\n     -o-perspective: 900px;\n        perspective: 900px;\n        margin-bottom: 30px;\n}\n\n.rotating-card {\n   -webkit-transition: all 1.3s;\n   -moz-transition: all 1.3s;\n     -o-transition: all 1.3s;\n        transition: all 1.3s;\n-webkit-transform-style: preserve-3d;\n   -moz-transform-style: preserve-3d;\n     -o-transform-style: preserve-3d;\n        transform-style: preserve-3d;\n\n    margin-top: 20px;\n  position: relative;\n   background: none repeat scroll 0 0 #FFFFFF;\n    border-radius: 20px;\n    color: #444444;\n}\n.rotating-card-container .rotate,\n.rotating-card .back{\n    -webkit-transform: rotateY( 180deg );\n    -moz-transform: rotateY( 180deg );\n    -o-transform: rotateY( 180deg );\n    transform: rotateY( 180deg );\n}\n.rotating-card-container:hover .rotate{\n    -webkit-transform: rotateY(0deg);\n    -moz-transform: rotateY(0deg);\n    -o-transform: rotateY(0deg);\n    transform: rotateY(0deg);\n}\n\n\n.rotating-card .front,\n.rotating-card .back {\n    -webkit-backface-visibility: hidden;\n    -moz-backface-visibility: hidden;\n    -o-backface-visibility: hidden;\n    backface-visibility: hidden;\n\n    position: absolute;\n    top: 0;\n    left: 0;\n    background-color: #FFF;\n    box-shadow: 0 3px 17px rgba(0,0,0,.15);\n}\n\n.rotating-card .front {\n    z-index: 2;\n}\n\n.rotating-card .back {\n    z-index: 3;\n    height: 500px;\n    width: 100%;\n    display: block;\n    padding: 0 15px;\n    background-color: #e5e5e5;\n}\n\n.rotating-card .back-contaier {\n  background-color: white;\n  padding: 30px 15px;\n\n}\n\n.rotating-card .image{\n    border-radius: 20px 20px 0 0;\n}\n.rotating-card-container,\n.rotating-card .front,\n.rotating-card .back {\n  width: 100%;\n  min-height: 500px;\n  border-radius: 20px;\n}\n/*       Fix bug for IE      */\n\n@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {\n    .rotating-card .front, .rotating-card .back{\n        -ms-backface-visibility: visible;\n        backface-visibility: visible;\n    }\n    .rotating-car .back {\n        visibility: hidden;\n        -ms-transition: all 0.2s cubic-bezier(.92,.01,.83,.67);\n    }\n    .rotating-card .front{\n        z-index: 4;\n    }\n    .rotating-card-container:hover .back{\n        z-index: 5;\n        visibility: visible;\n    }\n}\n\n.fixed-section{\n    margin-top: 90px;\n}\n.fixed-section ul li{\n    list-style: none;\n}\n.fixed-section li a{\n    font-size: 14px;\n    padding: 2px;\n    display: block;\n    color: #666666;\n}\n.fixed-section li a.active{\n    color: #00bbff;\n}\n.fixed-section.float{\n    position: fixed;\n    top: 100px;\n    width: 200px;\n    margin-top: 0;\n}\n\n\n/* prettyprint */\n.presentation pre.prettyprint{\n    background-color: transparent;\n    border: 0px !important;\n    margin-bottom: 0;\n    margin-top: 30px;\n    text-align: left;\n}\n.presentation .atv,\n.presentation .str{\n    color: #0D9814;\n}\n.presentation .tag,\n.presentation .pln,\n.presentation .kwd{\n    color: #195CEC;\n}\n.presentation .atn{\n    color: #2C93FF;\n}\n.presentation .pln{\n    color: #333;\n}\n.presentation .com{\n    color: #999;\n}\n\n.presentation .text-white{\n    color: #FFFFFF;\n    text-shadow: 0 1px 2px rgba(0,0,0,.13);\n}\n.presentation .section-images .card-image{\n    border-radius: 6px 6px 0 0;\n    overflow: hidden;\n    box-shadow: 0 -3px 8px rgba(0,0,0,0);\n}\n.presentation .section-images .card-image .image{\n/*     border-radius: 6px; */\n}\n@media (max-width: 1200px){\n    .presentation .section-images .image img{\n        width: 100%;\n    }\n\n}\n.presentation .card-text-adjust{\n    padding-left: 40px;\n}\n.presentation .info.info-separator{\n    position: relative;\n}\n.presentation .info.info-separator:after{\n    height: 100%;\n    position: absolute;\n    background-color: #ccc;\n    width: 1px;\n    content: \"\";\n    right: -7px;\n    top: 0;\n}\n.presentation .info li{\n    padding: 5px 0;\n    border-bottom: 1px solid #E5E5E5;\n    color: #666666;\n}\n.presentation .info ul{\n    width: 240px;\n    margin: 10px auto;\n}\n.presentation .info li:last-child{\n    border: 0;\n}\n\n/*      layer animation          */\n\n.layers-container{\n    display: block;\n    margin-top: 50px;\n    position: relative;\n}\n.layers-container img {\n  position: absolute;\n  width: 100%;\n  height: auto;\n  top: 0;\n  left: 0;\n  text-align: center;\n}\n\n.section-black {\n  background-color: #333;\n}\n\n#layerHover{\n  top: 30px;\n}\n#layerImage{\n    top: 50px;\n}\n#layerBody{\n  top: 75px;\n}\n\n.animate {\n  transition: 1.5s ease-in-out;\n  -moz-transition: 1.5s ease-in-out;\n  -webkit-transition: 1.5s ease-in-out;\n}\n\n.down {\n  transform: translate(0,45px);\n  -moz-transform: translate(0,45px);\n  -webkit-transform: translate(0,45px);\n}\n\n.down-2x {\n   transform: translate(0,90px);\n  -moz-transform: translate(0,90px);\n  -webkit-transform: translate(0,90px);\n}\n\n\n.navbar-default.navbar-small .logo-container .brand{\n    color: #333333;\n}\n.navbar-transparent.navbar-small .logo-container .brand{\n    color: #FFFFFF;\n}\n.navbar-default.navbar-small .logo-container .brand{\n    color: #333333;\n}\n.section-thin{\n    padding-bottom: 0;\n}\n\n.info.info-separator{\n    position: relative;\n}\n.info.info-separator:after{\n    height: 100%;\n    position: absolute;\n    background-color: #ccc;\n    width: 1px;\n    content: \"\";\n    right: -7px;\n    top: 0;\n}\n@media (max-width: 767px){\n.info.info-separator:after{\n    display: none;\n  }\n}\n.info li{\n    padding: 5px 0;\n    border-bottom: 1px solid #E5E5E5;\n    color: #666666;\n}\n.info ul{\n    width: 240px;\n    margin: 10px auto;\n}\n.info li:last-child{\n    border: 0;\n}\n.payment-methods i {\n    font-size: 28px;\n    padding: 0 3px;\n    width: 38px;\n}\n.payment-methods h4 {\n    font-size: 18px;\n    line-height: 38px;\n}\n/*\n.info .description .btn{\n    width: 240px;\n    font-weight: 500;\n}\n*/\n#buyButtonHeroes{\n    margin-top: 31px;\n}\n.right-click{\n    width: 100%;\n    height: 100%;\n    background: rgba(51, 51, 51, 0.8);\n    position: fixed;\n    z-index: 20000;\n    display: none;\n}\n.onclick{\n    width: 100%;\n    height: 100%;\n    position: absolute;\n    z-index: 20001;\n}\n.container-right-click{\n    width: 100%;\n    position: absolute;\n    top: 0;\n    left: 0;\n}\n.container-right-click .card-price#card-price-small{\n    margin-top: 70px;\n     -webkit-transition: all .2s;\n    -moz-transition: all .2s;\n    -o-transition: all .2s;\n    transition: all .2s;\n    position: relative;\n    z-index: 20003;\n\n}\n.container-right-click .card-price#card-price-big{\n    margin-top: 40px;\n     -webkit-transition: all .2s;\n    -moz-transition: all .2s;\n    -o-transition: all .2s;\n    transition: all .2s;\n      position: relative;\n    z-index: 20003;\n\n}\n.animated {\n  -webkit-animation-duration: 1s;\n          animation-duration: 1s;\n  -webkit-animation-fill-mode: both;\n          animation-fill-mode: both;\n}\n\n@-webkit-keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -webkit-transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);\n            transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -3000px, 0);\n            transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 25px, 0);\n            transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(0, -10px, 0);\n            transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, 5px, 0);\n            transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -webkit-transform: none;\n            transform: none;\n  }\n}\n\n@keyframes bounceInDown {\n  0%, 60%, 75%, 90%, 100% {\n    -webkit-transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);\n            transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);\n  }\n\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(0, -3000px, 0);\n            transform: translate3d(0, -3000px, 0);\n  }\n\n  60% {\n    opacity: 1;\n    -webkit-transform: translate3d(0, 25px, 0);\n            transform: translate3d(0, 25px, 0);\n  }\n\n  75% {\n    -webkit-transform: translate3d(0, -10px, 0);\n            transform: translate3d(0, -10px, 0);\n  }\n\n  90% {\n    -webkit-transform: translate3d(0, 5px, 0);\n            transform: translate3d(0, 5px, 0);\n  }\n\n  100% {\n    -webkit-transform: none;\n            transform: none;\n  }\n}\n\n.bounceInDown {\n  -webkit-animation-name: bounceInDown;\n          animation-name: bounceInDown;\n}\n\n.container-right-click h4{\n    color: white;margin-top: 45px;font-weight: 200;margin-bottom: 0;\n}\n.icon-class{\n    fill: #75c3b6;\n}\n.navbar-header{\n    min-width: 120px;\n}\n#notifications{\n    background-color: #F5F2EC;\n}\n#demo-navbar{\n    border-radius: 0;\n    margin-bottom: 0px;\n}\n.download-area{\n    margin-top: 30px;\n}\n.sharing-area{\n    margin-top: 50px;\n}\n.sharing-area .btn{\n    margin-top: 14px;\n}\n\n/* for components and tutorial page */\npre.prettyprint{\n    background-color: #FFFCF5;\n    border: 0px;\n    margin-bottom: 0;\n    margin-top: 20px;\n    padding: 20px;\n    text-align: left;\n}\n.atv, .str{\n    color: #75c3b6;\n}\n.tag, .pln, .kwd{\n    color: #7A9E9F;\n}\n.atn{\n    color: #68B3C8;\n}\n.pln{\n    color: #333;\n}\n.com{\n    color: #999;\n}\n.space-top{\n    margin-top: 50px;\n}\n.area-line{\n    border: 1px solid #999;\n    border-left: 0;\n    border-right: 0;\n    color: #666;\n    display: block;\n    margin-top: 20px;\n    padding: 8px 0;\n    text-align: center;\n}\n.area-line a{\n    color: #666;\n}\n.container-fluid{\n    padding-right: 15px;\n    padding-left: 15px;\n}\n.example-pages{\n    margin-top: 50px;\n}\n.demo-wrapper{\n    padding-top: 70px;\n}\n.next-section{\n    margin-top: 100px;\n}\n.coloured-cards .card{\n    margin-top: 30px;\n}\n#modals .btn, #tooltips .btn, #popover .btn{\n    margin-bottom: 15px;\n}\n#social-sharing .btn{\n    margin-top: 15px;\n}\n#textarea textarea{\n    margin-bottom: 15px;\n}\n"; });
define('text!gradebook/addSubject.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"col-md-6\">\n    <h3>${ title }</h3>\n    <form submit.delegate=\"submit()\" class=\"form-horizontal\" validation-renderer=\"bootstrap-form\">\n\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">Subject Name:</label>\n        <div class=\"col-md-6\">\n          <input type=\"text\" class=\"form-control\" focus.bind=\"formStart\" value.bind=\"newSubject.name & validate\">\n        </div>\n      </div>\n\n      <div class=\"form-group\">\n        <div class=\"col-md-offset-4 col-md-6 text-center\">\n          <button type=\"submit\" class=\"btn btn-primary\">\n            ${ bttn }\n          </button>\n          <button click.delegate=\"reset()\" class=\"btn btn-danger\">\n            Cancel\n          </button>\n        </div>\n      </div>\n\n    </form>\n  </div>\n  <div class=\"col-md-6\">\n    <h3>Saved</h3>\n    <table class=\"table table-hover\">\n      <thead>\n      <tr>\n        <th>Name</th>\n        <th></th>\n      </tr>\n      </thead>\n      <tr repeat.for=\"subject of current.subjectList\">\n        <td>${ subject.name & oneTime}</td>\n        <td>\n          <div class=\"btn-group btn-group-xs\" role=\"group\">\n            <button type=\"button\" class=\"btn btn-default ${ subject.id === newSubject.id ? 'active' : ''}\" click.delegate=\"edit(subject)\">\n              <i class=\"fa fa-pencil\"></i> Edit\n            </button>\n            <button type=\"button\" class=\"btn btn-default\" click.delegate=\"delete(subject)\">\n              <i class=\"fa fa-eraser\"></i> Delete\n            </button>\n          </div>\n        </td>\n      </tr>\n    </table>\n  </div>\n</template>\n"; });
define('text!assets/css/examples.css', ['module'], function(module) { module.exports = "/*      light colors - used for select dropdown         */\n.link-danger {\n  color: #EB5E28 !important; }\n  .link-danger:focus, .link-danger:active, .link-danger:hover {\n    color: #B33C12 !important; }\n\n.link-info {\n  color: #68B3C8 !important; }\n  .link-info:focus, .link-info:active, .link-info:hover {\n    color: #3091B2 !important; }\n\n.landing-alert {\n  margin-bottom: 0; }\n\n.landing-header {\n  background-size: cover;\n  min-height: 570px; }\n\n.landing-header .motto {\n  padding-top: 8%;\n  text-align: left;\n  z-index: 3; }\n\n.landing-section {\n  padding: 100px 0; }\n\n.landing-section .btn-simple {\n  padding: 0; }\n\n.landing-section .column {\n  padding: 0 75px 0 25px; }\n\n.team-player .img-circle, .team-player .img-thumbnail {\n  display: block;\n  margin-top: 50px;\n  margin-left: auto;\n  margin-right: auto;\n  width: 120px; }\n\n.contact-form {\n  margin-top: 30px; }\n\n.contact-form label {\n  margin-top: 15px; }\n\n.contact-form .btn {\n  margin-top: 30px; }\n\n.navbar-relative {\n  position: relative;\n  z-index: 2; }\n\n#register-navbar a {\n  color: #FFF; }\n\n.register-background {\n  background-image: url(\"../paper_img/landscape.jpg\");\n  background-position: center center;\n  background-size: cover;\n  min-height: 100vh;\n  overflow: hidden;\n  position: absolute;\n  width: 100%; }\n\n.register-background .filter-black::after {\n  background-color: rgba(0, 0, 0, 0.5);\n  content: \"\";\n  display: block;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  z-index: 1; }\n\n.register-background .container {\n  margin-top: 11%;\n  position: relative;\n  z-index: 3; }\n\n.register-footer {\n  bottom: 20px;\n  color: #fff;\n  position: absolute;\n  z-index: 3;\n  width: 100%; }\n\n.register-footer .fa-heart {\n  color: #EB5E28; }\n\n.register-card {\n  background-color: #FF8F5E;\n  border-radius: 8px;\n  color: #fff;\n  max-width: 350px;\n  margin: 20px 0 70px;\n  min-height: 400px;\n  padding: 30px; }\n\n.register-card label {\n  margin-top: 15px; }\n\n.register-card .title {\n  color: #B33C12;\n  text-align: center; }\n\n.register-card .btn {\n  margin-top: 30px; }\n\n.register-card .forgot {\n  text-align: center; }\n\n.full-screen #register-navbar a {\n  color: #FFF; }\n.full-screen .background {\n  background-position: center center;\n  background-size: cover;\n  min-height: 100vh;\n  overflow: hidden;\n  position: absolute;\n  width: 100%; }\n.full-screen .background .filter-black::after {\n  background-color: rgba(0, 0, 0, 0.5);\n  content: \"\";\n  display: block;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  z-index: 1; }\n.full-screen .background .container {\n  margin-top: 11%;\n  position: relative;\n  z-index: 3; }\n.full-screen .demo-footer {\n  bottom: 10px;\n  color: #fff;\n  position: absolute;\n  z-index: 3;\n  width: 100%; }\n.full-screen .demo-footer .fa-heart {\n  color: #EB5E28; }\n.full-screen .demo-card {\n  border-radius: 8px;\n  max-width: 350px;\n  margin: 20px 0;\n  min-height: 400px;\n  padding: 30px; }\n.full-screen.login .demo-card {\n  background-color: #FF8F5E;\n  color: #fff; }\n  .full-screen.login .demo-card label {\n    margin-top: 15px; }\n  .full-screen.login .demo-card .title {\n    color: #B33C12;\n    text-align: center; }\n  .full-screen.login .demo-card .btn {\n    margin-top: 30px; }\n  .full-screen.login .demo-card .forgot {\n    text-align: center; }\n.full-screen.register .background .filter-black::after {\n  background-color: rgba(0, 0, 0, 0.6); }\n.full-screen.register .container {\n  margin-bottom: 50px; }\n.full-screen.register .info-horizontal {\n  color: #FFFFFF;\n  margin-bottom: 15px; }\n.full-screen.register .demo-card {\n  background-color: #E8E7E3;\n  max-width: 360px; }\n  .full-screen.register .demo-card input {\n    margin-bottom: 8px; }\n  .full-screen.register .demo-card .btn {\n    margin-top: 20px; }\n  .full-screen.register .demo-card .division {\n    float: none;\n    margin: 0 auto;\n    overflow: hidden;\n    margin: 20px 0;\n    position: relative;\n    text-align: center;\n    width: 100%; }\n    .full-screen.register .demo-card .division .line {\n      border-top: 1px solid #66615b;\n      position: absolute;\n      top: 10px;\n      width: 40%; }\n      .full-screen.register .demo-card .division .line.l {\n        left: 0; }\n      .full-screen.register .demo-card .division .line.r {\n        right: 0; }\n.full-screen.register .social {\n  margin-bottom: 10px;\n  margin-top: 15px;\n  text-align: center; }\n.full-screen.register .login {\n  margin-top: 20px;\n  text-align: center; }\n  .full-screen.register .login p {\n    font-size: 0.9em; }\n\n.profile-background {\n  background-position: center center;\n  background-size: cover;\n  height: 300px;\n  position: relative;\n  margin-top: -110px; }\n\n.profile-background .filter-black::after {\n  background-color: rgba(0, 0, 0, 0.5);\n  content: \"\";\n  display: block;\n  height: 300px;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  z-index: 1; }\n\n.profile-content {\n  position: relative; }\n\n.owner .avatar {\n  margin-top: -85px;\n  padding: 15px;\n  position: relative;\n  z-index: 3; }\n\n.owner .name h4 {\n  margin-top: 10px; }\n\n.profile-tabs {\n  margin: 50px 0;\n  min-height: 300px; }\n\n#following h3 {\n  margin: 40px 0; }\n\n.follows .unfollow {\n  width: 15px; }\n\n.follows hr {\n  margin-top: 10px; }\n\n.alert h5 {\n  margin-bottom: 10px; }\n\n.settings .settings-form {\n  margin-bottom: 50px;\n  margin-top: 50px; }\n.settings .fileinput {\n  margin-top: -85px;\n  position: relative;\n  z-index: 3; }\n.settings .form-group {\n  padding-bottom: 10px; }\n.settings .notifications {\n  list-style: none;\n  margin-left: -40px;\n  padding-bottom: 30px;\n  padding-top: 20px; }\n  .settings .notifications .notification-item {\n    border-top: 1px solid #e8e7e3;\n    min-height: 60px;\n    padding-top: 20px;\n    padding-bottom: 15px; }\n    .settings .notifications .notification-item .switch {\n      float: right; }\n\n.about-us .container {\n  max-width: 970px; }\n.about-us .header-wrapper {\n  height: 550px; }\n.about-us .section {\n  padding-top: 50px; }\n.about-us h3.title-uppercase {\n  margin-top: 50px; }\n.about-us p {\n  margin-top: 20px; }\n.about-us .creators {\n  margin-top: 100px; }\n.about-us .more-info {\n  margin-top: 50px;\n  margin-bottom: 30px; }\n\n.discover {\n  background-color: #FFFCF5; }\n  .discover .discover-title {\n    margin-top: 20px; }\n  .discover .form-inline {\n    margin-bottom: 40px; }\n  .discover .items-row {\n    margin-bottom: 50px; }\n  .discover .preloader h5 {\n    color: #D8D1C9;\n    display: inline-block; }\n\n.add-product {\n  background-color: #FFFCF5; }\n  .add-product .container {\n    max-width: 970px; }\n  .add-product h6 {\n    color: #9A9A9A;\n    margin-top: 20px; }\n  .add-product .price-row {\n    margin-bottom: 30px; }\n  .add-product .buttons-row {\n    margin: 60px 0 20px; }\n    .add-product .buttons-row .btn {\n      margin-bottom: 15px; }\n  .add-product .display-checkbox {\n    margin-top: 40px; }\n\n.buy-product {\n  background-color: #f4f3ef; }\n  .buy-product .container {\n    max-width: 970px; }\n  .buy-product .title-row {\n    margin-bottom: 30px; }\n  .buy-product .shop {\n    margin-top: 0px; }\n  .buy-product .carousel-inner {\n    background-color: transparent; }\n    .buy-product .carousel-inner .item {\n      padding: 40px 30px; }\n    .buy-product .carousel-inner img {\n      margin-left: 10%;\n      max-width: 80%; }\n  .buy-product .carousel-control {\n    background-color: transparent;\n    color: #EB5E28; }\n  .buy-product .price {\n    margin-top: 10px; }\n  .buy-product .shipping {\n    margin-bottom: 40px; }\n  .buy-product .details-row {\n    margin-top: 30px; }\n  .buy-product .faq {\n    padding-top: 20px;\n    padding-bottom: 20px; }\n  .buy-product .add-row {\n    margin-top: 50px;\n    margin-bottom: 50px; }\n    .buy-product .add-row h4 {\n      margin-top: 10px; }\n\n.contact-us .navbar {\n  margin-bottom: 0px; }\n.contact-us .title {\n  margin-top: 40px; }\n.contact-us .contact .form-control {\n  margin-bottom: 20px; }\n.contact-us .visit {\n  margin-top: 40px;\n  margin-bottom: 10px; }\n.contact-us .big-map {\n  height: 300px;\n  width: 100%; }\n.contact-us .footer-demo {\n  background-color: #f4f3ef; }\n\n.blog {\n  background-color: #FFFFFF; }\n  .blog .navbar {\n    border-bottom: 0 none;\n    margin-bottom: 0px; }\n    .blog .navbar .navbar-brand {\n      color: #66615b; }\n    .blog .navbar input {\n      background-color: #FFFFFF; }\n  .blog .title h3 {\n    margin-top: -10px; }\n  .blog .article {\n    border-top: 1px solid #F1EAE0;\n    margin-top: 30px; }\n    .blog .article .label {\n      margin-bottom: 10px;\n      margin-top: 40px; }\n    .blog .article .title {\n      color: #403D39;\n      font-weight: 600; }\n    .blog .article .article-image {\n      margin-top: 25px; }\n      .blog .article .article-image .card-big-shadow {\n        max-width: 100%; }\n      .blog .article .article-image .card {\n        background-size: cover;\n        min-height: 430px;\n        width: 100%; }\n      .blog .article .article-image .image-thumb {\n        font-size: 14px;\n        color: #a49e93; }\n    .blog .article .article-content p {\n      margin-top: 10px;\n      font-size: 18px; }\n    .blog .article .article-content .btn {\n      margin-top: 10px; }\n\n.search {\n  background-color: #FFFFFF; }\n  .search .navbar-ct-transparent {\n    border-bottom: 0 none;\n    margin-bottom: 0px; }\n    .search .navbar-ct-transparent .navbar-brand {\n      color: #66615b; }\n    .search .navbar-ct-transparent .navbar-toggle .icon-bar {\n      background: #66615b; }\n  .search .section-search {\n    min-height: 100vh; }\n  .search .addon-xtreme {\n    background-color: #FFFFFF;\n    font-size: 2.5em;\n    color: #a49e93; }\n  .search .input-xtreme {\n    background-color: #FFFFFF;\n    font-size: 3em;\n    height: 70px;\n    margin-left: 20px;\n    padding-left: 0px; }\n  .search .follows li {\n    padding: 20px; }\n  .search .search-form {\n    margin: 0 auto 50px;\n    max-width: 360px; }\n    .search .search-form .fa {\n      width: 22px; }\n  .search .text-missing {\n    margin-top: 100px;\n    margin-bottom: 50px; }\n  .search .description {\n    text-align: left; }\n    .search .description h5 {\n      margin-top: 0px; }\n      .search .description h5 small {\n        font-weight: 600; }\n\n.presentation-page .main {\n  margin-top: -96px; }\n.presentation-page .card img {\n  width: 100%; }\n.presentation-page .title {\n  margin-top: 70px;\n  max-width: 700px;\n  margin-left: auto;\n  margin-right: auto; }\n  .presentation-page .title h2 {\n    font-size: 2.5em; }\n.presentation-page .section-light-brown {\n  color: #66615b; }\n.presentation-page .section-dark-filter {\n  position: relative; }\n  .presentation-page .section-dark-filter:after {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    display: block;\n    top: 0;\n    left: 0;\n    background: black;\n    opacity: .66;\n    content: \"\"; }\n.presentation-page .section-header {\n  position: relative; }\n  .presentation-page .section-header .image-background {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    overflow: hidden; }\n    .presentation-page .section-header .image-background img {\n      width: 100%; }\n  .presentation-page .section-header .card {\n    margin-top: 110px;\n    padding: 4px;\n    background: #FFFFFF;\n    box-shadow: 0 30px 24px -12px rgba(33, 33, 33, 0.2), 0 5px 25px -4px rgba(33, 33, 33, 0.5);\n    border-radius: 3px;\n    min-height: 364px; }\n    .presentation-page .section-header .card img {\n      border-radius: 3px; }\n    .presentation-page .section-header .card:nth-child(1) {\n      position: relative;\n      z-index: 5; }\n  .presentation-page .section-header small {\n    text-align: center;\n    width: 100%;\n    display: block;\n    color: #3C3937;\n    font-size: 19px;\n    position: absolute;\n    bottom: -45px; }\n.presentation-page .section-summary {\n  margin-top: -120px;\n  padding-top: 110px; }\n.presentation-page .components-container {\n  margin-top: 80px; }\n  .presentation-page .components-container .card {\n    cursor: pointer;\n    background: transparent;\n    box-shadow: none;\n    margin-bottom: 120px;\n    padding: 10px; }\n    .presentation-page .components-container .card.no-margin {\n      margin-bottom: 0; }\n  .presentation-page .components-container .col-with-animation {\n    padding-top: 200px; }\n.presentation-page .components-container .details-text,\n.presentation-page .section-examples .details-text {\n  color: #66615b;\n  font-size: 1.1em;\n  font-weight: bold;\n  line-height: 1.15;\n  overflow: hidden;\n  padding-top: 3px;\n  text-align: center;\n  text-overflow: ellipsis;\n  margin-bottom: 25px; }\n.presentation-page .section-examples .card {\n  box-shadow: 0px 15px 18px -10px rgba(22, 22, 22, 0.5);\n  border-radius: 3px;\n  background: transparent;\n  margin-bottom: 40px;\n  overflow: hidden;\n  -webkit-transform: translateY(0px);\n  -moz-transform: translateY(0px);\n  -o-transform: translateY(0px);\n  -ms-transform: translateY(0px);\n  transform: translateY(0px);\n  -webkit-transition: all 300ms cubic-bezier(0.34, 2, 0.6, 1);\n  -moz-transition: all 300ms cubic-bezier(0.34, 2, 0.6, 1);\n  -o-transition: all 300ms cubic-bezier(0.34, 2, 0.6, 1);\n  -ms-transition: all 300ms cubic-bezier(0.34, 2, 0.6, 1);\n  transition: all 300ms cubic-bezier(0.34, 2, 0.6, 1); }\n  .presentation-page .section-examples .card:hover {\n    -webkit-transform: translateY(-12px);\n    -moz-transform: translateY(-12px);\n    -o-transform: translateY(-12px);\n    -ms-transform: translateY(-12px);\n    transform: translateY(-12px);\n    box-shadow: 0px 26px 22px -13px rgba(22, 22, 22, 0.5); }\n.presentation-page .section-examples .title {\n  margin-bottom: 100px; }\n.presentation-page .section-examples,\n.presentation-page .section-sharin {\n  margin-top: -120px;\n  padding-top: 130px;\n  padding-bottom: 130px; }\n.presentation-page .section-sharing span {\n  margin-top: 30px;\n  display: block; }\n.presentation-page .section-sharing .fa-pay {\n  font-size: 30px;\n  display: inline-block;\n  margin: 5px 1px 0;\n  width: auto; }\n.presentation-page .section-sharing .text-muted {\n  opacity: .8; }\n.presentation-page .section-responsive .phone-container {\n  max-width: 800px;\n  margin-left: -15px;\n  max-height: 430px; }\n  .presentation-page .section-responsive .phone-container img {\n    width: 100%;\n    margin-top: -120px; }\n.presentation-page .section-responsive .info {\n  margin-bottom: 0px; }\n  .presentation-page .section-responsive .info h4 {\n    font-size: 1.4em; }\n.presentation-page .navbar .navbar-nav > li > a.btn {\n  color: #FFFFFF;\n  opacity: .7; }\n  .presentation-page .navbar .navbar-nav > li > a.btn:hover, .presentation-page .navbar .navbar-nav > li > a.btn:focus {\n    color: #FFFFFF;\n    opacity: 1; }\n.presentation-page .title-brand {\n  margin-top: 0;\n  position: absolute;\n  top: 40%;\n  width: 100%;\n  font-size: 4em;\n  font-weight: bold;\n  text-transform: uppercase;\n  text-align: center;\n  color: #FFFFFF;\n  text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px  2px 0 #000, 2px  2px 0 #000; }\n  .presentation-page .title-brand .type {\n    position: relative;\n    font-size: 18px;\n    text-shadow: none;\n    background: #141414;\n    padding: 6px 10px;\n    border-radius: 6px;\n    right: 0;\n    margin-left: -18px;\n    display: inline-block;\n    transform: translateY(-48px);\n    -webkit-transform: translateY(-48px);\n    -moz-transform: translateY(-48px);\n    -o-transform: translateY(-48px); }\n.presentation-page .atvImg {\n  transform-style: preserve-3d;\n  -webkit-tap-highlight-color: transparent;\n  width: 100%;\n  height: 400px;\n  cursor: pointer; }\n.presentation-page .atvImg img {\n  box-shadow: 0 2px 8px rgba(14, 21, 47, 0.25);\n  width: 100%; }\n.presentation-page .atvImg-container {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  transition: all 0.25s ease-out;\n  cursor: pointer; }\n.presentation-page .atvImg-container.over .atvImg-shadow {\n  box-shadow: 0 45px 100px rgba(14, 21, 47, 0.4), 0 16px 40px rgba(14, 21, 47, 0.4); }\n.presentation-page .atvImg-layers {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  transform-style: preserve-3d; }\n.presentation-page .atvImg,\n.presentation-page .atvImg-layers,\n.presentation-page .atvImg-container,\n.presentation-page .atvImg img {\n  border-radius: 3px; }\n.presentation-page .atvImg-rendered-layer {\n  position: absolute;\n  width: 104%;\n  height: 104%;\n  top: -2%;\n  left: -2%;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-color: transparent;\n  background-size: cover;\n  transition: all 0.1s ease-out; }\n.presentation-page .atvImg-shadow {\n  position: absolute;\n  top: 5%;\n  left: 5%;\n  width: 90%;\n  height: 90%;\n  transition: all 0.25s ease-out;\n  box-shadow: 0 12px 30px rgba(14, 21, 47, 0.7); }\n.presentation-page .atvImg-shine {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  border-radius: 5px;\n  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 30%); }\n\n.twitter-profile-tweets .nav-tabs > li.active *::after {\n  border-bottom: 11px solid #f9f9f7; }\n.twitter-profile-tweets .twitter-logo {\n  position: absolute;\n  left: 50%;\n  margin-left: -40px; }\n  .twitter-profile-tweets .twitter-logo a i, .twitter-profile-tweets .twitter-logo a:hover i, .twitter-profile-tweets .twitter-logo a:active i, .twitter-profile-tweets .twitter-logo a:focus i {\n    color: #55acee;\n    font-size: 30px; }\n.twitter-profile-tweets .navbar-form {\n  margin-right: 0px;\n  padding-right: 0px; }\n.twitter-profile-tweets .following {\n  margin-top: -35px;\n  margin-left: 55px; }\n.twitter-profile-tweets .hashtag-suggestions li {\n  margin-bottom: 5px; }\n.twitter-profile-tweets .account {\n  margin-bottom: 15px; }\n  .twitter-profile-tweets .account .description-section {\n    line-height: 1.2em;\n    margin-top: 5px;\n    padding: 0px; }\n  .twitter-profile-tweets .account .follow {\n    margin-top: 10px; }\n.twitter-profile-tweets .tweets {\n  padding: 20px 50px; }\n  .twitter-profile-tweets .tweets .media {\n    border-bottom: 1px solid #F1EAE0;\n    overflow: visible; }\n    .twitter-profile-tweets .tweets .media img {\n      width: 100%; }\n    .twitter-profile-tweets .tweets .media .avatar {\n      border: 0 none;\n      margin-top: 10px; }\n    .twitter-profile-tweets .tweets .media .media-heading {\n      margin-bottom: 5px; }\n    .twitter-profile-tweets .tweets .media .media-body {\n      overflow: visible; }\n    .twitter-profile-tweets .tweets .media .media-footer .btn {\n      font-weight: bold;\n      margin-right: 20px; }\n    .twitter-profile-tweets .tweets .media .img-tweet {\n      display: inline-block; }\n    .twitter-profile-tweets .tweets .media .retweet {\n      margin-top: -20px;\n      margin-left: 40px; }\n    .twitter-profile-tweets .tweets .media .tweet-link {\n      margin-bottom: 25px;\n      margin-top: 20px; }\n    .twitter-profile-tweets .tweets .media .img-tweet-link {\n      display: inline-block;\n      max-width: 180px; }\n    .twitter-profile-tweets .tweets .media.last-media {\n      border-bottom: 0px; }\n    .twitter-profile-tweets .tweets .media .dropup, .twitter-profile-tweets .tweets .media .dropdown {\n      display: inline; }\n.twitter-profile-tweets .nav-pills-navigation {\n  text-align: center; }\n  .twitter-profile-tweets .nav-pills-navigation .nav-pills-wrapper {\n    display: inline-block;\n    position: relative;\n    width: auto; }\n.twitter-profile-tweets .people .number {\n  margin-top: 15px; }\n.twitter-profile-tweets .people .card-user .avatar {\n  margin-bottom: 10px; }\n.twitter-profile-tweets .people .card-user .image {\n  height: 120px; }\n.twitter-profile-tweets .people .card-user .content {\n  min-height: 255px; }\n  .twitter-profile-tweets .people .card-user .content .description {\n    font-size: 15px; }\n.twitter-profile-tweets .people .people-list {\n  margin-top: 40px; }\n.twitter-profile-tweets #media img.vertical-image {\n  max-height: 240px; }\n.twitter-profile-tweets #media .gallery-item .gallery-caption {\n  display: none; }\n.twitter-profile-tweets #media .pswp__caption__center {\n  max-width: 800px; }\n.twitter-profile-tweets #media .pswp__caption h5 {\n  display: inline-block; }\n\n@media (max-width: 1200px) {\n  .presentation-page .section-header .card {\n    min-height: 290px; } }\n@media (max-width: 968px) {\n  .presentation-page .section-header .image-background {\n    min-height: 100%; }\n    .presentation-page .section-header .image-background img {\n      width: auto;\n      height: 100%; } }\n@media (max-width: 768px) {\n  .presentation-page .components-container .card {\n    margin-bottom: 40px !important; }\n\n  .btn-wd {\n    min-width: 280px; }\n\n  .presentation-page .title-brand {\n    font-size: 3.4em; }\n\n  .presentation-page .title-brand .type {\n    font-size: 16px;\n    transform: translateY(-28px);\n    -webkit-transform: translateY(-28px);\n    -moz-transform: translateY(-28px);\n    -o-transform: translateY(-28px); } }\n@media (max-width: 500px) {\n  .presentation-page .section-header .card {\n    min-height: 230px; } }\n\n/*# sourceMappingURL=examples.css.map */\n"; });
define('text!gradebook/addYear.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"shared/converters/dateFormat\"></require>\n\n  <div class=\"col-md-6\">\n    <h3>${ title }</h3>\n    <form class=\"form-horizontal\" submit.delegate=\"submit()\" validation-renderer=\"bootstrap-form\">\n\n      <!-- Name Form -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">School Name:</label>\n        <div class=\"col-md-6\">\n          <input type=\"text\" class=\"form-control\" value.bind=\"newYear.school & validate\" focus.bind=\"formStart\">\n        </div>\n      </div>\n\n      <!-- Start Date -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">First day of School:</label>\n        <div class=\"col-md-6\">\n          <input type=\"date\" value.bind=\"newYear.first_day & validate\" class=\"form-control\">\n        </div>\n      </div>\n\n      <!-- End Date -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">Last day of School:</label>\n        <div class=\"col-md-6\">\n          <input type=\"date\" value.bind=\"newYear.last_day & validate\" class=\"form-control\">\n        </div>\n      </div>\n\n      <!-- Submit Button -->\n      <div class=\"form-group\">\n        <div class=\"col-md-offset-4 col-md-6 text-center\">\n          <button type=\"submit\" class=\"btn btn-primary\">\n            ${ bttn }\n          </button>\n          <button click.delegate=\"reset()\" class=\"btn btn-danger\">\n            Cancel\n          </button>\n        </div>\n      </div>\n    </form>\n  </div>\n\n  <!-- Added Years -->\n  <div class=\"col-md-6\">\n    <h3>Saved</h3>\n    <table class=\"table table-hover\">\n      <thead>\n      <tr>\n        <th>Year</th>\n        <th>School</th>\n        <th></th>\n      </tr>\n      </thead>\n      <tr repeat.for=\"year of years.objects\">\n        <td>${ year.first_day | dateFormat: 'YYYY' & oneTime}</td>\n        <td>${ year.school & oneTime }</td>\n        <td>\n          <div class=\"btn-group btn-group-xs\" role=\"group\">\n            <button type=\"button\" class=\"btn btn-default ${ year.id === current.year.id ? 'active' : ''}\"\n                    click.delegate=\"current.setYear(year)\">\n              <i class=\"fa fa-bolt\"></i> Activate\n            </button>\n            <button type=\"button\" class=\"btn btn-default ${ year.id === newYear.id ? 'active' : ''}\"\n                    click.delegate=\"edit(year)\">\n              <i class=\"fa fa-pencil\"></i> Edit\n            </button>\n            <button type=\"button\" class=\"btn btn-default\"\n                    click.delegate=\"delete(year)\">\n              <i class=\"fa fa-eraser\"></i> Delete\n            </button>\n          </div>\n        </td>\n      </tr>\n    </table>\n  </div>\n</template>\n"; });
define('text!assets/css/themify-icons-demo.css', ['module'], function(module) { module.exports = "body {\n\tfont: normal 1em/1.5em Arial, Helvetica, sans-serif;\n\tmax-width: 90%;\n\tmargin: 30px auto 0;\n}\nh1, h3 {\n\tfont-weight: normal;\n}\nh3 {\n\tfont-size: 1.4;\n\ttext-transform: uppercase;\n\tletter-spacing: 1px;\n}\n\n.icon-section {\n\tmargin: 0 0 3em;\n\tclear: both;\n\toverflow: hidden;\n}\n.icon-container {\n\twidth: 240px; \n\tpadding: .7em 0;\n\tfloat: left; \n\tposition: relative;\n\ttext-align: left;\n}\n.icon-container [class^=\"ti-\"], \n.icon-container [class*=\" ti-\"] {\n\tcolor: #000;\n\tposition: absolute;\n\tmargin-top: 3px;\n\ttransition: .3s;\n}\n.icon-container:hover [class^=\"ti-\"],\n.icon-container:hover [class*=\" ti-\"] {\n\tfont-size: 2.2em;\n\tmargin-top: -5px;\n}\n.icon-container:hover .icon-name {\n\tcolor: #000;\n}\n.icon-name {\n\tcolor: #aaa;\n\tmargin-left: 35px;\n\tfont-size: .8em;\n\ttransition: .3s;\n}\n.icon-container:hover .icon-name {\n\tmargin-left: 45px;\n}"; });
define('text!gradebook/index.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./components/assignmentlist\"></require>\n  <require from=\"./components/scoresList\"></require>\n  <require from=\"./components/quickEntry\"></require>\n  <require from=\"./components/addAssignment\"></require>\n  <require from=\"./components/reportAssignment\"></require>\n  <require from=\"shared/components/scriptInjector\"></require>\n\n  <style>\n  .center-pills {\n    display: flex;\n    justify-content: center;\n  }\n\n  .assignment-spacer {\n    width: 100%;\n    min-height: 1px;\n    margin-top: 150px;\n    margin-bottom: 150px;\n    display:inline-block;\n    position:relative;\n  }\n\n  .score-spacer {\n    width: 100%;\n    min-height: 1px;\n    margin-top: 250px;\n    margin-bottom: 250px;\n    display:inline-block;\n    position:relative;\n  }\n  </style>\n\n  <!-- Subject Selection Section -->\n  <div class=\"row\">\n    <div class=\"col-md-12 text-right\">\n      <span class=\"dropdown\">\n        <button class=\"dropdown-toggle btn btn-simple btn-block\" style=\"font-size: 4em; padding: 0.4em;\" data-toggle=\"dropdown\"><span class=\"pull-right\">${ !current.subject.name ? 'Subjects' : current.subject.name } <i class=\"fa fa-caret-down\" aria-hidden=\"true\"></i></span></button>\n      <!-- You can add classes for different colours on the next element -->\n        <ul class=\"dropdown-menu dropdown-primary dropdown-menu-right\">\n          <li repeat.for=\"subject of current.subjectList\" class=\"text-right\">\n            <a route-href=\"route: gradebook; params.bind: { subject: subject.id }\"  style=\"font-size: 4em\">${ subject.name }</a>\n          </li>\n        </ul>\n      </span>\n    </div>\n  </div>\n\n  <!-- Assignment List and Control -->\n  <div class=\"row\">\n    <div class=\"col-md-3\">\n      <div class=\"card card-with-shadow\">\n        <div class=\"content\">\n           <div if.bind=\"current.subject\">\n            <ul class=\"nav nav-pills center-pills\">\n              <li role=\"presentation\" class=\"${ editMode === 'add' ? 'active' : '' }\">\n                <a click.delegate=\"addAssignment()\" data-toggle=\"modal\" data-target=\"#assignmentModal\" data-toggle=\"tooltip\" data-placement=\"top\" data-delay='{\"show\":\"800\", \"hide\":\"0\"}' title=\"Add Assignment\" tooltip><i class=\"fa fa-plus\"></i></a>\n              </li>\n              <li role=\"presentation\" show.bind=\"current.scores || editMode === 'edit'\" class=\"${editMode === 'edit' ? 'active' : ''}\">\n                <a click.delegate=\"editAssignment()\" data-toggle=\"modal\" data-target=\"#assignmentModal\" data-toggle=\"tooltip\" data-placement=\"top\" data-delay='{\"show\":\"800\", \"hide\":\"0\"}' title=\"Edit Assignment\" tooltip><i class=\"fa fa-pencil\"></i></a>\n              </li>\n              <li role=\"presentation\" show.bind=\"current.scores\">\n                <a data-toggle=\"modal\" data-target=\"#deleteModal\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Delete Assignment\" data-delay='{\"show\":\"800\", \"hide\":\"0\"}' tooltip><i class=\"fa fa-eraser\"></i></a>\n              </li>\n              <li role=\"presentation\" show.bind=\"current.scores\" class=\"${quickEntry ? 'active' : ''}\">\n                <a click.delegate=\"toggleQuick()\"><i class=\"fa fa-fast-forward\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Quick Entry\" data-delay='{\"show\":\"800\", \"hide\":\"0\"}' tooltip></i></a>\n              </li>\n            </ul>\n            <br>\n            <assignment-list></assignment-list>\n          </div>\n\n          <!-- Content placeholder -->\n          <div class=\"text-muted text-center assignment-spacer\" if.bind=\"!current.subject\">\n            <h3>Assignments</h3>\n          </div>\n\n        </div>\n      </div>\n    </div>\n\n  <!-- Scores List -->\n  <div class=\"col-md-4\" >\n    <div class=\"card card-with-shadow\">\n      <div class=\"content\">\n        <div if.bind=\"current.scores && !editMode\">\n          <!-- Scores List Header -->\n          <div class=\"small text-muted text-right\">\n            ${ current.assignment.date | dateFormat: 'dddd, MMMM Do'}\n          </div>\n          <h5>${ current.assignment.name }<small if.bind=\"current.assignment.isPoints\"> max score:${ current.assignment.max }</small></h5>\n          <scores-list if.bind=\"!quickEntry\"></scores-list>\n          <quick-entry if.bind=\"quickEntry\"></quick-entry>\n        </div>\n\n        <!-- Content placeholder -->\n        <div if.bind=\"!current.scores && !editMode\">\n          <div class=\"text-muted text-center score-spacer\">\n            <h3>Scores</h3>\n          </div>\n        </div>\n\n      </div>\n    </div>\n  </div>\n\n  <!-- Reports -->\n  <div class=\"col-md-5\">\n    <div class=\"card card-with-shadow\">\n      <div class=\"content\">\n        <div if.bind=\"current.scores && !editMode\">\n          <report-assignment></report-assignment>\n        </div>\n\n        <!-- Content placheolder -->\n        <div if.bind=\"!current.scores && !editMode\">\n          <div class=\"text-muted text-center assignment-spacer\">\n            <h3>Plot</h3>\n          </div>\n        </div>\n\n      </div>\n    </div>\n  </div>\n\n  <!-- Add Assignment -->\n  <div class=\"modal fade\" id=\"assignmentModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"assignmentModal\" aria-hidden=\"true\" data-backdrop=\"static\" data-keyboard=\"false\">\n    <div class=\"modal-dialog\">\n      <add-assignment mode.two-way=\"editMode\"></add-assignment>\n    </div>\n  </div>\n\n  <!-- Delete Assignment -->\n  <div class=\"modal fade\" id=\"deleteModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"deleteModalLabel\" aria-hidden=\"true\">\n  <div class=\"modal-dialog modal-small \">\n    <div class=\"modal-content\">\n      <div class=\"modal-header no-border-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n      </div>\n      <div class=\"modal-body text-center\">\n        <h5>Are you sure you want to delete <strong>${ current.assignment.name }</strong>?</h5>\n      </div>\n      <div class=\"modal-footer\">\n        <div class=\"left-side\">\n            <button type=\"button\" click.delegate=\"deleteAssignment()\" class=\"btn btn-danger btn-simple\" data-dismiss=\"modal\">Delete</button>\n        </div>\n        <div class=\"divider\"></div>\n        <div class=\"right-side\">\n            <button type=\"button\" class=\"btn btn-default btn-simple\" data-dismiss=\"modal\">Cancel</button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n  <!-- <scriptinjector url=\"src/assets/js/ct-paper-checkbox.js\"></scriptinjector> -->\n  <!-- <scriptinjector url=\"src/assets/js/ct-paper-radio.js\"></scriptinjector> -->\n  <!-- <scriptinjector url=\"src/assets/js/bootstrap-select.js\"></scriptinjector> -->\n  <!-- <scriptinjector url=\"src/assets/js/bootstrap-datepicker.js\"></scriptinjector> -->\n  <!-- <scriptinjector url=\"src/assets/js/ct-paper-bootstrapswitch.js\"></scriptinjector> -->\n  <!-- <scriptinjector url=\"src/assets/js/jquery.tagsinput.js\"></scriptinjector> -->\n  <!-- <scriptinjector url=\"src/assets/js/ct-paper.js\"></scriptinjector> -->\n</template>\n"; });
define('text!assets/css/themify-icons.css', ['module'], function(module) { module.exports = "@font-face {\n\tfont-family: 'themify';\n\tsrc:url('../fonts/themify.eot?-fvbane');\n\tsrc:url('../fonts/themify.eot?#iefix-fvbane') format('embedded-opentype'),\n\t\turl('../fonts/themify.woff?-fvbane') format('woff'),\n\t\turl('../fonts/themify.ttf?-fvbane') format('truetype'),\n\t\turl('../fonts/themify.svg?-fvbane#themify') format('svg');\n\tfont-weight: normal;\n\tfont-style: normal;\n}\n\n[class^=\"ti-\"], [class*=\" ti-\"] {\n\tfont-family: 'themify';\n\tspeak: none;\n\tfont-style: normal;\n\tfont-weight: bold;\n\tfont-variant: normal;\n\ttext-transform: none;\n\tline-height: 1.42857;\n\n\t/* Better Font Rendering =========== */\n\t-webkit-font-smoothing: antialiased;\n\t-moz-osx-font-smoothing: grayscale;\n}\n\n.ti-wand:before {\n\tcontent: \"\\e600\";\n}\n.ti-volume:before {\n\tcontent: \"\\e601\";\n}\n.ti-user:before {\n\tcontent: \"\\e602\";\n}\n.ti-unlock:before {\n\tcontent: \"\\e603\";\n}\n.ti-unlink:before {\n\tcontent: \"\\e604\";\n}\n.ti-trash:before {\n\tcontent: \"\\e605\";\n}\n.ti-thought:before {\n\tcontent: \"\\e606\";\n}\n.ti-target:before {\n\tcontent: \"\\e607\";\n}\n.ti-tag:before {\n\tcontent: \"\\e608\";\n}\n.ti-tablet:before {\n\tcontent: \"\\e609\";\n}\n.ti-star:before {\n\tcontent: \"\\e60a\";\n}\n.ti-spray:before {\n\tcontent: \"\\e60b\";\n}\n.ti-signal:before {\n\tcontent: \"\\e60c\";\n}\n.ti-shopping-cart:before {\n\tcontent: \"\\e60d\";\n}\n.ti-shopping-cart-full:before {\n\tcontent: \"\\e60e\";\n}\n.ti-settings:before {\n\tcontent: \"\\e60f\";\n}\n.ti-search:before {\n\tcontent: \"\\e610\";\n}\n.ti-zoom-in:before {\n\tcontent: \"\\e611\";\n}\n.ti-zoom-out:before {\n\tcontent: \"\\e612\";\n}\n.ti-cut:before {\n\tcontent: \"\\e613\";\n}\n.ti-ruler:before {\n\tcontent: \"\\e614\";\n}\n.ti-ruler-pencil:before {\n\tcontent: \"\\e615\";\n}\n.ti-ruler-alt:before {\n\tcontent: \"\\e616\";\n}\n.ti-bookmark:before {\n\tcontent: \"\\e617\";\n}\n.ti-bookmark-alt:before {\n\tcontent: \"\\e618\";\n}\n.ti-reload:before {\n\tcontent: \"\\e619\";\n}\n.ti-plus:before {\n\tcontent: \"\\e61a\";\n}\n.ti-pin:before {\n\tcontent: \"\\e61b\";\n}\n.ti-pencil:before {\n\tcontent: \"\\e61c\";\n}\n.ti-pencil-alt:before {\n\tcontent: \"\\e61d\";\n}\n.ti-paint-roller:before {\n\tcontent: \"\\e61e\";\n}\n.ti-paint-bucket:before {\n\tcontent: \"\\e61f\";\n}\n.ti-na:before {\n\tcontent: \"\\e620\";\n}\n.ti-mobile:before {\n\tcontent: \"\\e621\";\n}\n.ti-minus:before {\n\tcontent: \"\\e622\";\n}\n.ti-medall:before {\n\tcontent: \"\\e623\";\n}\n.ti-medall-alt:before {\n\tcontent: \"\\e624\";\n}\n.ti-marker:before {\n\tcontent: \"\\e625\";\n}\n.ti-marker-alt:before {\n\tcontent: \"\\e626\";\n}\n.ti-arrow-up:before {\n\tcontent: \"\\e627\";\n}\n.ti-arrow-right:before {\n\tcontent: \"\\e628\";\n}\n.ti-arrow-left:before {\n\tcontent: \"\\e629\";\n}\n.ti-arrow-down:before {\n\tcontent: \"\\e62a\";\n}\n.ti-lock:before {\n\tcontent: \"\\e62b\";\n}\n.ti-location-arrow:before {\n\tcontent: \"\\e62c\";\n}\n.ti-link:before {\n\tcontent: \"\\e62d\";\n}\n.ti-layout:before {\n\tcontent: \"\\e62e\";\n}\n.ti-layers:before {\n\tcontent: \"\\e62f\";\n}\n.ti-layers-alt:before {\n\tcontent: \"\\e630\";\n}\n.ti-key:before {\n\tcontent: \"\\e631\";\n}\n.ti-import:before {\n\tcontent: \"\\e632\";\n}\n.ti-image:before {\n\tcontent: \"\\e633\";\n}\n.ti-heart:before {\n\tcontent: \"\\e634\";\n}\n.ti-heart-broken:before {\n\tcontent: \"\\e635\";\n}\n.ti-hand-stop:before {\n\tcontent: \"\\e636\";\n}\n.ti-hand-open:before {\n\tcontent: \"\\e637\";\n}\n.ti-hand-drag:before {\n\tcontent: \"\\e638\";\n}\n.ti-folder:before {\n\tcontent: \"\\e639\";\n}\n.ti-flag:before {\n\tcontent: \"\\e63a\";\n}\n.ti-flag-alt:before {\n\tcontent: \"\\e63b\";\n}\n.ti-flag-alt-2:before {\n\tcontent: \"\\e63c\";\n}\n.ti-eye:before {\n\tcontent: \"\\e63d\";\n}\n.ti-export:before {\n\tcontent: \"\\e63e\";\n}\n.ti-exchange-vertical:before {\n\tcontent: \"\\e63f\";\n}\n.ti-desktop:before {\n\tcontent: \"\\e640\";\n}\n.ti-cup:before {\n\tcontent: \"\\e641\";\n}\n.ti-crown:before {\n\tcontent: \"\\e642\";\n}\n.ti-comments:before {\n\tcontent: \"\\e643\";\n}\n.ti-comment:before {\n\tcontent: \"\\e644\";\n}\n.ti-comment-alt:before {\n\tcontent: \"\\e645\";\n}\n.ti-close:before {\n\tcontent: \"\\e646\";\n}\n.ti-clip:before {\n\tcontent: \"\\e647\";\n}\n.ti-angle-up:before {\n\tcontent: \"\\e648\";\n}\n.ti-angle-right:before {\n\tcontent: \"\\e649\";\n}\n.ti-angle-left:before {\n\tcontent: \"\\e64a\";\n}\n.ti-angle-down:before {\n\tcontent: \"\\e64b\";\n}\n.ti-check:before {\n\tcontent: \"\\e64c\";\n}\n.ti-check-box:before {\n\tcontent: \"\\e64d\";\n}\n.ti-camera:before {\n\tcontent: \"\\e64e\";\n}\n.ti-announcement:before {\n\tcontent: \"\\e64f\";\n}\n.ti-brush:before {\n\tcontent: \"\\e650\";\n}\n.ti-briefcase:before {\n\tcontent: \"\\e651\";\n}\n.ti-bolt:before {\n\tcontent: \"\\e652\";\n}\n.ti-bolt-alt:before {\n\tcontent: \"\\e653\";\n}\n.ti-blackboard:before {\n\tcontent: \"\\e654\";\n}\n.ti-bag:before {\n\tcontent: \"\\e655\";\n}\n.ti-move:before {\n\tcontent: \"\\e656\";\n}\n.ti-arrows-vertical:before {\n\tcontent: \"\\e657\";\n}\n.ti-arrows-horizontal:before {\n\tcontent: \"\\e658\";\n}\n.ti-fullscreen:before {\n\tcontent: \"\\e659\";\n}\n.ti-arrow-top-right:before {\n\tcontent: \"\\e65a\";\n}\n.ti-arrow-top-left:before {\n\tcontent: \"\\e65b\";\n}\n.ti-arrow-circle-up:before {\n\tcontent: \"\\e65c\";\n}\n.ti-arrow-circle-right:before {\n\tcontent: \"\\e65d\";\n}\n.ti-arrow-circle-left:before {\n\tcontent: \"\\e65e\";\n}\n.ti-arrow-circle-down:before {\n\tcontent: \"\\e65f\";\n}\n.ti-angle-double-up:before {\n\tcontent: \"\\e660\";\n}\n.ti-angle-double-right:before {\n\tcontent: \"\\e661\";\n}\n.ti-angle-double-left:before {\n\tcontent: \"\\e662\";\n}\n.ti-angle-double-down:before {\n\tcontent: \"\\e663\";\n}\n.ti-zip:before {\n\tcontent: \"\\e664\";\n}\n.ti-world:before {\n\tcontent: \"\\e665\";\n}\n.ti-wheelchair:before {\n\tcontent: \"\\e666\";\n}\n.ti-view-list:before {\n\tcontent: \"\\e667\";\n}\n.ti-view-list-alt:before {\n\tcontent: \"\\e668\";\n}\n.ti-view-grid:before {\n\tcontent: \"\\e669\";\n}\n.ti-uppercase:before {\n\tcontent: \"\\e66a\";\n}\n.ti-upload:before {\n\tcontent: \"\\e66b\";\n}\n.ti-underline:before {\n\tcontent: \"\\e66c\";\n}\n.ti-truck:before {\n\tcontent: \"\\e66d\";\n}\n.ti-timer:before {\n\tcontent: \"\\e66e\";\n}\n.ti-ticket:before {\n\tcontent: \"\\e66f\";\n}\n.ti-thumb-up:before {\n\tcontent: \"\\e670\";\n}\n.ti-thumb-down:before {\n\tcontent: \"\\e671\";\n}\n.ti-text:before {\n\tcontent: \"\\e672\";\n}\n.ti-stats-up:before {\n\tcontent: \"\\e673\";\n}\n.ti-stats-down:before {\n\tcontent: \"\\e674\";\n}\n.ti-split-v:before {\n\tcontent: \"\\e675\";\n}\n.ti-split-h:before {\n\tcontent: \"\\e676\";\n}\n.ti-smallcap:before {\n\tcontent: \"\\e677\";\n}\n.ti-shine:before {\n\tcontent: \"\\e678\";\n}\n.ti-shift-right:before {\n\tcontent: \"\\e679\";\n}\n.ti-shift-left:before {\n\tcontent: \"\\e67a\";\n}\n.ti-shield:before {\n\tcontent: \"\\e67b\";\n}\n.ti-notepad:before {\n\tcontent: \"\\e67c\";\n}\n.ti-server:before {\n\tcontent: \"\\e67d\";\n}\n.ti-quote-right:before {\n\tcontent: \"\\e67e\";\n}\n.ti-quote-left:before {\n\tcontent: \"\\e67f\";\n}\n.ti-pulse:before {\n\tcontent: \"\\e680\";\n}\n.ti-printer:before {\n\tcontent: \"\\e681\";\n}\n.ti-power-off:before {\n\tcontent: \"\\e682\";\n}\n.ti-plug:before {\n\tcontent: \"\\e683\";\n}\n.ti-pie-chart:before {\n\tcontent: \"\\e684\";\n}\n.ti-paragraph:before {\n\tcontent: \"\\e685\";\n}\n.ti-panel:before {\n\tcontent: \"\\e686\";\n}\n.ti-package:before {\n\tcontent: \"\\e687\";\n}\n.ti-music:before {\n\tcontent: \"\\e688\";\n}\n.ti-music-alt:before {\n\tcontent: \"\\e689\";\n}\n.ti-mouse:before {\n\tcontent: \"\\e68a\";\n}\n.ti-mouse-alt:before {\n\tcontent: \"\\e68b\";\n}\n.ti-money:before {\n\tcontent: \"\\e68c\";\n}\n.ti-microphone:before {\n\tcontent: \"\\e68d\";\n}\n.ti-menu:before {\n\tcontent: \"\\e68e\";\n}\n.ti-menu-alt:before {\n\tcontent: \"\\e68f\";\n}\n.ti-map:before {\n\tcontent: \"\\e690\";\n}\n.ti-map-alt:before {\n\tcontent: \"\\e691\";\n}\n.ti-loop:before {\n\tcontent: \"\\e692\";\n}\n.ti-location-pin:before {\n\tcontent: \"\\e693\";\n}\n.ti-list:before {\n\tcontent: \"\\e694\";\n}\n.ti-light-bulb:before {\n\tcontent: \"\\e695\";\n}\n.ti-Italic:before {\n\tcontent: \"\\e696\";\n}\n.ti-info:before {\n\tcontent: \"\\e697\";\n}\n.ti-infinite:before {\n\tcontent: \"\\e698\";\n}\n.ti-id-badge:before {\n\tcontent: \"\\e699\";\n}\n.ti-hummer:before {\n\tcontent: \"\\e69a\";\n}\n.ti-home:before {\n\tcontent: \"\\e69b\";\n}\n.ti-help:before {\n\tcontent: \"\\e69c\";\n}\n.ti-headphone:before {\n\tcontent: \"\\e69d\";\n}\n.ti-harddrives:before {\n\tcontent: \"\\e69e\";\n}\n.ti-harddrive:before {\n\tcontent: \"\\e69f\";\n}\n.ti-gift:before {\n\tcontent: \"\\e6a0\";\n}\n.ti-game:before {\n\tcontent: \"\\e6a1\";\n}\n.ti-filter:before {\n\tcontent: \"\\e6a2\";\n}\n.ti-files:before {\n\tcontent: \"\\e6a3\";\n}\n.ti-file:before {\n\tcontent: \"\\e6a4\";\n}\n.ti-eraser:before {\n\tcontent: \"\\e6a5\";\n}\n.ti-envelope:before {\n\tcontent: \"\\e6a6\";\n}\n.ti-download:before {\n\tcontent: \"\\e6a7\";\n}\n.ti-direction:before {\n\tcontent: \"\\e6a8\";\n}\n.ti-direction-alt:before {\n\tcontent: \"\\e6a9\";\n}\n.ti-dashboard:before {\n\tcontent: \"\\e6aa\";\n}\n.ti-control-stop:before {\n\tcontent: \"\\e6ab\";\n}\n.ti-control-shuffle:before {\n\tcontent: \"\\e6ac\";\n}\n.ti-control-play:before {\n\tcontent: \"\\e6ad\";\n}\n.ti-control-pause:before {\n\tcontent: \"\\e6ae\";\n}\n.ti-control-forward:before {\n\tcontent: \"\\e6af\";\n}\n.ti-control-backward:before {\n\tcontent: \"\\e6b0\";\n}\n.ti-cloud:before {\n\tcontent: \"\\e6b1\";\n}\n.ti-cloud-up:before {\n\tcontent: \"\\e6b2\";\n}\n.ti-cloud-down:before {\n\tcontent: \"\\e6b3\";\n}\n.ti-clipboard:before {\n\tcontent: \"\\e6b4\";\n}\n.ti-car:before {\n\tcontent: \"\\e6b5\";\n}\n.ti-calendar:before {\n\tcontent: \"\\e6b6\";\n}\n.ti-book:before {\n\tcontent: \"\\e6b7\";\n}\n.ti-bell:before {\n\tcontent: \"\\e6b8\";\n}\n.ti-basketball:before {\n\tcontent: \"\\e6b9\";\n}\n.ti-bar-chart:before {\n\tcontent: \"\\e6ba\";\n}\n.ti-bar-chart-alt:before {\n\tcontent: \"\\e6bb\";\n}\n.ti-back-right:before {\n\tcontent: \"\\e6bc\";\n}\n.ti-back-left:before {\n\tcontent: \"\\e6bd\";\n}\n.ti-arrows-corner:before {\n\tcontent: \"\\e6be\";\n}\n.ti-archive:before {\n\tcontent: \"\\e6bf\";\n}\n.ti-anchor:before {\n\tcontent: \"\\e6c0\";\n}\n.ti-align-right:before {\n\tcontent: \"\\e6c1\";\n}\n.ti-align-left:before {\n\tcontent: \"\\e6c2\";\n}\n.ti-align-justify:before {\n\tcontent: \"\\e6c3\";\n}\n.ti-align-center:before {\n\tcontent: \"\\e6c4\";\n}\n.ti-alert:before {\n\tcontent: \"\\e6c5\";\n}\n.ti-alarm-clock:before {\n\tcontent: \"\\e6c6\";\n}\n.ti-agenda:before {\n\tcontent: \"\\e6c7\";\n}\n.ti-write:before {\n\tcontent: \"\\e6c8\";\n}\n.ti-window:before {\n\tcontent: \"\\e6c9\";\n}\n.ti-widgetized:before {\n\tcontent: \"\\e6ca\";\n}\n.ti-widget:before {\n\tcontent: \"\\e6cb\";\n}\n.ti-widget-alt:before {\n\tcontent: \"\\e6cc\";\n}\n.ti-wallet:before {\n\tcontent: \"\\e6cd\";\n}\n.ti-video-clapper:before {\n\tcontent: \"\\e6ce\";\n}\n.ti-video-camera:before {\n\tcontent: \"\\e6cf\";\n}\n.ti-vector:before {\n\tcontent: \"\\e6d0\";\n}\n.ti-themify-logo:before {\n\tcontent: \"\\e6d1\";\n}\n.ti-themify-favicon:before {\n\tcontent: \"\\e6d2\";\n}\n.ti-themify-favicon-alt:before {\n\tcontent: \"\\e6d3\";\n}\n.ti-support:before {\n\tcontent: \"\\e6d4\";\n}\n.ti-stamp:before {\n\tcontent: \"\\e6d5\";\n}\n.ti-split-v-alt:before {\n\tcontent: \"\\e6d6\";\n}\n.ti-slice:before {\n\tcontent: \"\\e6d7\";\n}\n.ti-shortcode:before {\n\tcontent: \"\\e6d8\";\n}\n.ti-shift-right-alt:before {\n\tcontent: \"\\e6d9\";\n}\n.ti-shift-left-alt:before {\n\tcontent: \"\\e6da\";\n}\n.ti-ruler-alt-2:before {\n\tcontent: \"\\e6db\";\n}\n.ti-receipt:before {\n\tcontent: \"\\e6dc\";\n}\n.ti-pin2:before {\n\tcontent: \"\\e6dd\";\n}\n.ti-pin-alt:before {\n\tcontent: \"\\e6de\";\n}\n.ti-pencil-alt2:before {\n\tcontent: \"\\e6df\";\n}\n.ti-palette:before {\n\tcontent: \"\\e6e0\";\n}\n.ti-more:before {\n\tcontent: \"\\e6e1\";\n}\n.ti-more-alt:before {\n\tcontent: \"\\e6e2\";\n}\n.ti-microphone-alt:before {\n\tcontent: \"\\e6e3\";\n}\n.ti-magnet:before {\n\tcontent: \"\\e6e4\";\n}\n.ti-line-double:before {\n\tcontent: \"\\e6e5\";\n}\n.ti-line-dotted:before {\n\tcontent: \"\\e6e6\";\n}\n.ti-line-dashed:before {\n\tcontent: \"\\e6e7\";\n}\n.ti-layout-width-full:before {\n\tcontent: \"\\e6e8\";\n}\n.ti-layout-width-default:before {\n\tcontent: \"\\e6e9\";\n}\n.ti-layout-width-default-alt:before {\n\tcontent: \"\\e6ea\";\n}\n.ti-layout-tab:before {\n\tcontent: \"\\e6eb\";\n}\n.ti-layout-tab-window:before {\n\tcontent: \"\\e6ec\";\n}\n.ti-layout-tab-v:before {\n\tcontent: \"\\e6ed\";\n}\n.ti-layout-tab-min:before {\n\tcontent: \"\\e6ee\";\n}\n.ti-layout-slider:before {\n\tcontent: \"\\e6ef\";\n}\n.ti-layout-slider-alt:before {\n\tcontent: \"\\e6f0\";\n}\n.ti-layout-sidebar-right:before {\n\tcontent: \"\\e6f1\";\n}\n.ti-layout-sidebar-none:before {\n\tcontent: \"\\e6f2\";\n}\n.ti-layout-sidebar-left:before {\n\tcontent: \"\\e6f3\";\n}\n.ti-layout-placeholder:before {\n\tcontent: \"\\e6f4\";\n}\n.ti-layout-menu:before {\n\tcontent: \"\\e6f5\";\n}\n.ti-layout-menu-v:before {\n\tcontent: \"\\e6f6\";\n}\n.ti-layout-menu-separated:before {\n\tcontent: \"\\e6f7\";\n}\n.ti-layout-menu-full:before {\n\tcontent: \"\\e6f8\";\n}\n.ti-layout-media-right-alt:before {\n\tcontent: \"\\e6f9\";\n}\n.ti-layout-media-right:before {\n\tcontent: \"\\e6fa\";\n}\n.ti-layout-media-overlay:before {\n\tcontent: \"\\e6fb\";\n}\n.ti-layout-media-overlay-alt:before {\n\tcontent: \"\\e6fc\";\n}\n.ti-layout-media-overlay-alt-2:before {\n\tcontent: \"\\e6fd\";\n}\n.ti-layout-media-left-alt:before {\n\tcontent: \"\\e6fe\";\n}\n.ti-layout-media-left:before {\n\tcontent: \"\\e6ff\";\n}\n.ti-layout-media-center-alt:before {\n\tcontent: \"\\e700\";\n}\n.ti-layout-media-center:before {\n\tcontent: \"\\e701\";\n}\n.ti-layout-list-thumb:before {\n\tcontent: \"\\e702\";\n}\n.ti-layout-list-thumb-alt:before {\n\tcontent: \"\\e703\";\n}\n.ti-layout-list-post:before {\n\tcontent: \"\\e704\";\n}\n.ti-layout-list-large-image:before {\n\tcontent: \"\\e705\";\n}\n.ti-layout-line-solid:before {\n\tcontent: \"\\e706\";\n}\n.ti-layout-grid4:before {\n\tcontent: \"\\e707\";\n}\n.ti-layout-grid3:before {\n\tcontent: \"\\e708\";\n}\n.ti-layout-grid2:before {\n\tcontent: \"\\e709\";\n}\n.ti-layout-grid2-thumb:before {\n\tcontent: \"\\e70a\";\n}\n.ti-layout-cta-right:before {\n\tcontent: \"\\e70b\";\n}\n.ti-layout-cta-left:before {\n\tcontent: \"\\e70c\";\n}\n.ti-layout-cta-center:before {\n\tcontent: \"\\e70d\";\n}\n.ti-layout-cta-btn-right:before {\n\tcontent: \"\\e70e\";\n}\n.ti-layout-cta-btn-left:before {\n\tcontent: \"\\e70f\";\n}\n.ti-layout-column4:before {\n\tcontent: \"\\e710\";\n}\n.ti-layout-column3:before {\n\tcontent: \"\\e711\";\n}\n.ti-layout-column2:before {\n\tcontent: \"\\e712\";\n}\n.ti-layout-accordion-separated:before {\n\tcontent: \"\\e713\";\n}\n.ti-layout-accordion-merged:before {\n\tcontent: \"\\e714\";\n}\n.ti-layout-accordion-list:before {\n\tcontent: \"\\e715\";\n}\n.ti-ink-pen:before {\n\tcontent: \"\\e716\";\n}\n.ti-info-alt:before {\n\tcontent: \"\\e717\";\n}\n.ti-help-alt:before {\n\tcontent: \"\\e718\";\n}\n.ti-headphone-alt:before {\n\tcontent: \"\\e719\";\n}\n.ti-hand-point-up:before {\n\tcontent: \"\\e71a\";\n}\n.ti-hand-point-right:before {\n\tcontent: \"\\e71b\";\n}\n.ti-hand-point-left:before {\n\tcontent: \"\\e71c\";\n}\n.ti-hand-point-down:before {\n\tcontent: \"\\e71d\";\n}\n.ti-gallery:before {\n\tcontent: \"\\e71e\";\n}\n.ti-face-smile:before {\n\tcontent: \"\\e71f\";\n}\n.ti-face-sad:before {\n\tcontent: \"\\e720\";\n}\n.ti-credit-card:before {\n\tcontent: \"\\e721\";\n}\n.ti-control-skip-forward:before {\n\tcontent: \"\\e722\";\n}\n.ti-control-skip-backward:before {\n\tcontent: \"\\e723\";\n}\n.ti-control-record:before {\n\tcontent: \"\\e724\";\n}\n.ti-control-eject:before {\n\tcontent: \"\\e725\";\n}\n.ti-comments-smiley:before {\n\tcontent: \"\\e726\";\n}\n.ti-brush-alt:before {\n\tcontent: \"\\e727\";\n}\n.ti-youtube:before {\n\tcontent: \"\\e728\";\n}\n.ti-vimeo:before {\n\tcontent: \"\\e729\";\n}\n.ti-twitter:before {\n\tcontent: \"\\e72a\";\n}\n.ti-time:before {\n\tcontent: \"\\e72b\";\n}\n.ti-tumblr:before {\n\tcontent: \"\\e72c\";\n}\n.ti-skype:before {\n\tcontent: \"\\e72d\";\n}\n.ti-share:before {\n\tcontent: \"\\e72e\";\n}\n.ti-share-alt:before {\n\tcontent: \"\\e72f\";\n}\n.ti-rocket:before {\n\tcontent: \"\\e730\";\n}\n.ti-pinterest:before {\n\tcontent: \"\\e731\";\n}\n.ti-new-window:before {\n\tcontent: \"\\e732\";\n}\n.ti-microsoft:before {\n\tcontent: \"\\e733\";\n}\n.ti-list-ol:before {\n\tcontent: \"\\e734\";\n}\n.ti-linkedin:before {\n\tcontent: \"\\e735\";\n}\n.ti-layout-sidebar-2:before {\n\tcontent: \"\\e736\";\n}\n.ti-layout-grid4-alt:before {\n\tcontent: \"\\e737\";\n}\n.ti-layout-grid3-alt:before {\n\tcontent: \"\\e738\";\n}\n.ti-layout-grid2-alt:before {\n\tcontent: \"\\e739\";\n}\n.ti-layout-column4-alt:before {\n\tcontent: \"\\e73a\";\n}\n.ti-layout-column3-alt:before {\n\tcontent: \"\\e73b\";\n}\n.ti-layout-column2-alt:before {\n\tcontent: \"\\e73c\";\n}\n.ti-instagram:before {\n\tcontent: \"\\e73d\";\n}\n.ti-google:before {\n\tcontent: \"\\e73e\";\n}\n.ti-github:before {\n\tcontent: \"\\e73f\";\n}\n.ti-flickr:before {\n\tcontent: \"\\e740\";\n}\n.ti-facebook:before {\n\tcontent: \"\\e741\";\n}\n.ti-dropbox:before {\n\tcontent: \"\\e742\";\n}\n.ti-dribbble:before {\n\tcontent: \"\\e743\";\n}\n.ti-apple:before {\n\tcontent: \"\\e744\";\n}\n.ti-android:before {\n\tcontent: \"\\e745\";\n}\n.ti-save:before {\n\tcontent: \"\\e746\";\n}\n.ti-save-alt:before {\n\tcontent: \"\\e747\";\n}\n.ti-yahoo:before {\n\tcontent: \"\\e748\";\n}\n.ti-wordpress:before {\n\tcontent: \"\\e749\";\n}\n.ti-vimeo-alt:before {\n\tcontent: \"\\e74a\";\n}\n.ti-twitter-alt:before {\n\tcontent: \"\\e74b\";\n}\n.ti-tumblr-alt:before {\n\tcontent: \"\\e74c\";\n}\n.ti-trello:before {\n\tcontent: \"\\e74d\";\n}\n.ti-stack-overflow:before {\n\tcontent: \"\\e74e\";\n}\n.ti-soundcloud:before {\n\tcontent: \"\\e74f\";\n}\n.ti-sharethis:before {\n\tcontent: \"\\e750\";\n}\n.ti-sharethis-alt:before {\n\tcontent: \"\\e751\";\n}\n.ti-reddit:before {\n\tcontent: \"\\e752\";\n}\n.ti-pinterest-alt:before {\n\tcontent: \"\\e753\";\n}\n.ti-microsoft-alt:before {\n\tcontent: \"\\e754\";\n}\n.ti-linux:before {\n\tcontent: \"\\e755\";\n}\n.ti-jsfiddle:before {\n\tcontent: \"\\e756\";\n}\n.ti-joomla:before {\n\tcontent: \"\\e757\";\n}\n.ti-html5:before {\n\tcontent: \"\\e758\";\n}\n.ti-flickr-alt:before {\n\tcontent: \"\\e759\";\n}\n.ti-email:before {\n\tcontent: \"\\e75a\";\n}\n.ti-drupal:before {\n\tcontent: \"\\e75b\";\n}\n.ti-dropbox-alt:before {\n\tcontent: \"\\e75c\";\n}\n.ti-css3:before {\n\tcontent: \"\\e75d\";\n}\n.ti-rss:before {\n\tcontent: \"\\e75e\";\n}\n.ti-rss-alt:before {\n\tcontent: \"\\e75f\";\n}\n"; });
define('text!home/index.html', ['module'], function(module) { module.exports = "<template>\n    <div class=\"wrapper\">\n        <div class=\"landing-header\" style=\"background-image: url('src/images/notebook.jpg');\">\n            <div class=\"container\">\n                <div class=\"motto\">\n                    <h1 class=\"title-uppercase\">Marks</h1>\n                    <h3>A modern gradebook and teaching assistant designed<br>for elementary school teachers.</h3>\n                    <br />\n                    <a href=\"https://www.youtube.com/watch?v=dQw4w9WgXcQ\" class=\"btn\"><i class=\"fa fa-play\"></i>Watch video</a>\n                    <a class=\"btn\">Download</a>\n                </div>\n            </div>\n        </div>\n        <div class=\"main\">\n            <div class=\"section text-center landing-section\">\n                <div class=\"container\">\n                    <div class=\"row\">\n                        <div class=\"col-md-8 col-md-offset-2\">\n                            <h2>Become a data driven teacher</h2>\n                            <h5>This is the paragraph where you can write more details about your product. Keep you user engaged by providing meaningful information. Remember that by this time, the user is curious, otherwise he wouldn't scroll to get here. Add a button if you want the user to see more.</h5>\n                            <br />\n                            <a href=\"#\" class=\"btn btn-danger btn-fill\">See Details</a>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"section section-light-brown landing-section\">\n                <div class=\"container\">\n                    <div class=\"row\">\n                        <div class=\"col-md-4 column\">\n                            <h4>First Attribute</h4>\n                            <p>Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing a feature will be enough.</p>\n                            <a class=\"btn btn-danger btn-simple\" href=\"#\">See more <i class=\"fa fa-chevron-right\"></i></a>\n                        </div>\n                        <div class=\"col-md-4 column\">\n                            <h4>Second Attribute</h4>\n                            <p>Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing a feature will be enough.</p>\n                            <a class=\"btn btn-danger btn-simple\" href=\"#\">See more <i class=\"fa fa-chevron-right\"></i></a>\n                        </div>\n                        <div class=\"col-md-4 column\">\n                            <h4>Third Attribute</h4>\n                            <p>Divide details about your product or agency work into parts. Write a few lines about each one. A paragraph describing a feature will be enough.</p>\n                            <a class=\"btn btn-danger btn-simple\" href=\"#\">See more <i class=\"fa fa-chevron-right\"></i></a>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"section section-dark text-center landing-section\">\n                <div class=\"container\">\n                    <h2>Let's talk about us</h2>\n                    <div class=\"col-md-4\">\n                        <div class=\"team-player\">\n                            <img src=\"../assets/img/chet_faker_2.jpg\" alt=\"Thumbnail Image\" class=\"img-circle img-responsive\">\n                            <h5>Chet Faker <br /><small class=\"text-muted\">Music</small></h5>\n                            <p>You can write here details about one of your team members. You can give more details about what they do. Feel free to add some <a href=\"#\">links</a> for people to be able to follow them outside the site.</p>\n                        </div>\n                    </div>\n                    <div class=\"col-md-4\">\n                        <div class=\"team-player\">\n                            <img src=\"../assets/img/flume.jpg\" alt=\"Thumbnail Image\" class=\"img-circle img-responsive\">\n                            <h5>Flume <br /><small class=\"text-muted\">Production</small></h5>\n                            <p>You can write here details about one of your team members. You can give more details about what they do. Feel free to add some <a href=\"#\">links</a> for people to be able to follow them outside the site.</p>\n                        </div>\n                    </div>\n                    <div class=\"col-md-4\">\n                        <div class=\"team-player\">\n                            <img src=\"../assets/img/banks.jpg\" alt=\"Thumbnail Image\" class=\"img-circle img-circle img-responsive\">\n                            <h5>Banks <br /><small class=\"text-muted\">Music</small></h5>\n                            <p>You can write here details about one of your team members. You can give more details about what they do. Feel free to add some <a href=\"#\">links</a> for people to be able to follow them outside the site.</p>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"section landing-section\">\n                <div class=\"container\">\n                    <div class=\"row\">\n                        <div class=\"col-md-8 col-md-offset-2\">\n                            <h2 class=\"text-center\">Keep in touch?</h2>\n                            <form class=\"contact-form\">\n                                <div class=\"row\">\n                                    <div class=\"col-md-6\">\n                                        <label>Name</label>\n                                        <input class=\"form-control\" placeholder=\"Name\">\n                                    </div>\n                                    <div class=\"col-md-6\">\n                                        <label>Email</label>\n                                        <input class=\"form-control\" placeholder=\"Email\">\n                                    </div>\n                                </div>\n                                <label>Message</label>\n                                <textarea class=\"form-control\" rows=\"4\" placeholder=\"Tell us your thoughts and feelings...\"></textarea>\n                                <div class=\"row\">\n                                    <div class=\"col-md-4 col-md-offset-4\">\n                                        <button class=\"btn btn-danger btn-block btn-lg btn-fill\">Send Message</button>\n                                    </div>\n                                </div>\n                            </form>\n                        </div>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n    </div>\n</template>\n"; });
define('text!gradebook/lib/autocomplete.css', ['module'], function(module) { module.exports = "autocomplete {\n  display: inline-block;\n}\n\nautocomplete .suggestions {\n  list-style-type: none;\n  cursor: default;\n  padding: 0;\n  margin: 0;\n  border: 1px solid #ccc;\n  background: #fff;\n  box-shadow: -1px 1px 3px rgba(0,0,0,.1);\n\n  position: absolute;\n  z-index: 9999;\n  max-height: 15rem;\n  overflow: hidden;\n  overflow-y: auto;\n  box-sizing: border-box;\n}\n\nautocomplete .suggestion {\n  padding: 0 .3rem;\n  line-height: 1.5rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: #333;\n}\n\nautocomplete .suggestion:hover,\nautocomplete .suggestion.selected {\n  background: #f0f0f0;\n}\n"; });
define('text!home/index_old.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"col-md-6\">\n    <h1>Welcome to Marks!</h1>\n    <p>\n      The primary goal of marks was to create a tool that enables data-driven teaching in primary schools. Primary education provides a unique opportunity for data-driven methods as there typically is one person in charge of a classroom for a long duration. This means many opportunities to track a student's progress and make interventions based on data, given the proper tool.\n    </p>\n    <p>\n      However, in order for a data-driven method to be successful, you need data (duh) and ability to quickly draw insights from that data (less duh). The largest impediments to these requirements are data entry and useful reporting. Marks attempts to remove these obstacles by focusing on easy data entry and reporting that reduces teacher workload. Essentially, it tries to make the teacher want to use the application to make their life easier, while providing a data infrastructure as a bonus. To incentivize teacher adoption, each feature is designed to reduce teacher workload in some aspect. For example, the quick entry mode in Marks allows for an unsorted stack of papers to have their grades entered and calculated quickly. This lowers the barrier for gathering data while making the essential act of keeping grades less onerous. To close the loop, being able to generate easily interpretable reports on the assignment, subject, and student level provides a useful resource for student/parent conferences, individual student plans, and report card generation. Together, making data entry and data interpretation as painless as possible provides a foundation for a data-driven classroom to be built upon.\n    </p>\n  </div>\n  <div class=\"col-md-6\">\n    <h2>Sign up</h2>\n    <form class=\"form-horizontal\" submit.delegate=\"submitSignUp()\" validation-renderer=\"bootstrap-form\">\n\n      <!-- E-mail -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">E-mail:</label>\n        <div class=\"col-md-6\">\n          <input type=\"email\" class=\"form-control\" value.bind=\"newUser.email & validate\">\n        </div>\n      </div>\n\n      <!-- Password -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">Password</label>\n        <div class=\"col-md-6\">\n          <input type=\"password\" value.bind=\"newUser.password & validate\" class=\"form-control\">\n        </div>\n      </div>\n\n      <!-- Submit Button -->\n      <div class=\"form-group\">\n        <div class=\"col-md-offset-4 col-md-6 text-center\">\n          <button type=\"submit\" class=\"btn btn-primary\">\n            Sign Up\n          </button>\n          <button class=\"btn btn-danger\">\n            Sign in with Google\n          </button>\n        </div>\n      </div>\n    </form>\n  </div>\n</template>\n"; });
define('text!reports/index.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./components/studentReport\"></require>\n\n  <!-- Reports Menu -->\n  <ul class=\"nav nav-tabs\">\n    <li>\n      <h4>Reports</h4>\n    </li>\n    <li repeat.for=\"report of reports\" role=\"presentation\"\n        class=\"${report === selectedReport ? 'active' : ''}\">\n      <a href=\"\" click.delegate=\"setReport(report)\">${ report }</a>\n    </li>\n  </ul>\n\n  <student-report if.bind=\"selectedReport === 'Student'\"></student-report>\n</template>\n"; });
define('text!admin/components/password.html', ['module'], function(module) { module.exports = "<template>\n  <!-- Reset Form -->\n  <div if.bind=\"reset\">\n    <h2>Reset Password</h2>\n    <form class=\"form-horizontal\" submit.delegate=\"resetPassword()\">\n\n      <!-- New Password -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">New Password:</label>\n        <div class=\"col-md-6\">\n          <input type=\"password\" class=\"form-control\"\n                 value.bind=\"password.new\" required>\n        </div>\n      </div>\n\n      <!-- Confirm New Password -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">Confirm New Password:</label>\n        <div class=\"col-md-6\">\n          <input type=\"password\" value.bind=\"password.confirm\" class=\"form-control\"\n                 required>\n        </div>\n      </div>\n\n      <!-- Submit Button -->\n      <div class=\"form-group\">\n        <div class=\"col-md-offset-4 col-md-6 text-center\">\n          <button type=\"submit\" class=\"btn btn-primary\">\n            Change Password\n          </button>\n          ${ feedback }\n        </div>\n      </div>\n    </form>\n  </div>\n\n  <!-- Change Password Form -->\n  <div if.bind=\"!reset\">\n    <h2>Change Password</h2>\n    <form class=\"form-horizontal\" submit.delegate=\"changePassword()\">\n\n      <!-- Current Password -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">Current Password:</label>\n        <div class=\"col-md-6\">\n          <input type=\"password\" class=\"form-control\"\n                 value.bind=\"password.current\" required>\n        </div>\n      </div>\n\n      <!-- New Password -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">New Password:</label>\n        <div class=\"col-md-6\">\n          <input type=\"password\" class=\"form-control\"\n                 value.bind=\"password.new\" required>\n        </div>\n      </div>\n\n      <!-- Confirm New Password -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">Confirm New Password:</label>\n        <div class=\"col-md-6\">\n          <input type=\"password\" value.bind=\"password.confirm\" class=\"form-control\"\n                 required>\n        </div>\n      </div>\n\n      <!-- Submit Button -->\n      <div class=\"form-group\">\n        <div class=\"col-md-offset-4 col-md-6 text-center\">\n          <button type=\"submit\" class=\"btn btn-primary\">\n            Change Password\n          </button>\n          ${ feedback }\n        </div>\n      </div>\n    </form>\n  </div>\n</template>\n"; });
define('text!admin/components/profile.html', ['module'], function(module) { module.exports = "<template>\n  <h3>Profile</h3>\n  <form submit.delegate=\"submit()\" class=\"form-horizontal\" validation-renderer=\"bootstrap-form\">\n    <!-- Title -->\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\">Title:</label>\n      <div class=\"col-md-6\">\n        <select class=\"form-control\" value.bind=\"profile.title & validate\">\n          <option value=\"\">Select</option>\n          <option value=\"Ms.\">Ms.</option>\n          <option value=\"Mrs.\">Mrs.</option>\n          <option value=\"Mr.\">Mr.</option>\n          <option value=\"Dr.\">Dr.</option>\n        </select>\n      </div>\n    </div>\n    <!-- First Name -->\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\" for=\"firstname\">First Name:</label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" class=\"form-control\" id=\"firstname\" placeholder=\"First Name\"\n               value.bind=\"profile.first_name & validate\">\n      </div>\n    </div>\n\n    <!-- Last Name -->\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\" for=\"lastname\">Last Name:</label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" class=\"form-control\" id=\"lastname\" placeholder=\"Last Name\"\n               value.bind=\"profile.last_name & validate\">\n      </div>\n    </div>\n\n    <!-- Submit Button -->\n    <div class=\"form-group\">\n      <div class=\"col-md-offset-4 col-md-6 text-center\">\n        <button type=\"submit\" class=\"btn btn-primary\">Save Changes</button>\n        <i if.bind=\"isSaving\" class=\"fa fa-circle-o-notch fa-spin fa-2x\" aria-hidden=\"true\"></i>\n        <i if.bind=\"saved\" class=\"fa fa-check text-success fa-2x\" aria-hidden=\"true\"></i>\n      </div>\n    </div>\n  </form>\n</template>\n"; });
define('text!gradebook/components/addAssignment.html', ['module'], function(module) { module.exports = "<template>\n  <style>\n  .datepicker{z-index:9999 !important}\n  </style>\n  <div class=\"modal-content\">\n    <div class=\"modal-header\">\n      <h4 class=\"modal-title\" id=\"assignmentModalLabel\">${ title } in ${ current.subject.name }</h4>\n    </div>\n    <div class=\"modal-body\">\n      <form class=\"form-horizontal\" validation-renderer=\"bootstrap-form\">\n        <!-- Assignment Name -->\n        <div class=\"form-group\">\n          <label class=\"col-md-4 control-label\">Name:</label>\n          <div class=\"col-md-6\">\n            <input type=\"text\" class=\"form-control border-input\" value.bind=\"newAssignment.name & validate\">\n          </div>\n        </div>\n        <!-- Date of Assignment -->\n        <div class=\"form-group\">\n          <label class=\"col-md-4 control-label\">Date Assigned:</label>\n          <div class=\"col-md-6\">\n            <div class=\"input-group border-input\">\n            <input type=\"text\" class=\"datepicker form-control border-input\"\n                   value.bind=\"newAssignment.date | dateFormat: 'MMMM Do' & validate\" bootstrap-datepicker>\n                   <span class=\"input-group-addon\"><i class=\"fa fa-calendar fa-fw\"></i></span>\n            </div>\n          </div>\n        </div>\n        <!-- Assignment Type -->\n        <div class=\"form-group\" show.bind=\"mode !== 'edit'\">\n          <label class=\"col-md-4 control-label\">Type:</label>\n          <div class=\"col-md-6\">\n            <select class=\"selectpicker\" data-style=\"form-control border-input\" data-menu-style=\"\" value.bind=\"newAssignment.type & validate\" bootstrap-select>\n              <option disabled selected value=\"\">Select Type</option>\n              <option value=\"Points\">Points</option>\n              <option value=\"Checks\">Checks</option>\n            </select>\n          </div>\n        </div>\n        <!-- Max Points -->\n        <div class=\"form-group\" if.bind=\"newAssignment.type === 'Points'\">\n          <label class=\"col-md-4 control-label\">Max Points:</label>\n          <div class=\"col-md-6\">\n            <input type=\"number\" name=\"max\" class=\"form-control border-input\" value.bind=\"newAssignment.max & validate\">\n          </div>\n        </div>\n      </form>\n    </div>\n    <div class=\"modal-footer\">\n      <div class=\"left-side\">\n          <button type=\"button\" click.delegate=\"submit()\" class=\"btn btn-success btn-simple\" data-dismiss=\"modal\">${ btn }</button>\n      </div>\n      <div class=\"divider\"></div>\n      <div class=\"right-side\">\n          <button type=\"button\" click.delegate=\"cancel()\" data-dismiss=\"modal\" class=\"btn btn-danger btn-simple\">Cancel</button>\n      </div>\n    </div>\n\n  </div>\n</template>\n"; });
define('text!gradebook/components/assignmentlist.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"shared/converters/weekFormat\"></require>\n\n  <input type=\"text\" value.bind=\"listWeek | weekFormat\" style=\"text-align: center;\"\n         change.delegate=\"jumpWeek()\" class=\"datepicker form-control border-input\"\n         bootstrap-datepicker>\n  <br>\n  <ul class=\"nav\">\n    <li repeat.for=\"assignment of current.assignmentList\">\n      <div class=\"text-left\">\n        <a class=\"btn btn-simple btn-primary bt-lg ${assignment.id === current.assignment.id ? 'active' : ''}\"\n           route-href=\"route: gradebook; params.bind: { subject: current.subject.id, assignment: assignment.id }\">\n          ${ assignment.name & oneTime }\n        </a>\n        <span class=\"pull-right\">\n          <a class=\"btn btn-simple btn-sm\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"${ assignment.date | dateFormat: 'MMMM Do'}\" tooltip>\n            ${ assignment.date | dateFormat: 'ddd' }\n          </a>\n        </span>\n      </div>\n    </li>\n  </ul>\n  <br>\n</template>\n"; });
define('text!gradebook/components/quickEntry.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../library/autocomplete\"></require>\n\n  <table class=\"table table-hover scores\">\n    <tr repeat.for=\"score of entered\">\n      <td class=\"text-center\">${ score.student.first_name }</td>\n      <td class=\"text-center\" innerhtml.bind=\"score.value | scoreFormat: score.assignment\"></td>\n    </tr>\n\n    <!-- Input Row -->\n    <tr>\n      <td class=\"text-center col-md-6\">\n        <!-- Name Input -->\n          <div class=\"form-group\">\n            <autocomplete service.bind=\"suggestionService\"\n                          value.bind=\"score\"\n                          placeholder=\"Name\"\n                          name-focus.bind=\"nameFocus\"\n                          score-focus.bind=\"scoreFocus\"\n                          is-points.bind=\"current.assignment.isPoints\"\n                          checks.call=\"parseKey(key)\">\n              <template replace-part=\"suggestion\">\n                <span style=\"font-style: italic\">${suggestion}</span>\n              </template>\n            </autocomplete>\n</div>\n</td>\n\n<!-- Value Input -->\n<td class=\"text-center col-md-6\">\n  <div class=\"form-group\">\n    <div if.bind=\"current.assignment.isPoints\" class=\"form-group\">\n      <input value.bind=\"quickPoints\"\n             type=\"number\"\n             class=\"form-control text-center border-input\"\n             placeholder=\"Score\"\n             focus.bind=\"scoreFocus\"\n             keypress.delegate=\"parseKey($event.which)\" />\n    </div>\n    <div if.bind=\"!current.assignment.isPoints\">\n      <i class=\"fa fa-check-circle-o fa-2x\" aria-hidden=\"true\"></i>\n    </div>\n  </div>\n</td>\n</tr>\n</table>\n</template>\n"; });
define('text!gradebook/components/reportAssignment.html', ['module'], function(module) { module.exports = "<template>\n  <style>\n    .bar rect {\n      fill: #68B3C8;\n    }\n\n    .bar text {\n      fill: #fff;\n      font: 12px sans-serif;\n    }\n\n    .arc text {\n      font: 10px sans-serif;\n      text-anchor: middle;\n    }\n\n    .arc path {\n      stroke: #fff;\n    }\n\n    .legend {\n        font-size: 13px;\n      }\n      h1 {\n        font-size: 15px;\n        text-align: center;\n    \t}\n      rect {\n        stroke-width: 2;\n      }\n\n    .chart-tooltip {\n      z-index: 1620;\n      position: absolute;\n      padding: 10px 10px;\n      background: #FFFCF5;\n      top: 10px;\n      border-radius: 2px;\n      display: none;\n      width: auto;\n      right: 10px;\n      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);\n      transform: translateY(6px);\n      transition: transform 0.25s;\n      -webkit-backface-visibility: hidden;\n      will-change: transform;\n    }\n\n    .label {\n     font-weight: 600;\n    }\n\n  </style>\n  <div class=\"text-center\" id=\"content\"></div>\n</template>\n"; });
define('text!gradebook/components/scoresList.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"shared/converters/scoreFormat\"></require>\n  <require from=\"shared/converters/dateFormat\"></require>\n\n  <style>\n    .scores tr {\n     height: 70px;\n    }\n  </style>\n\n  <table class=\"table table-hover scores\">\n    <tr repeat.for=\"score of current.scores\">\n      <td class=\"text-center col-md-6\">${ score.student.first_name }</td>\n      <td class=\"text-center col-md-6\" click.delegate=\"editScore(score)\">\n        <!-- View Mode -->\n        <div if.bind=\"score.id !== editScoreId\" innerhtml.bind=\"score.value | scoreFormat: score.assignment\"><i></i></div>\n\n        <!-- Edit Mode -->\n        <div if.bind=\"score.id === editScoreId\">\n            <input keypress.delegate=\"deFocus($event.which)\"\n                   class=\"form-control text-center\"\n                   focus.bind=\"editFocus\"\n                   blur.trigger=\"updateScore(score, $index)\"\n                   value.bind=\"score.value & validate\"\n                   type=\"number\">\n        </div>\n      </td>\n    </tr>\n  </table>\n</template>\n"; });
define('text!gradebook/lib/autocomplete.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./autocomplete.css\"></require>\n\n  <input type=\"text\" autocomplete=\"off\" class=form-control\n         aria-autocomplete=\"list\"\n         aria-expanded.bind=\"expanded\"\n         aria-owns.one-time=\"'au-autocomplate-' + id + '-suggestions'\"\n         aria-activedescendant.bind=\"index >= 0 ? 'au-autocomplate-' + id + '-suggestion-' + index : ''\"\n         id.one-time=\"'au-autocomplete-' + id\"\n         placeholder.bind=\"placeholder\"\n         value.bind=\"inputValue & debounce:delay\"\n         keydown.delegate=\"keydown($event.which)\"\n         blur.trigger=\"blur()\"\n         focus.bind=\"nameFocus\">\n  <ul class=\"suggestions\" role=\"listbox\"\n      if.bind=\"expanded\"\n      id.one-time=\"'au-autocomplate-' + id + '-suggestions'\"\n      ref=\"suggestionsUL\">\n    <li repeat.for=\"suggestion of suggestions\"\n        id.one-time=\"'au-autocomplate-' + id + '-suggestion-' + $index\"\n        role=\"option\"\n        class-name.bind=\"($index === index ? 'selected' : '') + ' suggestion'\"\n        mousedown.delegate=\"suggestionClicked(suggestion)\">\n        ${ suggestion.studref.first_name }\n      <!-- <template replaceable-part=\"suggestion\">\n        ${ suggestion }\n      </template> -->\n    </li>\n  </ul>\n</template>\n"; });
define('text!home/signup/firstTime.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"gradebook/addYear\"></require>\n  <require from=\"gradebook/addStudent\"></require>\n  <require from=\"gradebook/addSubject\"></require>\n  <require from=\"admin/components/profile\"></require>\n\n  <div class=\"col-md-2\">\n    <h3>Setup</h3>\n    <ul class=\"nav nav-stacked\">\n      <li role=\"presentation\"\n          repeat.for=\"step of completed\">\n        <a class=\"text-success\"><i class=\"fa fa-check-circle-o text-success\" aria-hidden=\"true\"></i> ${ step }</a>\n      </li>\n      <li role=\"presentation\"\n          repeat.for=\"step of todo\"\n          class=\"${ step === activeStep ? 'active' : 'disabled'}\">\n        <a href click.delegate=\"nextStep(step)\"><i class=\"fa fa-circle-o\" aria-hidden=\"true\"></i> ${ step }</a>\n      </li>\n    </ul>\n\n  </div>\n\n  <div class=\"col-md-10\">\n    <div class=\"row\">\n      <div if.bind=\"activeStep === 'Introduction'\">\n        <h3>Checklist</h3>\n        <p class=\"col-md-6\">\n          Welcome to Marks! This guided setup will get you up and running fast.\n          After entering all the information for each step mark it done by click on the circle to the left!\n          You're done with the introduction so go ahead and \"marks\" it done!\n        </p>\n      </div>\n      <profile if.bind=\"activeStep === 'Profile'\"></profile>\n      <add-year if.bind=\"activeStep === 'Years'\"></add-year>\n      <add-student if.bind=\"activeStep === 'Students'\"></add-student>\n      <add-subject if.bind=\"activeStep === 'Subjects'\"></add-subject>\n      <div if.bind=\"todo.length === 0\">\n        <h3>All done! Sending you to your gradebook!</h3>\n      </div>\n    </div>\n  </div>\n</template>\n"; });
define('text!home/signup/payment.html', ['module'], function(module) { module.exports = "<template>\n  <h1>Enter Payment Information</h1>\n  <a href=\"/#/first_time\" class=\"btn\">Setup Gradebook</a>\n<template>\n"; });
define('text!reports/components/studentReport.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../converters/scoreFilter\"></require>\n  <require from=\"../attributes/timePlot\"></require>\n  <require from=\"shared/converters/dateFormat\"></require>\n  <require from=\"shared/converters/scoreFormat\"></require>\n\n  <style> /* set the CSS */\n.line {\n  fill: none;\n  stroke: steelblue;\n  stroke-width: 2px;\n}\n</style>\n\n  <!-- Selection Menu -->\n  <div class=\"row\">\n    <form class=\"form-inline\" submit.delegate=\"generate()\">\n      <div class=\"form-group\">\n        <label>Select Student:</label>\n        <select class=\"form-control\" value.bind=\"selected.student\" placeholder=\"Select Student\">\n          <option repeat.for=\"student of students\" model.bind=\"student\">\n            ${ student.first_name } ${ student.last_name }\n          </option>\n        </select>\n      </div>\n      <div class=\"form-group\">\n        <label>Start Date:</label>\n          <input type=\"date\" class=\"form-control\" value.bind=\"selected.start\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>End Date:</label>\n          <input type=\"date\" class=\"form-control\" value.bind=\"selected.end\">\n      </div>\n\n      <button type=\"submit\" class=\"btn btn-default\">Generate Report</button>\n      <ul>\n    </form>\n  </div>\n\n  <!-- Report Header -->\n  <div if.bind=\"reportGenerated\">\n  <div class=\"row\">\n    <h1>${ selected.student.first_name & oneTime} ${ selected.student.last_name & oneTime}</h1>\n  </div>\n\n  <!-- Subject Rows -->\n  <div class=\"row\" repeat.for=\"subject of current.subjectList\">\n    <div class=\"col-md-4\">\n      <h2>${ subject.name & oneTime}</h2>\n      <table class=\"table\">\n        <div if.bind=\"$first\">\n          <thead>\n            <th></th>\n            <th>Date</th>\n            <th>Max Score</th>\n            <th>Score</th>\n          </thead>\n        </div>\n        <tbody>\n          <tr repeat.for=\"score of scores | scoreFilter: subject.id\">\n            <td>${ score.assref.name & oneTime}</td>\n            <td>${ score.assref.date | dateFormat: 'MMMM Do' & oneTime}</td>\n            <td>${ score.assref.max & oneTime}</td>\n            <td innerhtml.bind=\"score.value | scoreFormat: score.assignment & oneTime\"></td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n\n    <!-- Plots -->\n    <div class=\"col-md-6\">\n      <div class=\"col-md-6\">\n        <h2>Points</h2>\n        <div time-plot=\"scores.bind: scores | scoreFilter: subject.id; type.bind: 'Points'\"></div>\n      </div>\n      <div class=\"col-md-6\">\n        <h2>Checks</h2>\n        <div time-plot=\"scores.bind: scores | scoreFilter: subject.id; type.bind: 'Checks'\"></div>\n      </div>\n    </div>\n  </div>\n</div>\n</template>\n"; });
define('text!shared/components/footbar.html', ['module'], function(module) { module.exports = "<template>\n<div class=\"row\">\n<footer class=\"footer footer-black\">\n\n    <div class=\"container\">\n        <div class=\"row\">\n            <div class=\"col-md-4 col-sm-4\">\n                <div class=\"logo text-center\">\n                    <h3>Marks</h3>\n                </div>\n            </div>\n            <div class=\"col-md-6 col-md-offset-2 col-sm-8\">\n                <div class=\"links\">\n                    <ul>\n                        <li>\n                            <a href=\"#\">\n                                Home\n                            </a>\n                        </li>\n                        <li>\n                            <a href=\"#\">\n                                Company\n                            </a>\n                        </li>\n                        <li>\n                            <a href=\"#\">\n                                Support\n                            </a>\n                        </li>\n                        <li>\n                            <a href=\"#\">\n                               Team\n                            </a>\n                        </li>\n                        <li>\n                            <a href=\"#\">\n                               Contact\n                            </a>\n                        </li>\n                        <li>\n                            <a href=\"#\">\n                               Blog\n                            </a>\n                        </li>\n                    </ul>\n                    <hr />\n                    <div class=\"copyright\">\n                        <div class=\"pull-left\">\n                            &copy; 2017 Nick, made with love in San Mateo\n                        </div>\n                        <div class=\"pull-right\">\n                            <ul>\n                                <li>\n                                    <a href=\"#\">\n                                        Terms\n                                    </a>\n                                </li>\n                                |\n                                <li>\n                                    <a href=\"#\">\n                                        Privacy\n                                    </a>\n                                </li>\n                            </ul>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n    </div>\n</footer>\n</div>\n</template>\n"; });
define('text!shared/components/navbar.html', ['module'], function(module) { module.exports = "<template>\n<require from=\"shared/converters/dateFormat\"></require>\n<require from=\"css/marks.css\"></require>\n\n\n<div id=\"navbar\">\n        <nav class=\"navbar navbar-ct-primary\" role=\"navigation\">\n          <div class=\"container-fluid\">\n            <div class=\"navbar-header\">\n              <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\">\n                <span class=\"sr-only\">Toggle navigation</span>\n                <span class=\"icon-bar\"></span>\n                <span class=\"icon-bar\"></span>\n                <span class=\"icon-bar\"></span>\n              </button>\n              <a class=\"navbar-brand\" href=\"/\">Marks</a>\n            </div>\n\n            <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n              <ul class=\"nav navbar-nav\">\n                <li repeat.for=\"row of router.navigation | authFilter: auth.isAuthenticated()\" class=\"${row.isActive ? 'active' : ''}\">\n                  <a class=\"btn btn-simple btn-neutral\" href.bind=\"row.href\">${row.title}</a>\n                </li>\n              </ul>\n              <ul class=\"nav navbar-nav navbar-right\">\n                <li class=\"dropdown\" if.bind=\"auth.isAuthenticated()\">\n                  <a href=\"#\" class=\"dropdown-toggle btn btn-simple btn-neutral btn-rotate\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                    ${ current.user.teacherName }<span if.bind=\"current.year\"> - ${ current.year.school } (${ current.year.first_day | dateFormat: 'YYYY' }) <i class=\"fa fa-cog\"></i>\n                  </a>\n                    <ul class=\"dropdown-menu\">\n                      <li class=\"dropdown-header\">Manage</li>\n                      <li role=\"separator\" class=\"divider\"></li>\n                      <li><a route-href=\"route: addsubject\"><i class=\"fa fa-book fa-fw\"></i>  Subjects</a></li>\n                      <li><a route-href=\"route: addstudent\"><i class=\"fa fa-users fa-fw\"></i>  Students</a></li>\n                      <li><a route-href=\"route: addyear\"><i class=\"fa fa-calendar-plus-o fa-fw\"></i>  Years</a></li>\n                      <li role=\"separator\" class=\"divider\"></li>\n                      <li><a route-href=\"route: settings\"><i class=\"fa fa-cogs fa-fw\"></i>  Settings</a></li>\n                      <li role=\"separator\" class=\"divider\"></li>\n                      <li><a href=\"\" click.delegate=\"logout()\"><i class=\"fa fa-sign-out fa-fw\"></i>  Logout</a></li>\n                    </ul>\n                </li>\n                <li if.bind=\"!auth.isAuthenticated()\"><a href=\"#\">Sign Up</a></li>\n                <li class=\"dropdown\" if.bind=\"!auth.isAuthenticated()\">\n                  <a href=\"#\" click.delegate=\"showReset = flase\"class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n                    Login<span class=\"caret\"></span>\n                  </a>\n                  <ul id=\"login-dp\" class=\"dropdown-menu\">\n                    <li>\n                       <div class=\"row\">\n                          <div class=\"col-md-12\">\n                            <!-- <div class=\"social-buttons\">\n                              <a href=\"#\" class=\"btn btn-fb\"><i class=\"fa fa-facebook\"></i> Facebook</a>\n                              <a href=\"#\" class=\"btn btn-tw\"><i class=\"fa fa-twitter\"></i> Twitter</a>\n                            </div> -->\n                             <form if.bind=\"!showReset\" submit.delegate=\"login()\" class=\"form\" role=\"form\" id=\"login-nav\" validation-renderer=\"bootstrap-form\">\n                                <div class=\"form-group\">\n                                   <label class=\"sr-only\" for=\"exampleInputEmail2\">Email address</label>\n                                   <input value.bind=\"user.email & validate\" type=\"email\" class=\"form-control border-input\" id=\"exampleInputEmail2\" placeholder=\"Email address\" required>\n                                </div>\n                                <div class=\"form-group\">\n                                  <label class=\"sr-only\" for=\"exampleInputPassword2\">Password</label>\n                                  <input value.bind=\"user.password & validate\" type=\"password\" class=\"form-control border-input\" id=\"exampleInputPassword2\" placeholder=\"Password\" required>\n                                  <div class=\"help-block text-right\"><a href=\"#\" click.delegate=\"toggleReset()\">Forget your password?</a></div>\n                                </div>\n                                <div class=\"form-group\">\n                                   <button type=\"submit\" class=\"btn btn-primary\">Sign in</button>\n                                </div>\n                                <!-- <div class=\"checkbox\">\n                                   <label>\n                                   <input type=\"checkbox\"> keep me logged-in\n                                   </label>\n                                </div> -->\n                             </form>\n                             <form if.bind=\"showReset\" submit.delegate=\"sendReset()\" class=\"form\" role=\"form\" id=\"login-nav\">\n                                <div class=\"form-group\">\n                                   <label class=\"sr-only\" for=\"exampleInputEmail2\">Email address</label>\n                                   <input value.bind=\"loginData.email\" type=\"email\" class=\"form-control\" id=\"exampleInputEmail2\" placeholder=\"Email address\" required>\n                                </div>\n                                <div class=\"form-group\">\n                                   <button type=\"submit\" class=\"btn btn-primary btn-block\">Send Reset E-mail</button>\n                                </div>\n                                <!-- <div class=\"checkbox\">\n                                   <label>\n                                   <input type=\"checkbox\"> keep me logged-in\n                                   </label>\n                                </div> -->\n                             </form>\n                          </div>\n                          <!-- <div class=\"bottom text-center\">\n                            New here ? <a href=\"#\"><b>Join Us</b></a>\n                          </div> -->\n                       </div>\n                    </li>\n                  </ul>\n                </li>\n              </ul>\n\n                </li>\n\n              </ul>\n\n            </div><!-- /.navbar-collapse -->\n\n          </div><!-- /.container-fluid -->\n\n        </nav>\n\n    </div><!--  end navbar -->\n</template>\n"; });
define('text!gradebook/library/autocomplete.css', ['module'], function(module) { module.exports = "autocomplete {\n  display: inline-block;\n}\n\nautocomplete .suggestions {\n  list-style-type: none;\n  cursor: default;\n  padding: 0;\n  margin: 0;\n  border: 1px solid #ccc;\n  background: #fff;\n  box-shadow: -1px 1px 3px rgba(0,0,0,.1);\n\n  position: absolute;\n  z-index: 9999;\n  max-height: 15rem;\n  overflow: hidden;\n  overflow-y: auto;\n  box-sizing: border-box;\n}\n\nautocomplete .suggestion {\n  padding: 0 .3rem;\n  line-height: 1.5rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: #333;\n}\n\nautocomplete .suggestion:hover,\nautocomplete .suggestion.selected {\n  background: #f0f0f0;\n}\n"; });
define('text!gradebook/library/autocomplete.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./autocomplete.css\"></require>\n\n  <input type=\"text\" autocomplete=\"off\" class=\"form-control border-input text-center\"\n         aria-autocomplete=\"list\"\n         aria-expanded.bind=\"expanded\"\n         aria-owns.one-time=\"'au-autocomplate-' + id + '-suggestions'\"\n         aria-activedescendant.bind=\"index >= 0 ? 'au-autocomplate-' + id + '-suggestion-' + index : ''\"\n         id.one-time=\"'au-autocomplete-' + id\"\n         placeholder.bind=\"placeholder\"\n         value.bind=\"inputValue & debounce:delay\"\n         keydown.delegate=\"keydown($event.which)\"\n         blur.trigger=\"blur()\"\n         focus.bind=\"nameFocus\">\n  <ul class=\"suggestions\" role=\"listbox\"\n      if.bind=\"expanded\"\n      id.one-time=\"'au-autocomplate-' + id + '-suggestions'\"\n      ref=\"suggestionsUL\">\n    <li repeat.for=\"suggestion of suggestions\"\n        id.one-time=\"'au-autocomplate-' + id + '-suggestion-' + $index\"\n        role=\"option\"\n        class-name.bind=\"($index === index ? 'selected' : '') + ' suggestion'\"\n        mousedown.delegate=\"suggestionClicked(suggestion)\">\n        ${ suggestion.studref.first_name }\n      <!-- <template replaceable-part=\"suggestion\">\n        ${ suggestion }\n      </template> -->\n    </li>\n  </ul>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map