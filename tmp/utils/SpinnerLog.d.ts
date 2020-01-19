export default class Log {
    protected hide: boolean;
    protected text: string;
    protected spinner: any;
    constructor(text: any, hide: any);
    succeed(text?: string): void;
    fail(e?: any): void;
    warn(text?: string): void;
    info(text?: string): void;
}
