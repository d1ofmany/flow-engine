"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flowEngine = exports.evalRule = exports.findRule = undefined;

require("colors");

var findRule = function findRule(rule, type) {
  return function (item) {
    return item.id === rule[type];
  };
};

var evalRule = function evalRule(rule, object) {
  var ruleFunction = void 0;
  try {
    ruleFunction = eval("(" + rule.rule + ")");
    return ruleFunction(object);
  } catch (e) {
    console.log((rule.title + " error: " + e).red);
    return false;
  }
};

var flowEngine = function flowEngine(rules, object, accumulator) {
  if (!accumulator) {
    return flowEngine(rules, object, [rules[0]]);
  }

  var rule = accumulator[accumulator.length - 1];

  var findCircular = findRule(rule, "id");
  var findNextTrue = findRule(rule, "true_id");
  var findNextFalse = findRule(rule, "false_id");

  var circular = accumulator.slice(0, accumulator.length - 1).find(findCircular);

  if (circular) {
    console.log("End!".blue);
    return;
  }

  var ruleResult = evalRule(rule, object);

  if (ruleResult) {
    console.log((rule.title + " passed").green);
  } else {
    console.log((rule.title + " failed").red);
  }

  var ruleNext = void 0;

  if (ruleResult && rule.true_id) {
    ruleNext = rules.find(findNextTrue);
  } else if (!ruleResult && rule.false_id) {
    ruleNext = rules.find(findNextFalse);
  }

  if (ruleNext) {
    accumulator = accumulator.concat(ruleNext);
    return flowEngine(rules, object, accumulator);
  } else {
    console.log("End!".blue);
    return;
  }
};

exports.findRule = findRule;
exports.evalRule = evalRule;
exports.flowEngine = flowEngine;