import {Query} from "./query";
import {Sort} from "./sort";
import {Sequelizable} from "./sequelize";
import { ObjectUtil } from "./common.utils";
import { SEQUELIZE_OPERATORS } from "./config";
import { Rule } from "./rule";
import { Cloneable } from "./cloneable";
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

    static build(filter: any): Filter{
        if (typeof filter === 'string'){
           filter = JSON.parse(filter)
        }
        return new Filter(filter.queryGroup, filter.sort);
    }

    constructor(queryGroup?: Query[], sortBy?: Sort[]) {
      this.queryGroup = queryGroup ? queryGroup.map(group => new Query(group.condition, group.rules)) : [];
      this.sortBy = sortBy ? sortBy.map(sort => new Sort(sort.columnName, sort.value)) : [];
    }
  
    setTableDefinition(tableDefinition) {
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
    hasInvalidRules(){
        return  (this.queryGroup.length === 0 || this.getAllRules().filter(rule => !rule.isEmpty()).length > 0);
    }
    hasDynamicVariables() {
      return this.queryGroup.filter((query) => query.hasDynamicVariables()).length > 0;
    }
  
    unsequelize(sequelized: any): this {
      if (Object.keys(sequelized).length > 0) {
        let sequelizedQueryGroups:any = [];
        if (Array.isArray(sequelized.where)) {
          sequelizedQueryGroups = sequelized.where;
        } else if (typeof sequelized.where === 'object') {
          sequelizedQueryGroups = (<Array<Array<any>>>ObjectUtil.values(sequelized.where))[0];
        } else {
          // check if sequlize contains only 1 rule
          sequelizedQueryGroups = [sequelized.where];
        }
        if (sequelizedQueryGroups && sequelizedQueryGroups.length) {
          this.queryGroup = sequelizedQueryGroups.map((group) => new Query().unsequelize(group));
          this.queryGroup = this.queryGroup.map((queryGroup) => {
            if (queryGroup.condition === 'OR') {
              const queryGrouptemp = new Query();
              queryGrouptemp['condition'] = queryGroup.condition;
              queryGrouptemp['rules'] = queryGroup.rules;
              queryGroup.rules = [];
              queryGroup.rules[0] = queryGrouptemp;
              queryGroup.condition = 'AND';
            }
            return queryGroup;
          });
        }
        this.sortBy = sequelized.order && sequelized.order.map((seq) => new Sort().unsequelize(seq)) || [];
      }
      return this;
    }
    sequelize() {
      const queryGroup = this.queryGroup.map(group => group.sequelize());
      const order = this.sortBy.map((sort) => sort.sequelize());
      const sequalize = {};
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
    sequelizeString(){
        return JSON.stringify(this.sequelize());
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
    stringify(){
      let filter={
          queryGroupMergeOperator:this.queryGroupMergeOperator,
          queryGroup:this.queryGroup.map(queryGroup=>queryGroup.stringify()),
          sortBy:this.sortBy
      }
      return JSON.stringify(filter)
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