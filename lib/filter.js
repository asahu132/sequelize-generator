"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var query_1 = require("./query");
var sort_1 = require("./sort");
var common_utils_1 = require("./common.utils");
var config_1 = require("./config");
var Filter = /** @class */ (function () {
    function Filter(queryGroup, sortBy) {
        this.context = {};
        this.queryGroupMergeOperator = 'OR';
        this.queryGroup = queryGroup ? queryGroup.map(function (group) { return new query_1.Query(group.condition, group.rules); }) : [];
        this.sortBy = sortBy ? sortBy.map(function (sort) { return new sort_1.Sort(sort.columnName, sort.value); }) : [];
    }
    Filter.merge = function (filters) {
        var returnedFilter = filters[0].clone();
        returnedFilter.queryGroupMergeOperator = 'AND';
        filters.slice(1).map(function (filter) { return filter.clone(); }).forEach(function (filter) {
            if (filter.queryGroup.length > 0) {
                returnedFilter.queryGroup.push(new query_1.Query('AND', filter.queryGroup));
            }
            filter.sortBy.forEach(function (sort) {
                if (returnedFilter.sortBy.filter(function (rsort) { return rsort.columnName === sort.columnName; }).length === 0) {
                    returnedFilter.sortBy.push(sort);
                }
            });
        });
        return returnedFilter;
    };
    Filter.build = function (filter) {
        if (typeof filter === 'string') {
            filter = JSON.parse(filter);
        }
        return new Filter(filter.queryGroup, filter.sort);
    };
    Filter.prototype.setTableDefinition = function (tableDefinition) {
        this.getAllRules().forEach(function (rule) {
            rule.setTableDefinition(tableDefinition);
        });
    };
    Filter.prototype.isEmpty = function () {
        return this.queryGroup.length === 0 && this.sortBy.length === 0;
    };
    Filter.prototype.hasEmptyQueryGroup = function () {
        return this.queryGroup.length === 0;
    };
    Filter.prototype.hasEmptySortCondition = function () {
        return this.sortBy.length === 0;
    };
    Filter.prototype.hasInValidSortCondition = function () {
        return this.sortBy.filter(function (sortObject) { return sortObject.columnName === '' || sortObject.value === ''; }).length > 0;
    };
    Filter.prototype.checkValidSortCondition = function () {
        if (this.hasEmptySortCondition()) {
            return false;
        }
        else {
            return this.hasInValidSortCondition();
        }
    };
    Filter.prototype.hasEmptyRules = function () {
        return (this.queryGroup.length === 0 || this.getAllRules().filter(function (rule) { return !rule.isEmpty(); }).length > 0);
    };
    Filter.prototype.hasInvalidRules = function () {
        return (this.queryGroup.length === 0 || this.getAllRules().filter(function (rule) { return !rule.isEmpty(); }).length > 0);
    };
    Filter.prototype.hasDynamicVariables = function () {
        return this.queryGroup.filter(function (query) { return query.hasDynamicVariables(); }).length > 0;
    };
    Filter.prototype.unsequelize = function (sequelized) {
        if (Object.keys(sequelized).length > 0) {
            var sequelizedQueryGroups = [];
            if (Array.isArray(sequelized.where)) {
                sequelizedQueryGroups = sequelized.where;
            }
            else if (typeof sequelized.where === 'object') {
                sequelizedQueryGroups = common_utils_1.ObjectUtil.values(sequelized.where)[0];
            }
            else {
                // check if sequlize contains only 1 rule
                sequelizedQueryGroups = [sequelized.where];
            }
            if (sequelizedQueryGroups && sequelizedQueryGroups.length) {
                this.queryGroup = sequelizedQueryGroups.map(function (group) { return new query_1.Query().unsequelize(group); });
                this.queryGroup = this.queryGroup.map(function (queryGroup) {
                    if (queryGroup.condition === 'OR') {
                        var queryGrouptemp = new query_1.Query();
                        queryGrouptemp['condition'] = queryGroup.condition;
                        queryGrouptemp['rules'] = queryGroup.rules;
                        queryGroup.rules = [];
                        queryGroup.rules[0] = queryGrouptemp;
                        queryGroup.condition = 'AND';
                    }
                    return queryGroup;
                });
            }
            this.sortBy = sequelized.order && sequelized.order.map(function (seq) { return new sort_1.Sort().unsequelize(seq); }) || [];
        }
        return this;
    };
    Filter.prototype.sequelize = function () {
        var _a;
        var queryGroup = this.queryGroup.map(function (group) { return group.sequelize(); });
        var order = this.sortBy.map(function (sort) { return sort.sequelize(); });
        var sequalize = {};
        if (order.length > 0) {
            sequalize['order'] = order;
        }
        if (this.queryGroup.length === 1) {
            /*const rules = this.queryGroup[0].getAllRules();
            if (rules.length === 1) {
              sequalize['where'] = rules[0].sequelize();
            } else {*/
            sequalize['where'] = queryGroup;
            // }
        }
        else if (queryGroup.length > 0) {
            sequalize['where'] = (_a = {},
                _a[config_1.SEQUELIZE_OPERATORS[this.queryGroupMergeOperator].operator] = queryGroup,
                _a);
        }
        return sequalize;
    };
    Filter.prototype.sequelizeString = function () {
        return JSON.stringify(this.sequelize());
    };
    Filter.prototype.clone = function () {
        return new Filter(this.queryGroup.map(function (query) { return query.clone(); }), this.sortBy.map(function (sort) { return sort.clone(); }));
    };
    Filter.prototype.toString = function () {
        var str = '';
        if (this.queryGroup.length > 0) {
            str = this.queryGroup.map(function (query) { return query.toString(); }).join(' ,');
        }
        if (this.sortBy.length > 0) {
            if (str.length > 0) {
                str = str + ' ,';
            }
            str = str + this.sortBy.map(function (sort) { return sort.toString(); }).join(' ,');
        }
        if (str.length === 0) {
            str = 'All';
        }
        return str;
    };
    Filter.prototype.stringify = function () {
        var filter = {
            queryGroupMergeOperator: this.queryGroupMergeOperator,
            queryGroup: this.queryGroup.map(function (queryGroup) { return queryGroup.stringify(); }),
            sortBy: this.sortBy
        };
        return JSON.stringify(filter);
    };
    Filter.prototype.getAllRules = function () {
        var _this = this;
        var allRules = this.queryGroup.reduce(function (result, group) {
            var rules = group.getAllRules();
            if (rules.length > 0) {
                rules[0].operator = _this.queryGroupMergeOperator;
            }
            return result.concat(rules);
        }, []);
        // @This case is required to handle 'All' in breadcrumb (HTML)
        if (allRules.length) {
            allRules[0].operator = 'AND';
        }
        return allRules;
    };
    Filter.prototype.removeRule = function (rule) {
        if (rule) {
            this.queryGroup.forEach(function (queryGroupEntry) {
                queryGroupEntry.removeRule(rule);
            });
        }
    };
    Filter.prototype.reset = function () {
        this.queryGroup = [];
        this.sortBy = [];
    };
    return Filter;
}());
exports.Filter = Filter;
