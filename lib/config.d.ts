export declare const SEQUELIZE_OPERATORS: any;
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
