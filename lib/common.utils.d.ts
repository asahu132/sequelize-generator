export declare class ObjectUtil {
    static isEmpty(obj: any): boolean;
    static getFirstValue(obj: any): any;
    static values(obj: any): any[];
}
export declare class UUIDHelper {
    /**Check if valid uuid*/
    static isValidUUID(uuid: string): RegExpMatchArray | null;
    static generateUUID(): string;
}
export declare class DateUtil {
    static MILLIS_IN_MINUTE: number;
    static MILLIS_IN_HOUR: number;
    static MILLIS_IN_DAY: number;
    static asStartOfSeconds(date: Date): Date;
    static asEndOfSeconds(date: Date): Date;
    static asStartOfMillis(date: Date): Date;
    static asEndOfMillis(date: Date): Date;
    static asStartOfDay(date: Date): Date;
    static asEndOfDay(date: Date): Date;
    static isValidDate(dateString: string): boolean;
}
