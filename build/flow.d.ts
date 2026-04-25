export declare const _brand: unique symbol;
export type Unique<T, B> = T & {
    readonly [_brand]: B;
};
export type Id<B> = Unique<number, B>;
export type UnixTimestamp = Unique<number, 'unix_timestamp'>;
export type ISO8601TimeString = Unique<string, 'ISO8601_timestamp'>;
export declare const RESPONSE_CODES: Record<number, string>;
export declare function getLocalOrSet<T>(key: string, defaultValue: T): T;
export declare function tryGetLocal<T>(key: string): T | null;
export declare function setLocal<T>(key: string, value: T): void;
export interface Result<T> {
    data: T | null;
    ok: boolean;
    msg?: string;
}
export declare function tryGetJson<T>(url: URL, requestInit?: RequestInit): Promise<Result<T>>;
export declare function tryGetImg(url: URL, logName?: string): Promise<Result<ArrayBuffer>>;
export declare function getResponseMsg(request: URL, responseCode: number): string;
interface NamedElement {
    node: Element;
    name: string;
}
export declare function tryGetElement<T extends Element>(selector: string, root?: NamedElement): T;
export declare function tryGetElements(selector: string, root?: NamedElement): NodeListOf<Element>;
export declare function assert<T>(object: T, objectName: string, partialErrorMsg: string): NonNullable<T>;
export {};
//# sourceMappingURL=flow.d.ts.map