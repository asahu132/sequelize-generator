"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var ObjectUtil = /** @class */ (function () {
    function ObjectUtil() {
    }
    ObjectUtil.isEmpty = function (obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    };
    ObjectUtil.getFirstValue = function (obj) {
        return obj[Object.keys(obj)[0]];
    };
    ObjectUtil.values = function (obj) {
        var values = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                values.push(obj[key]);
            }
        }
        return values;
    };
    return ObjectUtil;
}());
exports.ObjectUtil = ObjectUtil;
var UUIDHelper = /** @class */ (function () {
    function UUIDHelper() {
    }
    /**Check if valid uuid*/
    UUIDHelper.isValidUUID = function (uuid) {
        return uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    };
    UUIDHelper.generateUUID = function () {
        return uuid_1.v4();
    };
    return UUIDHelper;
}());
exports.UUIDHelper = UUIDHelper;
var DateUtil = /** @class */ (function () {
    function DateUtil() {
    }
    DateUtil.asStartOfSeconds = function (date) {
        var d = new Date(date.getTime());
        d.setSeconds(0, 0);
        return d;
    };
    DateUtil.asEndOfSeconds = function (date) {
        var d = new Date(date.getTime());
        d.setSeconds(59, 999);
        return d;
    };
    DateUtil.asStartOfMillis = function (date) {
        var d = new Date(date.getTime());
        d.setMilliseconds(0);
        return d;
    };
    DateUtil.asEndOfMillis = function (date) {
        var d = new Date(date.getTime());
        d.setMilliseconds(999);
        return d;
    };
    DateUtil.asStartOfDay = function (date) {
        var d = new Date(date.getTime());
        d.setHours(0, 0, 0, 0);
        return d;
    };
    DateUtil.asEndOfDay = function (date) {
        var d = new Date(date.getTime());
        d.setHours(23, 59, 59, 999);
        return d;
    };
    DateUtil.isValidDate = function (dateString) {
        return !isNaN(Date.parse(dateString));
    };
    DateUtil.MILLIS_IN_MINUTE = 59 * 1000 + 999;
    DateUtil.MILLIS_IN_HOUR = 59 * 59 * 1000 + 999;
    DateUtil.MILLIS_IN_DAY = 23 * 59 * 59 * 1000 + 999;
    return DateUtil;
}());
exports.DateUtil = DateUtil;
