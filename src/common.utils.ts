import {v4 as UUID} from 'uuid';

export class ObjectUtil {
  static isEmpty(obj: any) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  static getFirstValue(obj: any) {
    return obj[Object.keys(obj)[0]];
  }

  static values(obj: any): any[] {
    const values:any = []
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        values.push(obj[key]);
      }
    }
    return values;
  }
}

export class UUIDHelper {
  /**Check if valid uuid*/
  static isValidUUID(uuid: string) {
    return uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  }

  static generateUUID() {
    return UUID();
  }
}

export class DateUtil {
  static MILLIS_IN_MINUTE = 59 * 1000 + 999;
  static MILLIS_IN_HOUR = 59 * 59 *  1000 + 999;
  static MILLIS_IN_DAY = 23 * 59 * 59 *  1000 + 999;
  static asStartOfSeconds(date: Date): Date {
    const d = new Date(date.getTime());
    d.setSeconds(0, 0);
    return d;
  }

  static asEndOfSeconds(date: Date): Date {
    const d = new Date(date.getTime());
    d.setSeconds(59, 999);
    return d;
  }

  static asStartOfMillis(date: Date): Date {
    const d = new Date(date.getTime());
    d.setMilliseconds(0);
    return d;
  }

  static asEndOfMillis(date: Date): Date {
    const d = new Date(date.getTime());
    d.setMilliseconds(999);
    return d;
  }
  static asStartOfDay(date: Date): Date {
    const d = new Date(date.getTime());
    d.setHours(0, 0, 0, 0);
    return d;
  }

  static asEndOfDay(date: Date): Date {
    const d = new Date(date.getTime());
    d.setHours(23, 59, 59, 999);
    return d;
  }

  static isValidDate(dateString: string) {
    return !isNaN(Date.parse(dateString));
  }
}
