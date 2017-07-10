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
      config.addPipelineStep('authorize', _aureliaAuth.AuthorizeStep);
      config.map([{ route: '/', moduleId: './home/index', nav: 0, title: 'Welcome', auth: false }, { route: 'gradebook', moduleId: './gradebook/index', nav: 1, title: 'Gradebook', name: 'gradebook', auth: true }, { route: 'reports', moduleId: './reports/index', nav: 2, title: 'Reports', auth: true }, { route: 'settings', moduleId: './admin/settings', title: 'Settings', name: 'settings', auth: true }, { route: 'password/:token', moduleId: './admin/components/password', title: 'Reset Password' }, { route: 'payment', moduleId: './home/signup/payment', title: 'Setup Payment', name: 'payment', auth: true }, { route: 'first_time', moduleId: './home/signup/firstTime', title: 'Gradebook Setup', name: 'firsttime', auth: true }, { route: 'gradebook/addsubject', moduleId: './gradebook/addSubject', title: 'Add Subject', name: 'addsubject', auth: true }, { route: 'gradebook/addstudent', moduleId: './gradebook/addStudent', title: 'Add Student', name: 'addstudent', auth: true }, { route: 'gradebook/addyear', moduleId: './gradebook/addYear', title: 'Add Year', name: 'addyear', auth: true }]);

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
    aurelia.use.standardConfiguration().feature('validation').plugin('aurelia-auth', function (baseConfig) {
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
      var _this = this;

      var confirmed = confirm('Are you sure you want to delete ' + this.current.assignment.name + '?');

      if (confirmed) {
        this.api.delete(this.current.assignment).then(function (data) {
          return _this.ea.publish('reloadAssignments');
        });

        this.current.clearAssignment();
      }
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

    AddAssignment.prototype.attached = function attached() {
      if (this.mode === 'edit') {
        this.newAssignment = this.current.assignment;
        this.title = 'Edit Assignment';
        this.btn = 'Save Changes';
      } else {
        this.title = 'Add Assignment';
        this.btn = this.title;
      }
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
          _this.ea.publish('reloadAssignments');
          _this.current.setAssignment(data);
          _this.mode = false;
        });
      });
    };

    AddAssignment.prototype.cancel = function cancel() {
      this.mode = false;
    };

    return AddAssignment;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mode', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('gradebook/components/assignmentlist',['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'shared/services/currentService'], function (exports, _aureliaFramework, _aureliaEventAggregator, _currentService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AssignmentList = undefined;

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

    AssignmentList.prototype.attached = function attached() {
      var _this = this;

      this.current.setAssignmentList();

      this.subsub = this.ea.subscribe('subjectSet', function (resp) {
        return _this.current.setAssignmentList();
      });
      this.reload = this.ea.subscribe('reloadAssignments', function (resp) {
        return _this.current.setAssignmentList();
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

      this.isPoints = this.current.assignment.isPoints;
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
        if (!this.isPoints && key === 13) {
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
      var width = 500 - margin.left - margin.right;
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

      var div = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);

      var bar = g.selectAll('.bar').data(bins).enter().append('g').attr('class', 'bar').attr('transform', function (d) {
        return 'translate(' + x(d.x0) + ',' + y(d.length) + ')';
      }).on('mouseover', function (d) {
        div.transition().duration(200).style('opacity', 0.9);

        div.html(d.map(function (item) {
          return item.student.first_name + ': ' + item.value + '<br>';
        }).join('')).style('left', d3.event.pageX + 'px').style('top', d3.event.pageY - 28 + 'px');
      }).on('mouseout', function (d) {
        div.transition().duration(500).style('opacity', 0);
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
      }).rollup(function (g) {
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

      var width = 500;
      var height = 300;
      var radius = Math.min(width, height) / 2;

      var tooltip = d3.select(divElement).append('div').attr('class', 'tooltip2');

      tooltip.append('div').attr('class', 'label');
      tooltip.append('div').attr('class', 'count');
      tooltip.append('div').attr('class', 'students');
      tooltip.append('div').attr('class', 'percent');

      var color = d3.scaleOrdinal(d3.schemeCategory10.slice(2, 4));
      if (nestdata.length === 1 && nestdata[0].group === 'Missing') {
        color = d3.scaleOrdinal(d3.schemeCategory10.slice(3, 4));
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
        tooltip.select('.label').html(d.data.group);
        tooltip.select('.count').html(d.data.count);
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
define('shared/services/currentService',['exports', 'aurelia-event-aggregator', './apiService', 'aurelia-framework'], function (exports, _aureliaEventAggregator, _apiService, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.CurrentService = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var CurrentService = exports.CurrentService = (_dec = (0, _aureliaFramework.inject)(_apiService.ApiService, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function CurrentService(api, eventaggregator) {
      _classCallCheck(this, CurrentService);

      this.api = api;
      this.ea = eventaggregator;

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

      this.api.find('subjects', query).then(function (data) {
        return _this2.subjectList = data.objects;
      });
    };

    CurrentService.prototype.setSubject = function setSubject(subject) {
      this.subject = subject;
      this.clearAssignment();
      this.ea.publish('subjectSet');
    };

    CurrentService.prototype.setAssignmentList = function setAssignmentList() {
      var _this3 = this;

      var query = {
        filters: [{ 'name': 'subject_id', 'op': 'eq', 'val': this.subject.id }],
        order_by: [{ 'field': 'date', 'direction': 'desc' }]
      };

      this.api.find('assignments', query).then(function (data) {
        return _this3.assignmentList = data.objects;
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
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"shared/components/navbar\"></require>\n\n  <!-- Navigation -->\n  <nav-bar></nav-bar>\n\n  <!-- Viewport -->\n  <div class=\"container\">\n    <div class=\"row\">\n      <router-view></router-view>\n    </div>\n  </div>\n</template>\n"; });
define('text!gradebook/lib/autocomplete.css', ['module'], function(module) { module.exports = "autocomplete {\n  display: inline-block;\n}\n\nautocomplete .suggestions {\n  list-style-type: none;\n  cursor: default;\n  padding: 0;\n  margin: 0;\n  border: 1px solid #ccc;\n  background: #fff;\n  box-shadow: -1px 1px 3px rgba(0,0,0,.1);\n\n  position: absolute;\n  z-index: 9999;\n  max-height: 15rem;\n  overflow: hidden;\n  overflow-y: auto;\n  box-sizing: border-box;\n}\n\nautocomplete .suggestion {\n  padding: 0 .3rem;\n  line-height: 1.5rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: #333;\n}\n\nautocomplete .suggestion:hover,\nautocomplete .suggestion.selected {\n  background: #f0f0f0;\n}\n"; });
define('text!admin/settings.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"admin/components/profile\"></require>\n  <require from=\"admin/components/password\"></require>\n\n  <div class=\"col-md-7 col-md-offset-3\">\n    <h1>Settings</h1>\n    <hr>\n    <profile></profile>\n    <hr>\n    <password></password>\n  </div>\n</template>\n"; });
define('text!gradebook/addStudent.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"col-md-6\">\n    <h3>${ title }</h3>\n    <form submit.delegate=\"submit()\" class=\"form-horizontal\" validation-renderer=\"bootstrap-form\">\n\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">First Name:</label>\n        <div class=\"col-md-6\">\n          <input type=\"text\" class=\"form-control\" value.bind=\"newStudent.first_name & validate\" focus.bind=\"formStart\">\n        </div>\n      </div>\n\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">Last Name:</label>\n        <div class=\"col-md-6\">\n          <input type=\"text\" class=\"form-control\" value.bind=\"newStudent.last_name & validate\">\n        </div>\n      </div>\n\n      <div class=\"form-group\">\n        <div class=\"col-md-offset-4 col-md-6 text-center\">\n          <button type=\"submit\" class=\"btn btn-primary\">\n            ${ bttn }\n          </button>\n          <button click.delegate=\"reset()\" class=\"btn btn-danger\">\n            Cancel\n          </button>\n        </div>\n      </div>\n\n    </form>\n  </div>\n\n  <div class=\"col-md-6\">\n    <h3>Saved</h3>\n    <table class=\"table table-hover\">\n      <thead>\n      <tr>\n        <th>Name\n          <small>(Total: ${ students.objects.length })</small>\n        </th>\n        <th></th>\n      </tr>\n      </thead>\n      <tr repeat.for=\"student of students.objects\">\n        <td>${ student.fullName & oneTime}</td>\n        <td>\n          <div class=\"btn-group btn-group-xs\" role=\"group\">\n            <button type=\"button\" class=\"btn btn-default ${ newStudent.id === student.id ? 'active' : '' }\"\n                    click.delegate=\"edit(student)\">\n              <i class=\"fa fa-pencil\"></i> Edit\n            </button>\n            <button type=\"button\" class=\"btn btn-default\"\n                    click.delegate=\"delete(student)\">\n              <i class=\"fa fa-eraser\"></i> Delete\n            </button>\n          </div>\n        </td>\n      </tr>\n    </table>\n  </div>\n</template>\n"; });
define('text!gradebook/addSubject.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"col-md-6\">\n    <h3>${ title }</h3>\n    <form submit.delegate=\"submit()\" class=\"form-horizontal\" validation-renderer=\"bootstrap-form\">\n\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">Subject Name:</label>\n        <div class=\"col-md-6\">\n          <input type=\"text\" class=\"form-control\" focus.bind=\"formStart\" value.bind=\"newSubject.name & validate\">\n        </div>\n      </div>\n\n      <div class=\"form-group\">\n        <div class=\"col-md-offset-4 col-md-6 text-center\">\n          <button type=\"submit\" class=\"btn btn-primary\">\n            ${ bttn }\n          </button>\n          <button click.delegate=\"reset()\" class=\"btn btn-danger\">\n            Cancel\n          </button>\n        </div>\n      </div>\n\n    </form>\n  </div>\n  <div class=\"col-md-6\">\n    <h3>Saved</h3>\n    <table class=\"table table-hover\">\n      <thead>\n      <tr>\n        <th>Name</th>\n        <th></th>\n      </tr>\n      </thead>\n      <tr repeat.for=\"subject of current.subjectList\">\n        <td>${ subject.name & oneTime}</td>\n        <td>\n          <div class=\"btn-group btn-group-xs\" role=\"group\">\n            <button type=\"button\" class=\"btn btn-default ${ subject.id === newSubject.id ? 'active' : ''}\" click.delegate=\"edit(subject)\">\n              <i class=\"fa fa-pencil\"></i> Edit\n            </button>\n            <button type=\"button\" class=\"btn btn-default\" click.delegate=\"delete(subject)\">\n              <i class=\"fa fa-eraser\"></i> Delete\n            </button>\n          </div>\n        </td>\n      </tr>\n    </table>\n  </div>\n</template>\n"; });
define('text!gradebook/addYear.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"shared/converters/dateFormat\"></require>\n\n  <div class=\"col-md-6\">\n    <h3>${ title }</h3>\n    <form class=\"form-horizontal\" submit.delegate=\"submit()\" validation-renderer=\"bootstrap-form\">\n\n      <!-- Name Form -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">School Name:</label>\n        <div class=\"col-md-6\">\n          <input type=\"text\" class=\"form-control\" value.bind=\"newYear.school & validate\" focus.bind=\"formStart\">\n        </div>\n      </div>\n\n      <!-- Start Date -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">First day of School:</label>\n        <div class=\"col-md-6\">\n          <input type=\"date\" value.bind=\"newYear.first_day & validate\" class=\"form-control\">\n        </div>\n      </div>\n\n      <!-- End Date -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">Last day of School:</label>\n        <div class=\"col-md-6\">\n          <input type=\"date\" value.bind=\"newYear.last_day & validate\" class=\"form-control\">\n        </div>\n      </div>\n\n      <!-- Submit Button -->\n      <div class=\"form-group\">\n        <div class=\"col-md-offset-4 col-md-6 text-center\">\n          <button type=\"submit\" class=\"btn btn-primary\">\n            ${ bttn }\n          </button>\n          <button click.delegate=\"reset()\" class=\"btn btn-danger\">\n            Cancel\n          </button>\n        </div>\n      </div>\n    </form>\n  </div>\n\n  <!-- Added Years -->\n  <div class=\"col-md-6\">\n    <h3>Saved</h3>\n    <table class=\"table table-hover\">\n      <thead>\n      <tr>\n        <th>Year</th>\n        <th>School</th>\n        <th></th>\n      </tr>\n      </thead>\n      <tr repeat.for=\"year of years.objects\">\n        <td>${ year.first_day | dateFormat: 'YYYY' & oneTime}</td>\n        <td>${ year.school & oneTime }</td>\n        <td>\n          <div class=\"btn-group btn-group-xs\" role=\"group\">\n            <button type=\"button\" class=\"btn btn-default ${ year.id === current.year.id ? 'active' : ''}\"\n                    click.delegate=\"current.setYear(year)\">\n              <i class=\"fa fa-bolt\"></i> Activate\n            </button>\n            <button type=\"button\" class=\"btn btn-default ${ year.id === newYear.id ? 'active' : ''}\"\n                    click.delegate=\"edit(year)\">\n              <i class=\"fa fa-pencil\"></i> Edit\n            </button>\n            <button type=\"button\" class=\"btn btn-default\"\n                    click.delegate=\"delete(year)\">\n              <i class=\"fa fa-eraser\"></i> Delete\n            </button>\n          </div>\n        </td>\n      </tr>\n    </table>\n  </div>\n</template>\n"; });
define('text!gradebook/index.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./components/assignmentlist\"></require>\n  <require from=\"./components/scoresList\"></require>\n  <require from=\"./components/quickEntry\"></require>\n  <require from=\"./components/addAssignment\"></require>\n  <require from=\"./components/reportAssignment\"></require>\n\n  <!-- Subjects Menu -->\n  <ul class=\"nav nav-tabs\">\n    <li>\n      <h4>Subjects</h4>\n    </li>\n    <li repeat.for=\"sub of current.subjectList\" role=\"presentation\"\n        class=\"${sub.id === current.subject.id ? 'active' : ''}\">\n      <a href=\"\" click.delegate=\"current.setSubject(sub)\">${ sub.name }</a>\n    </li>\n  </ul>\n\n  <!-- Subject Menu Bar -->\n  <div class=\"row\" show.bind=\"current.subject\">\n    <ul class=\"nav nav-pills\">\n      <li role=\"presentation\" class=\"${editMode === 'add' ? 'active' : ''}\">\n        <a href=\"#\" click.delegate=\"addAssignment()\"><i class=\"fa fa-plus fa-lg\"></i> Add Assignment</a>\n      </li>\n      <li role=\"presentation\" show.bind=\"current.scores\" class=\"${quickEntry ? 'active' : ''}\">\n        <a href=\"#\" click.delegate=\"toggleQuick()\"><i class=\"fa fa-fast-forward\"></i> Quick Entry</a>\n      </li>\n      <li role=\"presentation\" show.bind=\"current.scores || editMode === 'edit'\" class=\"${editMode === 'edit' ? 'active' : ''}\">\n        <a href=\"#\" click.delegate=\"editAssignment()\"><i class=\"fa fa-pencil\"></i> Edit Assignment</a>\n      </li>\n      <li role=\"presentation\" show.bind=\"current.scores\">\n        <a href=\"#\" click.delegate=\"deleteAssignment()\"><i class=\"fa fa-eraser\"></i> Delete Assignment</a>\n      </li>\n    </ul>\n  </div>\n\n  <!-- Assignment List -->\n  <div class=\"row\">\n    <div class=\"col-md-2\" if.bind=\"current.subject\">\n      <h5>Assignments</h5>\n      <assignment-list></assignment-list>\n    </div>\n\n    <!-- Scores List -->\n    <div class=\"col-md-4\" if.bind=\"current.scores && !editMode\">\n      <h5>Scores</h5>\n      <scores-list if.bind=\"!quickEntry\"></scores-list>\n      <quick-entry if.bind=\"quickEntry\"></quick-entry>\n    </div>\n\n    <!-- Reports -->\n    <div class=\"col-md-6\" if.bind=\"current.scores && !editMode\">\n      <h5>Assesment</h5>\n      <report-assignment></report-assignment>\n    </div>\n\n    <!-- Add Assignment -->\n    <div class=\"col-md-5\" if.bind=\"editMode\">\n      <add-assignment mode.two-way=\"editMode\"></add-assignment>\n    </div>\n  </div>\n</template>\n"; });
define('text!home/index.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"col-md-6\">\n    <h1>Welcome to Marks!</h1>\n    <p>\n      The primary goal of marks was to create a tool that enables data-driven teaching in primary schools. Primary education provides a unique opportunity for data-driven methods as there typically is one person in charge of a classroom for a long duration. This means many opportunities to track a student's progress and make interventions based on data, given the proper tool.\n    </p>\n    <p>\n      However, in order for a data-driven method to be successful, you need data (duh) and ability to quickly draw insights from that data (less duh). The largest impediments to these requirements are data entry and useful reporting. Marks attempts to remove these obstacles by focusing on easy data entry and reporting that reduces teacher workload. Essentially, it tries to make the teacher want to use the application to make their life easier, while providing a data infrastructure as a bonus. To incentivize teacher adoption, each feature is designed to reduce teacher workload in some aspect. For example, the quick entry mode in Marks allows for an unsorted stack of papers to have their grades entered and calculated quickly. This lowers the barrier for gathering data while making the essential act of keeping grades less onerous. To close the loop, being able to generate easily interpretable reports on the assignment, subject, and student level provides a useful resource for student/parent conferences, individual student plans, and report card generation. Together, making data entry and data interpretation as painless as possible provides a foundation for a data-driven classroom to be built upon.\n    </p>\n  </div>\n  <div class=\"col-md-6\">\n    <h2>Sign up</h2>\n    <form class=\"form-horizontal\" submit.delegate=\"submitSignUp()\" validation-renderer=\"bootstrap-form\">\n\n      <!-- E-mail -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">E-mail:</label>\n        <div class=\"col-md-6\">\n          <input type=\"email\" class=\"form-control\" value.bind=\"newUser.email & validate\">\n        </div>\n      </div>\n\n      <!-- Password -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">Password</label>\n        <div class=\"col-md-6\">\n          <input type=\"password\" value.bind=\"newUser.password & validate\" class=\"form-control\">\n        </div>\n      </div>\n\n      <!-- Submit Button -->\n      <div class=\"form-group\">\n        <div class=\"col-md-offset-4 col-md-6 text-center\">\n          <button type=\"submit\" class=\"btn btn-primary\">\n            Sign Up\n          </button>\n          <button class=\"btn btn-danger\">\n            Sign in with Google\n          </button>\n        </div>\n      </div>\n    </form>\n  </div>\n</template>\n"; });
define('text!reports/index.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./components/studentReport\"></require>\n\n  <!-- Reports Menu -->\n  <ul class=\"nav nav-tabs\">\n    <li>\n      <h4>Reports</h4>\n    </li>\n    <li repeat.for=\"report of reports\" role=\"presentation\"\n        class=\"${report === selectedReport ? 'active' : ''}\">\n      <a href=\"\" click.delegate=\"setReport(report)\">${ report }</a>\n    </li>\n  </ul>\n\n  <student-report if.bind=\"selectedReport === 'Student'\"></student-report>\n</template>\n"; });
define('text!admin/components/password.html', ['module'], function(module) { module.exports = "<template>\n  <!-- Reset Form -->\n  <div if.bind=\"reset\">\n    <h2>Reset Password</h2>\n    <form class=\"form-horizontal\" submit.delegate=\"resetPassword()\">\n\n      <!-- New Password -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">New Password:</label>\n        <div class=\"col-md-6\">\n          <input type=\"password\" class=\"form-control\"\n                 value.bind=\"password.new\" required>\n        </div>\n      </div>\n\n      <!-- Confirm New Password -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">Confirm New Password:</label>\n        <div class=\"col-md-6\">\n          <input type=\"password\" value.bind=\"password.confirm\" class=\"form-control\"\n                 required>\n        </div>\n      </div>\n\n      <!-- Submit Button -->\n      <div class=\"form-group\">\n        <div class=\"col-md-offset-4 col-md-6 text-center\">\n          <button type=\"submit\" class=\"btn btn-primary\">\n            Change Password\n          </button>\n          ${ feedback }\n        </div>\n      </div>\n    </form>\n  </div>\n\n  <!-- Change Password Form -->\n  <div if.bind=\"!reset\">\n    <h2>Change Password</h2>\n    <form class=\"form-horizontal\" submit.delegate=\"changePassword()\">\n\n      <!-- Current Password -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">Current Password:</label>\n        <div class=\"col-md-6\">\n          <input type=\"password\" class=\"form-control\"\n                 value.bind=\"password.current\" required>\n        </div>\n      </div>\n\n      <!-- New Password -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">New Password:</label>\n        <div class=\"col-md-6\">\n          <input type=\"password\" class=\"form-control\"\n                 value.bind=\"password.new\" required>\n        </div>\n      </div>\n\n      <!-- Confirm New Password -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">Confirm New Password:</label>\n        <div class=\"col-md-6\">\n          <input type=\"password\" value.bind=\"password.confirm\" class=\"form-control\"\n                 required>\n        </div>\n      </div>\n\n      <!-- Submit Button -->\n      <div class=\"form-group\">\n        <div class=\"col-md-offset-4 col-md-6 text-center\">\n          <button type=\"submit\" class=\"btn btn-primary\">\n            Change Password\n          </button>\n          ${ feedback }\n        </div>\n      </div>\n    </form>\n  </div>\n</template>\n"; });
define('text!admin/components/profile.html', ['module'], function(module) { module.exports = "<template>\n  <h3>Profile</h3>\n  <form submit.delegate=\"submit()\" class=\"form-horizontal\" validation-renderer=\"bootstrap-form\">\n    <!-- Title -->\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\">Title:</label>\n      <div class=\"col-md-6\">\n        <select class=\"form-control\" value.bind=\"profile.title & validate\">\n          <option value=\"\">Select</option>\n          <option value=\"Ms.\">Ms.</option>\n          <option value=\"Mrs.\">Mrs.</option>\n          <option value=\"Mr.\">Mr.</option>\n          <option value=\"Dr.\">Dr.</option>\n        </select>\n      </div>\n    </div>\n    <!-- First Name -->\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\" for=\"firstname\">First Name:</label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" class=\"form-control\" id=\"firstname\" placeholder=\"First Name\"\n               value.bind=\"profile.first_name & validate\">\n      </div>\n    </div>\n\n    <!-- Last Name -->\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\" for=\"lastname\">Last Name:</label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" class=\"form-control\" id=\"lastname\" placeholder=\"Last Name\"\n               value.bind=\"profile.last_name & validate\">\n      </div>\n    </div>\n\n    <!-- Submit Button -->\n    <div class=\"form-group\">\n      <div class=\"col-md-offset-4 col-md-6 text-center\">\n        <button type=\"submit\" class=\"btn btn-primary\">Save Changes</button>\n        <i if.bind=\"isSaving\" class=\"fa fa-circle-o-notch fa-spin fa-2x\" aria-hidden=\"true\"></i>\n        <i if.bind=\"saved\" class=\"fa fa-check text-success fa-2x\" aria-hidden=\"true\"></i>\n      </div>\n    </div>\n  </form>\n</template>\n"; });
define('text!gradebook/components/addAssignment.html', ['module'], function(module) { module.exports = "<template>\n  <h5>${ title }</h5>\n  <form class=\"form-horizontal\" submit.delegate=\"submit()\" validation-renderer=\"bootstrap-form\">\n\n    <!-- Assignment Name -->\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\">Name:</label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" class=\"form-control\" value.bind=\"newAssignment.name & validate\">\n      </div>\n    </div>\n\n    <!-- Date of Assignment -->\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\">Date Assigned:</label>\n      <div class=\"col-md-6\">\n        <input type=\"date\" name=\"date\" class=\"form-control\"\n               value.bind=\"newAssignment.date & validate\">\n      </div>\n    </div>\n\n    <!-- Assignment Type -->\n    <div class=\"form-group\" show.bind=\"mode !== 'edit'\">\n      <label class=\"col-md-4 control-label\">Type:</label>\n      <div class=\"col-md-6\">\n        <select class=\"form-control\" name=\"type\" value.bind=\"newAssignment.type & validate\">\n          <option value=\"\">Select Type</option>\n          <option value=\"Points\">Points</option>\n          <option value=\"Checks\">Checks</option>\n        </select>\n      </div>\n    </div>\n\n    <!-- Max Points -->\n    <div class=\"form-group\" if.bind=\"newAssignment.type === 'Points'\">\n      <label class=\"col-md-4 control-label\">Max Points:</label>\n      <div class=\"col-md-6\">\n        <input type=\"number\" name=\"max\" class=\"form-control\" value.bind=\"newAssignment.max & validate\">\n      </div>\n    </div>\n\n    <!-- Submit Button -->\n    <div class=\"form-group\">\n      <div class=\"col-md-6 col-md-offset-5\">\n        <button type=\"submit\" class=\"btn btn-primary\">\n          ${ btn }\n        </button>\n        <button click.delegate=\"cancel()\" class=\"btn btn-danger\">\n          Cancel\n        </button>\n      </div>\n    </div>\n\n  </form>\n</template>\n"; });
define('text!gradebook/components/assignmentlist.html', ['module'], function(module) { module.exports = "<template>\n  <ul class=\"nav nav-pills nav-stacked\">\n    <li repeat.for=\"assignment of current.assignmentList\"\n        role=\"presentation\"\n        class=\"${assignment.id === current.assignment.id ? 'active' : ''}\">\n      <a href=\"\" click.delegate=\"current.setAssignment(assignment)\">${ assignment.name & oneTime }</a>\n    </li>\n  </ul>\n</template>\n"; });
define('text!gradebook/components/quickEntry.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../lib/autocomplete\"></require>\n  <require from=\"../../shared/converters/scoreFormat\"></require>\n\n  <table class=\"table table-hover\">\n    <thead>\n      <tr>\n        <th></th>\n        <th class=\"text-center\">${ current.assignment.type }\n          <small show.bind=\"isPoints\">\n            (max: ${ current.assignment.max })</small></th>\n      </tr>\n    </thead>\n    <tr repeat.for=\"score of entered\">\n      <td class=\"text-center\">${ score.student.first_name }</td>\n      <td class=\"text-center\" innerhtml.bind=\"score.value | scoreFormat: score.assignment\"></td>\n    </tr>\n\n    <!-- Input Row -->\n    <tr>\n      <td class=\"text-center\">\n        <!-- Name Input -->\n          <div class=\"form-group\">\n            <autocomplete service.bind=\"suggestionService\"\n                          value.bind=\"score\"\n                          placeholder=\"Name\"\n                          name-focus.bind=\"nameFocus\"\n                          score-focus.bind=\"scoreFocus\"\n                          is-points.bind=\"isPoints\"\n                          checks.call=\"parseKey(key)\">\n            <template replace-part=\"suggestion\">\n              <span style=\"font-style: italic\">${suggestion}</span>\n            </template>\n</autocomplete>\n</div>\n</td>\n\n<!-- Value Input -->\n<td class=\"text-center\">\n  <div class=\"form-group\">\n    <div if.bind=\"isPoints\" class=\"form-group\">\n      <input value.bind=\"quickPoints\"\n             type=\"number\"\n             class=\"form-control\"\n             style=\"width: 5em;\"\n             placeholder=\"Score\"\n             focus.bind=\"scoreFocus\"\n             keypress.delegate=\"parseKey($event.which)\" />\n    </div>\n    <div if.bind=\"!isPoints\">\n      <i class=\"fa fa-check-circle-o fa-2x\" aria-hidden=\"true\"></i>\n    </div>\n  </div>\n</td>\n</tr>\n</table>\n</template>\n"; });
define('text!gradebook/components/reportAssignment.html', ['module'], function(module) { module.exports = "<template>\n<style>\n\n.bar rect {\nfill: steelblue;\n}\n\n.bar text {\nfill: #fff;\nfont: 10px sans-serif;\n}\n\ndiv.tooltip {\n    position: absolute;\n    text-align: center;\n    width: auto;\n    height: auto;\n    padding: 2px;\n    font: 16px sans-serif;\n    background: lightsteelblue;\n    border: 0px;\n    border-radius: 8px;\n    pointer-events: none;\n\n}\n\n.arc text {\n  font: 10px sans-serif;\n  text-anchor: middle;\n}\n\n.arc path {\n  stroke: #fff;\n}\n\n.legend {\n    font-size: 13px;\n  }\n  h1 {\n  font-size: 15px;\n  text-align: center;\n\t}\n  rect {\n    stroke-width: 2;\n  }\n\n  .tooltip2 {\n  box-shadow: 0 0 5px #999999;\n  display: none;\n  font-size: 12px;\n  left: 130px;\n  padding: 10px;\n  position: absolute;\n  text-align: center;\n  top: 95px;\n  width: 80px;\n  z-index: 10;\n  line-height: 140%; /*Interlineado*/\n  font-family: \"Open Sans\", sans-serif;\n  font-weight: 300;\n  background: rgba(0, 0, 0, 0.8);\n  color: #fff;\n  border-radius: 2px;\n\t}\n\n  .label {\n   font-weight: 600;\n  }\n\n</style>\n  <div id=\"content\"></div>\n</template>\n"; });
define('text!gradebook/components/scoresList.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../../shared/converters/scoreFormat\"></require>\n\n  <table class=\"table table-hover\">\n    <thead>\n    <tr>\n      <th></th>\n      <th class=\"text-center\">${ current.assignment.type }\n        <small show.bind=\"current.assignment.isPoints && current.assignment.max !== 0\">\n          (max: ${current.assignment.max})</small></th>\n    </tr>\n    </thead>\n      <tr repeat.for=\"score of current.scores\">\n        <td class=\"text-center\">${ score.student.first_name }</td>\n        <td class=\"text-center\" click.delegate=\"editScore(score)\">\n          <!-- View Mode -->\n          <div if.bind=\"score.id !== editScoreId\" innerhtml.bind=\"score.value | scoreFormat: score.assignment\"></div>\n\n          <!-- Edit Mode -->\n          <div if.bind=\"score.id === editScoreId\">\n              <input keypress.delegate=\"deFocus($event.which)\"\n                     focus.bind=\"editFocus\"\n                     blur.trigger=\"updateScore(score, $index)\"\n                     value.bind=\"score.value & validate\"\n                     type=\"number\"\n                     style=\"width: 3.5em\">\n          </div>\n        </td>\n      </tr>\n  </table>\n\n</template>\n"; });
define('text!gradebook/lib/autocomplete.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./autocomplete.css\"></require>\n\n  <input type=\"text\" autocomplete=\"off\" class=form-control\n         aria-autocomplete=\"list\"\n         aria-expanded.bind=\"expanded\"\n         aria-owns.one-time=\"'au-autocomplate-' + id + '-suggestions'\"\n         aria-activedescendant.bind=\"index >= 0 ? 'au-autocomplate-' + id + '-suggestion-' + index : ''\"\n         id.one-time=\"'au-autocomplete-' + id\"\n         placeholder.bind=\"placeholder\"\n         value.bind=\"inputValue & debounce:delay\"\n         keydown.delegate=\"keydown($event.which)\"\n         blur.trigger=\"blur()\"\n         focus.bind=\"nameFocus\">\n  <ul class=\"suggestions\" role=\"listbox\"\n      if.bind=\"expanded\"\n      id.one-time=\"'au-autocomplate-' + id + '-suggestions'\"\n      ref=\"suggestionsUL\">\n    <li repeat.for=\"suggestion of suggestions\"\n        id.one-time=\"'au-autocomplate-' + id + '-suggestion-' + $index\"\n        role=\"option\"\n        class-name.bind=\"($index === index ? 'selected' : '') + ' suggestion'\"\n        mousedown.delegate=\"suggestionClicked(suggestion)\">\n        ${ suggestion.studref.first_name }\n      <!-- <template replaceable-part=\"suggestion\">\n        ${ suggestion }\n      </template> -->\n    </li>\n  </ul>\n</template>\n"; });
define('text!home/signup/firstTime.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"gradebook/addYear\"></require>\n  <require from=\"gradebook/addStudent\"></require>\n  <require from=\"gradebook/addSubject\"></require>\n  <require from=\"admin/components/profile\"></require>\n\n  <div class=\"col-md-2\">\n    <h3>Setup</h3>\n    <ul class=\"nav nav-stacked\">\n      <li role=\"presentation\"\n          repeat.for=\"step of completed\">\n        <a class=\"text-success\"><i class=\"fa fa-check-circle-o text-success\" aria-hidden=\"true\"></i> ${ step }</a>\n      </li>\n      <li role=\"presentation\"\n          repeat.for=\"step of todo\"\n          class=\"${ step === activeStep ? 'active' : 'disabled'}\">\n        <a href click.delegate=\"nextStep(step)\"><i class=\"fa fa-circle-o\" aria-hidden=\"true\"></i> ${ step }</a>\n      </li>\n    </ul>\n\n  </div>\n\n  <div class=\"col-md-10\">\n    <div class=\"row\">\n      <div if.bind=\"activeStep === 'Introduction'\">\n        <h3>Checklist</h3>\n        <p class=\"col-md-6\">\n          Welcome to Marks! This guided setup will get you up and running fast.\n          After entering all the information for each step mark it done by click on the circle to the left!\n          You're done with the introduction so go ahead and \"marks\" it done!\n        </p>\n      </div>\n      <profile if.bind=\"activeStep === 'Profile'\"></profile>\n      <add-year if.bind=\"activeStep === 'Years'\"></add-year>\n      <add-student if.bind=\"activeStep === 'Students'\"></add-student>\n      <add-subject if.bind=\"activeStep === 'Subjects'\"></add-subject>\n      <div if.bind=\"todo.length === 0\">\n        <h3>All done! Sending you to your gradebook!</h3>\n      </div>\n    </div>\n  </div>\n</template>\n"; });
define('text!home/signup/payment.html', ['module'], function(module) { module.exports = "<template>\n  <h1>Enter Payment Information</h1>\n  <a href=\"/#/first_time\" class=\"btn\">Setup Gradebook</a>\n<template>\n"; });
define('text!reports/components/studentReport.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../converters/scoreFilter\"></require>\n  <require from=\"../attributes/timePlot\"></require>\n  <require from=\"shared/converters/dateFormat\"></require>\n  <require from=\"shared/converters/scoreFormat\"></require>\n\n  <style> /* set the CSS */\n.line {\n  fill: none;\n  stroke: steelblue;\n  stroke-width: 2px;\n}\n</style>\n\n  <!-- Selection Menu -->\n  <div class=\"row\">\n    <form class=\"form-inline\" submit.delegate=\"generate()\">\n      <div class=\"form-group\">\n        <label>Select Student:</label>\n        <select class=\"form-control\" value.bind=\"selected.student\" placeholder=\"Select Student\">\n          <option repeat.for=\"student of students\" model.bind=\"student\">\n            ${ student.first_name } ${ student.last_name }\n          </option>\n        </select>\n      </div>\n      <div class=\"form-group\">\n        <label>Start Date:</label>\n          <input type=\"date\" class=\"form-control\" value.bind=\"selected.start\">\n      </div>\n\n      <div class=\"form-group\">\n        <label>End Date:</label>\n          <input type=\"date\" class=\"form-control\" value.bind=\"selected.end\">\n      </div>\n\n      <button type=\"submit\" class=\"btn btn-default\">Generate Report</button>\n      <ul>\n    </form>\n  </div>\n\n  <!-- Report Header -->\n  <div if.bind=\"reportGenerated\">\n  <div class=\"row\">\n    <h1>${ selected.student.first_name & oneTime} ${ selected.student.last_name & oneTime}</h1>\n  </div>\n\n  <!-- Subject Rows -->\n  <div class=\"row\" repeat.for=\"subject of current.subjectList\">\n    <div class=\"col-md-4\">\n      <h2>${ subject.name & oneTime}</h2>\n      <table class=\"table\">\n        <div if.bind=\"$first\">\n          <thead>\n            <th></th>\n            <th>Date</th>\n            <th>Max Score</th>\n            <th>Score</th>\n          </thead>\n        </div>\n        <tbody>\n          <tr repeat.for=\"score of scores | scoreFilter: subject.id\">\n            <td>${ score.assref.name & oneTime}</td>\n            <td>${ score.assref.date | dateFormat: 'MMMM Do' & oneTime}</td>\n            <td>${ score.assref.max & oneTime}</td>\n            <td innerhtml.bind=\"score.value | scoreFormat: score.assignment & oneTime\"></td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n\n    <!-- Plots -->\n    <div class=\"col-md-6\">\n      <div class=\"col-md-6\">\n        <h2>Points</h2>\n        <div time-plot=\"scores.bind: scores | scoreFilter: subject.id; type.bind: 'Points'\"></div>\n      </div>\n      <div class=\"col-md-6\">\n        <h2>Checks</h2>\n        <div time-plot=\"scores.bind: scores | scoreFilter: subject.id; type.bind: 'Checks'\"></div>\n      </div>\n    </div>\n  </div>\n</div>\n</template>\n"; });
define('text!shared/components/navbar.html', ['module'], function(module) { module.exports = "<template>\n<require from=\"shared/converters/dateFormat\"></require>\n\n  <style>\n  #login-dp{\n    min-width: 250px;\n    padding: 14px 14px 0;\n    overflow:hidden;\n    background-color:rgba(255,255,255,.8);\n  }\n  #login-dp .help-block{\n    font-size:12px\n  }\n  #login-dp .bottom{\n    background-color:rgba(255,255,255,.8);\n    border-top:1px solid #ddd;\n    clear:both;\n    padding:14px;\n  }\n  #login-dp .social-buttons{\n    margin:12px 0\n  }\n  #login-dp .social-buttons a{\n    width: 49%;\n  }\n  #login-dp .form-group {\n    margin-bottom: 10px;\n  }\n  .btn-fb{\n    color: #fff;\n    background-color:#3b5998;\n  }\n  .btn-fb:hover{\n    color: #fff;\n    background-color:#496ebc\n  }\n  .btn-tw{\n    color: #fff;\n    background-color:#55acee;\n  }\n  .btn-tw:hover{\n    color: #fff;\n    background-color:#59b5fa;\n  }\n  @media(max-width:768px){\n    #login-dp{\n        background-color: inherit;\n        color: #fff;\n    }\n    #login-dp .bottom{\n        background-color: inherit;\n        border-top:0 none;\n    }\n  }\n  </style>\n\n  <!-- Navigation Bar -->\n  <nav class=\"navbar navbar-default\">\n    <div class=\"container-fluid\">\n      <!-- Brand and toggle get grouped for better mobile display -->\n      <div class=\"navbar-header\">\n        <button type=\"button\" class=\"navbar-toggle collapsed\"\n                data-toggle=\"collapse\"\n                data-target=\"#bs-example-navbar-collapse-1\"\n                aria-expanded=\"false\">\n          <span class=\"sr-only\">Toggle navigation</span>\n          <span class=\"icon-bar\"></span>\n          <span class=\"icon-bar\"></span>\n          <span class=\"icon-bar\"></span>\n        </button>\n        <a class=\"navbar-brand\" href=\"#\" }>Marks</a>\n      </div>\n\n      <!-- Collect the nav links, forms, and other content for toggling -->\n      <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n        <ul class=\"nav navbar-nav\">\n          <li repeat.for=\"row of router.navigation | authFilter: auth.isAuthenticated()\" class=\"${row.isActive ? 'active' : ''}\">\n            <a href.bind=\"row.href\">${row.title}</a>\n          </li>\n        </ul>\n        <ul class=\"nav navbar-nav navbar-right\">\n          <li class=\"dropdown\" if.bind=\"auth.isAuthenticated()\">\n            <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n              ${ current.user.teacherName }<span if.bind=\"current.year\"> - ${ current.year.school } (${ current.year.first_day | dateFormat: 'YYYY' })</span><span class=\"caret\"></span>\n            </a>\n              <ul class=\"dropdown-menu\">\n                <li><a route-href=\"route: addsubject\">Add Subject</a></li>\n                <li><a route-href=\"route: addstudent\">Add Student</a></li>\n                <li><a route-href=\"route: addyear\">Add Year</a></li>\n                <li role=\"separator\" class=\"divider\"></li>\n                <li><a route-href=\"route: settings\">Settings</a></li>\n                <li role=\"separator\" class=\"divider\"></li>\n                <li><a href=\"\" click.delegate=\"logout()\">Logout</a></li>\n              </ul>\n          </li>\n          <li class=\"dropdown\" if.bind=\"!auth.isAuthenticated()\">\n            <a href=\"#\" click.delegate=\"showReset = flase\"class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">\n              Login<span class=\"caret\"></span>\n            </a>\n            <ul id=\"login-dp\" class=\"dropdown-menu\">\n              <li>\n                 <div class=\"row\">\n                    <div class=\"col-md-12\">\n                      <!-- <div class=\"social-buttons\">\n                        <a href=\"#\" class=\"btn btn-fb\"><i class=\"fa fa-facebook\"></i> Facebook</a>\n                        <a href=\"#\" class=\"btn btn-tw\"><i class=\"fa fa-twitter\"></i> Twitter</a>\n                      </div> -->\n                       <form if.bind=\"!showReset\" submit.delegate=\"login()\" class=\"form\" role=\"form\" id=\"login-nav\" validation-renderer=\"bootstrap-form\">\n                          <div class=\"form-group\">\n                             <label class=\"sr-only\" for=\"exampleInputEmail2\">Email address</label>\n                             <input value.bind=\"user.email & validate\" type=\"email\" class=\"form-control\" id=\"exampleInputEmail2\" placeholder=\"Email address\" required>\n                          </div>\n                          <div class=\"form-group\">\n                            <label class=\"sr-only\" for=\"exampleInputPassword2\">Password</label>\n                            <input value.bind=\"user.password & validate\" type=\"password\" class=\"form-control\" id=\"exampleInputPassword2\" placeholder=\"Password\" required>\n                            <div class=\"help-block text-right\"><a href=\"#\" click.delegate=\"toggleReset()\">Forget your password?</a></div>\n                          </div>\n                          <div class=\"form-group\">\n                             <button type=\"submit\" class=\"btn btn-primary btn-block\">Sign in</button>\n                          </div>\n                          <!-- <div class=\"checkbox\">\n                             <label>\n                             <input type=\"checkbox\"> keep me logged-in\n                             </label>\n                          </div> -->\n                       </form>\n                       <form if.bind=\"showReset\" submit.delegate=\"sendReset()\" class=\"form\" role=\"form\" id=\"login-nav\">\n                          <div class=\"form-group\">\n                             <label class=\"sr-only\" for=\"exampleInputEmail2\">Email address</label>\n                             <input value.bind=\"loginData.email\" type=\"email\" class=\"form-control\" id=\"exampleInputEmail2\" placeholder=\"Email address\" required>\n                          </div>\n                          <div class=\"form-group\">\n                             <button type=\"submit\" class=\"btn btn-primary btn-block\">Send Reset E-mail</button>\n                          </div>\n                          <!-- <div class=\"checkbox\">\n                             <label>\n                             <input type=\"checkbox\"> keep me logged-in\n                             </label>\n                          </div> -->\n                       </form>\n                    </div>\n                    <!-- <div class=\"bottom text-center\">\n                      New here ? <a href=\"#\"><b>Join Us</b></a>\n                    </div> -->\n                 </div>\n              </li>\n            </ul>\n          </li>\n        </ul>\n      </div>\n    </div>\n  </nav>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map