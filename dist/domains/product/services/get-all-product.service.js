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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProductsService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const pagination_util_1 = require("../../../core/utils/pagination.util");
const client_1 = require("@prisma/client");
// GET ALL PRODUCTS (with pagination, search, filter, sort)
const getAllProductsService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, take, page, limit } = (0, pagination_util_1.getPagination)(query);
    const { search, categoryId, sortBy = "createdAt", order = "desc" } = query;
    // Build filter "where"
    const where = Object.assign(Object.assign({ isDeleted: false }, (search
        ? {
            name: {
                contains: search,
                mode: client_1.Prisma.QueryMode.insensitive,
            },
        }
        : {})), (categoryId ? { categoryId } : {}));
    // Fetch products + count in parallel
    const [data, total] = yield Promise.all([
        prisma_1.default.product.findMany({
            where,
            include: { category: true },
            skip,
            take,
            orderBy: { [sortBy]: order },
        }),
        prisma_1.default.product.count({ where }),
    ]);
    // Return result with pagination metadata
    return {
        data,
        meta: {
            total,
            page,
            totalPages: Math.ceil(total / limit),
            limit,
        },
    };
});
exports.getAllProductsService = getAllProductsService;
