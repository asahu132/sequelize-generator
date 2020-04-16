import { Sequelizable } from "./sequelize";
import { Cloneable } from "./cloneable";
import { Rule } from "./rule";
export declare class Query implements Sequelizable, Cloneable<Query> {
    condition: string;
    rules: any[];
    constructor(condition?: any, rules?: any);
    getRules(rules: any): any;
    hasDynamicVariables(): boolean;
    isSequalizedQuery(sequelized: any): boolean;
    unsequelize(sequelized: any): this;
    sequelize(): any;
    clone(): Query;
    toString(): string;
    stringify(): {
        condition: string;
        rules: any[];
    };
    getAllRules(): Rule[];
    removeRule(rule: Rule): Rule | undefined;
}
