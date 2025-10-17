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
exports.deleteProductController = void 0;
const product_validations_1 = require("../validations/product.validations");
const delete_product_service_1 = require("../services/delete.product.service");
const deleteProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = product_validations_1.productIdSchema.parse(req.params);
        const result = yield (0, delete_product_service_1.deleteProductService)(id);
        return res.json({
            success: true,
            message: result.message,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteProductController = deleteProductController;
