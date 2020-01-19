export declare const noParamProps: string[];
export declare const oneParamProps: string[];
export declare const selectors: string[];
declare const _default: {
    noParamProps: string[];
    oneParamProps: string[];
    selectors: string[];
};
export default _default;
export interface IVSelectorProto {
    text(): Promise<string>;
    html(): Promise<string>;
    height(): Promise<number>;
    width(): Promise<number>;
    val(): Promise<string>;
    index(): Promise<number>;
    offset(): Promise<{
        top: number;
        left: number;
        width: number;
        heigh: number;
    }>;
    /**
     * 返回基于非static父节点定位
     */
    offsetParent(): Promise<{
        top: number;
        left: number;
        width: number;
        heigh: number;
    }>;
    scrollTop(): Promise<number>;
    css(name: string): Promise<string>;
    attr(attrname: string): Promise<any>;
    prop(name: string): Promise<any>;
    data(name: string): Promise<any>;
    hasClass(name: string): Promise<boolean>;
}
export interface IVSelectorExpect {
    text(value: string | symbol): Promise<void>;
    html(value: string | symbol): Promise<void>;
    height(value: string | symbol): Promise<void>;
    width(value: number | symbol): Promise<void>;
    val(value: string | symbol): Promise<void>;
    index(value: number | symbol): Promise<void>;
    scrollTop(value: number | symbol): Promise<void>;
    visible(value: boolean): Promise<void>;
    length(value: number): Promise<void>;
    css(name: string | symbol, value: string): Promise<void>;
    attr(name: string | symbol, value: string): Promise<void>;
    prop(name: string | symbol, value: string): Promise<void>;
    data(name: string | symbol, value: string): Promise<void>;
    hasClass(name: string | symbol, value: boolean): Promise<void>;
}
export interface IVSelectorWaitFor {
    text(value: string | symbol, options?: WaitForOptions): Promise<void>;
    html(value: string | symbol, options?: WaitForOptions): Promise<void>;
    height(value: string | symbol, options?: WaitForOptions): Promise<void>;
    width(value: number | symbol, options?: WaitForOptions): Promise<void>;
    val(value: string | symbol, options?: WaitForOptions): Promise<void>;
    index(value: number | symbol, options?: WaitForOptions): Promise<void>;
    scrollTop(value: number | symbol, options?: WaitForOptions): Promise<void>;
    visible(value: boolean, options?: WaitForOptions): Promise<void>;
    length(value: number, options?: WaitForOptions): Promise<void>;
    css(name: string | symbol, value: string, options?: WaitForOptions): Promise<void>;
    attr(name: string | symbol, value: string, options?: WaitForOptions): Promise<void>;
    prop(name: string | symbol, value: string, options?: WaitForOptions): Promise<void>;
    data(name: string | symbol, value: string, options?: WaitForOptions): Promise<void>;
    hasClass(name: string, value: boolean): Promise<void>;
}
export interface WaitForOptions {
    timeout?: number;
    delay?: number;
}
