declare const _default: () => Promise<LocationObject>;
export default _default;
export interface LocationObject {
    protocol: string | null;
    host: string | null;
    port: number | null;
    hostname: string;
    hash: string | null;
    search: {
        [key: string]: string;
    };
    query: string | null;
    pathname: string | null;
    path: string | null;
    href: string | null;
    hashQuery: {
        [key: string]: string;
    };
}
