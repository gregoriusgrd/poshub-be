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
exports.createProductController = void 0;
const product_validations_1 = require("../validations/product.validations");
const http_error_1 = require("../../../core/errors/http-error");
const error_codes_1 = require("../../../core/errors/error-codes");
const create_product_service_1 = require("../services/create-product.service");
const createProductController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = product_validations_1.createProductSchema.parse(req.body);
        const file = req.file;
        if (!file) {
            throw (0, http_error_1.badRequest)("Product image is required", error_codes_1.EC.BAD_REQUEST);
        }
        const newProduct = yield (0, create_product_service_1.createProductService)(data, file);
        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: newProduct,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createProductController = createProductController;
