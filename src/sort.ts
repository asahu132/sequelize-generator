import { Sequelizable } from "./sequelize";
import { Cloneable } from "./cloneable";

export class Sort implements Sequelizable, Cloneable<Sort> {
    public columnName: string;
    public value: string;
  
    constructor(columnName?: string, value?: string) {
      this.columnName = columnName || '';
      this.value = value || '';
    }
  
    unsequelize(sequelized: any): this {
      this.columnName = sequelized[0];
      this.value = sequelized[1];
      return this;
    }
  
    sequelize() {
      return [this.columnName, this.value];
    }
  
    clone() {
      return new Sort(this.columnName, this.value);
    }
  
    toString() {
      return this.columnName + ' ' + this.value;
    }
    isEmpty() {
      return !this.columnName || !this.value;
    }
  }