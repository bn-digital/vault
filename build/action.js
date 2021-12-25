"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@actions/core");
var path_1 = (0, tslib_1.__importDefault)(require("path"));
var index_1 = (0, tslib_1.__importDefault)(require("./index"));
var dotenv_1 = require("dotenv");
/**
 * Executes as Github Action entrypoint
 */
function run() {
    var _a;
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
        var workspaceDir, vaultEnv;
        return (0, tslib_1.__generator)(this, function (_b) {
            (0, dotenv_1.config)();
            workspaceDir = process.env.GITHUB_WORKSPACE;
            try {
                vaultEnv = new index_1.default((0, core_1.getInput)('endpoint'), {
                    provider: (0, core_1.getInput)('provider'),
                    token: (_a = (0, core_1.getInput)('token')) !== null && _a !== void 0 ? _a : process.env.GITHUB_TOKEN,
                });
                vaultEnv.populate(path_1.default.resolve(workspaceDir, (0, core_1.getInput)('template')), path_1.default.resolve(workspaceDir, (0, core_1.getInput)('target')));
            }
            catch (error) {
                (0, core_1.setFailed)(error.message);
            }
            return [2 /*return*/];
        });
    });
}
run().catch(console.error);
