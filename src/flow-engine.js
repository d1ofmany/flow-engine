import 'colors';

const findRule = (rule, type) => item => item.id === rule[type];

const evalRule = (rule, object) => {
  let ruleFunction;
  try {
    ruleFunction = new Function("return (" + rule.rule + ");")();
    return ruleFunction(object);
  } catch (e) {
    console.log((rule.title + " error: " + e).red);
    return false;
  }
};

const flowEngine = (rules, object, executedRules) => {
  if (!executedRules) {
    return flowEngine(rules, object, [rules[0]]);
  }
  
  const rule = executedRules[executedRules.length -1];
  
  var circular = executedRules.slice(0, executedRules.length - 1).find(findRule(rule, "id"));
  
  if (circular) {
    console.log("End!".blue);
    return;
  }
  
  const ruleResult = evalRule(rule, object);
  
  if (ruleResult) {
    console.log((rule.title + " passed").green);
  } else {
    console.log((rule.title + " failed").red);
  }
  
  let ruleNext;
  
  if (ruleResult && rule.true_id) {
    ruleNext = rules.find(findRule(rule, "true_id"));
  } else if (!ruleResult && rule.false_id) {
    ruleNext = rules.find(findRule(rule, "false_id"));
  }
  
  if (ruleNext) {
    executedRules = [...executedRules, ruleNext];
    return flowEngine(rules, object, executedRules);
  } else {
    console.log("End!".blue);
    return;
  } 
};

export { findRule, evalRule, flowEngine };
