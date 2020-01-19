import 'colors';
import { IConfigParams } from './utils/config';
import VSelector from './VSelector';
import { Page, Browser, NavigationOptions } from 'puppeteer';
declare function TestKit(selector: any): VSelector;
declare namespace TestKit {
    var constants: {
        UNDEFINED: string;
        NULL: string;
        EMPTY: string;
        NOT_EMPTY: string;
    };
    var setBrowser: (b: Browser) => Promise<void>;
    var setCurrentPage: (p: Page) => Promise<void>;
    var config: (cfg: IConfigParams) => void;
    var mock: (maps: {
        [path: string]: string;
    }, options?: {
        timeout?: number | undefined;
        headers?: {
            [key: string]: string;
        } | undefined;
    } | undefined) => Promise<void>;
    var reload: (opts?: NavigationOptions | undefined) => Promise<void>;
    var title: () => Promise<void>;
    var location: () => Promise<import("./lib/location").LocationObject>;
    var delay: (ms?: any) => Promise<void>;
    var waitFor: {
        title: (title: any, options?: import("./lib/waitFors").WaitForOptions | undefined) => Promise<void>;
        target: (targetUrlSubstr: any, options?: import("./lib/waitFors").WaitForOptions | undefined) => Promise<void>;
        location: (urlOrPathOrHash: any, options?: import("./lib/waitFors").WaitForOptions | undefined) => Promise<void>;
        request: (urlOrPath: any, postData?: any, options?: import("./lib/waitFors").TimeoutOption | undefined) => Promise<void>;
        response: (urlOrPath: any, options?: import("./lib/waitFors").TimeoutOption | undefined) => Promise<void>;
        fn: (cb: any, options?: import("./lib/waitFors").WaitForOptions | undefined) => Promise<void>;
    };
    var expect: {
        title: (title: any, silent?: any) => Promise<boolean>;
        target: (targetUrlSubstr: any, silent?: any) => Promise<boolean>;
        location: (urlOrPathOrHash: any, silent?: any) => Promise<boolean>;
    };
}
declare namespace TestKit {
    let browser: Browser;
    let page: Page;
}
export default TestKit;
