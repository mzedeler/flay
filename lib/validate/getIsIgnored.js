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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIsIgnored = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const getPathEntryMap_1 = require("./getPathEntryMap");
const getIsIgnored = (dir) => __awaiter(void 0, void 0, void 0, function* () {
    const pathEntryMap = yield (0, getPathEntryMap_1.getPathEntryMap)(dir);
    const ignoreFiles = Object
        .values(pathEntryMap)
        .filter(({ dirent: { name } }) => name === '.flayignore')
        .map(({ path }) => path);
    const ignorePatterns = [];
    for (const ignoreFile of ignoreFiles) {
        const entries = (yield (0, promises_1.readFile)(ignoreFile))
            .toString('utf-8')
            .split(/[\r\n]+/)
            .map(s => s.trim())
            .filter(s => s.length)
            .map(pattern => (0, node_path_1.join)(dir, pattern));
        ignorePatterns.push(...entries);
    }
    return (path) => ignorePatterns.some(pattern => path === pattern);
});
exports.getIsIgnored = getIsIgnored;
