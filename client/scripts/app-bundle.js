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
      config.map([{ route: '', redirect: 'gradebook' }, { route: 'gradebook', moduleId: 'gradebook', nav: 1, title: 'Gradebook' }, { route: 'admin', moduleId: 'admin', nav: 2, title: 'Administration' }]);

      this.router = router;
    };

    return App;
  }();
});
define('assignmentlist',['exports', 'aurelia-http-client', 'aurelia-framework'], function (exports, _aureliaHttpClient, _aureliaFramework) {
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

  var _desc, _value, _class, _descriptor;

  var AssignmentList = exports.AssignmentList = (_class = function () {
    function AssignmentList() {
      _classCallCheck(this, AssignmentList);

      _initDefineProp(this, 'curSub', _descriptor, this);

      this.http = new _aureliaHttpClient.HttpClient();
      this.assignments = [];
    }

    AssignmentList.prototype.activate = function activate(curSub) {
      this.assignments = [curSub, curSub];
      console.log(curSub);
    };

    AssignmentList.prototype.created = function created() {
      var _this = this;

      this.http.get('http://localhost:5000/api/assignments').then(function (data) {
        _this.assignments = JSON.parse(data.response);
      });
    };

    return AssignmentList;
  }(), (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'curSub', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class);
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
define('gradebook',['exports', 'aurelia-http-client'], function (exports, _aureliaHttpClient) {
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

  var gradebook = exports.gradebook = function () {
    function gradebook() {
      var _this = this;

      _classCallCheck(this, gradebook);

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

      this.http = new _aureliaHttpClient.HttpClient();
      this.subjects = [];
      this.assignments = null;
      this.scores = null;
      this.editScoreId = null;

      this.entered = [];
      this.quickmode = false;
      this.quickNameFocus = true;
      this.quickScoreFocus = false;
      this.quickPoints = null;
    }

    gradebook.prototype.created = function created() {
      var _this2 = this;

      this.http.get('http://localhost:5000/api/subjects').then(function (data) {
        _this2.subjects = JSON.parse(data.response).objects;
      });
    };

    gradebook.prototype.getAssignments = function getAssignments(id) {
      var _this3 = this;

      var qobj = {
        filters: [{ "name": "subjid", "op": "eq", "val": id }],
        order_by: [{ "field": "date", "direction": "desc" }]
      };

      this.http.createRequest('http://localhost:5000/api/assignments').asGet().withParams({ q: JSON.stringify(qobj) }).send().then(function (data) {
        _this3.assignments = JSON.parse(data.response).objects;
      });

      this.scores = null;
      this.assignmentMeta = null;
    };

    gradebook.prototype.getScores = function getScores(id) {
      var _this4 = this;

      var qobj = {
        filters: [{ "name": "assignid", "op": "eq", "val": id }],
        order_by: [{ "field": "studref__first_name", "direction": "asc" }]
      };

      this.http.createRequest('http://localhost:5000/api/scores').asGet().withParams({ q: JSON.stringify(qobj) }).send().then(function (data) {
        _this4.scores = JSON.parse(data.response).objects;
        _this4.assignmentMeta = _this4.scores[0].assref;
      });
    };

    gradebook.prototype.editScore = function editScore(score) {
      if (this.assignmentMeta.type === 'Points') {
        this.editScoreId = score.id;
        this.editFocus = true;
      } else {
        score.value = 1 - score.value;
        this.updateScore('blurred', score.id, score.value);
      }
    };

    gradebook.prototype.updateScore = function updateScore(key, id, value) {
      if (key === 13 || key === 'blurred') {
        this.http.createRequest('http://localhost:5000/api/scores/' + id).asPut().withContent({ "value": value }).send();

        this.editScoreId = null;
      }

      return true;
    };

    gradebook.prototype.toggleQuick = function toggleQuick() {
      this.quickmode = !this.quickmode;
      if (this.quickmode) {
        this.notEntered = this.scores;
      }
    };

    gradebook.prototype.quickUpdate = function quickUpdate(key) {
      if (key === 13) {
        if (this.assignmentMeta.type !== 'Checks') {
          this.updateScore(key, this.quickName.id, this.quickPoints);
          this.quickName.value = this.quickPoints;
          this.entered.push(this.quickName);
        } else {
          this.updateScore(key, this.quickName.id, 1);
          this.quickName.value = 1;
          this.entered.push(this.quickName);
        }

        this.quickName = null;
        this.quickPoints = null;
        this.quickScoreFocus = false;
        this.quickNameFocus = true;
      } else {
        return true;
      }
    };

    return gradebook;
  }();
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
define('subjectlist',['exports', 'aurelia-http-client'], function (exports, _aureliaHttpClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SubjectList = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var SubjectList = exports.SubjectList = function () {
    function SubjectList() {
      _classCallCheck(this, SubjectList);

      this.http = new _aureliaHttpClient.HttpClient();
      this.subjects = [];
    }

    SubjectList.prototype.created = function created() {
      var _this = this;

      this.http.get('http://localhost:5000/api/subjects').then(function (data) {
        _this.subjects = JSON.parse(data.response).objects;
      });
    };

    SubjectList.prototype.select = function select(contact) {
      this.selectedId = contact.id;
      return true;
    };

    return SubjectList;
  }();
});
define('converters/score-format',['exports'], function (exports) {
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

      _initDefineProp(this, 'quickNameFocus', _descriptor5, this);

      _initDefineProp(this, 'quickScoreFocus', _descriptor6, this);

      _initDefineProp(this, 'assmType', _descriptor7, this);

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
          if (this.assmType === 'Points') {
            this.quickNameFocus = false;
            this.quickScoreFocus = true;
            return;
          } else {
            console.log("this is running");
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
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'quickNameFocus', [_dec3], {
    enumerable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'quickScoreFocus', [_dec4], {
    enumerable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'assmType', [_aureliaTemplating.bindable], {
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
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n\n\n  <nav class=\"navbar navbar-default\">\n    <div class=\"container-fluid\">\n      <!-- Brand and toggle get grouped for better mobile display -->\n      <div class=\"navbar-header\">\n        <button type=\"button\" class=\"navbar-toggle collapsed\"\n                data-toggle=\"collapse\"\n                data-target=\"#bs-example-navbar-collapse-1\"\n                aria-expanded=\"false\">\n          <span class=\"sr-only\">Toggle navigation</span>\n          <span class=\"icon-bar\"></span>\n          <span class=\"icon-bar\"></span>\n          <span class=\"icon-bar\"></span>\n        </button>\n        <a class=\"navbar-brand\" href=\"/\" }>Marks</a>\n      </div>\n\n      <!-- Collect the nav links, forms, and other content for toggling -->\n      <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n        <ul class=\"nav navbar-nav\">\n          <li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\n          <a href.bind=\"row.href\">${row.title}</a>\n        </li>\n        </ul>\n        <ul class=\"nav navbar-nav navbar-right\">\n          <li><a href>School Name (2017)</a>\n          </li>\n        </ul>\n      </div>\n    </div>\n  </nav>\n\n    <!-- Viewport -->\n  <div class=\"container\">\n    <div class=\"row\">\n      <router-view></router-view>\n    </div>\n  </div>\n</template>\n"; });
define('text!resources/autocomplete.css', ['module'], function(module) { module.exports = "autocomplete {\n  display: inline-block;\n}\n\nautocomplete .suggestions {\n  list-style-type: none;\n  cursor: default;\n  padding: 0;\n  margin: 0;\n  border: 1px solid #ccc;\n  background: #fff;\n  box-shadow: -1px 1px 3px rgba(0,0,0,.1);\n\n  position: absolute;\n  z-index: 9999;\n  max-height: 15rem;\n  overflow: hidden;\n  overflow-y: auto;\n  box-sizing: border-box;\n}\n\nautocomplete .suggestion {\n  padding: 0 .3rem;\n  line-height: 1.5rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: #333;\n}\n\nautocomplete .suggestion:hover,\nautocomplete .suggestion.selected {\n  background: #f0f0f0;\n}\n"; });
define('text!assignmentlist.html', ['module'], function(module) { module.exports = "<template>\n  <ul class=\"\">\n    <li>\n      <h4>Assignments</h4>\n    </li>\n    <li repeat.for=\"assign of assignments\" role=\"presentation\">\n      <a href=''>${ assign }</a>\n    </li>\n  </ul>\n</template>\n"; });
define('text!gradebook.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./converters/score-format\"></require>\n  <require from=\"./resources/autocomplete\"></require>\n\n\n  <ul class=\"nav nav-tabs\">\n    <li>\n      <h4>Subjects</h4>\n    </li>\n    <li repeat.for=\"sub of subjects\" role=\"presentation\"\n    class=\"${sub.id === assignments[0].subjid ? 'active' : ''}\">\n      <a href=\"\" click.delegate=\"getAssignments(sub.id)\">${ sub.name }</a>\n    </li>\n  </ul>\n  <!-- Subject Menu Bar -->\n  <div class=\"row\" show.bind=\"assignments\">\n    <ul class=\"nav nav-pills\">\n      <li role=\"presentation\">\n        <a href=\"#\"><i class=\"fa fa-plus fa-lg\"></i> Add Assignment</a>\n      </li>\n      <li role=\"presentation\" show.bind=\"scores\" class=\"${quickmode ? 'active' : ''}\">\n        <a href=\"#\" click.delegate=\"toggleQuick()\"><i class=\"fa fa-fast-forward\"></i> Quick Entry</a>\n      </li>\n    </ul>\n  </div>\n    <div class='row'>\n      <div class='col-md-2'>\n        <h5 show.bind=\"assignments\">Assignments</h5>\n        <ul class=\"nav nav-pills nav-stacked\">\n          <li repeat.for=\"assign of assignments\" role=\"presentation\"\n          class=\"${assign.id === assignmentMeta.id ? 'active' : ''}\">\n            <a href=\"\" click.delegate=\"getScores(assign.id)\">${ assign.name }</a>\n          </li>\n        </ul>\n      </div>\n\n      <div class='col-md-4'>\n        <h5 show.bind=\"scores\">Scores</h5>\n        <table class=\"table table-hover\" show.bind=\"scores && !quickmode\">\n          <thead>\n          <tr>\n            <th></th>\n            <th class='text-center'>${ assignmentMeta.type }\n              <small show.bind=\"assignmentMeta.type == 'Points'\">\n                (max: ${assignmentMeta.max})</small></th>\n          </tr>\n          </thead>\n            <tr repeat.for=\"score of scores\">\n              <td class=\"text-center\">${ score.studref.first_name }</td>\n              <td class=\"text-center\" click.delegate=\"editScore(score)\">\n                <!-- View Mode -->\n                <div if.bind=\"score.id !== editScoreId\">\n                  ${ score.value  | scoreFormat: assignmentMeta}\n                  <i if.bind=\"score.value === 1 && assignmentMeta.type === 'Checks'\" class=\"fa fa-check-circle-o fa-2x\" aria-hidden=\"true\"></i>\n                  <i if.bind=\"score.value === 0 && assignmentMeta.type === 'Checks'\" class=\"fa fa-circle-o fa-2x\" aria-hidden=\"true\"></i>\n                </div>\n\n                <!-- Edit Mode -->\n                <div if.bind=\"score.id === editScoreId\">\n                    <input keypress.delegate=\"updateScore($event.which, score.id, score.value)\"\n                    focus.bind=\"editFocus\" blur.trigger=\"updateScore('blurred', score.id, score.value)\"\n                    value.bind=\"score.value\" type=\"number\" style=\"width: 3.5em\">\n                </div>\n              </td>\n            </tr>\n        </table>\n\n        <!-- Quick Entry Mode -->\n        <table class='table table-hover' if.bind=\"quickmode\">\n          <thead>\n            <tr>\n              <th></th>\n              <th class='text-center'>${ assignmentMeta.type }\n                <small show.bind=\"assignmentMeta.type == 'Points'\">\n                  (max: ${assignmentMeta.max})</small></th>\n            </tr>\n          </thead>\n          <tr repeat.for=\"score of entered\">\n            <td class=\"text-center\">${ score.studref.first_name }</td>\n            <td class=\"text-center\">\n              ${ score.value  | scoreFormat: assignmentMeta}\n              <i if.bind=\"score.value === 1 && assignmentMeta.type === 'Checks'\" class=\"fa fa-check-circle-o fa-2x\" aria-hidden=\"true\"></i>\n              <i if.bind=\"score.value === 0 && assignmentMeta.type === 'Checks'\" class=\"fa fa-circle-o fa-2x\" aria-hidden=\"true\"></i>\n            </td>\n          </tr>\n          <tr>\n            <td class=\"text-center\">\n              <!-- Name Input -->\n                <div class=\"form-group\">\n                  <autocomplete service.bind=\"suggestionService\"\n                                value.bind=\"quickName\"\n                                placeholder=\"Name\"\n                                quick-name-focus.bind=\"quickNameFocus\"\n                                quick-score-focus.bind=\"quickScoreFocus\"\n                                assm-type.bind=\"assignmentMeta.type\"\n                                checks.call=\"quickUpdate(key)\">\n                  <template replace-part=\"suggestion\">\n                    <span style=\"font-style: italic\">${suggestion}</span>\n                  </template>\n                </autocomplete>\n                </div>\n            </td>\n\n            <!-- Value Input -->\n            <td class=\"text-center\">\n                <div class=\"form-group\">\n                  <div if.bind=\"assignmentMeta.type === 'Points'\" class=\"form-group\">\n                    <input value.bind=\"quickPoints\" class=form-control\n                    style=\"width: 5em;\" placeholder=\"Score\"\n                    focus.bind=\"quickScoreFocus\" keypress.delegate=\"quickUpdate($event.which)\" />\n\n                  </div>\n                  <div if.bind=\"assignmentMeta.type === 'Checks'\">\n                    <i class=\"fa fa-check-circle-o fa-2x\" aria-hidden=\"true\"></i>\n                  </div>\n                </div>\n            </td>\n          </tr>\n        </table>\n      </div>\n      </div>\n</template>\n"; });
define('text!subjectlist.html', ['module'], function(module) { module.exports = "<template>\n  <ul class=\"nav nav-tabs\">\n    <li>\n      <h4>Subjects</h4>\n    </li>\n    <li repeat.for=\"sub of subjects\" role=\"presentation\">\n      <a href='gradebook/subject/${ sub.id }'>${ sub.name }</a>\n    </li>\n  </ul>\n</template>\n"; });
define('text!resources/autocomplete.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./autocomplete.css\"></require>\n\n  <input type=\"text\" autocomplete=\"off\" class=form-control\n         aria-autocomplete=\"list\"\n         aria-expanded.bind=\"expanded\"\n         aria-owns.one-time=\"'au-autocomplate-' + id + '-suggestions'\"\n         aria-activedescendant.bind=\"index >= 0 ? 'au-autocomplate-' + id + '-suggestion-' + index : ''\"\n         id.one-time=\"'au-autocomplete-' + id\"\n         placeholder.bind=\"placeholder\"\n         value.bind=\"inputValue & debounce:delay\"\n         keydown.delegate=\"keydown($event.which)\"\n         blur.trigger=\"blur()\"\n         focus.bind=\"quickNameFocus\">\n  <ul class=\"suggestions\" role=\"listbox\"\n      if.bind=\"expanded\"\n      id.one-time=\"'au-autocomplate-' + id + '-suggestions'\"\n      ref=\"suggestionsUL\">\n    <li repeat.for=\"suggestion of suggestions\"\n        id.one-time=\"'au-autocomplate-' + id + '-suggestion-' + $index\"\n        role=\"option\"\n        class-name.bind=\"($index === index ? 'selected' : '') + ' suggestion'\"\n        mousedown.delegate=\"suggestionClicked(suggestion)\">\n        ${ suggestion.studref.first_name }\n      <!-- <template replaceable-part=\"suggestion\">\n        ${ suggestion }\n      </template> -->\n    </li>\n  </ul>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map