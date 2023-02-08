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
exports.getIndexFiles = void 0;
const getPathEntryMap_1 = require("./getPathEntryMap");
const getIndexFiles = (dir) => __awaiter(void 0, void 0, void 0, function* () {
    const pathEntryMap = yield (0, getPathEntryMap_1.getPathEntryMap)(dir);
    const result = {};
    for (const [path, pathEntry] of Object.entries(pathEntryMap)) {
        if (pathEntry.dirent.isFile() && pathEntry.dirent.name.match(/^index.tsx?$/)) {
            result[pathEntry.path] = pathEntry;
        }
    }
    return result;
});
exports.getIndexFiles = getIndexFiles;
