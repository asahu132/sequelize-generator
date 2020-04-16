/**
 * A light weight template engine for evaluating expression like ${VARIABLE}
 * eg -
 * one plus tow is ${1+2} returns one plus two is 3
 * ${'x'+'y'} return xy
 * ${VAL1*VAL2} return 6 where context is {VAL1:2,VAL2:3}
 * */
import _ from 'lodash';

declare var require: any;

export class TemplateEngine {

  // static REGEX = /\$\{(((?!\$).)*)\}/g;
  static REGEX = /\$\{(.*?)\}/g;

  static EXPRESSION_START_DELIMITER = '${';
  static EXPRESSION_END_DELIMITER = '}';
  private expressions: any;

  static looseJsonParse(obj) {
    return Function('"use strict";return (' + obj + ')')();
  }

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
  static async getGlobalContext() {
    return {
      date: {
        now: new Date(),
      },
      me: {},
    };
  }

  /**Evaluate template string against given context*/
  static eval(template: string, context) {
    return new TemplateEngine(template).compile().eval(context);
  }


  /**
   * Evaluate expression against given context
   * eg ${VAL1*VAL2} return 6 where context is {VAL1:2,VAL2:3}
   */
  static evaluateExpression(expression, context) {
    const exp = expression.trim();
    const contextKeys = Object.keys(context);
    return TemplateEngine.looseJsonParse(`function(${contextKeys.join(',')}){
              return ${exp.substring(2, exp.length - 1)};
            }`)
      .apply(this, contextKeys.map(key => context[key]));
  }

  /**
   * This will evaluate given javascript string as javascript expression and returns the result
   * eg return VAL1*VAL2; return 6 where context is {VAL1:2,VAL2:3}
   * */
  static evalStatement(statement, context): any {
    const exp = statement.trim();
    const contextKeys = Object.keys(context);
    return TemplateEngine.looseJsonParse(`function(${contextKeys.join(',')}){
              ${exp};
            }`)
      .apply(this, contextKeys.map(key => context[key]));
  }
  constructor(private template: string) {
  }

  /**Compile the given template string*/
  compile(): TemplateEngine {
    /*for (let i = 0; i < this.template.length; i++) {

    }*/
    this.expressions = this.template.match(TemplateEngine.REGEX);
    // remove duplicate expression
    if (this.expressions) {
      this.expressions = _.uniq(this.expressions);
    }
    return this;
  }

  /**Evaluate template string against given context*/
  eval(context): string {
    let temp = this.template;
    this.expressions && this.expressions.forEach((expression) => {
      temp = temp.replace(expression, TemplateEngine.evaluateExpression(expression, context));
    });
    return temp;
  }

  replacer(tpl, data): string {
    const re = /\$\(([^\)]+)?\)/g;
    let text = tpl;
    let match;
    while (match = re.exec(text)) {
      text = tpl.replace(match[0], data[match[1]]);
      re.lastIndex = 0;
    }
    return text;
  }


}
