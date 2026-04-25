export interface Result<T> {
    data: T | null;
    ok: boolean;
    msg?: string;
}
export declare function tryReadJSON<T>(filePath: string): Promise<Result<T>>;
export declare function tryWriteJSON(filePath: string, data: any): Promise<Error | void>;
export declare function tryWriteImg(filePath: string, data: Buffer): Promise<Error | void>;
//# sourceMappingURL=flowLocal.d.ts.map