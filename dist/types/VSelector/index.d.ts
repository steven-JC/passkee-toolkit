import { IOffset } from '../utils';
import { IMouseTrigger } from './VSelector.mouse';
import { IVSelectorExpect, IVSelectorWaitFor, IVSelectorProto } from './const';
declare class VSelector {
    selectors: any;
    domSelector: string;
    expect: IVSelectorExpect;
    waitFor: IVSelectorWaitFor;
    click: IMouseTrigger;
    mousedown: IMouseTrigger;
    mouseup: IMouseTrigger;
    mousemove: (offset?: IOffset) => Promise<void>;
    constructor(selector: any);
    length(silent?: any): Promise<any>;
    visible(silent?: any): Promise<any>;
    blur(offsetY?: any): Promise<void>;
    focus(): Promise<void>;
    input(content: any, autoBlur?: any): Promise<void>;
    type(content: any, autoBlur?: boolean): Promise<void>;
    hover(): Promise<void>;
    scroll(x: number, y: number): Promise<void>;
    upload(filePaths: any): Promise<void>;
    screenshot(name: any): Promise<void>;
}
interface VSelector extends IVSelectorProto {
    filter(selector?: string): VSelector;
    parents(selector?: string): VSelector;
    parent(selector?: string): VSelector;
    children(selector?: string): VSelector;
    find(selector: string): VSelector;
    eq(index: number): VSelector;
}
export default VSelector;
