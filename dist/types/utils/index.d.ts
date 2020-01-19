import ExpectError from './ExpectError';
import TimeoutError from './TimeoutError';
import SpinnerLog from './SpinnerLog';
export declare const compareConst: {
    UNDEFINED: string;
    NULL: string;
    EMPTY: string;
    NOT_EMPTY: string;
};
declare const utils: {
    log(text: any, options?: any): SpinnerLog;
    compareUrl: (urlOrPathOrHash: any, basetUrl: any, silent: any) => boolean;
    parseUrl(uri: any, contextUrl?: any): any;
    defineFreezedProps(context: any, obj: any): void;
    converToDomSelector(selectors: any): Promise<any>;
    converToString(selectors: any): Promise<any>;
    waitFor(fotIt: any, opts?: any, errorMsg?: any): Promise<unknown>;
    equat(value: any, target: any): boolean;
    TimeoutError: typeof TimeoutError;
    ExpectError: typeof ExpectError;
    assignSelectors(...args: any[]): any;
    apply(func: any, args: any, context: any): any;
};
export interface IPlainObject {
    [key: string]: any;
}
export interface IOffset {
    x?: number;
    y?: number;
}
export default utils;
