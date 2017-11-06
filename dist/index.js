'use strict';

var _object = require('./data/object');

var _object2 = _interopRequireDefault(_object);

var _rules = require('./data/rules');

var _rules2 = _interopRequireDefault(_rules);

var _flowEngine = require('./flow-engine');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _flowEngine.flowEngine)(_rules2.default, _object2.default);