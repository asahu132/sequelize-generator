"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_utils_1 = require("./common.utils");
var CASE_SENSITIVE_TYPES = ['uuid', 'reference', 'integer', 'decimal', 'boolean', 'date_time', 'dateonly', 'time', 'bigint', 'duration'];
var NON_STRING_TYPES = ['integer', 'decimal', 'bigint', 'uuid'];
exports.SEQUELIZE_OPERATORS = {
    'Greater Than': { operator: '[Op.gt]' },
    'Greater Than or Equal': { operator: '[Op.gte]' },
    'Less Than': { operator: '[Op.lt]' },
    'Less Than or Equal': { operator: '[Op.lte]' },
    // 'Not Equal': { operator: '[Op.ne]' },
    // 'Equal': { operator: '[Op.eq]' },
    'Not': { operator: '[Op.not]' },
    'Between': {
        operator: '[Op.between]',
        sequelize: function (type, value) {
            return value;
        },
    },
    'Not Between': {
        operator: '[Op.notBetween]',
        sequelize: function (type, value) {
            return value;
        },
    },
    'In': {
        operator: '[Op.in]',
        sequelize: function (type, value) {
            if (Array.isArray(value)) {
                return value;
            }
            return value.split(',').map(function (val) { return val.trim(); });
        },
    },
    'Not In': {
        operator: '[Op.notIn]',
        sequelize: function (type, value) {
            return value.replace(/ /g, '').split(',');
        },
    },
    'Like': { operator: '[Op.like]' },
    'Not Like': { operator: '[Op.notLike]' },
    // 'Like': '[Op.iLike]',
    'Not ILike': { operator: '[Op.notILike]' },
    'Regexp': { operator: '[Op.regexp]' },
    'Not Regexp': { operator: '[Op.notRegexp]' },
    'iRegexp': { operator: '[Op.iRegexp]' },
    'Not IRegexp': { operator: '[Op.notIRegexp]' },
    'Overlap': { operator: '[Op.overlap]' },
    'Contained': { operator: '[Op.contained]' },
    'Any': { operator: '[Op.any]' },
    'AND': {
        operator: '[Op.and]',
    },
    'OR': {
        operator: '[Op.or]',
    },
    'Is Empty': {
        operator: '[Op.or]',
        sequelize: function (type, value) {
            if (CASE_SENSITIVE_TYPES.indexOf(type) >= 0) {
                return [{ '[Op.eq]': null }, { '[Op.eq]': null }];
            }
            return [{ '[Op.eq]': null }, { '[Op.eq]': '' }];
        },
    },
    'Is Not Empty': {
        operator: '[Op.and]',
        sequelize: function (type, value) {
            if (CASE_SENSITIVE_TYPES.indexOf(type) >= 0) {
                return [{ '[Op.ne]': null }, { '[Op.ne]': null }];
            }
            return [{ '[Op.ne]': null }, { '[Op.ne]': '' }];
        },
    },
    'Starts With': {
        operator: '[Op.iLike]',
        sequelize: function (type, value) {
            return value + '%';
        },
    },
    'Ends With': {
        operator: '[Op.iLike]',
        sequelize: function (type, value) {
            return '%' + value;
        },
    },
    'Contains': {
        operator: function (type) {
            return type !== 'multiSelect' ? '[Op.iLike]' : '[Op.contains]';
        },
        sequelize: function (type, value, columnName, tableName) {
            if (tableName === void 0) { tableName = ''; }
            if (this.isExpressionBased(type)) {
                return 'sequelize.where(sequelize.cast(sequelize.col("' + tableName + '.' + columnName + '"),"varchar"),{"[Op.iLike]":"%' + value + '%"})';
            }
            return '%' + value + '%';
        },
        isExpressionBased: function (type) {
            return NON_STRING_TYPES.indexOf(type) > -1;
        },
    },
    'Not Contains': {
        operator: function (type) {
            return type !== 'multiSelect' ? '[Op.notILike]' : '[Op.contains]';
        },
        sequelize: function (type, value) {
            return '%' + value + '%';
        },
    },
    'Equal': {
        operator: function (type) {
            if (type === 'date_time') {
                return '[Op.between]';
            }
            return CASE_SENSITIVE_TYPES.indexOf(type) < 0 ? '[Op.iLike]' : '[Op.eq]';
        },
        sequelize: function (type, value) {
            if (type === 'date_time') {
                var date = new Date(value);
                return [common_utils_1.DateUtil.asStartOfSeconds(date), common_utils_1.DateUtil.asEndOfSeconds(date)];
            }
            return value;
        },
    },
    'Not Equal': {
        operator: function (type) {
            if (type === 'date_time') {
                return '[Op.notBetween]';
            }
            return CASE_SENSITIVE_TYPES.indexOf(type) < 0 ? '[Op.notILike]' : '[Op.ne]';
        },
        sequelize: function (type, value) {
            if (type === 'date_time') {
                var date = new Date(value);
                return [common_utils_1.DateUtil.asStartOfSeconds(date), common_utils_1.DateUtil.asEndOfSeconds(date)];
            }
            return value;
        },
    },
    'Date Equal': {
        displayType: 'dateonly',
        operator: '[Op.between]',
        sequelize: function (type, value) {
            var date = new Date(value);
            return [common_utils_1.DateUtil.asStartOfDay(date), common_utils_1.DateUtil.asEndOfDay(date)];
            return value;
        },
    },
    'Date Not Equal': {
        displayType: 'dateonly',
        operator: '[Op.notBetween]',
        sequelize: function (type, value) {
            var date = new Date(value);
            return [common_utils_1.DateUtil.asStartOfDay(date), common_utils_1.DateUtil.asEndOfDay(date)];
            return value;
        },
    },
};
exports.DATA_TYPE_OPERATORS = {
    'string': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With', 'Is Empty', 'Is Not Empty', 'In', 'Not In'],
    'integer': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Greater Than', 'Greater Than or Equal', 'Less Than', 'Less Than or Equal', 'Between', 'In', 'Not In'],
    'decimal': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Greater Than', 'Greater Than or Equal', 'Less Than', 'Less Than or Equal', 'Between', 'In', 'Not In'],
    'choice': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With', 'Is Empty', 'Is Not Empty'],
    'email': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With', 'Is Empty', 'Is Not Empty', 'In', 'Not In'],
    'text': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With', 'Is Empty', 'Is Not Empty'],
    'markdown': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With', 'Is Empty', 'Is Not Empty'],
    'script': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With', 'Is Empty', 'Is Not Empty'],
    'reference': ['Equal', 'Not Equal', 'Is Empty', 'Is Not Empty'],
    'group': ['Equal', 'Not Equal', 'Is Empty', 'Is Not Empty'],
    'boolean': ['Equal', 'Not Equal'],
    'url': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With', 'Is Empty', 'Is Not Empty'],
    'uuid': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Is Empty', 'Is Not Empty', 'In', 'Not In'],
    'date_time': ['Equal', 'Not Equal', 'Greater Than', 'Less Than', 'Between', 'Is Empty', 'Is Not Empty', 'Date Equal', 'Date Not Equal'],
    'list_designer': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With', 'Is Empty', 'Is Not Empty'],
    'name_label': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With', 'Is Empty', 'Is Not Empty'],
    'form_designer': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With', 'Is Empty', 'Is Not Empty'],
    'dateonly': ['Equal', 'Not Equal', 'Greater Than', 'Greater Than or Equal', 'Less Than', 'Less Than or Equal', 'Between', 'Is Empty', 'Is Not Empty'],
    'time': ['Equal', 'Not Equal', 'Greater Than', 'Greater Than or Equal', 'Less Than', 'Less Than or Equal', 'Between', 'Is Empty', 'Is Not Empty'],
    'phone': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With', 'Is Empty', 'Is Not Empty'],
    'password': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With', 'Is Empty', 'Is Not Empty'],
    'duration': ['Equal', 'Not Equal', 'Greater Than', 'Greater Than or Equal', 'Less Than', 'Less Than or Equal', 'Between', 'Is Empty', 'Is Not Empty'],
    'multiSelect': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Overlap', 'Is Empty', 'Is Not Empty'],
    'filter_builder': ['Equal', 'Not Equal', 'Contains', 'Not Contains', 'Starts With', 'Ends With', 'Is Empty', 'Is Not Empty'],
    'record_link': ['Equal', 'Not Equal', 'Is Empty', 'Is Not Empty'],
};
exports.DATA_TYPE_RENDERER = {
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
var OperatorConfig = /** @class */ (function () {
    function OperatorConfig(config, displayOperator) {
        this.config = config;
        this.displayOperator = displayOperator;
        this.config = Object.assign({}, OperatorConfig.DEFAULT_CONFIG, config);
        this.operator = this.config.operator;
        this.resetDisplayOperator();
    }
    OperatorConfig.findConfigByValue = function (sequelizeOperator, value) {
        if (sequelizeOperator === '[Op.iLike]') {
            if (value.startsWith('%') && value.endsWith('%')) {
                return new OperatorConfig(exports.SEQUELIZE_OPERATORS['Contains'], 'Contains');
            }
            else if (value.startsWith('%')) {
                return new OperatorConfig(exports.SEQUELIZE_OPERATORS['Ends With'], 'Ends With');
            }
            else if (value.endsWith('%')) {
                return new OperatorConfig(exports.SEQUELIZE_OPERATORS['Starts With'], 'Starts With');
            }
            else {
                return new OperatorConfig(exports.SEQUELIZE_OPERATORS['Equal'], 'Equal');
            }
        }
        else if (sequelizeOperator === '[Op.notILike]') {
            if (value.startsWith('%') && value.endsWith('%')) {
                return new OperatorConfig(exports.SEQUELIZE_OPERATORS['Not Contains'], 'Not Contains');
            }
            else {
                return new OperatorConfig(exports.SEQUELIZE_OPERATORS['Not Equal'], 'Not Equal');
            }
        }
        else if (sequelizeOperator === '[Op.eq]') {
            return new OperatorConfig(exports.SEQUELIZE_OPERATORS['Equal'], 'Equal');
        }
        else if (sequelizeOperator === '[Op.ne]') {
            return new OperatorConfig(exports.SEQUELIZE_OPERATORS['Not Equal'], 'Not Equal');
        }
        for (var i in exports.SEQUELIZE_OPERATORS) {
            if (exports.SEQUELIZE_OPERATORS[i].operator === sequelizeOperator) {
                return new OperatorConfig(exports.SEQUELIZE_OPERATORS[i], i);
            }
        }
        return null;
    };
    OperatorConfig.prototype.isExpressionBased = function (type) {
        if (this.config.isExpressionBased) {
            return this.config.isExpressionBased.call(this.config, type);
        }
        return false;
    };
    OperatorConfig.prototype.sequelize = function (type, value, columnName, tableName) {
        var sequelize = this.config.sequelize.call(this.config, type, value, columnName, tableName);
        this.resetDisplayOperator();
        return sequelize;
    };
    OperatorConfig.prototype.unsequelize = function (value) {
        var sequelize = this.config.unsequelize.call(this.config, value);
        this.resetDisplayOperator();
        return sequelize;
    };
    OperatorConfig.prototype.resetDisplayOperator = function () {
        if (this.config.displayOperator) {
            if (typeof this.config.displayOperator === 'function') {
                this.displayOperator = this.config.displayOperator.apply(this.config);
            }
            else {
                this.displayOperator = this.config.displayOperator;
            }
        }
    };
    OperatorConfig.prototype.getOperator = function (type) {
        if (typeof this.operator === 'function') {
            this.operator = this.operator.call(this.config, type);
        }
        return this.operator;
    };
    OperatorConfig.DEFAULT_CONFIG = {
        sequelize: function (type, value) {
            return value;
        },
    };
    return OperatorConfig;
}());
exports.OperatorConfig = OperatorConfig;
