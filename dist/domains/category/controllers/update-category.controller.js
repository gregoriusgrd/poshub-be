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
exports.updateCategoryController = void 0;
const category_validation_1 = require("../validations/category.validation");
const update_category_service_1 = require("../services/update-category.service");
// UPDATE CATEGORY
const updateCategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = category_validation_1.categoryIdSchema.parse(req.params);
        const data = category_validation_1.updateCategorySchema.parse(req.body);
        const updatedCategory = yield (0, update_category_service_1.updateCategoryService)(id, data);
        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateCategoryController = updateCategoryController;
