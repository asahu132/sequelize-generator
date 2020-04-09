"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var Rule = /** @class */ (function () {
    function Rule(columnName, operand, isDynamic, value, displayType, operator, columnLabel, valueLabel, tableDefinition) {
        this.columnName = columnName || '';
        this.operand = operand || '';
        this.isDynamic = isDynamic || false;
        this.value = value || '';
        this.columnLabel = columnLabel || '';
        this.valueLabel = valueLabel || '';
        this.operator = operator || '';
        this.displayType = displayType || '';
        this.tableName = '';
        this.setTableDefinition(tableDefinition);
    }
    Rule.prototype.setTableDefinition = function (tableDefinition) {
        if (tableDefinition === void 0) { tableDefinition = {}; }
        this.tableDefinition = tableDefinition;
        this.tableName = tableDefinition['model'] || '';
    };
    Rule.prototype.hasDynamicVariables = function () {
        return this.isDynamic;
    };
    Rule.prototype.sequelize = function () {
        var _a, _b;
        //this.displayType = Rule.guessDisplayType(this.value, this.columnName, this);
        if ((this.columnName && this.columnName.trim().length > 0) && (this.operand && this.operand.trim().length > 0)) {
            var opConfig = new config_1.OperatorConfig(config_1.SEQUELIZE_OPERATORS[this.operand], this.operand);
            if (opConfig.isExpressionBased(this.displayType)) {
                return opConfig.sequelize(this.displayType, this.value, this.columnName, this.tableName);
            }
            else {
                return _a = {},
                    _a[this.columnName] = (_b = {},
                        _b[opConfig.getOperator(this.displayType)] = opConfig.sequelize(this.displayType, this.value, this.columnName, this.tableName),
                        _b),
                    _a;
            }
        }
        return {};
    };
    Rule.prototype.clone = function () {
        var rule = new Rule(this.columnName, this.operand, this.isDynamic, this.value, this.tableDefinition);
        rule.displayType = this.displayType ? this.displayType : 'string';
        rule.populatLabels(this.columnLabel, this.valueLabel);
        return rule;
    };
    Rule.prototype.equals = function (rule) {
        return rule && this.value === rule.value && this.isDynamic === rule.isDynamic && this.operand === rule.operand && this.columnName === rule.columnName;
    };
    Rule.prototype.filterLabels = function (columnLabel) {
        this.columnLabel = columnLabel;
    };
    Rule.prototype.populatLabels = function (columnName, idName) {
        this.columnLabel = columnName;
        this.valueLabel = idName;
    };
    Rule.prototype.toString = function () {
        return (this.columnLabel || this.columnName) + ' ' + this.operand + ' ' + (this.valueLabel || this.value);
    };
    Rule.prototype.isEmpty = function () {
        if (this.operand === 'Is Empty' || this.operand === 'Is Not Empty') {
            return typeof this.columnName !== 'undefined';
        }
        return !!(this.columnName && this.operand && (this.value ? this.value.toString() : this.value));
    };
    return Rule;
}());
exports.Rule = Rule;
