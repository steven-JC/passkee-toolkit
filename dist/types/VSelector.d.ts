declare class VSelector {
    selectors: any;
    domSelector: string;
    expect: DomExpect;
    waitFor: DomWaitFor;
    click: IMouseTrigger;
    mousedown: IMouseTrigger;
    mouseup: IMouseTrigger;
    mousemove: (offset?: Offset) => Promise<void>;
    constructor(selector: any);
    length(silent: any): Promise<any>;
    visible(silent?: any): Promise<any>;
    blur(offsetY?: any): Promise<void>;
    focus(): Promise<void>;
    input(content: any, autoBlur?: any): Promise<void>;
    type(content: any, autoBlur?: boolean): Promise<void>;
    hover(): Promise<void>;
    upload(filePaths: any): Promise<void>;
    screenshot(name: any): Promise<void>;
}
interface VSelector {
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
    offsetParent(): Promise<{
        top: number;
        left: number;
        width: number;
        heigh: number;
    }>;
    position(): Promise<{
        top: number;
        left: number;
    }>;
    scrollTop(): Promise<number>;
    css(name: string): Promise<string>;
    attr(attrname: string): Promise<any>;
    prop(name: string): Promise<any>;
    data(name: string): Promise<any>;
    hasClass(name: string): Promise<boolean>;
    filter(selector?: string): VSelector;
    parents(selector?: string): VSelector;
    parent(selector?: string): VSelector;
    children(selector?: string): VSelector;
    find(selector: string): VSelector;
    eq(index: number): VSelector;
    first(): VSelector;
    last(): VSelector;
}
interface IMouseTrigger {
    (offset?: any): Promise<any>;
    left(offset?: any): Promise<any>;
    middle(offset?: any): Promise<any>;
    right(offset?: any): Promise<any>;
}
interface DomWaitFor {
    text(value: string | symbol, options?: WaitForOptions): Promise<void>;
    html(value: string | symbol, options?: WaitForOptions): Promise<void>;
    height(value: string | symbol, options?: WaitForOptions): Promise<void>;
    width(value: number | symbol, options?: WaitForOptions): Promise<void>;
    val(value: string | symbol, options?: WaitForOptions): Promise<void>;
    index(value: number | symbol, options?: WaitForOptions): Promise<void>;
    visible(value: boolean, options?: WaitForOptions): Promise<void>;
    length(value: number, options?: WaitForOptions): Promise<void>;
    scrollTop(value: number | symbol, options?: WaitForOptions): Promise<void>;
    css(name: string | symbol, value: string, options?: WaitForOptions): Promise<void>;
    attr(name: string | symbol, value: string, options?: WaitForOptions): Promise<void>;
    prop(name: string | symbol, value: string, options?: WaitForOptions): Promise<void>;
    data(name: string | symbol, value: string, options?: WaitForOptions): Promise<void>;
    hasClass(name: string, value: boolean): Promise<void>;
}
interface DomExpect {
    text(value: string | symbol): Promise<void>;
    html(value: string | symbol): Promise<void>;
    height(value: string | symbol): Promise<void>;
    width(value: number | symbol): Promise<void>;
    val(value: string | symbol): Promise<void>;
    index(value: number | symbol): Promise<void>;
    visible(value: boolean): Promise<void>;
    length(value: number): Promise<void>;
    scrollTop(value: number | symbol): Promise<void>;
    css(name: string | symbol, value: string): Promise<void>;
    attr(name: string | symbol, value: string): Promise<void>;
    prop(name: string | symbol, value: string): Promise<void>;
    data(name: string | symbol, value: string): Promise<void>;
    hasClass(name: string | symbol, value: boolean): Promise<void>;
}
export interface Offset {
    x?: number;
    y?: number;
}
export interface PlainObject {
    [key: string]: any;
}
export interface WaitForOptions {
    timeout?: number;
    delay?: number;
}
export interface MouseTrigger {
    (offset?: Offset): Promise<void>;
    left(offset?: Offset): Promise<void>;
    middle(offset?: Offset): Promise<void>;
    right(offset?: Offset): Promise<void>;
}
export default VSelector;
