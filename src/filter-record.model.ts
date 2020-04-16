import {Filter} from "./filter";

export class FilterRecordModel {
  public name: string;
  public description: string;
  public label: string;
  public condition: string;
  public tableId: string;
  public applicationId: string;

    constructor(public id?: string, private filter?: Filter) {
        this.name = '';
        this.description = '';
        this.label = '';
        this.condition = '';
        this.tableId = '';
        this.applicationId = '';
    }

  toFilterBuilderModel(): Filter {
    if (!this.filter) {
      this.filter = Filter.parse(JSON.parse(this.condition));
    }
    return this.filter;
  }
}
