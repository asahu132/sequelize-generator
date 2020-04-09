"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Sort = /** @class */ (function () {
    function Sort(columnName, value) {
        this.columnName = columnName || '';
        this.value = value || '';
    }
    Sort.prototype.unsequelize = function (sequelized) {
        this.columnName = sequelized[0];
        this.value = sequelized[1];
        return this;
    };
    Sort.prototype.sequelize = function () {
        return [this.columnName, this.value];
    };
    Sort.prototype.clone = function () {
        return new Sort(this.columnName, this.value);
    };
    Sort.prototype.toString = function () {
        return this.columnName + ' ' + this.value;
    };
    Sort.prototype.isEmpty = function () {
        return !this.columnName || !this.value;
    };
    return Sort;
}());
exports.Sort = Sort;
