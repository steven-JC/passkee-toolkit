declare const _default: {
    title: (title: any, options?: WaitForOptions | undefined) => Promise<void>;
    target: (targetUrlSubstr: any, options?: WaitForOptions | undefined) => Promise<void>;
    location: (urlOrPathOrHash: any, options?: WaitForOptions | undefined) => Promise<void>;
    request: (urlOrPath: any, postData?: any, options?: TimeoutOption | undefined) => Promise<void>;
    response: (urlOrPath: any, options?: TimeoutOption | undefined) => Promise<void>;
    fn: (cb: any, options?: WaitForOptions | undefined) => Promise<void>;
};
export default _default;
export interface WaitForOptions {
    timeout?: number;
    delay?: number;
}
export interface TimeoutOption {
    timeout: number;
}
