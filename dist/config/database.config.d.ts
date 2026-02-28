declare const _default: (() => {
    uri: string;
    options: {
        maxPoolSize: number;
        serverSelectionTimeoutMS: number;
        socketTimeoutMS: number;
        bufferMaxEntries: number;
        retryWrites: boolean;
        w: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    uri: string;
    options: {
        maxPoolSize: number;
        serverSelectionTimeoutMS: number;
        socketTimeoutMS: number;
        bufferMaxEntries: number;
        retryWrites: boolean;
        w: string;
    };
}>;
export default _default;
