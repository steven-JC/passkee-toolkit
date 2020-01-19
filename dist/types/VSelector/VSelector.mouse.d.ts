import { IOffset } from '../utils';
declare const _default: (that: any) => {};
export default _default;
export interface IMouseTrigger {
    (offset?: IOffset): Promise<any>;
    left(offset?: IOffset): Promise<any>;
    middle(offset?: IOffset): Promise<any>;
    right(offset?: IOffset): Promise<any>;
}
