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
define('gradebook/index',['exports', 'aurelia-http-client', 'aurelia-framework'], function (exports, _aureliaHttpClient, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.gradebook = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var gradebook = exports.gradebook = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient), _dec(_class = function () {
    function gradebook(HttpClient) {
      _classCallCheck(this, gradebook);

      this.http = HttpClient;

      this.subjectSelected = false;
      this.assignmentSelected = false;
      this.quickEntry = false;
    }

    gradebook.prototype.created = function created() {
      var _this = this;

      this.http.get('http://localhost:5000/api/subjects').then(function (data) {
        _this.subjects = JSON.parse(data.response).objects;
      });
    };

    gradebook.prototype.selectSubject = function selectSubject(subject) {
      this.subjectSelected = subject;
      this.assignmentSelected = false;
    };

    gradebook.prototype.selectAssignment = function selectAssignment(assignment) {
      this.assignmentSelected = assignment;
    };

    gradebook.prototype.toggleQuick = function toggleQuick() {
      this.quickEntry = !this.quickEntry;
    };

    return gradebook;
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
            return;
          } else {
            this.checks({ key: key });
            return;
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

  var _dec, _class, _desc, _value, _class2, _descriptor, _descriptor2;

  var AssignmentList = exports.AssignmentList = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient), _dec(_class = (_class2 = function () {
    function AssignmentList(HttpClient) {
      _classCallCheck(this, AssignmentList);

      _initDefineProp(this, 'subject', _descriptor, this);

      _initDefineProp(this, 'selectAssignment', _descriptor2, this);

      this.http = HttpClient;

      this.selectedId = false;
    }

    AssignmentList.prototype.subjectChanged = function subjectChanged() {
      this.getAssignments(this.subject);
      this.selectedId = false;
    };

    AssignmentList.prototype.getAssignments = function getAssignments(subject) {
      var _this = this;

      var qobj = {
        filters: [{ "name": "subjid", "op": "eq", "val": subject.id }],
        order_by: [{ "field": "date", "direction": "desc" }]
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
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'selectAssignment', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('gradebook/components/scoresList',['exports', 'aurelia-framework', 'aurelia-http-client', 'aurelia-templating'], function (exports, _aureliaFramework, _aureliaHttpClient, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ScoresList = undefined;

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

  var ScoresList = exports.ScoresList = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient), _dec(_class = (_class2 = function () {
    function ScoresList(HttpClient) {
      _classCallCheck(this, ScoresList);

      _initDefineProp(this, 'assignment', _descriptor, this);

      this.http = HttpClient;

      this.editScoreId = null;
    }

    ScoresList.prototype.bind = function bind() {
      this.getScores(this.assignment);
      this.isPoints = this.assignment.type === 'Points';
    };

    ScoresList.prototype.getScores = function getScores(assignment) {
      var _this = this;

      var qobj = {
        filters: [{ "name": "assignid", "op": "eq", "val": assignment.id }],
        order_by: [{ "field": "studref__first_name", "direction": "asc" }]
      };

      this.http.createRequest('http://localhost:5000/api/scores').asGet().withParams({ q: JSON.stringify(qobj) }).send().then(function (data) {
        _this.scores = JSON.parse(data.response).objects;
      });
    };

    ScoresList.prototype.editScore = function editScore(score) {
      if (this.isPoints) {
        this.editScoreId = score.id;
        this.editFocus = true;
      } else {
        score.value = 1 - score.value;
        this.updateScore('blurred', score);
      }
    };

    ScoresList.prototype.updateScore = function updateScore(key, score) {
      if (key === 13 || key === 'blurred') {
        this.http.createRequest('http://localhost:5000/api/scores/' + score.id).asPut().withContent({ "value": score.value }).send();

        this.editScoreId = null;
      }

      return true;
    };

    return ScoresList;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'assignment', [_aureliaTemplating.bindable], {
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
    function QuickEntry(HttpClient) {
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

      this.http = HttpClient;

      this.entered = [];
    }

    QuickEntry.prototype.bind = function bind() {
      this.getScores(this.assignment);
      this.isPoints = this.assignment.type === 'Points';
      this.nameFocus = true;
    };

    QuickEntry.prototype.detached = function detached() {
      this.entered = [];
    };

    QuickEntry.prototype.getScores = function getScores(assignment) {
      var _this2 = this;

      var qobj = {
        filters: [{ "name": "assignid", "op": "eq", "val": assignment.id }],
        order_by: [{ "field": "studref__first_name", "direction": "asc" }]
      };

      this.http.createRequest('http://localhost:5000/api/scores').asGet().withParams({ q: JSON.stringify(qobj) }).send().then(function (data) {
        _this2.notEntered = JSON.parse(data.response).objects;
      });
    };

    QuickEntry.prototype.parseKey = function parseKey(key) {
      var _this3 = this;

      if (key === 13) {
        if (this.isPoints) {
          this.score.value = this.quickPoints;
          this.updateScore(this.score);
        } else {
          this.score.value = 1;
          this.updateScore(this.score);
        }

        this.entered.push(this.score);

        this.notEntered = this.notEntered.filter(function (item) {
          return item.id !== _this3.score.id;
        });

        this.score = null;
        this.quickPoints = null;
        this.scoreFocus = false;
        this.nameFocus = true;
      } else {
        return true;
      }
    };

    QuickEntry.prototype.updateScore = function updateScore(score) {
      this.http.createRequest('http://localhost:5000/api/scores/' + score.id).asPut().withContent({ "value": score.value }).send();
    };

    return QuickEntry;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'assignment', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n\n  <!-- Navigation Bar -->\n  <nav class=\"navbar navbar-default\">\n    <div class=\"container-fluid\">\n      <!-- Brand and toggle get grouped for better mobile display -->\n      <div class=\"navbar-header\">\n        <button type=\"button\" class=\"navbar-toggle collapsed\"\n                data-toggle=\"collapse\"\n                data-target=\"#bs-example-navbar-collapse-1\"\n                aria-expanded=\"false\">\n          <span class=\"sr-only\">Toggle navigation</span>\n          <span class=\"icon-bar\"></span>\n          <span class=\"icon-bar\"></span>\n          <span class=\"icon-bar\"></span>\n        </button>\n        <a class=\"navbar-brand\" href=\"/\" }>Marks</a>\n      </div>\n\n      <!-- Collect the nav links, forms, and other content for toggling -->\n      <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n        <ul class=\"nav navbar-nav\">\n          <li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\n          <a href.bind=\"row.href\">${row.title}</a>\n        </li>\n        </ul>\n        <ul class=\"nav navbar-nav navbar-right\">\n          <li><a href>School Name (2017)</a>\n          </li>\n        </ul>\n      </div>\n    </div>\n  </nav>\n\n  <!-- Viewport -->\n  <div class=\"container\">\n    <div class=\"row\">\n      <router-view></router-view>\n    </div>\n  </div>\n</template>\n"; });
define('text!resources/autocomplete.css', ['module'], function(module) { module.exports = "autocomplete {\n  display: inline-block;\n}\n\nautocomplete .suggestions {\n  list-style-type: none;\n  cursor: default;\n  padding: 0;\n  margin: 0;\n  border: 1px solid #ccc;\n  background: #fff;\n  box-shadow: -1px 1px 3px rgba(0,0,0,.1);\n\n  position: absolute;\n  z-index: 9999;\n  max-height: 15rem;\n  overflow: hidden;\n  overflow-y: auto;\n  box-sizing: border-box;\n}\n\nautocomplete .suggestion {\n  padding: 0 .3rem;\n  line-height: 1.5rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: #333;\n}\n\nautocomplete .suggestion:hover,\nautocomplete .suggestion.selected {\n  background: #f0f0f0;\n}\n"; });
define('text!gradebook/index.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./components/assignmentlist\"></require>\n  <require from=\"./components/scoresList\"></require>\n  <require from=\"./components/quickEntry\"></require>\n\n  <!-- Subjects Menu -->\n  <ul class=\"nav nav-tabs\">\n    <li>\n      <h4>Subjects</h4>\n    </li>\n    <li repeat.for=\"sub of subjects\" role=\"presentation\"\n        class=\"${sub.id === subjectSelected.id ? 'active' : ''}\">\n      <a href=\"\" click.delegate=\"selectSubject(sub)\">${ sub.name }</a>\n    </li>\n  </ul>\n\n  <!-- Subject Menu Bar -->\n  <div class=\"row\" show.bind=\"subjectSelected\">\n    <ul class=\"nav nav-pills\">\n      <li role=\"presentation\">\n        <a href=\"#\"><i class=\"fa fa-plus fa-lg\"></i> Add Assignment</a>\n      </li>\n      <li role=\"presentation\" show.bind=\"assignmentSelected\" class=\"${quickEntry ? 'active' : ''}\">\n        <a href=\"#\" click.delegate=\"toggleQuick()\"><i class=\"fa fa-fast-forward\"></i> Quick Entry</a>\n      </li>\n    </ul>\n  </div>\n\n  <!-- Assignment List -->\n  <div class='row'>\n    <div class='col-md-2' if.bind=\"subjectSelected\">\n      <h5>Assignments</h5>\n      <assignment-list subject.bind=\"subjectSelected\"\n                       select-assignment.call=\"selectAssignment(assignment)\">\n      </assignment-list>\n    </div>\n\n  <!-- Scores List -->\n  <div class='col-md-4' if.bind=\"assignmentSelected\">\n    <h5>Scores</h5>\n    <scores-list if.bind=\"!quickEntry\" assignment.bind=\"assignmentSelected\"></scores-list>\n    <quick-entry if.bind=\"quickEntry\" assignment.bind=\"assignmentSelected\"></quick-entry>\n  </div>\n</template>\n"; });
define('text!resources/autocomplete.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./autocomplete.css\"></require>\n\n  <input type=\"text\" autocomplete=\"off\" class=form-control\n         aria-autocomplete=\"list\"\n         aria-expanded.bind=\"expanded\"\n         aria-owns.one-time=\"'au-autocomplate-' + id + '-suggestions'\"\n         aria-activedescendant.bind=\"index >= 0 ? 'au-autocomplate-' + id + '-suggestion-' + index : ''\"\n         id.one-time=\"'au-autocomplete-' + id\"\n         placeholder.bind=\"placeholder\"\n         value.bind=\"inputValue & debounce:delay\"\n         keydown.delegate=\"keydown($event.which)\"\n         blur.trigger=\"blur()\"\n         focus.bind=\"nameFocus\">\n  <ul class=\"suggestions\" role=\"listbox\"\n      if.bind=\"expanded\"\n      id.one-time=\"'au-autocomplate-' + id + '-suggestions'\"\n      ref=\"suggestionsUL\">\n    <li repeat.for=\"suggestion of suggestions\"\n        id.one-time=\"'au-autocomplate-' + id + '-suggestion-' + $index\"\n        role=\"option\"\n        class-name.bind=\"($index === index ? 'selected' : '') + ' suggestion'\"\n        mousedown.delegate=\"suggestionClicked(suggestion)\">\n        ${ suggestion.studref.first_name }\n      <!-- <template replaceable-part=\"suggestion\">\n        ${ suggestion }\n      </template> -->\n    </li>\n  </ul>\n</template>\n"; });
define('text!gradebook/components/assignmentlist.html', ['module'], function(module) { module.exports = "<template>\n  <ul class=\"nav nav-pills nav-stacked\">\n    <li repeat.for=\"assign of assignments\" role=\"presentation\"\n        class=\"${assign.id === selectedId ? 'active' : ''}\">\n      <a href=\"\" click.delegate=\"chooseAssignment(assign)\">${ assign.name }</a>\n    </li>\n  </ul>\n</template>\n"; });
define('text!gradebook/components/scoresList.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../converters/score-format\"></require>\n\n  <table class=\"table table-hover\">\n    <thead>\n    <tr>\n      <th></th>\n      <th class='text-center'>${ assignment.type }\n        <small show.bind=\"isPoints\">\n          (max: ${assignment.max})</small></th>\n    </tr>\n    </thead>\n      <tr repeat.for=\"score of scores\">\n        <td class=\"text-center\">${ score.studref.first_name }</td>\n        <td class=\"text-center\" click.delegate=\"editScore(score)\">\n          <!-- View Mode -->\n          <div if.bind=\"score.id !== editScoreId\">\n            <div if.bind=\"isPoints\">\n              ${ score.value  | scoreFormat: assignment}\n            </div>\n            <div if.bind=\"!isPoints\">\n              <i class=\"fa fa${ score.value === 1 ? '-check': ''}-circle-o fa-2x\" aria-hidden=\"true\"></i>\n            </div>\n          </div>\n\n          <!-- Edit Mode -->\n          <div if.bind=\"score.id === editScoreId\">\n              <input keypress.delegate=\"updateScore($event.which, score)\"\n                     focus.bind=\"editFocus\"\n                     blur.trigger=\"updateScore('blurred', score)\"\n                     value.bind=\"score.value\"\n                     type=\"number\"\n                     style=\"width: 3.5em\">\n          </div>\n        </td>\n      </tr>\n  </table>\n\n</template>\n"; });
define('text!gradebook/components/quickEntry.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../../resources/autocomplete\"></require>\n  <require from=\"../converters/score-format\"></require>\n\n  <table class='table table-hover'>\n    <thead>\n      <tr>\n        <th></th>\n        <th class='text-center'>${ assignment.type }\n          <small show.bind=\"isPoints\">\n            (max: ${assignment.max})</small></th>\n      </tr>\n    </thead>\n    <tr repeat.for=\"score of entered\">\n      <td class=\"text-center\">${ score.studref.first_name }</td>\n      <td class=\"text-center\">\n        <div if.bind=\"isPoints\">\n          ${ score.value  | scoreFormat: assignment}\n        </div>\n        <div if.bind=\"!isPoints\">\n          <i class=\"fa fa${ score.value === 1 ? '-check': ''}-circle-o fa-2x\" aria-hidden=\"true\"></i>\n        </div>\n      </td>\n    </tr>\n\n    <!-- Input Row -->\n    <tr>\n      <td class=\"text-center\">\n        <!-- Name Input -->\n          <div class=\"form-group\">\n            <autocomplete service.bind=\"suggestionService\"\n                          value.bind=\"score\"\n                          placeholder=\"Name\"\n                          name-focus.bind=\"nameFocus\"\n                          score-focus.bind=\"scoreFocus\"\n                          is-points.bind=\"isPoints\"\n                          checks.call=\"parseKey(key)\">\n            <template replace-part=\"suggestion\">\n              <span style=\"font-style: italic\">${suggestion}</span>\n            </template>\n          </autocomplete>\n          </div>\n      </td>\n\n      <!-- Value Input -->\n      <td class=\"text-center\">\n          <div class=\"form-group\">\n            <div if.bind=\"isPoints\" class=\"form-group\">\n              <input value.bind=\"quickPoints\"\n                     class=form-control\n                     style=\"width: 5em;\"\n                     placeholder=\"Score\"\n                     focus.bind=\"scoreFocus\"\n                     keypress.delegate=\"parseKey($event.which)\" />\n            </div>\n            <div if.bind=\"!isPoints\">\n              <i class=\"fa fa-check-circle-o fa-2x\" aria-hidden=\"true\"></i>\n            </div>\n          </div>\n      </td>\n    </tr>\n  </table>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map