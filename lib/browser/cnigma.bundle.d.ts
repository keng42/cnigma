declare module "buffer" {
    export function stringToArrayBuffer(str: string): ArrayBufferLike;
    export function arrayBufferToString(buffer: number[]): string;
    export function arrayBufferToHex(buffer: Uint8Array): string;
    export function hexToArrayBuffer(hex: string): ArrayBufferLike;
    export function base64ToArrayBuffer(base64: string): ArrayBufferLike;
    export function arrayBufferToBase64(buffer: Uint8Array): string;
    export function concatArrayBuffer<T extends Uint8Array>(c: {
        new (len: number): T;
    }, ...arrays: T[]): T;
}
declare module "conceal" {
    export class Conceal {
        password: string;
        key: ArrayBuffer;
        encoding: 'base64' | 'hex';
        algo: 'aes-256-gcm' | 'aes-128-gcm';
        isBase64: boolean;
        versionBuf: Uint8Array;
        constructor(password: string, encoding?: 'base64' | 'hex', keyStr?: string, algo?: 'aes-256-gcm' | 'aes-128-gcm');
        randomBytes(len?: number, isBase64?: boolean): string;
        encryptStr(text: string, password?: string): Promise<string>;
        decryptStr(encrypted: string, password?: string): Promise<string>;
    }
}
declare module "rsa" {
    export class Rsa {
        privateKeyBuf: ArrayBufferLike;
        publicKeyBuf: ArrayBufferLike;
        encoding: 'hex' | 'base64';
        algo: string;
        constructor(privateKey: string, publicKey: string, encoding?: 'hex' | 'base64', algo?: 'RSA-SHA256' | 'RSA-SHA512');
        sign(plain: string, key?: ArrayBufferLike, encoding?: "base64" | "hex"): Promise<string>;
        verify(plain: string, sig: string, key?: ArrayBufferLike, encoding?: "base64" | "hex"): Promise<boolean>;
        encrypt(plain: string, key?: ArrayBufferLike, encoding?: "base64" | "hex"): Promise<string>;
        decrypt(cipher: string, key?: ArrayBufferLike, encoding?: "base64" | "hex"): Promise<string>;
    }
}
declare module "cnigma" {
    export * from "conceal";
    export * from "rsa";
}
