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
exports.getAllProductsController = void 0;
const get_all_product_service_1 = require("../services/get-all-product.service");
const getAllProductsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
        const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
        const sortBy = req.query.sortBy === "price" || req.query.sortBy === "createdAt"
            ? req.query.sortBy
            : "createdAt";
        const order = req.query.sortOrder === "asc" || req.query.sortOrder === "desc"
            ? req.query.sortOrder
            : req.query.order === "asc" || req.query.order === "desc"
                ? req.query.order
                : "asc";
        const products = yield (0, get_all_product_service_1.getAllProductsService)({ page, limit, search, categoryId, sortBy, order });
        return res.status(200).json(Object.assign({ success: true, message: "Products retrieved successfully" }, products));
    }
    catch (err) {
        next(err);
    }
});
exports.getAllProductsController = getAllProductsController;
