import { Filter } from "./filter";
export declare class FilterRecordModel {
    id?: string | undefined;
    private filter?;
    name: string;
    description: string;
    label: string;
    condition: string;
    tableId: string;
    applicationId: string;
    constructor(id?: string | undefined, filter?: Filter | undefined);
    toFilterBuilderModel(): Filter;
}
