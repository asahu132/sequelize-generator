"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A light weight template engine for evaluating expression like ${VARIABLE}
 * eg -
 * one plus tow is ${1+2} returns one plus two is 3
 * ${'x'+'y'} return xy
 * ${VAL1*VAL2} return 6 where context is {VAL1:2,VAL2:3}
 * */
var lodash_1 = require("lodash");
var TemplateEngine = /** @class */ (function () {
    function TemplateEngine(template) {
        this.template = template;
    }
    TemplateEngine.looseJsonParse = function (obj) {
        return Function('"use strict";return (' + obj + ')')();
    };
    /*  static ASCII_CHAR_COUNT = 256;
    static PRIME_NUMBER = 31;
  
    static hashCode(str: string): number {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash * TemplateEngine.ASCII_CHAR_COUNT) + str.charCodeAt(i)) % TemplateEngine.PRIME_NUMBER;
      }
      return hash;
    }*/
    /**Returns all global variables that can be used inside filter conditions*/
    TemplateEngine.getGlobalContext = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        date: {
                            now: new Date(),
                        },
                        me: {},
                    }];
            });
        });
    };
    /**Evaluate template string against given context*/
    TemplateEngine.eval = function (template, context) {
        return new TemplateEngine(template).compile().eval(context);
    };
    /**
     * Evaluate expression against given context
     * eg ${VAL1*VAL2} return 6 where context is {VAL1:2,VAL2:3}
     */
    TemplateEngine.evaluateExpression = function (expression, context) {
        var exp = expression.trim();
        var contextKeys = Object.keys(context);
        return TemplateEngine.looseJsonParse("function(" + contextKeys.join(',') + "){\n              return " + exp.substring(2, exp.length - 1) + ";\n            }")
            .apply(this, contextKeys.map(function (key) { return context[key]; }));
    };
    /**
     * This will evaluate given javascript string as javascript expression and returns the result
     * eg return VAL1*VAL2; return 6 where context is {VAL1:2,VAL2:3}
     * */
    TemplateEngine.evalStatement = function (statement, context) {
        var exp = statement.trim();
        var contextKeys = Object.keys(context);
        return TemplateEngine.looseJsonParse("function(" + contextKeys.join(',') + "){\n              " + exp + ";\n            }")
            .apply(this, contextKeys.map(function (key) { return context[key]; }));
    };
    /**Compile the given template string*/
    TemplateEngine.prototype.compile = function () {
        /*for (let i = 0; i < this.template.length; i++) {
    
        }*/
        this.expressions = this.template.match(TemplateEngine.REGEX);
        // remove duplicate expression
        if (this.expressions) {
            this.expressions = lodash_1.default.uniq(this.expressions);
        }
        return this;
    };
    /**Evaluate template string against given context*/
    TemplateEngine.prototype.eval = function (context) {
        var temp = this.template;
        this.expressions && this.expressions.forEach(function (expression) {
            temp = temp.replace(expression, TemplateEngine.evaluateExpression(expression, context));
        });
        return temp;
    };
    TemplateEngine.prototype.replacer = function (tpl, data) {
        var re = /\$\(([^\)]+)?\)/g;
        var text = tpl;
        var match;
        while (match = re.exec(text)) {
            text = tpl.replace(match[0], data[match[1]]);
            re.lastIndex = 0;
        }
        return text;
    };
    // static REGEX = /\$\{(((?!\$).)*)\}/g;
    TemplateEngine.REGEX = /\$\{(.*?)\}/g;
    TemplateEngine.EXPRESSION_START_DELIMITER = '${';
    TemplateEngine.EXPRESSION_END_DELIMITER = '}';
    return TemplateEngine;
}());
exports.TemplateEngine = TemplateEngine;
