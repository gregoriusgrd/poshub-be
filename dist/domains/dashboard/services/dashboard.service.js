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
exports.getDashboardSummaryService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const date_fns_1 = require("date-fns");
/**
 * Dashboard Summary Service
 */
const getDashboardSummaryService = () => __awaiter(void 0, void 0, void 0, function* () {
    const todayStart = (0, date_fns_1.startOfDay)(new Date());
    const todayEnd = (0, date_fns_1.endOfDay)(new Date());
    const [totalSalesToday, totalTransactionsToday, activeCashiers, inconsistentShifts,] = yield Promise.all([
        prisma_1.default.transaction.aggregate({
            _sum: { totalAmount: true },
            where: { transactionTime: { gte: todayStart, lte: todayEnd } },
        }),
        prisma_1.default.transaction.count({
            where: { transactionTime: { gte: todayStart, lte: todayEnd } },
        }),
        prisma_1.default.shift.count({ where: { status: "OPEN" } }),
        prisma_1.default.shift.count({
            where: {
                cashDifference: { not: 0 },
                openedAt: { gte: todayStart, lte: todayEnd },
            },
        }),
    ]);
    // Daily Sales Trend (7 hari terakhir)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const dayStart = (0, date_fns_1.startOfDay)((0, date_fns_1.subDays)(new Date(), i));
        const dayEnd = (0, date_fns_1.endOfDay)((0, date_fns_1.subDays)(new Date(), i));
        const sum = yield prisma_1.default.transaction.aggregate({
            _sum: { totalAmount: true },
            where: { transactionTime: { gte: dayStart, lte: dayEnd } },
        });
        last7Days.push({
            date: dayStart.toISOString().split("T")[0],
            totalSales: Number(sum._sum.totalAmount || 0),
        });
    }
    // Top 5 Products Sold (7 hari terakhir)
    const topProducts = yield prisma_1.default.transactionItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        where: {
            transaction: {
                transactionTime: { gte: (0, date_fns_1.subDays)(todayStart, 7), lte: todayEnd },
            },
        },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
    });
    const productDetails = yield prisma_1.default.product.findMany({
        where: { id: { in: topProducts.map((p) => p.productId) } },
        select: { id: true, name: true },
    });
    const topProductsData = topProducts.map((p) => {
        var _a;
        return ({
            productId: p.productId,
            productName: ((_a = productDetails.find((d) => d.id === p.productId)) === null || _a === void 0 ? void 0 : _a.name) || "Unknown",
            totalSold: Number(p._sum.quantity || 0),
        });
    });
    return {
        totalSalesToday: Number(totalSalesToday._sum.totalAmount || 0),
        totalTransactionsToday,
        activeCashiers,
        inconsistentShifts,
        salesTrend: last7Days,
        topProducts: topProductsData,
    };
});
exports.getDashboardSummaryService = getDashboardSummaryService;
