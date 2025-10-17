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
exports.deleteCategoryController = void 0;
const category_validation_1 = require("../validations/category.validation");
const delete_category_service_1 = require("../services/delete-category.service");
// DELETE CATEGORY
const deleteCategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = category_validation_1.categoryIdSchema.parse(req.params);
        const result = yield (0, delete_category_service_1.deleteCategoryService)(id);
        return res.status(200).json({
            success: true,
            message: result.message,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteCategoryController = deleteCategoryController;
