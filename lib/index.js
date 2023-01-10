"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const node_path_1 = require("node:path");
const getPathEntryMap_1 = require("./utils/getPathEntryMap");
const getIndexFiles_1 = require("./utils/getIndexFiles");
const getCompoundDirectories_1 = require("./utils/getCompoundDirectories");
const getCollections_1 = require("./utils/getCollections");
function validate(dir) {
    return __asyncGenerator(this, arguments, function* validate_1() {
        const pathEntryMap = yield __await((0, getPathEntryMap_1.getPathEntryMap)(dir));
        const indexFiles = yield __await((0, getIndexFiles_1.getIndexFiles)(dir));
        const compoundDirectories = yield __await((0, getCompoundDirectories_1.getCompoundDirectories)(dir));
        const collections = yield __await((0, getCollections_1.getCollections)(dir));
        const indexFileDirectoryPaths = Object.keys(indexFiles).map(node_path_1.dirname);
        const getCompoundDirectoriesWithoutIndexFiles = () => {
            const result = compoundDirectories;
            for (const directory of indexFileDirectoryPaths) {
                delete result[directory];
            }
            return Object.values(result);
        };
        yield yield __await({
            title: 'Compound directories without index files',
            message: 'These compound directories are missing index files.',
            pathEntries: getCompoundDirectoriesWithoutIndexFiles()
        });
        const getCollectionsWithIndexFiles = () => {
            const result = {};
            for (const path of indexFileDirectoryPaths) {
                if (collections[path]) {
                    result[path] = collections[path];
                }
            }
            return Object.values(result);
        };
        yield yield __await({
            title: 'Collections with index files',
            message: 'These collections have unexpected index files.',
            pathEntries: getCollectionsWithIndexFiles()
        });
    });
}
function main() {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let failed;
        const indent = (message) => message.replace(new RegExp('^', 'g'), '  ');
        try {
            for (var _d = true, _e = __asyncValues(yield validate(process.argv[2])), _f; _f = yield _e.next(), _a = _f.done, !_a;) {
                _c = _f.value;
                _d = false;
                try {
                    const violation = _c;
                    if (!failed) {
                        failed = true;
                        console.log('');
                        console.log(chalk_1.default.red(chalk_1.default.inverse(' FAIL ')));
                    }
                    console.log('');
                    console.log(indent(chalk_1.default.bold(violation.title)));
                    console.log(indent(chalk_1.default.yellow(violation.message)));
                    console.log('');
                    violation.pathEntries.forEach(pathEntry => console.log(indent(pathEntry.path)));
                    console.log('');
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (failed) {
            process.exit(-1);
        }
    });
}
main();
