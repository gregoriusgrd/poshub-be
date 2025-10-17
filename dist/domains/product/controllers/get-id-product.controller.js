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
exports.getProductByIdController = void 0;
const product_validations_1 = require("../validations/product.validations");
const get_id_product_service_1 = require("../services/get-id-product.service");
const getProductByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // validasi & parsing id
        const { id } = product_validations_1.productIdSchema.parse(req.params);
        // ambil data product dari service
        const product = yield (0, get_id_product_service_1.getProductByIdService)(id);
        return res.json({
            success: true,
            message: "Product retrieved successfully",
            data: product,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getProductByIdController = getProductByIdController;
