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
exports.getIgnoreList = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const getIgnoreList = (dir) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, promises_1.readFile)((0, node_path_1.join)(dir, '.flayignore'));
        return [];
    }
    catch (e) {
        return [];
    }
});
exports.getIgnoreList = getIgnoreList;
