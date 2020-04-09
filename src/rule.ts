import {Sequelizable} from "./sequelize";
import {Cloneable} from "./cloneable";
import {OperatorConfig, SEQUELIZE_OPERATORS} from "./config";

export class Rule implements Sequelizable, Cloneable<Rule> {
    public columnName: string;
    public operand: string;
    public isDynamic: boolean;
    public value: any;
    public operator: string;
    public displayType;
    public columnLabel: string;
    public valueLabel: string;
    public tableName: string;
    public tableDefinition;

    setTableDefinition(tableDefinition = {}) {
        this.tableDefinition = tableDefinition;
        this.tableName = tableDefinition['model'] || '';
    }

    hasDynamicVariables() {
        return this.isDynamic;
    }

    constructor(columnName?: string, operand?: string, isDynamic?: boolean, value?: string, displayType?: string, operator?: string, columnLabel?: string, valueLabel?: string, tableDefinition?: any) {
        this.columnName = columnName || '';
        this.operand = operand || '';
        this.isDynamic = isDynamic || false;
        this.value = value || '';
        this.columnLabel = columnLabel;
        this.valueLabel = valueLabel;
        this.operator = operator;
        this.displayType = displayType;
        this.setTableDefinition(tableDefinition);
    }


    sequelize() {
        //this.displayType = Rule.guessDisplayType(this.value, this.columnName, this);
        if ((this.columnName && this.columnName.trim().length > 0) && (this.operand && this.operand.trim().length > 0)) {
            const opConfig = new OperatorConfig(SEQUELIZE_OPERATORS[this.operand], this.operand);
            if (opConfig.isExpressionBased(this.displayType)) {
                return opConfig.sequelize(this.displayType, this.value, this.columnName, this.tableName);
            } else {
                return {
                    [this.columnName]: {
                        [opConfig.getOperator(this.displayType)]: opConfig.sequelize(this.displayType, this.value, this.columnName, this.tableName)
                    }
                };
            }
        }
        return {};
    }

    clone(): Rule {
        const rule = new Rule(this.columnName, this.operand, this.isDynamic, this.value, this.tableDefinition);
        rule.displayType = this.displayType ? this.displayType : 'string';
        rule.populatLabels(this.columnLabel, this.valueLabel);
        return rule;
    }

    equals(rule: Rule): boolean {
        return rule && this.value === rule.value && this.isDynamic === rule.isDynamic && this.operand === rule.operand && this.columnName === rule.columnName;
    }

    filterLabels(columnLabel: string) {
        this.columnLabel = columnLabel;
    }

    populatLabels(columnName, idName) {
        this.columnLabel = columnName;
        this.valueLabel = idName;
    }

    toString() {
        return (this.columnLabel || this.columnName) + ' ' + this.operand + ' ' + (this.valueLabel || this.value);
    }

    isEmpty() {
        if (this.operand === 'Is Empty' || this.operand === 'Is Not Empty') {
            return typeof this.columnName !== 'undefined';
        }
        return !!(this.columnName && this.operand && (this.value ? this.value.toString() : this.value));
    }
}