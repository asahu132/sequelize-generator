import { Sequelizable } from "./sequelize";
import { Cloneable } from "./cloneable";
import { Query } from "./query";
import { Sort } from "./sort";
import { Rule } from "./rule";
export declare class Filter implements Sequelizable, Cloneable<Filter> {
    context: {};
    queryGroup: Query[];
    sortBy: Sort[];
    queryGroupMergeOperator: string;
    static merge(filters: Filter[]): Filter;
    constructor(queryGroup?: Query[], sortBy?: Sort[]);
    setTableDefinition(tableDefinition: any): void;
    isEmpty(): boolean;
    hasEmptyQueryGroup(): boolean;
    hasEmptySortCondition(): boolean;
    hasInValidSortCondition(): boolean;
    checkValidSortCondition(): boolean;
    hasEmptyRules(): boolean;
    hasDynamicVariables(): boolean;
    sequelize(): any;
    clone(): Filter;
    toString(): string;
    getAllRules(): Rule[];
    removeRule(rule: Rule): void;
    reset(): void;
}
