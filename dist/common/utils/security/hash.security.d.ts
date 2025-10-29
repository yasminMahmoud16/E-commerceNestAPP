export declare const generateHash: (plainText: string, salt_round?: number) => Promise<string>;
export declare const compareHash: (plainText: string, hashValue: string) => Promise<boolean>;
