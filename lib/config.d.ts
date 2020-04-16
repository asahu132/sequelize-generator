export declare const SEQUELIZE_OPERATORS: {
    'Greater Than': {
        operator: string;
    };
    'Greater Than or Equal': {
        operator: string;
    };
    'Less Than': {
        operator: string;
    };
    'Less Than or Equal': {
        operator: string;
    };
    Not: {
        operator: string;
    };
    Between: {
        operator: string;
        sequelize: (type: any, value: any) => any;
        unsequelize: (value: any) => any;
    };
    'Not Between': {
        operator: string;
        sequelize: (type: any, value: any) => any;
        unsequelize: (value: any) => any;
    };
    In: {
        operator: string;
        sequelize: (type: any, value: any) => any;
        unsequelize: (value: any) => any;
    };
    'Not In': {
        operator: string;
        sequelize: (type: any, value: any) => any;
        unsequelize: (value: any) => any;
    };
    Like: {
        operator: string;
    };
    'Not Like': {
        operator: string;
    };
    'Not ILike': {
        operator: string;
    };
    Regexp: {
        operator: string;
    };
    'Not Regexp': {
        operator: string;
    };
    iRegexp: {
        operator: string;
    };
    'Not IRegexp': {
        operator: string;
    };
    Overlap: {
        operator: string;
    };
    Contained: {
        operator: string;
    };
    Any: {
        operator: string;
    };
    AND: {
        operator: string;
        unsequelize: (value: any) => any;
    };
    OR: {
        operator: string;
        unsequelize: (value: any) => any;
    };
    'Is Empty': {
        operator: string;
        sequelize: (type: any, value: any) => ({
            '[Op.eq]': null;
        } | {
            '[Op.eq]': string;
        })[];
        unsequelize: (value: any) => ({
            '[Op.eq]': null;
        } | {
            '[Op.eq]': string;
        })[];
    };
    'Is Not Empty': {
        operator: string;
        sequelize: (type: any, value: any) => ({
            '[Op.ne]': null;
        } | {
            '[Op.ne]': string;
        })[];
        unsequelize: (value: any) => ({
            '[Op.ne]': null;
        } | {
            '[Op.ne]': string;
        })[];
    };
    'Starts With': {
        operator: string;
        sequelize: (type: any, value: any) => string;
        unsequelize: (value: any) => any;
    };
    'Ends With': {
        operator: string;
        sequelize: (type: any, value: any) => string;
        unsequelize: (value: any) => any;
    };
    Contains: {
        operator: (type: any) => "[Op.iLike]" | "[Op.contains]";
        sequelize: (type: any, value: any, columnName: any, tableName?: string) => string;
        unsequelize: (value: any) => any;
        isExpressionBased: (type: any) => boolean;
    };
    'Not Contains': {
        operator: (type: any) => "[Op.notILike]" | "[Op.contains]";
        sequelize: (type: any, value: any) => string;
        unsequelize: (value: any) => any;
    };
    Equal: {
        operator: (type: any) => "[Op.between]" | "[Op.iLike]" | "[Op.eq]";
        sequelize: (type: any, value: any) => any;
        unsequelize: (value: any) => any;
    };
    'Not Equal': {
        operator: (type: any) => "[Op.notBetween]" | "[Op.notILike]" | "[Op.ne]";
        sequelize: (type: any, value: any) => any;
        unsequelize: (value: any) => any;
    };
    'Date Equal': {
        displayType: string;
        operator: string;
        sequelize: (type: any, value: any) => any;
        unsequelize: (value: any) => any;
    };
    'Date Not Equal': {
        displayType: string;
        operator: string;
        sequelize: (type: any, value: any) => any;
        unsequelize: (value: any) => any;
    };
};
export declare const DATA_TYPE_OPERATORS: {
    string: string[];
    integer: string[];
    decimal: string[];
    choice: string[];
    email: string[];
    text: string[];
    markdown: string[];
    script: string[];
    reference: string[];
    group: string[];
    boolean: string[];
    url: string[];
    uuid: string[];
    date_time: string[];
    list_designer: string[];
    name_label: string[];
    form_designer: string[];
    dateonly: string[];
    time: string[];
    phone: string[];
    password: string[];
    duration: string[];
    multiSelect: string[];
    filter_builder: string[];
    record_link: string[];
};
export declare const DATA_TYPE_RENDERER: {
    markdown: string;
    script: string;
    name_label: string;
    filter_builder: string;
    form_designer: string;
    list_designer: string;
    email: string;
    url: string;
    uuid: string;
    jsonb: string;
    date_time: string;
};
export declare class OperatorConfig {
    private config;
    displayOperator?: any;
    static DEFAULT_CONFIG: {
        sequelize: (type: any, value: any) => any;
        unsequelize: (value: any) => any;
    };
    operator: any;
    displayType: any;
    static findConfigByValue(sequelizeOperator: any, value: any): any;
    constructor(config: any, displayOperator?: any);
    isExpressionBased(type: any): any;
    sequelize(type: any, value: any, columnName: any, tableName: any): any;
    unsequelize(value: any): any;
    resetDisplayOperator(): void;
    getOperator(type: any): any;
}
export declare class SequelizeExpressionCompiler {
    context: {
        sequelize: {
            where: (colData: any, condition: any) => {
                columnName: any;
                tableName: any;
                operand: string;
                value: any;
            };
            fn: (functionName: any, columnName?: string) => string;
            cast: (columnName: any) => any;
            col: (colData: any) => {
                columnName: any;
                tableName: any;
            } | {
                columnName: any;
                tableName?: undefined;
            };
        };
    };
    compileExpression(expression: any): any;
}
