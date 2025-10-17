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
exports.getAllCategoriesService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const pagination_util_1 = require("../../../core/utils/pagination.util");
const getAllCategoriesService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, limit, search, }) {
    const { skip, take, page: currentPage, limit: perPage } = (0, pagination_util_1.getPagination)({
        page,
        limit,
    });
    const where = Object.assign({}, (search && {
        name: {
            contains: search,
            mode: "insensitive",
        },
    }));
    const [data, total] = yield Promise.all([
        prisma_1.default.category.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: "desc" },
        }),
        prisma_1.default.category.count({ where }),
    ]);
    return {
        data,
        meta: {
            total,
            page: currentPage,
            limit: perPage,
            totalPages: Math.ceil(total / perPage),
        },
    };
});
exports.getAllCategoriesService = getAllCategoriesService;
