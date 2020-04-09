import { Cloneable } from "./cloneable";
import { Sequelizable } from "./sequelize";
import { Rule } from "./rule";
export declare class Query implements Sequelizable, Cloneable<Query> {
    condition: string;
    rules: any[];
    constructor(condition?: any, rules?: any);
    getRules(rules: any): any;
    hasDynamicVariables(): boolean;
    isSequalizedQuery(sequelized: any): boolean;
    sequelize(): any;
    clone(): Query;
    toString(): string;
    getAllRules(): Rule[];
    removeRule(rule: Rule): Rule | undefined;
}
