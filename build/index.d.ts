import { OptionValues } from 'commander';
export declare type AuthProviders = 'github';
export declare type CommandLineArgs = OptionValues & {
    endpoint?: string;
    token?: string;
    dist?: string;
    file?: string;
    auth?: AuthProviders;
};
export default class VaultEnv {
    private readonly vault;
    private readonly client;
    /**
     * @param endpoint
     * @param auth
     */
    constructor(endpoint: string, auth: {
        provider: string;
        token: string;
    });
    /**
     * Writes fetched secret values to file, using template file with env variable keys and secret paths as values
     * @param from
     * @param to
     */
    populate(from: string, to: string): void;
    /**
     * Reads secret by provided complete path to secret, including name, e.g. staging/database/username, where "staging" is key-value path
     * @param path
     */
    private readSecret;
}
