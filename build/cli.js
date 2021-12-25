"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var commander_1 = require("commander");
var index_1 = (0, tslib_1.__importDefault)(require("./index"));
var dotenv_1 = require("dotenv");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
(0, dotenv_1.config)();
var program = new commander_1.Command();
program
    .requiredOption('-e, --endpoint [endpoint]', 'Vault endpoint, e.g. https://vault.your-company.com. Default is $VAULT_ENDPOINT env variable', process.env.VAULT_ENDPOINT)
    .requiredOption('-t, --token [token]', 'Authentication token used by Vault to auth with specified provider. Default is $GITHUB_TOKEN env variable', process.env.GITHUB_TOKEN)
    .option('-p, --provider [provider]', 'Authentication provider (currently supported: github)', 'github')
    .option('-d, --dist [dist]', 'Dotenv template file in project root to read key=value pairs from', path_1.default.join(process.cwd(), ".env.".concat((_a = process.env.APP_ENV) !== null && _a !== void 0 ? _a : 'dist')))
    .option('-f, --file [file]', 'Dotenv file in project root to write into', path_1.default.join(process.cwd(), '.env'))
    .parse(process.argv);
program.parse();
var _b = program.opts(), endpoint = _b.endpoint, token = _b.token, provider = _b.provider, file = _b.file, dist = _b.dist;
new index_1.default(endpoint, { token: token, provider: provider }).populate(dist, file);
