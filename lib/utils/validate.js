"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const node_path_1 = require("node:path");
const getCollections_1 = require("./getCollections");
const getCompoundDirectories_1 = require("./getCompoundDirectories");
const getIndexFiles_1 = require("./getIndexFiles");
function validate(dir) {
    return __asyncGenerator(this, arguments, function* validate_1() {
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
exports.validate = validate;
