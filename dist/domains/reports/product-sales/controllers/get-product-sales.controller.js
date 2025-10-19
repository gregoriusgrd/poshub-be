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
exports.getProductSalesController = void 0;
const get_product_sales_service_1 = require("../services/get-product-sales.service");
const getProductSalesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, get_product_sales_service_1.getProductSalesService)(req.query);
        return res.status(200).json(Object.assign({ success: true, message: "Product sales report fetched successfully" }, result));
    }
    catch (err) {
        next(err);
    }
});
exports.getProductSalesController = getProductSalesController;
