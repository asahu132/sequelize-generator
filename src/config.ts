import _ from 'lodash';
import {TemplateEngine} from './template.engine';
import {DateUtil} from './common.utils';

const CASE_SENSITIVE_TYPES = ['uuid', 'reference', 'integer', 'decimal', 'boolean', 'date_time', 'dateonly', 'time', 'bigint', 'duration'];
const NON_STRING_TYPES = ['integer', 'decimal', 'bigint', 'uuid'];
export const SEQUELIZE_OPERATORS = {
  'Greater Than': {operator: '[Op.gt]'},
  'Greater Than or Equal': {operator: '[Op.gte]'},
  'Less Than': {operator: '[Op.lt]'},
  'Less Than or Equal': {operator: '[Op.lte]'},
  // 'Not Equal': { operator: '[Op.ne]' },
  // 'Equal': { operator: '[Op.eq]' },
  'Not': {operator: '[Op.not]'},
  'Between': {
    operator: '[Op.between]',
    sequelize: (type, value) => {
      return value;
    },
    unsequelize: function (value) {
      if (Array.isArray(value) && value.length > 0 && DateUtil.isValidDate(value[0])) {
        const diff = Date.parse(value[1]) - Date.parse(value[0]);
        if (diff < DateUtil.MILLIS_IN_MINUTE) { // if date diff is less than a minute than it must be equal operator
          this['displayOperator'] = 'Equal';
          return value[0];
        } else if (diff < DateUtil.MILLIS_IN_DAY) {
          this['displayOperator'] = 'Date Equal';
          return value[0];
        }
      }
      return value;
    }
  },
  'Not Between': {
    operator: '[Op.notBetween]',
    sequelize: (type, value) => {
      return value;
    },
    unsequelize: function (value) {
      if (Array.isArray(value) && value.length > 0 && DateUtil.isValidDate(value[0])) {
        const diff = Date.parse(value[1]) - Date.parse(value[0]);
        if (diff < DateUtil.MILLIS_IN_MINUTE) { // if date diff is less than a minute than it must be equal operator
          this['displayOperator'] = 'Equal';
          return value[0];
        } else if (diff < DateUtil.MILLIS_IN_DAY) {
          this['displayOperator'] = 'Date Equal';
          return value[0];
        }
      }
      return value;
    }
  },
  'In': {
    operator: '[Op.in]',
    sequelize: (type, value) => {
      if (Array.isArray(value)) {
        return value;
      }
      return value.split(',').map((val) => val.trim());
    },
    unsequelize: function (value) {
      if (Array.isArray(value) && value.length > 0) {
        return value.join(',');
      }
      return value;
    }
  },
  'Not In': {
    operator: '[Op.notIn]',
    sequelize: (type, value) => {
      return value.replace(/ /g, '').split(',');
    },
    unsequelize: function (value) {
      if (Array.isArray(value)) {
        return value.join(',');
      }
      return value;
    }
  },
  'Like': {operator: '[Op.like]'},
  'Not Like': {operator: '[Op.notLike]'},
  // 'Like': '[Op.iLike]',
  'Not ILike': {operator: '[Op.notILike]'},
  'Regexp': {operator: '[Op.regexp]'},
  'Not Regexp': {operator: '[Op.notRegexp]'},
  'iRegexp': {operator: '[Op.iRegexp]'},
  'Not IRegexp': {operator: '[Op.notIRegexp]'},
  'Overlap': {operator: '[Op.overlap]'},
  'Contained': {operator: '[Op.contained]'},
  'Any': {operator: '[Op.any]'},
  'AND': {
    operator: '[Op.and]',
    unsequelize: function (value) {
      if (_.isEqual(value, [{'[Op.ne]': null}, {'[Op.ne]': null}]) || _.isEqual(value, [{'[Op.ne]': null}, {'[Op.ne]': ''}])) {
        this['displayOperator'] = 'Is Not Empty';
      }
      return value;
    }
  },
  'OR': {
    operator: '[Op.or]',
    unsequelize: function (value) {
      if (_.isEqual(value, [{'[Op.eq]': null}, {'[Op.eq]': null}]) || _.isEqual(value, [{'[Op.eq]': null}, {'[Op.eq]': ''}])) {
        this['displayOperator'] = 'Is Empty';
      }
      return value;
    }
  },
  'Is Empty': {
    operator: '[Op.or]',
    sequelize: (type, value) => {
      if (CASE_SENSITIVE_TYPES.indexOf(type) >= 0) {
        return [{'[Op.eq]': null}, {'[Op.eq]': null}];
      }
      return [{'[Op.eq]': null}, {'[Op.eq]': ''}];
    },
    unsequelize: (value) => {
      return [{'[Op.eq]': null}, {'[Op.eq]': ''}];
    }
  },
  'Is Not Empty': {
    operator: '[Op.and]',
    sequelize: (type, value) => {
      if (CASE_SENSITIVE_TYPES.indexOf(type) >= 0) {
        return [{'[Op.ne]': null}, {'[Op.ne]': null}];
      }
      return [{'[Op.ne]': null}, {'[Op.ne]': ''}];
    },
    unsequelize: (value) => {
      return [{'[Op.ne]': null}, {'[Op.ne]': ''}];
    }
  },
  'Starts With': {
    operator: '[Op.iLike]',
    sequelize: (type, value) => {
      return value + '%';
    },
    unsequelize: (value) => {
      return value.replace(/\%/g, '');
    }
  },
  'Ends With': {
    operator: '[Op.iLike]',
    sequelize: function (type, value) {
      return '%' + value;
    },
    unsequelize: (value) => {
      return value.replace(/\%/g, '');
    }
  },
  'Contains': {
    operator: (type) => {
      return type !== 'multiSelect' ? '[Op.iLike]' : '[Op.contains]';
    },
    sequelize: function (type, value, columnName, tableName = '') {
      if (this.isExpressionBased(type)) {
        return 'sequelize.where(sequelize.cast(sequelize.col("' + tableName + '.' + columnName + '"),"varchar"),{"[Op.iLike]":"%' + value + '%"})';
      }
      return '%' + value + '%';
    },
    unsequelize: (value) => {
      return Array.isArray(value) ? value : value.replace(/\%/g, '');
    },
    isExpressionBased: (type) => {
      return NON_STRING_TYPES.indexOf(type) > -1;
    },
  },
  'Not Contains': {
    operator: (type) => {
      return type !== 'multiSelect' ? '[Op.notILike]' : '[Op.contains]';
    },
    sequelize: function (type, value) {
      return '%' + value + '%';
    },
    unsequelize: (value) => {
      return value.replace(/\%/g, '');
    }
  },
  'Equal': {
    operator: (type) => {
      if (type === 'date_time') {
        return '[Op.between]';
      }
      return CASE_SENSITIVE_TYPES.indexOf(type) < 0 ? '[Op.iLike]' : '[Op.eq]';
    },
    sequelize: function (type, value) {
      if (type === 'date_time') {
        const date = new Date(value);
        return [DateUtil.asStartOfSeconds(date), DateUtil.asEndOfSeconds(date)];
      }
      return value;
    },
    unsequelize: (value) => {
      return value;
    },
  },
  'Not Equal': {
    operator: (type) => {
      if (type === 'date_time') {
        return '[Op.notBetween]';
      }
      return CASE_SENSITIVE_TYPES.indexOf(type) < 0 ? '[Op.notILike]' : '[Op.ne]';
    },
    sequelize: function (type, value) {
      if (type === 'date_time') {
        const date = new Date(value);
        return [DateUtil.asStartOfSeconds(date), DateUtil.asEndOfSeconds(date)];
      }
      return value;
    },
    unsequelize: (value) => {
      return value;
    }
  },
  'Date Equal': {
    displayType: 'dateonly',
    operator: '[Op.between]',
    sequelize: function (type, value) {
      const date = new Date(value);
      return [DateUtil.asStartOfDay(date), DateUtil.asEndOfDay(date)];
      return value;
    },
    unsequelize: (value) => {
      return value;
    }
  },
  'Date Not Equal': {
    displayType: 'dateonly',
    operator: '[Op.notBetween]',
    sequelize: function (type, value) {
      const date = new Date(value);
      return [DateUtil.asStartOfDay(date), DateUtil.asEndOfDay(date)];
      return value;
    },
    unsequelize: (value) => {
      return value;
    }
  },
};

export const DATA_TYPE_OPERATORS = {
  'string': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With', 'Is Empty', 'Is Not Empty', 'In', 'Not In'],
  'integer': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Greater Than', 'Greater Than or Equal', 'Less Than', 'Less Than or Equal', 'Between', 'In', 'Not In'],
  'decimal': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Greater Than', 'Greater Than or Equal', 'Less Than', 'Less Than or Equal', 'Between', 'In', 'Not In'],
  'choice': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With',  'Is Empty', 'Is Not Empty'],
  'email': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With',  'Is Empty', 'Is Not Empty', 'In', 'Not In'],
  'text': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With',  'Is Empty', 'Is Not Empty'],
  'markdown': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With',  'Is Empty', 'Is Not Empty'],
  'script': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With',  'Is Empty', 'Is Not Empty'],
  'reference': ['Equal', 'Not Equal', 'Is Empty', 'Is Not Empty'],
  'group': ['Equal', 'Not Equal', 'Is Empty', 'Is Not Empty'],
  'boolean': ['Equal', 'Not Equal'],
  'url': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With',  'Is Empty', 'Is Not Empty'],
  'uuid': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Is Empty', 'Is Not Empty', 'In', 'Not In'],
  'date_time': ['Equal', 'Not Equal', 'Greater Than', 'Less Than', 'Between', 'Is Empty', 'Is Not Empty', 'Date Equal', 'Date Not Equal'],
  'list_designer': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With',  'Is Empty', 'Is Not Empty'],
  'name_label': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With',  'Is Empty', 'Is Not Empty'],
  'form_designer': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With',  'Is Empty', 'Is Not Empty'],
  'dateonly': ['Equal', 'Not Equal', 'Greater Than', 'Greater Than or Equal', 'Less Than', 'Less Than or Equal', 'Between', 'Is Empty', 'Is Not Empty'],
  'time': ['Equal', 'Not Equal', 'Greater Than', 'Greater Than or Equal', 'Less Than', 'Less Than or Equal', 'Between', 'Is Empty', 'Is Not Empty'],
  'phone': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With',  'Is Empty', 'Is Not Empty'],
  'password': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With',  'Is Empty', 'Is Not Empty'],
  'duration': ['Equal', 'Not Equal', 'Greater Than', 'Greater Than or Equal', 'Less Than', 'Less Than or Equal', 'Between', 'Is Empty', 'Is Not Empty'],
  'multiSelect': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Overlap', 'Is Empty', 'Is Not Empty'],
  'filter_builder': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With',  'Is Empty', 'Is Not Empty'],
  'record_link': ['Equal', 'Not Equal', 'Is Empty', 'Is Not Empty'],
};

export const DATA_TYPE_RENDERER = {
  markdown: 'text',
  script: 'text',
  name_label: 'text',
  filter_builder: 'text',
  form_designer: 'text',
  list_designer: 'text',
  email: 'string',
  url: 'string',
  uuid: 'string',
  jsonb: 'text',
  date_time: 'date_time',
};

export class OperatorConfig {


  static DEFAULT_CONFIG = {
    sequelize: (type, value) => {
      return value;
    },
    unsequelize: (value) => {
      return value;
    }
  };
  public operator;
  public displayType;

  static findConfigByValue(sequelizeOperator, value): any {
    if (sequelizeOperator === '[Op.iLike]') {
      if (value.startsWith('%') && value.endsWith('%')) {
        return new OperatorConfig(SEQUELIZE_OPERATORS['Contains'], 'Contains');
      } else if (value.startsWith('%')) {
        return new OperatorConfig(SEQUELIZE_OPERATORS['Ends With'], 'Ends With');
      } else if (value.endsWith('%')) {
        return new OperatorConfig(SEQUELIZE_OPERATORS['Starts With'], 'Starts With');
      } else {
        return new OperatorConfig(SEQUELIZE_OPERATORS['Equal'], 'Equal');
      }
    } else if (sequelizeOperator === '[Op.notILike]') {
      if (value.startsWith('%') && value.endsWith('%')) {
        return new OperatorConfig(SEQUELIZE_OPERATORS['Not Contains'], 'Not Contains');
      } else {
        return new OperatorConfig(SEQUELIZE_OPERATORS['Not Equal'], 'Not Equal');
      }
    } else if (sequelizeOperator === '[Op.eq]') {
      return new OperatorConfig(SEQUELIZE_OPERATORS['Equal'], 'Equal');
    } else if (sequelizeOperator === '[Op.ne]') {
      return new OperatorConfig(SEQUELIZE_OPERATORS['Not Equal'], 'Not Equal');
    }
    for (const i in SEQUELIZE_OPERATORS) {
      if (SEQUELIZE_OPERATORS[i].operator === sequelizeOperator) {
        return new OperatorConfig(SEQUELIZE_OPERATORS[i], i);
      }
    }
    return null;
  }


  constructor(private config, public displayOperator?) {
    this.config = (<any>Object).assign({}, OperatorConfig.DEFAULT_CONFIG, config);
    this.operator = this.config.operator;
    this.resetDisplayOperator();
  }

  isExpressionBased(type) {
    if (this.config.isExpressionBased) {
      return this.config.isExpressionBased.call(this.config, type);
    }
    return false;
  }

  sequelize(type, value, columnName, tableName) {
    const sequelize = this.config.sequelize.call(this.config, type, value, columnName, tableName);
    this.resetDisplayOperator();
    return sequelize;
  }

  unsequelize(value: any) {
    const sequelize = this.config.unsequelize.call(this.config, value);
    this.resetDisplayOperator();
    return sequelize;
  }

  resetDisplayOperator() {
    if (this.config.displayOperator) {
      if (typeof this.config.displayOperator === 'function') {
        this.displayOperator = this.config.displayOperator.apply(this.config);
      } else {
        this.displayOperator = this.config.displayOperator;
      }
    }
  }

  getOperator(type) {
    if (typeof this.operator === 'function') {
      this.operator = this.operator.call(this.config, type);
    }
    return this.operator;
  }
}

export class SequelizeExpressionCompiler {
  public context = {
    sequelize: {
      where: (colData, condition) => {
        const operand = Object.keys(condition)[0];
        return {columnName: colData.columnName, tableName: colData.tableName, operand, value: condition[operand]};
      },
      fn: (functionName, columnName = '') => {
        return columnName;
      },
      cast: (columnName) => {
        return columnName;
      },
      col: (colData) => {
        if (colData.indexOf('.') > 0) {
          const tableColumn = colData.split('.');
          return {columnName: tableColumn[1], tableName: tableColumn[0]};
        }
        return {columnName: colData};
      }
    }
  };

  compileExpression(expression) {
    return TemplateEngine.evalStatement('return ' + expression + ';', this.context);
  }
}
