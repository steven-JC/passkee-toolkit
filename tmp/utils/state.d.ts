import { Page, Browser } from 'puppeteer';
import Eventemitter3 from 'eventemitter3';
declare const _default: {
    lastMousePosition: {
        x: number;
        y: number;
    };
    currentPag: Page;
    currentBrows: Browser;
    currentPage: Page;
    currentBrowser: Browser;
    eventNames(): (string | symbol)[];
    listeners<T extends string | symbol>(event: T): Eventemitter3.ListenerFn<any[]>[];
    listenerCount(event: string | symbol): number;
    emit<T_1 extends string | symbol>(event: T_1, ...args: any[]): boolean;
    on<T_2 extends string | symbol>(event: T_2, fn: Eventemitter3.ListenerFn<any[]>, context?: any): any;
    addListener<T_3 extends string | symbol>(event: T_3, fn: Eventemitter3.ListenerFn<any[]>, context?: any): any;
    once<T_4 extends string | symbol>(event: T_4, fn: Eventemitter3.ListenerFn<any[]>, context?: any): any;
    removeListener<T_5 extends string | symbol>(event: T_5, fn?: Eventemitter3.ListenerFn<any[]> | undefined, context?: any, once?: boolean | undefined): any;
    off<T_6 extends string | symbol>(event: T_6, fn?: Eventemitter3.ListenerFn<any[]> | undefined, context?: any, once?: boolean | undefined): any;
    removeAllListeners(event?: string | symbol | undefined): any;
};
export default _default;
