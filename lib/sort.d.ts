import { Sequelizable } from "./sequelize";
import { Cloneable } from "./cloneable";
export declare class Sort implements Sequelizable, Cloneable<Sort> {
    columnName: string;
    value: string;
    constructor(columnName?: string, value?: string);
    unsequelize(sequelized: any): this;
    sequelize(): string[];
    clone(): Sort;
    toString(): string;
    isEmpty(): boolean;
}
