declare const _default: {
    debugMode: boolean;
    screenshotFolder: string;
    mockDataFolder: string;
    mockOptions: {
        timeout: number;
        headers: {
            [key: string]: string;
        };
    };
    setConfig(config: IConfigParams): void;
};
export default _default;
export interface IConfigParams {
    debugMode?: boolean;
    screenshotFolder?: string;
    mockDataFolder?: string;
    mockOptions?: {
        timeout: number;
        headers: {
            [key: string]: string;
        };
    };
}
