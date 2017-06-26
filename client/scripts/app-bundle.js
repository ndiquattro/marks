define('app',['exports', 'aurelia-framework', './gradebook/services/currentService'], function (exports, _aureliaFramework, _currentService) {
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

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_currentService.CurrentService), _dec(_class = function () {
    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Marks';
      config.map([{ route: '', redirect: 'gradebook' }, { route: 'gradebook', moduleId: './gradebook/index', nav: 1, title: 'Gradebook' }, { route: 'admin', moduleId: './admin/index', nav: 2, title: 'Administration' }]);

      this.router = router;
    };

    function App(current) {
      _classCallCheck(this, App);

      this.current = current;
    }

    return App;
  }()) || _class);
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
define('admin/index',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Admin = exports.Admin = function () {
    function Admin() {
      _classCallCheck(this, Admin);

      this.addCats = ['Years', 'Students', 'Subjects'];
      this.categorySelected = false;
    }

    Admin.prototype.setCategory = function setCategory(category) {
      this.categorySelected = category;
    };

    return Admin;
  }();
});
define('gradebook/index',['exports', 'aurelia-framework', 'aurelia-event-aggregator', './services/currentService', './services/apiService'], function (exports, _aureliaFramework, _aureliaEventAggregator, _currentService, _apiService) {
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
      this.current.setSubjectList();
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
        this.api.delete('assignments', this.current.assignment.id).then(function (data) {
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
define('admin/components/addYear',['exports', 'aurelia-framework', '../../gradebook/services/currentService', '../../gradebook/services/apiService'], function (exports, _aureliaFramework, _currentService, _apiService) {
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

  var AddYear = exports.AddYear = (_dec = (0, _aureliaFramework.inject)(_currentService.CurrentService, _apiService.ApiService), _dec(_class = function () {
    function AddYear(current, api) {
      _classCallCheck(this, AddYear);

      this.current = current;
      this.api = api;
      this.mode = 'add';
    }

    AddYear.prototype.attached = function attached() {
      this.reset();
      this.setYearList();
    };

    AddYear.prototype.reset = function reset() {
      this.newYear = {};
      this.mode = 'add';
      this.title = 'Year';
      this.bttn = 'Add Year';
    };

    AddYear.prototype.setYearList = function setYearList() {
      var _this = this;

      var query = {
        order_by: [{ 'field': 'year', 'direction': 'desc' }]
      };

      this.api.find('years', query).then(function (data) {
        return _this.years = data.objects;
      });
    };

    AddYear.prototype.edit = function edit(year) {
      this.newYear = year;
      this.mode = 'edit';
      this.title = 'Edit Year';
      this.bttn = 'Save Changes';
    };

    AddYear.prototype.delete = function _delete(year) {
      var _this2 = this;

      var confirmed = confirm('Are you sure you want to delete ' + year.school + ' (' + year.year + ')' + '?');

      if (confirmed) {
        this.api.delete('years', year.id).then(function (data) {
          return _this2.setYearList();
        });
      }
    };

    AddYear.prototype.submit = function submit() {
      var _this3 = this;

      if (this.mode === 'edit') {
        this.api.update('years', this.newYear.id, this.newYear).then(function (resp) {
          if (_this3.newYear.id === _this3.current.year.id) {
            _this3.current.setYear(_this3.newYear);
          }
        });
      } else {
        this.api.add('years', this.newYear).then(function (resp) {
          _this3.setYearList();
          _this3.setYear(resp);
        });
      }

      this.reset();
    };

    return AddYear;
  }()) || _class);
});
define('gradebook/components/addAssignment',['exports', 'aurelia-framework', 'aurelia-templating', 'aurelia-event-aggregator', '../services/currentService', '../services/apiService'], function (exports, _aureliaFramework, _aureliaTemplating, _aureliaEventAggregator, _currentService, _apiService) {
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

  var _dec, _class, _desc, _value, _class2, _descriptor;

  var AddAssignment = exports.AddAssignment = (_dec = (0, _aureliaFramework.inject)(_apiService.ApiService, _currentService.CurrentService, _aureliaEventAggregator.EventAggregator), _dec(_class = (_class2 = function () {
    function AddAssignment(api, current, eventaggregator) {
      _classCallCheck(this, AddAssignment);

      _initDefineProp(this, 'mode', _descriptor, this);

      this.api = api;
      this.current = current;
      this.ea = eventaggregator;
    }

    AddAssignment.prototype.created = function created() {
      this.newAssignment = {};
    };

    AddAssignment.prototype.bind = function bind() {
      if (this.mode === 'edit') {
        this.title = 'Edit Assignment';
        this.btn = 'Save Changes';
        this.newAssignment = this.current.assignment;
      } else {
        this.title = 'Add Assignment';
        this.btn = this.title;
      }
    };

    AddAssignment.prototype.detached = function detached() {
      this.newAssignment = {};
    };

    AddAssignment.prototype.submitAssignment = function submitAssignment() {
      var _this = this;

      if (this.mode === 'edit') {
        this.api.update('assignments', this.current.assignment.id, this.current.assignment);

        this.mode = false;
      } else {
        this.newAssignment.subjid = this.current.subject.id;

        this.api.add('assignments', this.newAssignment).then(function (data) {
          _this.ea.publish('reloadAssignments');

          _this.current.setAssignment(data);
          _this.mode = false;
        });
      }
    };

    AddAssignment.prototype.cancel = function cancel() {
      this.mode = false;
    };

    return AddAssignment;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mode', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('gradebook/components/assignmentlist',['exports', 'aurelia-framework', 'aurelia-event-aggregator', '../services/currentService'], function (exports, _aureliaFramework, _aureliaEventAggregator, _currentService) {
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
define('gradebook/components/quickEntry',['exports', 'aurelia-framework', 'aurelia-event-aggregator', '../services/currentService', '../services/apiService'], function (exports, _aureliaFramework, _aureliaEventAggregator, _currentService, _apiService) {
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
            return x.studref.first_name.toLowerCase().indexOf(value) === 0;
          }).sort();
          return Promise.resolve(suggestions);
        },

        getName: function getName(suggestion) {
          return suggestion.studref.first_name;
        }
      };

      this.api = api;
      this.current = current;
      this.ea = eventaggregator;
    }

    QuickEntry.prototype.attached = function attached() {
      this.entered = [];
      this.notEntered = this.current.scores;

      this.isPoints = this.current.isPoints;
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
      this.api.update('scores', score.id, { 'value': score.value });

      this.ea.publish('scoreUpdate');
    };

    return QuickEntry;
  }()) || _class);
});
define('gradebook/components/reportAssignment',['exports', 'aurelia-framework', 'aurelia-event-aggregator', '../services/currentService', 'd3'], function (exports, _aureliaFramework, _aureliaEventAggregator, _currentService, _d) {
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

      if (this.current.isPoints) {
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
          return item.studref.first_name + ': ' + item.value + '<br>';
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
            return item.studref.first_name;
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
define('gradebook/components/scoresList',['exports', 'aurelia-framework', 'aurelia-event-aggregator', '../services/currentService', '../services/apiService'], function (exports, _aureliaFramework, _aureliaEventAggregator, _currentService, _apiService) {
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

  var ScoresList = exports.ScoresList = (_dec = (0, _aureliaFramework.inject)(_apiService.ApiService, _currentService.CurrentService, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function ScoresList(api, current, eventaggregator) {
      _classCallCheck(this, ScoresList);

      this.api = api;
      this.ea = eventaggregator;
      this.current = current;

      this.editScoreId = null;
    }

    ScoresList.prototype.editScore = function editScore(score) {
      if (this.current.isPoints) {
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
      this.api.update('scores', score.id, { 'value': score.value });

      this.ea.publish('scoreUpdate');

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
      if (assignInfo.type === 'Points' && assignInfo.max !== 0) {
        return Math.round(value / assignInfo.max * 100) + '%';
      } else if (assignInfo.type === 'Points') {
        if (value === null) {
          return '_';
        } else {
          return value;
        }
      }
    };

    return ScoreFormatValueConverter;
  }();
});
define('gradebook/services/apiService',['exports', 'aurelia-http-client', 'aurelia-framework'], function (exports, _aureliaHttpClient, _aureliaFramework) {
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

  var ApiService = exports.ApiService = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient), _dec(_class = function () {
    function ApiService(http) {
      _classCallCheck(this, ApiService);

      http.configure(function (config) {
        config.withBaseUrl('http://localhost:5000/api/').withInterceptor({
          response: function response(message) {
            if (message.statusCode !== 204) {
              return JSON.parse(message.response);
            }
          }
        });
      });

      this.http = http;
    }

    ApiService.prototype.find = function find(source, query) {
      var req = this.http.createRequest(source).asGet();

      if (query) {
        req = req.withParams({ q: JSON.stringify(query) });
      }

      return req.send();
    };

    ApiService.prototype.update = function update(source, id, newvals) {
      return this.http.createRequest(source + '/' + id).asPut().withContent(newvals).send();
    };

    ApiService.prototype.add = function add(source, newitem) {
      return this.http.createRequest(source).asPost().withContent(newitem).send();
    };

    ApiService.prototype.delete = function _delete(source, id) {
      return this.http.createRequest(source + '/' + id).asDelete().send();
    };

    return ApiService;
  }()) || _class);
});
define('gradebook/services/currentService',['exports', 'aurelia-event-aggregator', './apiService', 'aurelia-framework'], function (exports, _aureliaEventAggregator, _apiService, _aureliaFramework) {
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

      this.year = JSON.parse(localStorage.getItem('currentYear'));
    }

    CurrentService.prototype.setSubjectList = function setSubjectList() {
      var _this = this;

      var query = {
        filters: [{ 'name': 'yearid', 'op': 'eq', 'val': this.year.id }]
      };

      this.api.find('subjects', query).then(function (data) {
        return _this.subjectList = data.objects;
      });
    };

    CurrentService.prototype.setSubject = function setSubject(subject) {
      this.subject = subject;
      this.clearAssignment();
      this.ea.publish('subjectSet');
    };

    CurrentService.prototype.setAssignmentList = function setAssignmentList() {
      var _this2 = this;

      var query = {
        filters: [{ 'name': 'subjid', 'op': 'eq', 'val': this.subject.id }],
        order_by: [{ 'field': 'date', 'direction': 'desc' }]
      };

      this.api.find('assignments', query).then(function (data) {
        return _this2.assignmentList = data.objects;
      });
    };

    CurrentService.prototype.setAssignment = function setAssignment(assignment) {
      this.assignment = assignment;
      this.isPoints = assignment.type === 'Points';
      this.setScores(assignment.id);
    };

    CurrentService.prototype.clearAssignment = function clearAssignment() {
      this.assignment = false;
      this.scores = false;
    };

    CurrentService.prototype.setScores = function setScores(assignId) {
      var _this3 = this;

      var query = {
        filters: [{ 'name': 'assignid', 'op': 'eq', 'val': assignId }],
        order_by: [{ 'field': 'studref__first_name', 'direction': 'asc' }]
      };

      this.api.find('scores', query).then(function (data) {
        _this3.scores = data.objects;
        _this3.ea.publish('scoreUpdate');
      });
    };

    CurrentService.prototype.setYear = function setYear(year) {
      this.year = year;
      localStorage.setItem('currentYear', JSON.stringify(year));

      this.clearAssignment();
      this.subjectList = false;
      this.assignmentList = false;
    };

    return CurrentService;
  }()) || _class);
});
define('resources/converters/dateFormat',['exports', 'moment'], function (exports, _moment) {
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
define('admin/components/addStudent',['exports', 'aurelia-framework', '../../gradebook/services/currentService', '../../gradebook/services/apiService'], function (exports, _aureliaFramework, _currentService, _apiService) {
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

  var AddStudent = exports.AddStudent = (_dec = (0, _aureliaFramework.inject)(_currentService.CurrentService, _apiService.ApiService), _dec(_class = function () {
    function AddStudent(current, api) {
      _classCallCheck(this, AddStudent);

      this.current = current;
      this.api = api;
    }

    AddStudent.prototype.attached = function attached() {
      this.reset();
      this.students = [];

      this.setStudentList();
    };

    AddStudent.prototype.reset = function reset() {
      this.mode = 'add';
      this.title = 'Add Student';
      this.bttn = 'Add Student';
      this.newStudent = {};
    };

    AddStudent.prototype.setStudentList = function setStudentList() {
      var _this = this;

      var query = {
        filters: [{ 'name': 'yearid', 'op': 'eq', 'val': this.current.year.id }],
        order_by: [{ 'field': 'first_name', 'direction': 'asc' }]
      };

      this.api.find('students', query).then(function (data) {
        return _this.students = data.objects;
      });
    };

    AddStudent.prototype.edit = function edit(student) {
      this.newStudent = student;
      this.mode = 'edit';

      this.title = 'Edit Student';
      this.bttn = 'Save Changes';
    };

    AddStudent.prototype.delete = function _delete(student) {
      var _this2 = this;

      var confirmed = confirm('Are you sure you want to delete ' + student.first_name + ' ' + student.last_name + '?');

      if (confirmed) {
        this.api.delete('students', student.id).then(function (data) {
          return _this2.setStudentList();
        });
      }
    };

    AddStudent.prototype.submit = function submit() {
      var _this3 = this;

      if (this.mode === 'edit') {
        this.api.update('students', this.newStudent.id, this.newStudent).then(function (resp) {
          return _this3.reset();
        });
      } else {
        this.newStudent.yearid = this.current.year.id;

        this.api.add('students', this.newStudent).then(function (resp) {
          return _this3.attached();
        });
      }
    };

    return AddStudent;
  }()) || _class);
});
define('admin/components/addSubject',['exports', 'aurelia-framework', '../../gradebook/services/currentService', '../../gradebook/services/apiService'], function (exports, _aureliaFramework, _currentService, _apiService) {
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

  var AddSubject = exports.AddSubject = (_dec = (0, _aureliaFramework.inject)(_currentService.CurrentService, _apiService.ApiService), _dec(_class = function () {
    function AddSubject(current, api) {
      _classCallCheck(this, AddSubject);

      this.current = current;
      this.api = api;
    }

    AddSubject.prototype.attached = function attached() {
      this.reset();
    };

    AddSubject.prototype.reset = function reset() {
      this.mode = 'add';
      this.title = 'Add Subject';
      this.bttn = 'Add Subject';
      this.newSubject = {};
    };

    AddSubject.prototype.edit = function edit(subject) {
      this.mode = 'edit';
      this.newSubject = subject;

      this.title = 'Edit Subject';
      this.bttn = 'Save Changes';
    };

    AddSubject.prototype.delete = function _delete(subject) {
      var _this = this;

      var confirmed = confirm('Are you sure you want to delete ' + subject.name + '?');

      if (confirmed) {
        this.api.delete('subjects', subject.id).then(function (data) {
          return _this.current.setSubjectList();
        });
      }
    };

    AddSubject.prototype.submit = function submit() {
      var _this2 = this;

      if (this.mode === 'edit') {
        this.api.update('subjects', this.newSubject.id, this.newSubject).then(function (resp) {
          return _this2.reset();
        });
      } else {
        this.newSubject.yearid = this.current.year.id;

        this.api.add('subjects', this.newSubject).then(function (resp) {
          _this2.current.setSubjectList();
          _this2.reset();
        });
      }
    };

    return AddSubject;
  }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"./resources/converters/dateFormat\"></require>\n\n  <!-- Navigation Bar -->\n  <nav class=\"navbar navbar-default\">\n    <div class=\"container-fluid\">\n      <!-- Brand and toggle get grouped for better mobile display -->\n      <div class=\"navbar-header\">\n        <button type=\"button\" class=\"navbar-toggle collapsed\"\n                data-toggle=\"collapse\"\n                data-target=\"#bs-example-navbar-collapse-1\"\n                aria-expanded=\"false\">\n          <span class=\"sr-only\">Toggle navigation</span>\n          <span class=\"icon-bar\"></span>\n          <span class=\"icon-bar\"></span>\n          <span class=\"icon-bar\"></span>\n        </button>\n        <a class=\"navbar-brand\" href=\"/\" }>Marks</a>\n      </div>\n\n      <!-- Collect the nav links, forms, and other content for toggling -->\n      <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n        <ul class=\"nav navbar-nav\">\n          <li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\n          <a href.bind=\"row.href\">${row.title}</a>\n        </li>\n        </ul>\n        <ul class=\"nav navbar-nav navbar-right\">\n          <li><a href>${ current.year.school } (${ current.year.year | dateFormat: 'YYYY' })</a>\n          </li>\n        </ul>\n      </div>\n    </div>\n  </nav>\n\n  <!-- Viewport -->\n  <div class=\"container\">\n    <div class=\"row\">\n      <router-view></router-view>\n    </div>\n  </div>\n</template>\n"; });
define('text!resources/autocomplete.css', ['module'], function(module) { module.exports = "autocomplete {\n  display: inline-block;\n}\n\nautocomplete .suggestions {\n  list-style-type: none;\n  cursor: default;\n  padding: 0;\n  margin: 0;\n  border: 1px solid #ccc;\n  background: #fff;\n  box-shadow: -1px 1px 3px rgba(0,0,0,.1);\n\n  position: absolute;\n  z-index: 9999;\n  max-height: 15rem;\n  overflow: hidden;\n  overflow-y: auto;\n  box-sizing: border-box;\n}\n\nautocomplete .suggestion {\n  padding: 0 .3rem;\n  line-height: 1.5rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: #333;\n}\n\nautocomplete .suggestion:hover,\nautocomplete .suggestion.selected {\n  background: #f0f0f0;\n}\n"; });
define('text!admin/index.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./components/addYear\"></require>\n  <require from=\"./components/addStudent\"></require>\n  <require from=\"./components/addSubject\"></require>\n\n  <div class=\"col-md-2\">\n    <h4>Add</h4>\n    <ul class=\"nav nav-pills nav-stacked\">\n      <li role=\"presentation\"\n          repeat.for=\"category of addCats\"\n          class=\"${ category === categorySelected ? 'active' : ''}\">\n        <a href click.delegate=\"setCategory(category)\">${ category }</a>\n      </li>\n    </ul>\n  </div>\n\n  <div class=\"col-md-10\">\n    <div class=\"row\">\n      <add-year if.bind=\"categorySelected === 'Years'\"></add-year>\n      <add-student if.bind=\"categorySelected === 'Students'\"></add-student>\n      <add-subject if.bind=\"categorySelected === 'Subjects'\"></add-subject>\n    </div>\n  </div>\n</template>\n"; });
define('text!gradebook/index.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./components/assignmentlist\"></require>\n  <require from=\"./components/scoresList\"></require>\n  <require from=\"./components/quickEntry\"></require>\n  <require from=\"./components/addAssignment\"></require>\n  <require from=\"./components/reportAssignment\"></require>\n\n  <!-- Subjects Menu -->\n  <ul class=\"nav nav-tabs\">\n    <li>\n      <h4>Subjects</h4>\n    </li>\n    <li repeat.for=\"sub of current.subjectList\" role=\"presentation\"\n        class=\"${sub.id === current.subject.id ? 'active' : ''}\">\n      <a href=\"\" click.delegate=\"current.setSubject(sub)\">${ sub.name }</a>\n    </li>\n  </ul>\n\n  <!-- Subject Menu Bar -->\n  <div class=\"row\" show.bind=\"current.subject\">\n    <ul class=\"nav nav-pills\">\n      <li role=\"presentation\" class=\"${editMode === 'add' ? 'active' : ''}\">\n        <a href=\"#\" click.delegate=\"addAssignment()\"><i class=\"fa fa-plus fa-lg\"></i> Add Assignment</a>\n      </li>\n      <li role=\"presentation\" show.bind=\"current.scores\" class=\"${quickEntry ? 'active' : ''}\">\n        <a href=\"#\" click.delegate=\"toggleQuick()\"><i class=\"fa fa-fast-forward\"></i> Quick Entry</a>\n      </li>\n      <li role=\"presentation\" show.bind=\"current.scores || editMode === 'edit'\" class=\"${editMode === 'edit' ? 'active' : ''}\">\n        <a href=\"#\" click.delegate=\"editAssignment()\"><i class=\"fa fa-pencil\"></i> Edit Assignment</a>\n      </li>\n      <li role=\"presentation\" show.bind=\"current.scores\">\n        <a href=\"#\" click.delegate=\"deleteAssignment()\"><i class=\"fa fa-eraser\"></i> Delete Assignment</a>\n      </li>\n    </ul>\n  </div>\n\n  <!-- Assignment List -->\n  <div class=\"row\">\n    <div class=\"col-md-2\" if.bind=\"current.subject\">\n      <h5>Assignments</h5>\n      <assignment-list></assignment-list>\n    </div>\n\n    <!-- Scores List -->\n    <div class=\"col-md-4\" if.bind=\"current.scores && !editMode\">\n      <h5>Scores</h5>\n      <scores-list if.bind=\"!quickEntry\"></scores-list>\n      <quick-entry if.bind=\"quickEntry\"></quick-entry>\n    </div>\n\n    <!-- Reports -->\n    <div class=\"col-md-6\" if.bind=\"current.scores && !editMode\">\n      <h5>Assesment</h5>\n      <report-assignment></report-assignment>\n    </div>\n\n    <!-- Add Assignment -->\n    <div class=\"col-md-5\" if.bind=\"editMode\">\n      <add-assignment mode.two-way=\"editMode\"></add-assignment>\n    </div>\n  </div>\n</template>\n"; });
define('text!resources/autocomplete.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./autocomplete.css\"></require>\n\n  <input type=\"text\" autocomplete=\"off\" class=form-control\n         aria-autocomplete=\"list\"\n         aria-expanded.bind=\"expanded\"\n         aria-owns.one-time=\"'au-autocomplate-' + id + '-suggestions'\"\n         aria-activedescendant.bind=\"index >= 0 ? 'au-autocomplate-' + id + '-suggestion-' + index : ''\"\n         id.one-time=\"'au-autocomplete-' + id\"\n         placeholder.bind=\"placeholder\"\n         value.bind=\"inputValue & debounce:delay\"\n         keydown.delegate=\"keydown($event.which)\"\n         blur.trigger=\"blur()\"\n         focus.bind=\"nameFocus\">\n  <ul class=\"suggestions\" role=\"listbox\"\n      if.bind=\"expanded\"\n      id.one-time=\"'au-autocomplate-' + id + '-suggestions'\"\n      ref=\"suggestionsUL\">\n    <li repeat.for=\"suggestion of suggestions\"\n        id.one-time=\"'au-autocomplate-' + id + '-suggestion-' + $index\"\n        role=\"option\"\n        class-name.bind=\"($index === index ? 'selected' : '') + ' suggestion'\"\n        mousedown.delegate=\"suggestionClicked(suggestion)\">\n        ${ suggestion.studref.first_name }\n      <!-- <template replaceable-part=\"suggestion\">\n        ${ suggestion }\n      </template> -->\n    </li>\n  </ul>\n</template>\n"; });
define('text!admin/components/addYear.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../../resources/converters/dateFormat\"></require>\n\n  <div class=\"col-md-6\">\n    <h4>${ title }</h4>\n    <form class=\"form-horizontal\" submit.delegate=\"submit()\">\n\n      <!-- Name Form -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">School Name:</label>\n        <div class=\"col-md-6\">\n          <input type=\"text\" class=\"form-control\"\n                 value.bind=\"newYear.school\" required>\n        </div>\n      </div>\n\n      <!-- Start Date -->\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">First day of School:</label>\n        <div class=\"col-md-6\">\n          <input type=\"date\" value.bind=\"newYear.year\" class=\"form-control\"\n                 required>\n        </div>\n      </div>\n\n      <!-- Submit Button -->\n      <div class=\"form-group\">\n        <div class=\"col-md-offset-4 col-md-6 text-center\">\n          <button type=\"submit\" class=\"btn btn-primary\">\n            ${ bttn }\n          </button>\n          <button click.delegate=\"reset()\" class=\"btn btn-danger\">\n            Cancel\n          </button>\n        </div>\n      </div>\n    </form>\n  </div>\n\n  <!-- Added Years -->\n  <div class=\"col-md-6\">\n    <h4>Saved</h4>\n    <table class=\"table table-hover\">\n      <thead>\n      <tr>\n        <th>Year</th>\n        <th>School</th>\n        <th></th>\n      </tr>\n      </thead>\n      <tr repeat.for=\"year of years\">\n        <td>${ year.year | dateFormat: 'YYYY' }</td>\n        <td>${ year.school }</td>\n        <td>\n          <div class=\"btn-group btn-group-xs\" role=\"group\">\n            <button type=\"button\" class=\"btn btn-default ${ year.id === current.year.id ? 'active' : ''}\"\n                    click.delegate=\"current.setYear(year)\">\n              <i class=\"fa fa-bolt\"></i> Activate\n            </button>\n            <button type=\"button\" class=\"btn btn-default ${ year.id === newYear.id ? 'active' : ''}\"\n                    click.delegate=\"edit(year)\">\n              <i class=\"fa fa-pencil\"></i> Edit\n            </button>\n            <button type=\"button\" class=\"btn btn-default\"\n                    click.delegate=\"delete(year)\">\n              <i class=\"fa fa-eraser\"></i> </span> Delete\n            </button>\n          </div>\n        </td>\n      </tr>\n    </table>\n  </div>\n</template>\n"; });
define('text!gradebook/components/addAssignment.html', ['module'], function(module) { module.exports = "<template>\n  <h5>${ title }</h5>\n  <form class=\"form-horizontal\" submit.delegate=\"submitAssignment()\"\n        autocomplete=\"off\">\n\n    <!-- Assignment Name -->\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\">Name:</label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" class=\"form-control\" value.bind=\"newAssignment.name\"\n               required>\n      </div>\n    </div>\n\n    <!-- Date of Assignment -->\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\">Date Assigned:</label>\n      <div class=\"col-md-6\">\n        <input type=\"date\" name=\"date\" class=\"form-control\"\n               value.bind=\"newAssignment.date\" required>\n      </div>\n    </div>\n\n    <!-- Assignment Type -->\n    <div class=\"form-group\" show.bind=\"mode !== 'edit'\">\n      <label class=\"col-md-4 control-label\">Type:</label>\n      <div class=\"col-md-6\">\n        <select class=\"form-control\" name=\"type\" value.bind=\"newAssignment.type\" required>\n          <option value=\"\">Select Type</option>\n          <option value=\"Points\">Points</option>\n          <option value=\"Checks\">Checks</option>\n        </select>\n      </div>\n    </div>\n\n    <!-- Max Points -->\n    <div class=\"form-group\" if.bind=\"newAssignment.type === 'Points'\">\n      <label class=\"col-md-4 control-label\">Max Points:</label>\n      <div class=\"col-md-6\">\n        <input type=\"number\" name=\"max\" class=\"form-control\" value.bind=\"newAssignment.max\" required>\n      </div>\n    </div>\n\n    <!-- Submit Button -->\n    <div class=\"form-group\">\n      <div class=\"col-md-6 col-md-offset-5\">\n        <button type=\"submit\" class=\"btn btn-primary\">\n          ${ btn }\n        </button>\n        <button click.delegate=\"cancel()\" class=\"btn btn-danger\">\n          Cancel\n        </button>\n      </div>\n    </div>\n\n  </form>\n</template>\n"; });
define('text!gradebook/components/assignmentlist.html', ['module'], function(module) { module.exports = "<template>\n  <ul class=\"nav nav-pills nav-stacked\">\n    <li repeat.for=\"assignment of current.assignmentList\"\n        role=\"presentation\"\n        class=\"${assignment.id === current.assignment.id ? 'active' : ''}\">\n      <a href=\"\" click.delegate=\"current.setAssignment(assignment)\">${ assignment.name }</a>\n    </li>\n  </ul>\n</template>\n"; });
define('text!gradebook/components/quickEntry.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../../resources/autocomplete\"></require>\n  <require from=\"../converters/score-format\"></require>\n\n  <table class=\"table table-hover\">\n    <thead>\n      <tr>\n        <th></th>\n        <th class=\"text-center\">${ current.assignment.type }\n          <small show.bind=\"isPoints\">\n            (max: ${ current.assignment.max })</small></th>\n      </tr>\n    </thead>\n    <tr repeat.for=\"score of entered\">\n      <td class=\"text-center\">${ score.studref.first_name }</td>\n      <td class=\"text-center\">\n        <div if.bind=\"isPoints\">\n          ${ score.value  | scoreFormat: current.assignment}\n        </div>\n        <div if.bind=\"!isPoints\">\n          <i class=\"fa fa${ score.value === 1 ? '-check': ''}-circle-o fa-2x\" aria-hidden=\"true\"></i>\n        </div>\n      </td>\n    </tr>\n\n    <!-- Input Row -->\n    <tr>\n      <td class=\"text-center\">\n        <!-- Name Input -->\n          <div class=\"form-group\">\n            <autocomplete service.bind=\"suggestionService\"\n                          value.bind=\"score\"\n                          placeholder=\"Name\"\n                          name-focus.bind=\"nameFocus\"\n                          score-focus.bind=\"scoreFocus\"\n                          is-points.bind=\"isPoints\"\n                          checks.call=\"parseKey(key)\">\n            <template replace-part=\"suggestion\">\n              <span style=\"font-style: italic\">${suggestion}</span>\n            </template>\n</autocomplete>\n</div>\n</td>\n\n<!-- Value Input -->\n<td class=\"text-center\">\n  <div class=\"form-group\">\n    <div if.bind=\"isPoints\" class=\"form-group\">\n      <input value.bind=\"quickPoints\"\n             type=\"number\"\n             class=\"form-control\"\n             style=\"width: 5em;\"\n             placeholder=\"Score\"\n             focus.bind=\"scoreFocus\"\n             keypress.delegate=\"parseKey($event.which)\" />\n    </div>\n    <div if.bind=\"!isPoints\">\n      <i class=\"fa fa-check-circle-o fa-2x\" aria-hidden=\"true\"></i>\n    </div>\n  </div>\n</td>\n</tr>\n</table>\n</template>\n"; });
define('text!gradebook/components/reportAssignment.html', ['module'], function(module) { module.exports = "<template>\n<style>\n\n.bar rect {\nfill: steelblue;\n}\n\n.bar text {\nfill: #fff;\nfont: 10px sans-serif;\n}\n\ndiv.tooltip {\n    position: absolute;\n    text-align: center;\n    width: auto;\n    height: auto;\n    padding: 2px;\n    font: 16px sans-serif;\n    background: lightsteelblue;\n    border: 0px;\n    border-radius: 8px;\n    pointer-events: none;\n\n}\n\n.arc text {\n  font: 10px sans-serif;\n  text-anchor: middle;\n}\n\n.arc path {\n  stroke: #fff;\n}\n\n.legend {\n    font-size: 13px;\n  }\n  h1 {\n  font-size: 15px;\n  text-align: center;\n\t}\n  rect {\n    stroke-width: 2;\n  }\n\n  .tooltip2 {\n  box-shadow: 0 0 5px #999999;\n  display: none;\n  font-size: 12px;\n  left: 130px;\n  padding: 10px;\n  position: absolute;\n  text-align: center;\n  top: 95px;\n  width: 80px;\n  z-index: 10;\n  line-height: 140%; /*Interlineado*/\n  font-family: \"Open Sans\", sans-serif;\n  font-weight: 300;\n  background: rgba(0, 0, 0, 0.8);\n  color: #fff;\n  border-radius: 2px;\n\t}\n\n  .label {\n   font-weight: 600;\n  }\n\n</style>\n  <div id=\"content\"></div>\n</template>\n"; });
define('text!gradebook/components/scoresList.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../converters/score-format\"></require>\n\n  <table class=\"table table-hover\">\n    <thead>\n    <tr>\n      <th></th>\n      <th class=\"text-center\">${ current.assignment.type }\n        <small show.bind=\"current.isPoints && current.assignment.max !== 0\">\n          (max: ${current.assignment.max})</small></th>\n    </tr>\n    </thead>\n      <tr repeat.for=\"score of current.scores\">\n        <td class=\"text-center\">${ score.studref.first_name }</td>\n        <td class=\"text-center\" click.delegate=\"editScore(score)\">\n          <!-- View Mode -->\n          <div if.bind=\"score.id !== editScoreId\">\n            <div if.bind=\"current.isPoints\">\n              ${ score.value  | scoreFormat: current.assignment}\n            </div>\n            <div if.bind=\"!current.isPoints\">\n              <i class=\"fa fa${ score.value === 1 ? '-check': ''}-circle-o fa-2x\" aria-hidden=\"true\"></i>\n            </div>\n          </div>\n\n          <!-- Edit Mode -->\n          <div if.bind=\"score.id === editScoreId\">\n              <input keypress.delegate=\"deFocus($event.which)\"\n                     focus.bind=\"editFocus\"\n                     blur.trigger=\"updateScore(score, $index)\"\n                     value.bind=\"score.value\"\n                     type=\"number\"\n                     style=\"width: 3.5em\">\n          </div>\n        </td>\n      </tr>\n  </table>\n\n</template>\n"; });
define('text!admin/components/addStudent.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"col-md-6\">\n    <h4>${ title }</h4>\n    <form submit.delegate=\"submit()\" class=\"form-horizontal\">\n\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">First Name:</label>\n        <div class=\"col-md-6\">\n          <input type=\"text\" class=\"form-control\" value.bind=\"newStudent.first_name\" required>\n        </div>\n      </div>\n\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">Last Name:</label>\n        <div class=\"col-md-6\">\n          <input type=\"text\" class=\"form-control\" value.bind=\"newStudent.last_name\">\n        </div>\n      </div>\n\n      <div class=\"form-group\">\n        <div class=\"col-md-offset-4 col-md-6 text-center\">\n          <button type=\"submit\" class=\"btn btn-primary\">\n            ${ bttn }\n          </button>\n          <button click.delegate=\"reset()\" class=\"btn btn-danger\">\n            Cancel\n          </button>\n        </div>\n      </div>\n\n    </form>\n  </div>\n\n  <div class=\"col-md-6\">\n    <h4>Saved</h4>\n    <table class=\"table table-hover\">\n      <thead>\n      <tr>\n        <th>Name\n          <small>(Total: ${ students.length })</small>\n        </th>\n        <th></th>\n      </tr>\n      </thead>\n      <tr repeat.for=\"student of students\">\n        <td>${ student.first_name } ${ student.last_name }</td>\n        <td>\n          <div class=\"btn-group btn-group-xs\" role=\"group\">\n            <button type=\"button\" class=\"btn btn-default ${ newStudent.id === student.id ? 'active' : '' }\"\n                    click.delegate=\"edit(student)\">\n              <i class=\"fa fa-pencil\"></i> Edit\n            </button>\n            <button type=\"button\" class=\"btn btn-default\"\n                    click.delegate=\"delete(student)\">\n              <i class=\"fa fa-eraser\"></i> Delete\n            </button>\n          </div>\n        </td>\n      </tr>\n    </table>\n  </div>\n</template>\n"; });
define('text!admin/components/addSubject.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"col-md-6\">\n    <h4>${ title }</h4>\n    <form submit.delegate=\"submit()\" class=\"form-horizontal\">\n\n      <div class=\"form-group\">\n        <label class=\"col-md-4 control-label\">Subject Name:</label>\n        <div class=\"col-md-6\">\n          <input type=\"text\" class=\"form-control\" value.bind=\"newSubject.name\">\n        </div>\n      </div>\n\n      <div class=\"form-group\">\n        <div class=\"col-md-offset-4 col-md-6 text-center\">\n          <button type=\"submit\" class=\"btn btn-primary\">\n            ${ bttn }\n          </button>\n        </div>\n      </div>\n\n    </form>\n  </div>\n  <div class=\"col-md-6\">\n    <h4>Saved</h4>\n    <table class=\"table table-hover\">\n      <thead>\n      <tr>\n        <th>Name</th>\n        <th></th>\n      </tr>\n      </thead>\n      <tr repeat.for=\"subject of current.subjectList\">\n        <td>${ subject.name }</td>\n        <td>\n          <div class=\"btn-group btn-group-xs\" role=\"group\">\n            <button type=\"button\" class=\"btn btn-default ${ subject.id === newSubject.id ? 'active' : ''}\" click.delegate=\"edit(subject)\">\n              <i class=\"fa fa-pencil\"></i> Edit\n            </button>\n            <button type=\"button\" class=\"btn btn-default\" click.delegate=\"delete(subject)\">\n              <i class=\"fa fa-eraser\"></i> Delete\n            </button>\n          </div>\n        </td>\n      </tr>\n    </table>\n  </div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map