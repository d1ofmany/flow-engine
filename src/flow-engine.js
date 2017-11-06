import 'colors';

const findRule = (rule, type) => item => item.id === rule[type];

const evalRule = (rule, object) => {
  let ruleFunction;
  try {
    ruleFunction = eval("(" + rule.rule + ")");
    return ruleFunction(object);
  } catch (e) {
    console.log((rule.title + " error: " + e).red);
    return false;
  }
};

const flowEngine = (rules, object, accumulator) => {
  if (!accumulator) {
    return flowEngine(rules, object, [rules[0]]);
  }
  
  const rule = accumulator[accumulator.length -1];
  
  const findCircular = findRule(rule, "id");
  const findNextTrue = findRule(rule, "true_id");
  const findNextFalse = findRule(rule, "false_id");
  
  var circular = accumulator.slice(0, accumulator.length - 1).find(findCircular);
  
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

export { findRule, evalRule, flowEngine };
