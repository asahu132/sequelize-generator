import {Sequelizable} from "./sequelize";
import {Cloneable} from "./cloneable";
import {Query} from "./query";
import {Sort} from "./sort";
import {SEQUELIZE_OPERATORS} from "./config";
import {Rule} from "./rule";

export class Filter implements Sequelizable, Cloneable<Filter> {
    public context = {};
    public queryGroup: Query[];
    public sortBy: Sort[];
    public queryGroupMergeOperator = 'OR';

    static merge(filters: Filter[]): Filter {
        const returnedFilter = filters[0].clone();
        returnedFilter.queryGroupMergeOperator = 'AND';
        filters.slice(1).map(filter => filter.clone()).forEach((filter) => {
            if (filter.queryGroup.length > 0) {
                returnedFilter.queryGroup.push(new Query('AND', filter.queryGroup));
            }
            filter.sortBy.forEach((sort) => {
                if (returnedFilter.sortBy.filter(rsort => rsort.columnName === sort.columnName).length === 0) {
                    returnedFilter.sortBy.push(sort);
                }
            });
        });
        return returnedFilter;
    }

    constructor(queryGroup?: Query[], sortBy?: Sort[]) {
        this.queryGroup = queryGroup ? queryGroup.map(group => new Query(group.condition, group.rules)) : [];
        this.sortBy = sortBy ? sortBy.map(sort => new Sort(sort.columnName, sort.value)) : [];
    }

    setTableDefinition(tableDefinition:any) {
        this.getAllRules().forEach((rule) => {
            rule.setTableDefinition(tableDefinition);
        });
    }

    isEmpty() {
        return this.queryGroup.length === 0 && this.sortBy.length === 0;
    }

    hasEmptyQueryGroup() {
        return this.queryGroup.length === 0;
    }

    hasEmptySortCondition() {
        return this.sortBy.length === 0;
    }

    hasInValidSortCondition() {
        return this.sortBy.filter((sortObject) => sortObject.columnName === '' || sortObject.value === '').length > 0;
    }

    checkValidSortCondition() {
        if (this.hasEmptySortCondition()) {
            return false;
        } else {
            return this.hasInValidSortCondition();
        }
    }

    hasEmptyRules() {
        return (this.queryGroup.length === 0 || this.getAllRules().filter(rule => !rule.isEmpty()).length > 0);
    }

    hasDynamicVariables() {
        return this.queryGroup.filter((query) => query.hasDynamicVariables()).length > 0;
    }

    sequelize() {
        const queryGroup = this.queryGroup.map(group => group.sequelize());
        const order = this.sortBy.map((sort) => sort.sequelize());
        const sequalize:any = {};
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
        } else if (queryGroup.length > 0) {
            sequalize['where'] = {
                [SEQUELIZE_OPERATORS[this.queryGroupMergeOperator].operator]: queryGroup
            };
        }
        return sequalize;
    }

    clone(): Filter {
        return new Filter(this.queryGroup.map((query) => query.clone()), this.sortBy.map((sort) => sort.clone()));
    }

    toString() {
        let str = '';
        if (this.queryGroup.length > 0) {
            str = this.queryGroup.map((query) => query.toString()).join(' ,');
        }
        if (this.sortBy.length > 0) {
            if (str.length > 0) {
                str = str + ' ,';
            }
            str = str + this.sortBy.map((sort) => sort.toString()).join(' ,');
        }
        if (str.length === 0) {
            str = 'All';
        }
        return str;
    }

    getAllRules(): Rule[] {
        const allRules = this.queryGroup.reduce((result:any, group) => {
            const rules = group.getAllRules();
            if (rules.length > 0) {
                rules[0].operator = this.queryGroupMergeOperator;
            }
            return result.concat(rules);
        }, []);
        // @This case is required to handle 'All' in breadcrumb (HTML)
        if (allRules.length) {
            allRules[0].operator = 'AND';
        }
        return allRules;
    }

    removeRule(rule: Rule) {
        if (rule) {
            this.queryGroup.forEach((queryGroupEntry) => {
                queryGroupEntry.removeRule(rule);
            });
        }
    }

    reset() {
        this.queryGroup = [];
        this.sortBy = [];
    }
}