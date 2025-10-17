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
exports.createCategoryController = void 0;
const category_validation_1 = require("../validations/category.validation");
const create_category_service_1 = require("../services/create-category.service");
// CREATE CATEGORY
const createCategoryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = category_validation_1.createCategorySchema.parse(req.body);
        const newCategory = yield (0, create_category_service_1.createCategoryService)(data);
        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: newCategory,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createCategoryController = createCategoryController;
