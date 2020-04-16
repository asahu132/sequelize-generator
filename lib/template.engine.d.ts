export declare class TemplateEngine {
    private template;
    static REGEX: RegExp;
    static EXPRESSION_START_DELIMITER: string;
    static EXPRESSION_END_DELIMITER: string;
    private expressions;
    static looseJsonParse(obj: any): any;
    /**Returns all global variables that can be used inside filter conditions*/
    static getGlobalContext(): Promise<{
        date: {
            now: Date;
        };
        me: {};
    }>;
    /**Evaluate template string against given context*/
    static eval(template: string, context: any): string;
    /**
     * Evaluate expression against given context
     * eg ${VAL1*VAL2} return 6 where context is {VAL1:2,VAL2:3}
     */
    static evaluateExpression(expression: any, context: any): any;
    /**
     * This will evaluate given javascript string as javascript expression and returns the result
     * eg return VAL1*VAL2; return 6 where context is {VAL1:2,VAL2:3}
     * */
    static evalStatement(statement: any, context: any): any;
    constructor(template: string);
    /**Compile the given template string*/
    compile(): TemplateEngine;
    /**Evaluate template string against given context*/
    eval(context: any): string;
    replacer(tpl: any, data: any): string;
}
