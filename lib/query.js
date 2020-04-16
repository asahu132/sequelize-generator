"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule_1 = require("./rule");
var common_utils_1 = require("./common.utils");
var config_1 = require("./config");
var Query = /** @class */ (function () {
    function Query(condition, rules) {
        this.condition = condition;
        this.rules = rules ? this.getRules(rules) : [];
    }
    Query.prototype.getRules = function (rules) {
        return rules.map(function (rule) {
            if (rule.rules) {
                rule = new Query(rule.condition, rule.rules);
            }
            else {
                rule = new rule_1.Rule(rule.columnName, rule.operand, rule.isDynamic, rule.value, rule.displayType, rule.operator, rule.columnLabel, rule.valueLabel, rule.tableDefinition);
            }
            return rule;
        });
    };
    Query.prototype.hasDynamicVariables = function () {
        return this.rules.filter(function (rule) { return rule.hasDynamicVariables(); }).length > 0;
    };
    Query.prototype.isSequalizedQuery = function (sequelized) {
        var operators = Object.keys(sequelized);
        if (operators.length > 0) {
            return common_utils_1.ObjectUtil.values(config_1.SEQUELIZE_OPERATORS).filter(function (op) {
                return op.operator === operators[0];
            }).length > 0;
        }
        return false;
    };
    Query.prototype.unsequelize = function (sequelized) {
        var _this = this;
        // check if SEQUELIZE_OPERATORS exists as key in sequelized
        if (sequelized) {
            var operators = Object.keys(sequelized);
            if (this.isSequalizedQuery(sequelized)) {
                for (var i in config_1.SEQUELIZE_OPERATORS) {
                    if (config_1.SEQUELIZE_OPERATORS[i].operator === operators[0]) {
                        this.condition = i;
                        break;
                    }
                }
                this.rules = sequelized[operators[0]].map(function (seqRule) {
                    if (_this.isSequalizedQuery(seqRule)) {
                        return new Query().unsequelize(seqRule);
                    }
                    return new rule_1.Rule().unsequelize(seqRule);
                });
            }
            else {
                this.rules = [sequelized].map(function (sequelize) { return new rule_1.Rule().unsequelize(sequelize); });
                this.condition = 'AND';
            }
        }
        return this;
    };
    Query.prototype.sequelize = function () {
        var _a;
        return this.rules.length === 1 ? this.rules[0].sequelize() : (_a = {},
            _a[config_1.SEQUELIZE_OPERATORS[this.condition].operator] = this.rules.map(function (rule) {
                return rule.sequelize();
            }),
            _a);
    };
    Query.prototype.clone = function () {
        return new Query(this.condition, this.rules.map(function (rule) { return rule.clone(); }));
    };
    Query.prototype.toString = function () {
        return this.rules.map(function (rule) { return rule.toString(); }).join(' ' + this.condition + ' ');
    };
    Query.prototype.stringify = function () {
        var query = {
            condition: this.condition,
            rules: this.rules.map(function (rule) { return rule.stringify(); })
        };
        return query;
    };
    Query.prototype.getAllRules = function () {
        var _this = this;
        return this.rules.reduce(function (result, rule) {
            if (rule instanceof Query) {
                var rules = rule.getAllRules();
                if (rules.length > 0) {
                    rules[0].operator = _this.condition;
                }
                result = result.concat(rules);
            }
            else {
                rule.operator = _this.condition;
                result.push(rule);
            }
            return result;
        }, []);
    };
    Query.prototype.removeRule = function (rule) {
        var index = -1;
        for (var i = 0; i < this.rules.length; i++) {
            if (this.rules[i] instanceof Query) {
                this.rules[i].removeRule(rule);
            }
            else if (this.rules[i].equals(rule)) {
                index = i;
            }
        }
        if (index > -1) {
            this.rules.splice(index, 1);
            return rule;
        }
    };
    return Query;
}());
exports.Query = Query;
