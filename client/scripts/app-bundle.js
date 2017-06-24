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

      this.quickEntry = false;
      this.editMode = false;
    }

    GradeBook.prototype.created = function created() {
      var _this = this;

      this.http.get('http://localhost:5000/api/subjects').then(function (data) {
        _this.subjects = JSON.parse(data.response).objects;
      });
    };

    GradeBook.prototype.addAssignment = function addAssignment() {
      this.assignment.clearAssignment();
      this.editMode = 'add';
    };

    GradeBook.prototype.editAssignment = function editAssignment() {
      this.editMode = 'edit';
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
define('gradebook/components/addAssignment',['exports', 'aurelia-framework', 'aurelia-http-client', 'aurelia-templating', 'aurelia-event-aggregator', '../services/assignmentService'], function (exports, _aureliaFramework, _aureliaHttpClient, _aureliaTemplating, _aureliaEventAggregator, _assignmentService) {
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

  var AddAssignment = exports.AddAssignment = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _assignmentService.AssignmentService, _aureliaEventAggregator.EventAggregator), _dec(_class = (_class2 = function () {
    function AddAssignment(http, assignment, eventaggregator) {
      _classCallCheck(this, AddAssignment);

      _initDefineProp(this, 'mode', _descriptor, this);

      this.http = http;
      this.assignment = assignment;
      this.ea = eventaggregator;
    }

    AddAssignment.prototype.created = function created() {
      this.newAssignment = {};
    };

    AddAssignment.prototype.bind = function bind() {
      if (this.mode === 'edit') {
        this.title = 'Edit Assignment';
        this.btn = 'Save Changes';
        this.newAssignment = this.assignment.meta;
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
        this.http.createRequest('http://localhost:5000/api/assignments/' + this.assignment.meta.id).asPut().withContent(this.assignment.meta).send();

        this.mode = false;
      } else {
        this.newAssignment.subjid = this.assignment.subject.id;

        this.http.createRequest('http://localhost:5000/api/assignments').asPost().withContent(this.newAssignment).send().then(function (data) {
          _this.ea.publish('reloadAssignments');

          _this.assignment.setAssignment(JSON.parse(data.response));
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
define('gradebook/components/assignmentlist',['exports', 'aurelia-framework', 'aurelia-http-client', 'aurelia-event-aggregator', '../services/assignmentService'], function (exports, _aureliaFramework, _aureliaHttpClient, _aureliaEventAggregator, _assignmentService) {
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

  var AssignmentList = exports.AssignmentList = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _assignmentService.AssignmentService, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function AssignmentList(http, assignment, eventaggregator) {
      _classCallCheck(this, AssignmentList);

      this.http = http;
      this.assignment = assignment;
      this.ea = eventaggregator;
    }

    AssignmentList.prototype.created = function created() {
      var _this = this;

      this.getAssignments(this.assignment.subject);
      this.subscription = this.ea.subscribe('subjectUpdated', function (resp) {
        return _this.getAssignments(_this.assignment.subject);
      });
      this.reload = this.ea.subscribe('reloadAssignments', function (resp) {
        return _this.getAssignments(_this.assignment.subject);
      });
    };

    AssignmentList.prototype.detached = function detached() {
      this.subscription.dispose();
      this.reload.dispose();
    };

    AssignmentList.prototype.getAssignments = function getAssignments(subject) {
      var _this2 = this;

      var qobj = {
        filters: [{ 'name': 'subjid', 'op': 'eq', 'val': subject.id }],
        order_by: [{ 'field': 'date', 'direction': 'desc' }]
      };

      this.http.createRequest('http://localhost:5000/api/assignments').asGet().withParams({ q: JSON.stringify(qobj) }).send().then(function (data) {
        _this2.assignments = JSON.parse(data.response).objects;
      });
    };

    return AssignmentList;
  }()) || _class);
});
define('gradebook/components/quickEntry',['exports', 'aurelia-framework', 'aurelia-http-client', 'aurelia-event-aggregator', '../services/assignmentService'], function (exports, _aureliaFramework, _aureliaHttpClient, _aureliaEventAggregator, _assignmentService) {
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

  var QuickEntry = exports.QuickEntry = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _assignmentService.AssignmentService, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function QuickEntry(http, assignment, eventaggregator) {
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

      this.http = http;
      this.assignment = assignment;
      this.ea = eventaggregator;
    }

    QuickEntry.prototype.attached = function attached() {
      this.entered = [];
      this.notEntered = this.assignment.scores;

      this.isPoints = this.assignment.isPoints;
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
      this.http.createRequest('http://localhost:5000/api/scores/' + score.id).asPut().withContent({ 'value': score.value }).send();

      this.ea.publish('scoreUpdate');
    };

    return QuickEntry;
  }()) || _class);
});
define('gradebook/components/reportAssignment',['exports', 'aurelia-framework', 'aurelia-http-client', 'aurelia-event-aggregator', '../services/assignmentService', 'd3'], function (exports, _aureliaFramework, _aureliaHttpClient, _aureliaEventAggregator, _assignmentService, _d) {
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

  var ReportAssignment = exports.ReportAssignment = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _assignmentService.AssignmentService, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function ReportAssignment(http, assignment, eventaggregator) {
      _classCallCheck(this, ReportAssignment);

      this.http = http;
      this.assignment = assignment;
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

      if (this.assignment.isPoints) {
        this.renderHistogram(this.assignment.scores, '#content');
      } else {
        this.renderDonut(this.assignment.scores, '#content');
      }
    };

    ReportAssignment.prototype.render = function render(data, divElement) {
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
      var _this2 = this;

      var formatCount = d3.format(',.0f');

      var margin = { top: 20, right: 20, bottom: 30, left: 50 };
      var width = 500 - margin.left - margin.right;
      var height = 300 - margin.top - margin.bottom;

      var svg = d3.select(divElement).append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);

      var g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var x = d3.scaleLinear().range([0, width]);

      if (this.assignment.meta.max !== 0) {
        x.domain([0, this.assignment.meta.max]);
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

      if (this.assignment.meta.max !== 0) {
        g.append('g').attr('class', 'axis axis--x').attr('transform', 'translate(0,' + height + ')').call(d3.axisBottom(x).tickFormat(function (d) {
          return Math.round(d / _this2.assignment.meta.max * 100) + '%';
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
      }).sort(null);

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
define('gradebook/components/scoresList',['exports', 'aurelia-framework', 'aurelia-http-client', 'aurelia-event-aggregator', '../services/assignmentService'], function (exports, _aureliaFramework, _aureliaHttpClient, _aureliaEventAggregator, _assignmentService) {
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

  var ScoresList = exports.ScoresList = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _assignmentService.AssignmentService, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function ScoresList(http, assignment, eventaggregator) {
      _classCallCheck(this, ScoresList);

      this.http = http;
      this.ea = eventaggregator;
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
define('gradebook/services/assignmentService',['exports', 'aurelia-http-client', 'aurelia-event-aggregator', 'aurelia-framework'], function (exports, _aureliaHttpClient, _aureliaEventAggregator, _aureliaFramework) {
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

  var AssignmentService = exports.AssignmentService = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function AssignmentService(http, eventaggregator) {
      _classCallCheck(this, AssignmentService);

      this.http = http;
      this.ea = eventaggregator;
    }

    AssignmentService.prototype.setSubject = function setSubject(subject) {
      this.subject = subject;
      this.clearAssignment();
      this.ea.publish('subjectUpdated');
    };

    AssignmentService.prototype.setAssignment = function setAssignment(assignment) {
      this.meta = assignment;
      this.isPoints = assignment.type === 'Points';
      this.setScores(assignment.id);
    };

    AssignmentService.prototype.deleteAssignment = function deleteAssignment() {
      var _this = this;

      var confirmed = confirm('Are you sure you want to delete ' + this.meta.name + '?');

      if (confirmed) {
        this.http.createRequest('http://localhost:5000/api/assignments/' + this.meta.id).asDelete().send().then(function (resp) {
          return _this.ea.publish('reloadAssignments');
        });

        this.clearAssignment();
      }
    };

    AssignmentService.prototype.clearAssignment = function clearAssignment() {
      this.meta = {};
      this.scores = false;
    };

    AssignmentService.prototype.setScores = function setScores(assignId) {
      var _this2 = this;

      var qobj = {
        filters: [{ 'name': 'assignid', 'op': 'eq', 'val': assignId }],
        order_by: [{ 'field': 'studref__first_name', 'direction': 'asc' }]
      };

      this.http.createRequest('http://localhost:5000/api/scores').asGet().withParams({ q: JSON.stringify(qobj) }).send().then(function (data) {
        _this2.scores = JSON.parse(data.response).objects;
        _this2.ea.publish('scoreUpdate');
      });
    };

    return AssignmentService;
  }()) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n\n  <!-- Navigation Bar -->\n  <nav class=\"navbar navbar-default\">\n    <div class=\"container-fluid\">\n      <!-- Brand and toggle get grouped for better mobile display -->\n      <div class=\"navbar-header\">\n        <button type=\"button\" class=\"navbar-toggle collapsed\"\n                data-toggle=\"collapse\"\n                data-target=\"#bs-example-navbar-collapse-1\"\n                aria-expanded=\"false\">\n          <span class=\"sr-only\">Toggle navigation</span>\n          <span class=\"icon-bar\"></span>\n          <span class=\"icon-bar\"></span>\n          <span class=\"icon-bar\"></span>\n        </button>\n        <a class=\"navbar-brand\" href=\"/\" }>Marks</a>\n      </div>\n\n      <!-- Collect the nav links, forms, and other content for toggling -->\n      <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n        <ul class=\"nav navbar-nav\">\n          <li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\n          <a href.bind=\"row.href\">${row.title}</a>\n        </li>\n        </ul>\n        <ul class=\"nav navbar-nav navbar-right\">\n          <li><a href>School Name (2017)</a>\n          </li>\n        </ul>\n      </div>\n    </div>\n  </nav>\n\n  <!-- Viewport -->\n  <div class=\"container\">\n    <div class=\"row\">\n      <router-view></router-view>\n    </div>\n  </div>\n</template>\n"; });
define('text!resources/autocomplete.css', ['module'], function(module) { module.exports = "autocomplete {\n  display: inline-block;\n}\n\nautocomplete .suggestions {\n  list-style-type: none;\n  cursor: default;\n  padding: 0;\n  margin: 0;\n  border: 1px solid #ccc;\n  background: #fff;\n  box-shadow: -1px 1px 3px rgba(0,0,0,.1);\n\n  position: absolute;\n  z-index: 9999;\n  max-height: 15rem;\n  overflow: hidden;\n  overflow-y: auto;\n  box-sizing: border-box;\n}\n\nautocomplete .suggestion {\n  padding: 0 .3rem;\n  line-height: 1.5rem;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: #333;\n}\n\nautocomplete .suggestion:hover,\nautocomplete .suggestion.selected {\n  background: #f0f0f0;\n}\n"; });
define('text!gradebook/index.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./components/assignmentlist\"></require>\n  <require from=\"./components/scoresList\"></require>\n  <require from=\"./components/quickEntry\"></require>\n  <require from=\"./components/addAssignment\"></require>\n  <require from=\"./components/reportAssignment\"></require>\n\n  <!-- Subjects Menu -->\n  <ul class=\"nav nav-tabs\">\n    <li>\n      <h4>Subjects</h4>\n    </li>\n    <li repeat.for=\"sub of subjects\" role=\"presentation\"\n        class=\"${sub.id === assignment.subject.id ? 'active' : ''}\">\n      <a href=\"\" click.delegate=\"assignment.setSubject(sub)\">${ sub.name }</a>\n    </li>\n  </ul>\n\n  <!-- Subject Menu Bar -->\n  <div class=\"row\" show.bind=\"assignment.subject\">\n    <ul class=\"nav nav-pills\">\n      <li role=\"presentation\" class=\"${editMode === 'add' ? 'active' : ''}\">\n        <a href=\"#\" click.delegate=\"addAssignment()\"><i class=\"fa fa-plus fa-lg\"></i> Add Assignment</a>\n      </li>\n      <li role=\"presentation\" show.bind=\"assignment.scores\" class=\"${quickEntry ? 'active' : ''}\">\n        <a href=\"#\" click.delegate=\"toggleQuick()\"><i class=\"fa fa-fast-forward\"></i> Quick Entry</a>\n      </li>\n      <li role=\"presentation\" show.bind=\"assignment.scores || editMode === 'edit'\" class=\"${editMode === 'edit' ? 'active' : ''}\">\n        <a href=\"#\" click.delegate=\"editAssignment()\"><i class=\"fa fa-pencil\"></i> Edit Assignment</a>\n      </li>\n      <li role=\"presentation\" show.bind=\"assignment.scores\">\n        <a href=\"#\" click.delegate=\"assignment.deleteAssignment()\"><i class=\"fa fa-eraser\"></i> Delete Assignment</a>\n      </li>\n    </ul>\n  </div>\n\n  <!-- Assignment List -->\n  <div class=\"row\">\n    <div class=\"col-md-2\" if.bind=\"assignment.subject\">\n      <h5>Assignments</h5>\n      <assignment-list></assignment-list>\n    </div>\n\n    <!-- Scores List -->\n    <div class=\"col-md-4\" if.bind=\"assignment.scores && !editMode\">\n      <h5>Scores</h5>\n      <scores-list if.bind=\"!quickEntry\"></scores-list>\n      <quick-entry if.bind=\"quickEntry\"></quick-entry>\n    </div>\n\n    <!-- Reports -->\n    <div class=\"col-md-6\" if.bind=\"assignment.scores && !editMode\">\n      <h5>Assesment</h5>\n      <report-assignment></report-assignment>\n    </div>\n\n    <!-- Add Assignment -->\n    <div class=\"col-md-5\" if.bind=\"editMode\">\n      <add-assignment mode.two-way=\"editMode\"></add-assignment>\n    </div>\n  </div>\n</template>\n"; });
define('text!resources/autocomplete.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./autocomplete.css\"></require>\n\n  <input type=\"text\" autocomplete=\"off\" class=form-control\n         aria-autocomplete=\"list\"\n         aria-expanded.bind=\"expanded\"\n         aria-owns.one-time=\"'au-autocomplate-' + id + '-suggestions'\"\n         aria-activedescendant.bind=\"index >= 0 ? 'au-autocomplate-' + id + '-suggestion-' + index : ''\"\n         id.one-time=\"'au-autocomplete-' + id\"\n         placeholder.bind=\"placeholder\"\n         value.bind=\"inputValue & debounce:delay\"\n         keydown.delegate=\"keydown($event.which)\"\n         blur.trigger=\"blur()\"\n         focus.bind=\"nameFocus\">\n  <ul class=\"suggestions\" role=\"listbox\"\n      if.bind=\"expanded\"\n      id.one-time=\"'au-autocomplate-' + id + '-suggestions'\"\n      ref=\"suggestionsUL\">\n    <li repeat.for=\"suggestion of suggestions\"\n        id.one-time=\"'au-autocomplate-' + id + '-suggestion-' + $index\"\n        role=\"option\"\n        class-name.bind=\"($index === index ? 'selected' : '') + ' suggestion'\"\n        mousedown.delegate=\"suggestionClicked(suggestion)\">\n        ${ suggestion.studref.first_name }\n      <!-- <template replaceable-part=\"suggestion\">\n        ${ suggestion }\n      </template> -->\n    </li>\n  </ul>\n</template>\n"; });
define('text!gradebook/components/addAssignment.html', ['module'], function(module) { module.exports = "<template>\n  <h5>${ title }</h5>\n  <form class=\"form-horizontal\" submit.delegate=\"submitAssignment()\"\n        autocomplete=\"off\">\n\n    <!-- Assignment Name -->\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\">Name:</label>\n      <div class=\"col-md-6\">\n        <input type=\"text\" class=\"form-control\" value.bind=\"newAssignment.name\"\n               required>\n      </div>\n    </div>\n\n    <!-- Date of Assignment -->\n    <div class=\"form-group\">\n      <label class=\"col-md-4 control-label\">Date Assigned:</label>\n      <div class=\"col-md-6\">\n        <input type=\"date\" name=\"date\" class=\"form-control\"\n               value.bind=\"newAssignment.date\" required>\n      </div>\n    </div>\n\n    <!-- Assignment Type -->\n    <div class=\"form-group\" show.bind=\"mode !== 'edit'\">\n      <label class=\"col-md-4 control-label\">Type:</label>\n      <div class=\"col-md-6\">\n        <select class=\"form-control\" name=\"type\" value.bind=\"newAssignment.type\" required>\n          <option value=\"\">Select Type</option>\n          <option value=\"Points\">Points</option>\n          <option value=\"Checks\">Checks</option>\n        </select>\n      </div>\n    </div>\n\n    <!-- Max Points -->\n    <div class=\"form-group\" if.bind=\"newAssignment.type === 'Points'\">\n      <label class=\"col-md-4 control-label\">Max Points:</label>\n      <div class=\"col-md-6\">\n        <input type=\"number\" name=\"max\" class=\"form-control\" value.bind=\"newAssignment.max\" required>\n      </div>\n    </div>\n\n    <!-- Submit Button -->\n    <div class=\"form-group\">\n      <div class=\"col-md-6 col-md-offset-5\">\n        <button type=\"submit\" class=\"btn btn-primary\">\n          ${ btn }\n        </button>\n        <button click.delegate=\"cancel()\" class=\"btn btn-danger\">\n          Cancel\n        </button>\n      </div>\n    </div>\n\n  </form>\n</template>\n"; });
define('text!gradebook/components/assignmentlist.html', ['module'], function(module) { module.exports = "<template>\n  <ul class=\"nav nav-pills nav-stacked\">\n    <li repeat.for=\"assign of assignments\"\n        role=\"presentation\"\n        class=\"${assign.id === assignment.meta.id ? 'active' : ''}\">\n      <a href=\"\" click.delegate=\"assignment.setAssignment(assign)\">${ assign.name }</a>\n    </li>\n  </ul>\n</template>\n"; });
define('text!gradebook/components/quickEntry.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../../resources/autocomplete\"></require>\n  <require from=\"../converters/score-format\"></require>\n\n  <table class=\"table table-hover\">\n    <thead>\n      <tr>\n        <th></th>\n        <th class=\"text-center\">${ assignment.meta.type }\n          <small show.bind=\"isPoints\">\n            (max: ${assignment.meta.max})</small></th>\n      </tr>\n    </thead>\n    <tr repeat.for=\"score of entered\">\n      <td class=\"text-center\">${ score.studref.first_name }</td>\n      <td class=\"text-center\">\n        <div if.bind=\"isPoints\">\n          ${ score.value  | scoreFormat: assignment.meta}\n        </div>\n        <div if.bind=\"!isPoints\">\n          <i class=\"fa fa${ score.value === 1 ? '-check': ''}-circle-o fa-2x\" aria-hidden=\"true\"></i>\n        </div>\n      </td>\n    </tr>\n\n    <!-- Input Row -->\n    <tr>\n      <td class=\"text-center\">\n        <!-- Name Input -->\n          <div class=\"form-group\">\n            <autocomplete service.bind=\"suggestionService\"\n                          value.bind=\"score\"\n                          placeholder=\"Name\"\n                          name-focus.bind=\"nameFocus\"\n                          score-focus.bind=\"scoreFocus\"\n                          is-points.bind=\"isPoints\"\n                          checks.call=\"parseKey(key)\">\n            <template replace-part=\"suggestion\">\n              <span style=\"font-style: italic\">${suggestion}</span>\n            </template>\n</autocomplete>\n</div>\n</td>\n\n<!-- Value Input -->\n<td class=\"text-center\">\n  <div class=\"form-group\">\n    <div if.bind=\"isPoints\" class=\"form-group\">\n      <input value.bind=\"quickPoints\"\n             class=\"form-control\"\n             style=\"width: 5em;\"\n             placeholder=\"Score\"\n             focus.bind=\"scoreFocus\"\n             keypress.delegate=\"parseKey($event.which)\" />\n    </div>\n    <div if.bind=\"!isPoints\">\n      <i class=\"fa fa-check-circle-o fa-2x\" aria-hidden=\"true\"></i>\n    </div>\n  </div>\n</td>\n</tr>\n</table>\n</template>\n"; });
define('text!gradebook/components/reportAssignment.html', ['module'], function(module) { module.exports = "<template>\n<style>\n\n.bar rect {\nfill: steelblue;\n}\n\n.bar text {\nfill: #fff;\nfont: 10px sans-serif;\n}\n\ndiv.tooltip {\n    position: absolute;\n    text-align: center;\n    width: auto;\n    height: auto;\n    padding: 2px;\n    font: 16px sans-serif;\n    background: lightsteelblue;\n    border: 0px;\n    border-radius: 8px;\n    pointer-events: none;\n\n}\n\n.arc text {\n  font: 10px sans-serif;\n  text-anchor: middle;\n}\n\n.arc path {\n  stroke: #fff;\n}\n\n.legend {\n    font-size: 13px;\n  }\n  h1 {\n  font-size: 15px;\n  text-align: center;\n\t}\n  rect {\n    stroke-width: 2;\n  }\n\n  .tooltip2 {\n  box-shadow: 0 0 5px #999999;\n  display: none;\n  font-size: 12px;\n  left: 130px;\n  padding: 10px;\n  position: absolute;\n  text-align: center;\n  top: 95px;\n  width: 80px;\n  z-index: 10;\n  line-height: 140%; /*Interlineado*/\n  font-family: \"Open Sans\", sans-serif;\n  font-weight: 300;\n  background: rgba(0, 0, 0, 0.8);\n  color: #fff;\n  border-radius: 2px;\n\t}\n\n  .label {\n   font-weight: 600;\n  }\n\n</style>\n  <div id=\"content\"></div>\n</template>\n"; });
define('text!gradebook/components/scoresList.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"../converters/score-format\"></require>\n\n  <table class=\"table table-hover\">\n    <thead>\n    <tr>\n      <th></th>\n      <th class=\"text-center\">${ assignment.meta.type }\n        <small show.bind=\"assignment.isPoints && assignment.meta.max !== 0\">\n          (max: ${assignment.meta.max})</small></th>\n    </tr>\n    </thead>\n      <tr repeat.for=\"score of assignment.scores\">\n        <td class=\"text-center\">${ score.studref.first_name }</td>\n        <td class=\"text-center\" click.delegate=\"editScore(score)\">\n          <!-- View Mode -->\n          <div if.bind=\"score.id !== editScoreId\">\n            <div if.bind=\"assignment.isPoints\">\n              ${ score.value  | scoreFormat: assignment.meta}\n            </div>\n            <div if.bind=\"!assignment.isPoints\">\n              <i class=\"fa fa${ score.value === 1 ? '-check': ''}-circle-o fa-2x\" aria-hidden=\"true\"></i>\n            </div>\n          </div>\n\n          <!-- Edit Mode -->\n          <div if.bind=\"score.id === editScoreId\">\n              <input keypress.delegate=\"deFocus($event.which)\"\n                     focus.bind=\"editFocus\"\n                     blur.trigger=\"updateScore(score, $index)\"\n                     value.bind=\"score.value\"\n                     type=\"number\"\n                     style=\"width: 3.5em\">\n          </div>\n        </td>\n      </tr>\n  </table>\n\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map