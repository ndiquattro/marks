define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Marks';
      config.map([{ route: '', redirect: 'gradebook' }, { route: 'gradebook', moduleId: './gradebook/index', nav: 1, title: 'Gradebook' }, { route: 'admin', moduleId: 'admin', nav: 2, title: 'Administration' }]);

      this.router = router;
    };

    return App;
  }();
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
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

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
define('gradebook/index',['exports', 'aurelia-framework', 'aurelia-http-client', './services/assignmentService'], function (exports, _aureliaFramework, _aureliaHttpClient, _assignmentService) {
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

  var GradeBook = exports.GradeBook = (_dec = (0, _aureliaFramework.inject)(_assignmentService.AssignmentService, _aureliaHttpClient.HttpClient), _dec(_class = function () {
    function GradeBook(assignment, http) {
      _classCallCheck(this, GradeBook);

      this.assignment = assignment;
      this.http = http;

      this.subjectSelected = false;
      this.assignmentSelected = false;
      this.quickEntry = false;
      this.addingAssignment = false;
      this.editingAssignment = false;
      this.reloadAssignmentsFlag = false;
    }

    GradeBook.prototype.created = function created() {
      var _this = this;

      this.http.get('http://localhost:5000/api/subjects').then(function (data) {
        _this.subjects = JSON.parse(data.response).objects;
      });
    };

    GradeBook.prototype.addAssignment = function addAssignment() {
      this.assignmentSelected = false;
      this.assignment.clearAssignment();
      this.addingAssignment = true;
    };

    GradeBook.prototype.editAssignment = function editAssignment(assignment) {
      this.editingAssignment = true;
    };

    GradeBook.prototype.deleteAssignment = function deleteAssignment(assignment) {
      var _this2 = this;

      var confirmed = confirm('Are you sure you want to delete ' + assignment.name + '?');

      if (confirmed) {
        this.http.createRequest('http://localhost:5000/api/assignments/' + assignment.id).asDelete().send().then(function (resp) {
          return _this2.reloadAssignments(resp.response);
        });

        this.assignmentSelected = false;
      }
    };

    GradeBook.prototype.selectSubject = function selectSubject(subject) {
      this.subjectSelected = subject;
      this.assignmentSelected = false;
      this.addingAssignment = false;
    };

    GradeBook.prototype.selectAssignment = function selectAssignment(assignment) {
      this.assignmentSelected = false;
      this.assignment.clearAssignment();

      this.assignment.setAssignment(assignment);
      this.assignmentSelected = true;
    };

    GradeBook.prototype.reloadAssignments = function reloadAssignments(assignment) {
      this.reloadAssignmentsFlag = !this.reloadAssignmentsFlag;
      this.addingAssignment = false;
      this.editingAssignment = false;
    };

    GradeBook.prototype.toggleQuick = function toggleQuick() {
      this.quickEntry = !this.quickEntry;
    };

    return GradeBook;
  }()) || _class);
});
define('resources/autocomplete',['exports', 'aurelia-binding', 'aurelia-templating', 'aurelia-dependency-injection', 'aurelia-pal'], function (exports, _aureliaBinding, _aureliaTemplating, _aureliaDependencyInjection, _aureliaPal) {
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
        if (suggestions.length === 1 && suggestions[0].studref.first_name !== _this.value) {
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
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('gradebook/components/addAssignment',['exports', 'aurelia-framework', 'aurelia-http-client', 'aurelia-templating'], function (exports, _aureliaFramework, _aureliaHttpClient, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AddAssignment = undefined;

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

  var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var AddAssignment = exports.AddAssignment = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient), _dec(_class = (_class2 = function () {
    function AddAssignment(http) {
      _classCallCheck(this, AddAssignment);

      _initDefineProp(this, 'subject', _descriptor, this);

      _initDefineProp(this, 'edit', _descriptor2, this);

      _initDefineProp(this, 'reloadAssignments', _descriptor3, this);

      this.http = http;
      this.assignment = {};
    }

    AddAssignment.prototype.bind = function bind() {
      if (this.edit) {
        this.title = 'Edit Assignment';
        this.btn = 'Save Changes';
        this.assignment = this.edit;
      } else {
        this.title = 'Add Assignment';
        this.btn = this.title;
      }
    };

    AddAssignment.prototype.submitAssignment = function submitAssignment() {
      var _this = this;

      if (this.edit) {
        this.http.createRequest('http://localhost:5000/api/assignments/' + this.assignment.id).asPut().withContent(this.assignment).send().then(function (resp) {
          return _this.reloadAssignments({ assignment: resp.response });
        });
      } else {
        this.assignment.subjid = this.subject.id;

        this.http.createRequest('http://localhost:5000/api/assignments').asPost().withContent(this.assignment).send().then(function (resp) {
          return _this.reloadAssignments({ assignment: resp.response });
        });

        this.assignment = {};
      }
    };

    AddAssignment.prototype.cancelEdit = function cancelEdit() {
      this.reloadAssignments();
    };

    return AddAssignment;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'subject', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'edit', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'reloadAssignments', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('gradebook/components/assignmentlist',['exports', 'aurelia-framework', 'aurelia-http-client', 'aurelia-templating'], function (exports, _aureliaFramework, _aureliaHttpClient, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AssignmentList = undefined;

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

  var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var AssignmentList = exports.AssignmentList = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient), _dec(_class = (_class2 = function () {
    function AssignmentList(http) {
      _classCallCheck(this, AssignmentList);

      _initDefineProp(this, 'subject', _descriptor, this);

      _initDefineProp(this, 'reload', _descriptor2, this);

      _initDefineProp(this, 'selectAssignment', _descriptor3, this);

      this.http = http;

      this.selectedId = false;
    }

    AssignmentList.prototype.subjectChanged = function subjectChanged() {
      this.getAssignments(this.subject);
      this.selectedId = false;
    };

    AssignmentList.prototype.reloadChanged = function reloadChanged() {
      this.getAssignments(this.subject);
    };

    AssignmentList.prototype.getAssignments = function getAssignments(subject) {
      var _this = this;

      var qobj = {
        filters: [{ 'name': 'subjid', 'op': 'eq', 'val': subject.id }],
        order_by: [{ 'field': 'date', 'direction': 'desc' }]
      };

      this.http.createRequest('http://localhost:5000/api/assignments').asGet().withParams({ q: JSON.stringify(qobj) }).send().then(function (data) {
        _this.assignments = JSON.parse(data.response).objects;
      });
    };

    AssignmentList.prototype.chooseAssignment = function chooseAssignment(assignment) {
      this.selectedId = assignment.id;
      this.selectAssignment({ assignment: assignment });
    };

    return AssignmentList;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'subject', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'reload', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'selectAssignment', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('gradebook/components/quickEntry',['exports', 'aurelia-framework', 'aurelia-http-client', 'aurelia-templating'], function (exports, _aureliaFramework, _aureliaHttpClient, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.QuickEntry = undefined;

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

  var QuickEntry = exports.QuickEntry = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient), _dec(_class = (_class2 = function () {
    function QuickEntry(http) {
      var _this = this;

      _classCallCheck(this, QuickEntry);

      _initDefineProp(this, 'assignment', _descriptor, this);

      this.suggestionService = {
        suggest: function suggest(value) {
          if (value === '') {
            return Promise.resolve([]);
          }
          value = value.toLowerCase();
          var suggestions = _this.notEntered.filter(function (x) {
            return x.studref.first_name.toLowerCase().indexOf(value) === 0;
          }).sort();
          return Promise.resolve(suggestions);
        },

        getName: function getName(suggestion) {
          return suggestion.studref.first_name;
        }
      };

      this.http = http;

      this.entered = [];
    }

    QuickEntry.prototype.bind = function bind() {
      this.getScores(this.assignment);
      this.isPoints = this.assignment.type === 'Points';
      this.nameFocus = true;
      this.scoreFocus = false;
    };

    QuickEntry.prototype.detached = function detached() {
      this.entered = [];
    };

    QuickEntry.prototype.getScores = function getScores(assignment) {
      var _this2 = this;

      var qobj = {
        filters: [{ 'name': 'assignid', 'op': 'eq', 'val': assignment.id }],
        order_by: [{ 'field': 'studref__first_name', 'direction': 'asc' }]
      };

      this.http.createRequest('http://localhost:5000/api/scores').asGet().withParams({ q: JSON.stringify(qobj) }).send().then(function (data) {
        _this2.notEntered = JSON.parse(data.response).objects;
      });
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
      this.http.createRequest('http://localhost:5000/api/scores/' + score.id).asPut().withContent({ 'value': score.value }).send();
    };

    return QuickEntry;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'assignment', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('gradebook/components/reportAssignment',['exports', 'aurelia-framework', 'aurelia-http-client', 'aurelia-templating', '../services/assignmentService', 'd3'], function (exports, _aureliaFramework, _aureliaHttpClient, _aureliaTemplating, _assignmentService, _d) {
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

  var ReportAssignment = exports.ReportAssignment = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _assignmentService.AssignmentService, _aureliaFramework.BindingEngine), _dec(_class = (_class2 = function () {
    function ReportAssignment(http, assignment, bindingengine) {
      _classCallCheck(this, ReportAssignment);

      _initDefineProp(this, 'reload', _descriptor, this);

      this.http = http;
      this.assignment = assignment;
      this.bindingengine = bindingengine;
    }

    ReportAssignment.prototype.attached = function attached() {
      d3.select('svg').remove();
      this.preProcessData(this.assignment.scores);
      this.renderHistogram(this.assignment.scores, '#content');
    };

    ReportAssignment.prototype.reloadChanged = function reloadChanged() {
      this.attached();
    };

    ReportAssignment.prototype.preProcessData = function preProcessData(data) {
      return data;
    };

    ReportAssignment.prototype.render = function render(data, divElement) {
      console.log(data);
      data = this.preProcessData(data);

      var margin = { top: 20, right: 20, bottom: 30, left: 50 };
      var width = 500 - margin.left - margin.right;
      var height = 400 - margin.top - margin.bottom;

      var svg = d3.select(divElement).append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom).append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var x = d3.scaleLinear().range([0, width]).domain([0, 40]);

      var y = d3.scaleLinear().range([height, 0]).domain([0, 40]);

      svg.selectAll('dot').data(data).enter().append('circle').attr('r', 10).attr('cx', function (d) {
        return x(d.value);
      }).attr('cy', function (d) {
        return y(d.value);
      });

      svg.append('g').attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x));
      svg.append('g').call(d3.axisLeft(y));
    };

    ReportAssignment.prototype.renderHistogram = function renderHistogram(data, divElement) {
      var _this = this;

      var formatCount = d3.format(',.0f');

      var margin = { top: 20, right: 20, bottom: 30, left: 50 };
      var width = 500 - margin.left - margin.right;
      var height = 300 - margin.top - margin.bottom;

      var svg = d3.select(divElement).append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);

      var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var x = d3.scaleLinear().domain([0, this.assignment.meta.max]).range([0, width]);

      var bins = d3.histogram().value(function (d) {
        return d.value;
      }).domain(x.domain())(data);
      console.log(bins);

      var y = d3.scaleLinear().domain([0, d3.max(bins, function (d) {
        return d.length;
      })]).range([height, 0]);

      var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

      var bar = g.selectAll('.bar').data(bins).enter().append('g').attr('class', 'bar').attr('transform', function (d) {
        return 'translate(' + x(d.x0) + ',' + y(d.length) + ')';
      }).on("mouseover", function (d) {
        div.transition().duration(200).style("opacity", .9);

        div.html(d.map(function (item) {
          return item.studref.first_name + ': ' + item.value + '<br>';
        })).style("left", d3.event.pageX + "px").style("top", d3.event.pageY - 28 + "px");
      }).on("mouseout", function (d) {
        div.transition().duration(500).style("opacity", 0);
      });

      bar.append('rect').attr('x', 1).attr('width', x(bins[0].x1) - x(bins[0].x0) - 1).attr('height', function (d) {
        return height - y(d.length);
      });

      bar.append('text').attr('dy', '.75em').attr('y', 6).attr('x', (x(bins[0].x1) - x(bins[0].x0)) / 2).attr('text-anchor', 'middle').text(function (d) {
        return formatCount(d.length);
      });

      g.append('g').attr('class', 'axis axis--x').attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x).tickFormat(function (d) {
        return Math.round(d / _this.assignment.meta.max * 100) + '%';
      }));
    };

    return ReportAssignment;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'reload', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('gradebook/components/scoresList',['exports', 'aurelia-framework', 'aurelia-http-client', '../services/assignmentService'], function (exports, _aureliaFramework, _aureliaHttpClient, _assignmentService) {
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

  var ScoresList = exports.ScoresList = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _assignmentService.AssignmentService), _dec(_class = function () {
    function ScoresList(http, assignment) {
      _classCallCheck(this, ScoresList);

      this.http = http;
      this.assignment = assignment;

      this.editScoreId = null;
    }

    ScoresList.prototype.editScore = function editScore(score) {
      if (this.assignment.isPoints) {
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
      this.http.createRequest('http://localhost:5000/api/scores/' + score.id).asPut().withContent({ 'value': score.value }).send();

      this.assignment.flagNew();

      this.editScoreId = null;
    };

    return ScoresList;
  }()) || _class);
});
define('gradebook/converters/score-format',['exports'], function (exports) {
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

    ScoreFormatValueConverter.prototype.toView = function toView(value, assignInfo) {
      if (assignInfo.type === 'Points') {
        return Math.round(value / assignInfo.max * 100) + '%';
      }
    };

    return ScoreFormatValueConverter;
  }();
});
define('gradebook/services/assignmentService',['exports', 'aurelia-http-client', 'aurelia-framework'], function (exports, _aureliaHttpClient, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AssignmentService = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AssignmentService = exports.AssignmentService = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient), _dec(_class = function () {
    function AssignmentService(http) {
      _classCallCheck(this, AssignmentService);

      this.http = http;

      this.meta = {};
      this.scores = [];

      this.newScores = false;
      this.scoresLoaded = false;
    }

    AssignmentService.prototype.setAssignment = function setAssignment(assignment) {
      this.meta = assignment;
      this.scoresLoaded = false;
      this.isPoints = assignment.type === 'Points';
      this.setScores(assignment.id);
    };

    AssignmentService.prototype.clearAssignment = function clearAssignment() {
      this.meta = {};
      this.scores = [];
      this.scoresLoaded = false;
    };

    AssignmentService.prototype.setScores = function setScores(assignId) {
      var _this = this;

      var qobj = {
        filters: [{ 'name': 'assignid', 'op': 'eq', 'val': assignId }],
        order_by: [{ 'field': 'studref__first_name', 'direction': 'asc' }]
      };

      this.http.createRequest('http://localhost:5000/api/scores').asGet().withParams({ q: JSON.stringify(qobj) }).send().then(function (data) {
        _this.scores = JSON.parse(data.response).objects;
        _this.scoresLoaded = true;
      });
    };

    AssignmentService.prototype.flagNew = function flagNew() {
      this.newScores = !this.newScores;
    };

    return AssignmentService;
  }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n\n  <!-- Navigation Bar -->\n  <nav class=\"navbar navbar-default\">\n    <div class=\"container-fluid\">\n      <!-- Brand and toggle get grouped for better mobile display -->\n      <div class=\"navbar-header\">\n        <button type=\"button\" class=\"navbar-toggle collapsed\"\n                data-toggle=\"collapse\"\n                data-target=\"#bs-example-navbar-collapse-1\"\n                aria-expanded=\"false\">\n          <span class=\"sr-only\">Toggle navigation</span>\n          <span class=\"icon-bar\"></span>\n          <span class=\"icon-bar\"></span>\n          <span class=\"icon-bar\"></span>\n        </button>\n        <a class=\"navbar-brand\" href=\"/\" }>Marks</a>\n      </div>\n\n      <!-- Collect the nav links, forms, and other content for toggling -->\n      <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n        <ul class=\"nav navbar-nav\">\n          <li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\n          <a href.bind=\"row.href\">${row.title}</a>\n        </li>\n        </ul>\n        <ul class=\"nav navbar-nav navbar-right\">\n          <li><a href>School Name (2017)</a>\n          </li>\n        </ul>\n      </div>\n    </div>\n  </nav>\n\n  <!-- Viewport -->\n  <div class=\"container\">\n    <div class=\"row\">\n      <router-view></router-view>\n    </div>\n  </div>\n</template>\n"; });
define('text!resources/autocomplete.css', ['module'], function(module) { module.exports = "autocomplete {\n  display: inline-block;\n}\n\nautocomplete .suggestions {\n  list-style-type: none;\n  cursor: default;\n  padding: 0;\n  margin: 0;\n  border: 1px solid #ccc;\n  background: #fff;\n  box-shadow: -1px 1px 3px rgba(0,0,0,.1);\n\n  position: absolute;\n  z-index: 9999;\n  max-height: 15rem;\n  overflow: hidden;\n  overflow-y: auto;\n  box-sizing: border-box;\n}\n\nautocomplete .suggestion {\n  padding: 0 .3rem;\n  line-height: 1.5rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: #333;\n}\n\nautocomplete .suggestion:hover,\nautocomplete .suggestion.selected {\n  background: #f0f0f0;\n}\n"; });
define('text!gradebook/index.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./components/assignmentlist\"></require>\n  <require from=\"./components/scoresList\"></require>\n  <require from=\"./components/quickEntry\"></require>\n  <require from=\"./components/addAssignment\"></require>\n  <require from=\"./components/reportAssignment\"></require>\n\n  <!-- Subjects Menu -->\n  <ul class=\"nav nav-tabs\">\n    <li>\n      <h4>Subjects</h4>\n    </li>\n    <li repeat.for=\"sub of subjects\" role=\"presentation\"\n        class=\"${sub.id === subjectSelected.id ? 'active' : ''}\">\n      <a href=\"\" click.delegate=\"selectSubject(sub)\">${ sub.name }</a>\n    </li>\n  </ul>\n\n  <!-- Subject Menu Bar -->\n  <div class=\"row\" show.bind=\"subjectSelected\">\n    <ul class=\"nav nav-pills\">\n      <li role=\"presentation\" class=\"${addingAssignment ? 'active' : ''}\">\n        <a href=\"#\" click.delegate=\"addAssignment()\"><i class=\"fa fa-plus fa-lg\"></i> Add Assignment</a>\n      </li>\n      <li role=\"presentation\" show.bind=\"assignmentSelected\" class=\"${quickEntry ? 'active' : ''}\">\n        <a href=\"#\" click.delegate=\"toggleQuick()\"><i class=\"fa fa-fast-forward\"></i> Quick Entry</a>\n      </li>\n      <li role=\"presentation\" show.bind=\"assignmentSelected || editingAssignment\" class=\"${editingAssignment ? 'active' : ''}\">\n        <a href=\"#\" click.delegate=\"editAssignment(assignmentSelected)\"><i class=\"fa fa-pencil\"></i> Edit Assignment</a>\n      </li>\n      <li role=\"presentation\" show.bind=\"assignmentSelected\">\n        <a href=\"#\" click.delegate=\"deleteAssignment(assignmentSelected)\"><i class=\"fa fa-eraser\"></i> Delete Assignment</a>\n      </li>\n    </ul>\n  </div>\n\n  <!-- Assignment List -->\n  <div class=\"row\">\n    <div class=\"col-md-2\" if.bind=\"subjectSelected\">\n      <h5>Assignments</h5>\n      <assignment-list subject.bind=\"subjectSelected\"\n                       reload.bind=\"reloadAssignmentsFlag\"\n                       select-assignment.call=\"selectAssignment(assignment)\">\n      </assignment-list>\n    </div>\n\n    <!-- Scores List -->\n    <div class=\"col-md-4\" if.bind=\"assignment.scoresLoaded && !editingAssignment\">\n      <h5>Scores</h5>\n      <scores-list if.bind=\"!quickEntry\"></scores-list>\n      <quick-entry if.bind=\"quickEntry\" assignment.bind=\"assignment\" scores.bind=\"scores\"></quick-entry>\n    </div>\n\n    <!-- Reports -->\n    <div class=\"col-md-6\" if.bind=\"assignment.scoresLoaded && !editingAssignment\">\n      <h5>Assesment</h5>\n      <report-assignment reload.bind=\"assignment.newScores\"></report-assignment>\n    </div>\n\n    <!-- Add Assignment -->\n    <div class=\"col-md-5\" if.bind=\"addingAssignment || editingAssignment\">\n      <add-assignment subject.bind=\"subjectSelected\"\n                      edit.bind=\"editingAssignment\"\n                      reload-assignments.call=\"reloadAssignments(assignment)\">\n      </add-assignment>\n    </div>\n  </div>\n</template>\n"; });
define('text!resources/autocomplete.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./autocomplete.css\"></require>\n\n  <input type=\"text\" autocomplete=\"off\" class=form-control\n         aria-autocomplete=\"list\"\n         aria-expanded.bind=\"expanded\"\n         aria-owns.one-time=\"'au-autocomplate-' + id + '-suggestions'\"\n         aria-activedescendant.bind=\"index >= 0 ? 'au-autocomplate-' + id + '-suggestion-' + index : ''\"\n         id.one-time=\"'au-autocomplete-' + id\"\n         placeholder.bind=\"placeholder\"\n         value.bind=\"inputValue & debounce:delay\"\n         keydown.delegate=\"keydown($event.which)\"\n         blur.trigger=\"blur()\"\n         focus.bind=\"nameFocus\">\n  <ul class=\"suggestions\" role=\"listbox\"\n      if.bind=\"expanded\"\n      id.one-time=\"'au-autocomplate-' + id + '-suggestions'\"\n      ref=\"suggestionsUL\">\n    <li repeat.for=\"suggestion of suggestions\"\n        id.one-time=\"'au-autocomplate-' + id + '-suggestion-' + $index\"\n        role=\"option\"\n        class-name.bind=\"($index === index ? 'selected' : '') + ' suggestion'\"\n        mousedown.delegate=\"suggestionClicked(suggestion)\">\n        ${ suggestion.studref.first_name }\n      <!-- <template replaceable-part=\"suggestion\">\n        ${ suggestion }\n      </template> -->\n    </li>\n  </ul>\n</template>\n"; });
define('text!gradebook/components/addAssignment.html', ['module'], function(module) { module.exports = "<template>\n  <h5>${ title }</h5>\n  <form class=\"form-horizontal\" submit.delegate=\"submitAssignment()\"\n        autocomplete=\"off\">\n\n    <!-- Assignment Name -->\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\">Name:</label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" class=\"form-control\" value.bind=\"assignment.name\"\n               required>\n      </div>\n    </div>\n\n    <!-- Date of Assignment -->\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\">Date Assigned:</label>\n      <div class=\"col-md-6\">\n        <input type=\"date\" name=\"date\" class=\"form-control\"\n               value.bind=\"assignment.date\" required>\n      </div>\n    </div>\n\n    <!-- Assignment Type -->\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\">Type:</label>\n      <div class=\"col-md-6\">\n        <select class=\"form-control\" name=\"type\" value.bind=\"assignment.type\" required>\n          <option value=\"\">Select Type</option>\n          <option value=\"Points\">Points</option>\n          <option value=\"Checks\">Checks</option>\n        </select>\n      </div>\n    </div>\n\n    <!-- Max Points -->\n    <div class=\"form-group\" if.bind=\"assignment.type === 'Points'\">\n      <label class=\"col-md-4 control-label\">Max Points:</label>\n      <div class=\"col-md-6\">\n        <input type=\"number\" name=\"max\" class=\"form-control\" value.bind=\"assignment.max\" required>\n      </div>\n    </div>\n\n    <!-- Submit Button -->\n    <div class=\"form-group\">\n      <div class=\"col-md-6 col-md-offset-5\">\n        <button type=\"submit\" class=\"btn btn-primary\">\n          ${ btn }\n        </button>\n        <button click.delegate=\"cancelEdit()\" class=\"btn btn-danger\">\n          Cancel\n        </button>\n      </div>\n    </div>\n\n  </form>\n</template>\n"; });
define('text!gradebook/components/assignmentlist.html', ['module'], function(module) { module.exports = "<template>\n  <ul class=\"nav nav-pills nav-stacked\">\n    <li repeat.for=\"assign of assignments\" role=\"presentation\"\n        class=\"${assign.id === selectedId ? 'active' : ''}\">\n      <a href=\"\" click.delegate=\"chooseAssignment(assign)\">${ assign.name }</a>\n    </li>\n  </ul>\n</template>\n"; });
define('text!gradebook/components/quickEntry.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../../resources/autocomplete\"></require>\n  <require from=\"../converters/score-format\"></require>\n\n  <table class='table table-hover'>\n    <thead>\n      <tr>\n        <th></th>\n        <th class='text-center'>${ assignment.type }\n          <small show.bind=\"isPoints\">\n            (max: ${assignment.max})</small></th>\n      </tr>\n    </thead>\n    <tr repeat.for=\"score of entered\">\n      <td class=\"text-center\">${ score.studref.first_name }</td>\n      <td class=\"text-center\">\n        <div if.bind=\"isPoints\">\n          ${ score.value  | scoreFormat: assignment}\n        </div>\n        <div if.bind=\"!isPoints\">\n          <i class=\"fa fa${ score.value === 1 ? '-check': ''}-circle-o fa-2x\" aria-hidden=\"true\"></i>\n        </div>\n      </td>\n    </tr>\n\n    <!-- Input Row -->\n    <tr>\n      <td class=\"text-center\">\n        <!-- Name Input -->\n          <div class=\"form-group\">\n            <autocomplete service.bind=\"suggestionService\"\n                          value.bind=\"score\"\n                          placeholder=\"Name\"\n                          name-focus.bind=\"nameFocus\"\n                          score-focus.bind=\"scoreFocus\"\n                          is-points.bind=\"isPoints\"\n                          checks.call=\"parseKey(key)\">\n            <template replace-part=\"suggestion\">\n              <span style=\"font-style: italic\">${suggestion}</span>\n            </template>\n</autocomplete>\n</div>\n</td>\n\n<!-- Value Input -->\n<td class=\"text-center\">\n  <div class=\"form-group\">\n    <div if.bind=\"isPoints\" class=\"form-group\">\n      <input value.bind=\"quickPoints\"\n             class=\"form-control\"\n             style=\"width: 5em;\"\n             placeholder=\"Score\"\n             focus.bind=\"scoreFocus\"\n             keypress.delegate=\"parseKey($event.which)\" />\n    </div>\n    <div if.bind=\"!isPoints\">\n      <i class=\"fa fa-check-circle-o fa-2x\" aria-hidden=\"true\"></i>\n    </div>\n  </div>\n</td>\n</tr>\n</table>\n</template>\n"; });
define('text!gradebook/components/reportAssignment.html', ['module'], function(module) { module.exports = "<template>\n<style>\n\n.bar rect {\nfill: steelblue;\n}\n\n.bar text {\nfill: #fff;\nfont: 10px sans-serif;\n}\n\ndiv.tooltip {\n    position: absolute;\n    text-align: center;\n    width: auto;\n    height: auto;\n    padding: 2px;\n    font: 16px sans-serif;\n    background: lightsteelblue;\n    border: 0px;\n    border-radius: 8px;\n    pointer-events: none;\n\n}\n\n</style>\n  <div id=\"content\"></div>\n</template>\n"; });
define('text!gradebook/components/scoresList.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../converters/score-format\"></require>\n\n  <table class=\"table table-hover\">\n    <thead>\n    <tr>\n      <th></th>\n      <th class=\"text-center\">${ assignment.meta.type }\n        <small show.bind=\"assignment.isPoints\">\n          (max: ${assignment.meta.max})</small></th>\n    </tr>\n    </thead>\n      <tr repeat.for=\"score of assignment.scores\">\n        <td class=\"text-center\">${ score.studref.first_name }</td>\n        <td class=\"text-center\" click.delegate=\"editScore(score)\">\n          <!-- View Mode -->\n          <div if.bind=\"score.id !== editScoreId\">\n            <div if.bind=\"assignment.isPoints\">\n              ${ score.value  | scoreFormat: assignment.meta}\n            </div>\n            <div if.bind=\"!assignment.isPoints\">\n              <i class=\"fa fa${ score.value === 1 ? '-check': ''}-circle-o fa-2x\" aria-hidden=\"true\"></i>\n            </div>\n          </div>\n\n          <!-- Edit Mode -->\n          <div if.bind=\"score.id === editScoreId\">\n              <input keypress.delegate=\"deFocus($event.which)\"\n                     focus.bind=\"editFocus\"\n                     blur.trigger=\"updateScore(score, $index)\"\n                     value.bind=\"score.value\"\n                     type=\"number\"\n                     style=\"width: 3.5em\">\n          </div>\n        </td>\n      </tr>\n  </table>\n\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map