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
exports.getProductSalesService = void 0;
const prisma_1 = __importDefault(require("../../../../config/prisma"));
const pagination_util_1 = require("../../../../core/utils/pagination.util");
/**
 * Menampilkan total penjualan produk per hari dalam periode tertentu
 */
const getProductSalesService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { start, end, categoryId, paymentMethod, search, sortBy = "totalRevenue", order = "desc" } = query;
    // Date range filter (optional)
    const dateFilter = {};
    if (start || end) {
        dateFilter.transactionTime = {};
        if (start)
            dateFilter.transactionTime.gte = new Date(start);
        if (end)
            dateFilter.transactionTime.lte = new Date(end);
    }
    // Pagination setup
    const { page, limit, skip, take } = (0, pagination_util_1.getPagination)({
        page: Number(query.page),
        limit: Number(query.limit),
    });
    // Transaction filters
    const whereClause = Object.assign({}, dateFilter);
    if (paymentMethod)
        whereClause.paymentMethod = paymentMethod;
    // Ambil transaksi lengkap dengan items dan product
    const transactions = yield prisma_1.default.transaction.findMany({
        where: whereClause,
        include: {
            transactionItems: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            categoryId: true,
                            category: { select: { name: true } },
                        },
                    },
                },
            },
        },
    });
    // Group by product
    const productMap = {};
    for (const trx of transactions) {
        for (const item of trx.transactionItems) {
            const product = item.product;
            if (!productMap[product.id]) {
                productMap[product.id] = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    categoryId: product.categoryId,
                    category: (_a = product.category) === null || _a === void 0 ? void 0 : _a.name,
                    totalSold: 0,
                    totalRevenue: 0,
                };
            }
            productMap[product.id].totalSold += item.quantity;
            productMap[product.id].totalRevenue += Number(item.subtotal);
        }
    }
    // convert to array
    let report = Object.values(productMap);
    // Filter kategori & search
    if (categoryId) {
        report = report.filter((p) => p.categoryId === Number(categoryId));
    }
    if (search) {
        const lowerSearch = search.toLowerCase();
        report = report.filter((p) => p.name.toLowerCase().includes(lowerSearch));
    }
    const sortField = sortBy || "totalRevenue";
    const sortOrder = order === "asc" ? "asc" : "desc";
    const sorted = report.sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (valA === valB)
            return 0;
        return sortOrder === "asc" ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
    });
    // Pagination hasil akhir
    const paginated = sorted.slice(skip, skip + take);
    return {
        data: paginated,
        meta: {
            page,
            limit,
            totalItems: sorted.length,
            totalPages: Math.ceil(sorted.length / limit),
        },
    };
});
exports.getProductSalesService = getProductSalesService;
