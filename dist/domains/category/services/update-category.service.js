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
exports.updateCategoryService = void 0;
const category_repository_1 = require("../repositories/category.repository");
const http_error_1 = require("../../../core/errors/http-error");
const updateCategoryService = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield (0, category_repository_1.getCategoryById)(id);
    if (!existing)
        throw (0, http_error_1.notFound)("Category not found");
    if (data.name && data.name !== existing.name) {
        const duplicate = yield (0, category_repository_1.getCategoryByName)(data.name);
        if (duplicate)
            throw (0, http_error_1.badRequest)("Category name already exists");
    }
    const updated = yield (0, category_repository_1.updateCategory)(id, data);
    return updated;
});
exports.updateCategoryService = updateCategoryService;
