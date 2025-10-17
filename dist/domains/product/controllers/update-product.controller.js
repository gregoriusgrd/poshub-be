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
exports.updateProductController = void 0;
const product_validations_1 = require("../validations/product.validations");
const update_product_service_1 = require("../services/update-product.service");
const updateProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = product_validations_1.productIdSchema.parse(req.params);
        const data = product_validations_1.updateProductSchema.parse(req.body);
        const file = req.file;
        const updatedProduct = yield (0, update_product_service_1.updateProductService)(id, data, file);
        return res.json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateProductController = updateProductController;
