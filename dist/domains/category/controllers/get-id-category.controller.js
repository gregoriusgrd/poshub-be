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
exports.getCategoryByIdController = void 0;
const category_validation_1 = require("../validations/category.validation");
const get_id_category_service_1 = require("../services/get-id-category.service");
// GET CATEGORY BY ID
const getCategoryByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = category_validation_1.categoryIdSchema.parse(req.params);
        const category = yield (0, get_id_category_service_1.getCategoryByIdService)(id);
        return res.status(200).json({
            success: true,
            message: "Category retrieved successfully",
            data: category,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getCategoryByIdController = getCategoryByIdController;
