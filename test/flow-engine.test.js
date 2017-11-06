import { expect } from 'chai';
import sinon from 'sinon';
import 'colors';
import { findRule, evalRule, flowEngine } from '../src/flow-engine';

describe('flow-engine', () => {
    const spy = sinon.spy(console, 'log');
    
    const testObject = {
        "color": "blue",
        "size": 25
    };
    
    const testRules = [
        {
            "title": "Passing rule",
            "id": "1",
            "true_id": "2",
            "false_id": "3",
            "rule": "function (obj) { return obj.color === 'blue'; }"
        },
        {
            "title": "Failing child rule",
            "id": "2",
            "true_id": "4",
            "false_id": null,
            "rule": "function (obj) { return obj.color === 'red'; }"
        },
        {
            "title": "Failing child rule",
            "id": "3",
            "true_id": "4",
            "false_id": "5",
            "rule": "function (obj) { return obj.size === 50; }"
        },
        {
            "title": "Passing grandchild rule",
            "id": "4",
            "true_id": "4",
            "false_id": "5",
            "rule": "function (obj) { return obj.size === 25; }"
        }
    ];
    
    const circularTestRules = [
        {
            "title": "Failing rule",
            "id": "1",
            "true_id": null,
            "false_id": "2",
            "rule": "function (obj) { return obj.color === 'red'; }"
        },
        {
            "title": "Failing child rule",
            "id": "2",
            "true_id": "4",
            "false_id": "1",
            "rule": "function (obj) { return obj.color === 'yellow'; }"
        }
    ];
    
    describe('findRule', () => {
        it('should find rule by id', () => {
            const findById = findRule(testRules[0], 'id');
            const foundRule = testRules.find(findById);
            
            expect(foundRule).to.be.equal(testRules[0]);
        });
        
        it('should find rule by true_id', () => {
            const findById = findRule(testRules[0], 'true_id');
            const foundRule = testRules.find(findById);
            
            expect(foundRule).to.be.equal(testRules[1]);
        });
        
        it('should find rule by false_id', () => {
            const findById = findRule(testRules[0], 'false_id');
            const foundRule = testRules.find(findById);
            
            expect(foundRule).to.be.equal(testRules[2]);
        });
        
        it('no rule found', () => {
            const findByTrueId = findRule(testRules[3], 'false_id');
            const foundRule = testRules.find(findByTrueId);
            
            expect(foundRule).to.be.equal(undefined);
        });
    });
    
    describe('evalRule', () => {
        it('should return true for passing rule', () => {
            const rule = testRules[0];
            
            expect(evalRule(rule, testObject)).to.be.equal(true);
        });
        
        it('should return false for failing rule', () => {
            const rule = testRules[1];
            
            expect(evalRule(rule, testObject)).to.be.equal(false);
        });
        
        it('should return false given incorect rule syntax', () => {
            spy.reset();
            const rule = {
                "title": "Passing rule",
                "id": "1",
                "true_id": "2",
                "false_id": "3",
                "rule": "function (obj) return obj.color === 'blue'; }"
            };
            const evaluatedRule = evalRule(rule, testObject);
            
            expect(evaluatedRule).to.be.equal(false);
            expect(spy.calledWith('Passing rule error: SyntaxError: Unexpected token return'.red)).to.equal(true);
        });

    });
    
    describe('flowEngine', () => {
        it('should be a function', () => {
            expect(flowEngine).to.be.a('function');
        });
        
        it('should console.log correcty rule set', () => {
            spy.reset();
            
            flowEngine(testRules, testObject);
            
            expect(spy.firstCall.calledWith('Passing rule passed'.green)).to.equal(true);
            expect(spy.secondCall.calledWith('Failing child rule failed'.red)).to.equal(true);
            expect(spy.thirdCall.calledWith('End!'.blue)).to.equal(true);
        });
        
        it('should console.log correcty circular rule set', () => {
            spy.reset();
            
            flowEngine(circularTestRules, testObject);
            
            expect(spy.firstCall.calledWith('Failing rule failed'.red)).to.equal(true);
            expect(spy.secondCall.calledWith('Failing child rule failed'.red)).to.equal(true);
            expect(spy.thirdCall.calledWith('End!'.blue)).to.equal(true);
        });
    });
});