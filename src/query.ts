import {Cloneable} from "./cloneable";
import {Sequelizable} from "./sequelize";
import {Rule} from "./rule";
import {SEQUELIZE_OPERATORS} from "./config";

export class Query implements Sequelizable, Cloneable<Query> {
    public condition: string;
    public rules: any[];

    constructor(condition?, rules?) {
        this.condition = condition;
        this.rules = rules ? this.getRules(rules) : [];
    }

    getRules(rules) {
        return rules.map(rule => {
            if (rule.rules) {
                rule = new Query(rule.condition, rule.rules);

            } else {
                rule = new Rule(rule.columnName, rule.operand, rule.isDynamic, rule.value, rule.displayType, rule.operator, rule.columnLabel, rule.valueLabel, rule.tableDefinition);
            }
            return rule;
        });
    }

    hasDynamicVariables() {
        return this.rules.filter((rule) => rule.hasDynamicVariables()).length > 0;
    }

    isSequalizedQuery(sequelized) {
        const operators = Object.keys(sequelized);
        if (operators.length > 0) {
            return ObjectUtil.values(SEQUELIZE_OPERATORS).filter((op) => {
                return op.operator === operators[0];
            }).length > 0;
        }
        return false;
    }


    sequelize() {
        return this.rules.length === 1 ? (<Sequelizable>this.rules[0]).sequelize() : {
            [SEQUELIZE_OPERATORS[this.condition].operator]: this.rules.map(rule => {
                return (<Sequelizable>rule).sequelize();
            })
        };
    }

    clone(): Query {
        return new Query(this.condition, this.rules.map((rule) => rule.clone()));
    }

    toString() {
        return this.rules.map((rule) => rule.toString()).join(' ' + this.condition + ' ');
    }

    getAllRules(): Rule[] {
        return this.rules.reduce((result, rule) => {
            if (rule instanceof Query) {
                const rules = rule.getAllRules();
                if (rules.length > 0) {
                    rules[0].operator = this.condition;
                }
                result = result.concat(rules);
            } else {
                rule.operator = this.condition;
                result.push(rule);
            }
            return result;
        }, []);
    }

    removeRule(rule: Rule) {
        let index = -1;
        for (let i = 0; i < this.rules.length; i++) {
            if (this.rules[i] instanceof Query) {
                this.rules[i].removeRule(rule);
            } else if (this.rules[i].equals(rule)) {
                index = i;
            }
        }
        if (index > -1) {
            this.rules.splice(index, 1);
            return rule;
        }
    }
}