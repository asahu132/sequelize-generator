import { Sequelizable } from "./sequelize";
import { Cloneable } from "./cloneable";
export declare class Rule implements Sequelizable, Cloneable<Rule> {
    columnName: string;
    operand: string;
    isDynamic: boolean;
    value: any;
    operator: string;
    displayType: string;
    columnLabel: string;
    valueLabel: string;
    tableName: string;
    tableDefinition: any;
    setTableDefinition(tableDefinition?: any): void;
    hasDynamicVariables(): boolean;
    constructor(columnName?: string, operand?: string, isDynamic?: boolean, value?: string, displayType?: string, operator?: string, columnLabel?: string, valueLabel?: string, tableDefinition?: any);
    sequelize(): any;
    clone(): Rule;
    equals(rule: Rule): boolean;
    filterLabels(columnLabel: string): void;
    populatLabels(columnName: any, idName: any): void;
    toString(): string;
    isEmpty(): boolean;
}
