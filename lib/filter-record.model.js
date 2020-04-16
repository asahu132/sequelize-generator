"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var filter_1 = require("./filter");
var FilterRecordModel = /** @class */ (function () {
    function FilterRecordModel(id, filter) {
        this.id = id;
        this.filter = filter;
        this.name = '';
        this.description = '';
        this.label = '';
        this.condition = '';
        this.tableId = '';
        this.applicationId = '';
    }
    FilterRecordModel.prototype.toFilterBuilderModel = function () {
        if (!this.filter) {
            this.filter = filter_1.Filter.build(this.condition);
        }
        return this.filter;
    };
    return FilterRecordModel;
}());
exports.FilterRecordModel = FilterRecordModel;
