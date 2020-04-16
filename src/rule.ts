import { Sequelizable } from "./sequelize";

import { Cloneable } from "./cloneable";

import { UUIDHelper } from "./common.utils";

import { SequelizeExpressionCompiler, OperatorConfig, SEQUELIZE_OPERATORS } from "./config";

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
      this.columnLabel = columnLabel|| '';
      this.valueLabel = valueLabel|| '';
      this.operator = operator|| '';
      this.displayType = displayType;
      this.tableName='';
      this.setTableDefinition(tableDefinition);
    }
  
    unsequelize(sequelized: any): this {
      if (typeof sequelized === 'string') {
        const data = new SequelizeExpressionCompiler().compileExpression(sequelized);
        const opConfig = OperatorConfig.findConfigByValue(data.operand, data.value);
        this.value = opConfig.unsequelize(data.value);
        this.operand = data.operand;
        this.columnName = data.columnName;
        this.tableName = data.tableName;
      } else if (Object.keys(sequelized).length > 0) {
        this.columnName = Object.keys(sequelized)[0];
        const valPair = sequelized[this.columnName];
        const operand = Object.keys(valPair)[0];
        if (operand && operand !== 'undefined') {
          const opConfig = OperatorConfig.findConfigByValue(operand, valPair[operand]);
          this.value = opConfig.unsequelize(valPair[operand]);
          this.operand = opConfig.displayOperator;
          if (!this.displayType) {
            //this.displayType = Rule.guessDisplayType(this.value, this.columnName, this.tableDefinition);
          }
        }
        this.isDynamic = typeof this.value === 'string' && this.value.indexOf('${') > -1;
      }
      return this;
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
    stringify(){
        let rule = {
            columnName: this.columnName,
            operand: this.operand,
            isDynamic: this.isDynamic,
            value: this.value,
            displayType: this.displayType,
            tableName: this.tableName
        }
      return rule
    }
    isEmpty() {
      if (this.operand === 'Is Empty' || this.operand === 'Is Not Empty') {
        return typeof this.columnName !== 'undefined';
      }
      return !!(this.columnName && this.operand && (this.value ? this.value.toString() : this.value));
    }
  }