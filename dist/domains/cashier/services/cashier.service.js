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
exports.deleteCashierService = exports.updateCashierService = exports.getCashierByIdService = exports.getAllCashiersService = exports.createCashierService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const cashier_repository_1 = require("../repositories/cashier.repository");
const http_error_1 = require("../../../core/errors/http-error");
const pagination_util_1 = require("../../../core/utils/pagination.util");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const http_error_2 = require("../../../core/errors/http-error");
const error_codes_1 = require("../../../core/errors/error-codes");
// CREATE cashier
const createCashierService = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(dto.password, 10);
    return yield (0, cashier_repository_1.createCashier)({
        username: dto.username,
        fullName: dto.fullName,
        password: hashedPassword,
    });
});
exports.createCashierService = createCashierService;
// GET all cashiers for the admin (with pagination)
const getAllCashiersService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { skip, limit, page } = (0, pagination_util_1.getPagination)(query, 10, 50);
    const search = ((_a = query.search) === null || _a === void 0 ? void 0 : _a.toString()) || undefined;
    const sortBy = (_b = query.sortBy) === null || _b === void 0 ? void 0 : _b.toString();
    const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
    // Hitung total items
    const totalItems = yield (0, cashier_repository_1.countCashiers)(search);
    // Ambil data dengan pagination
    const cashiers = yield (0, cashier_repository_1.getAllCashiers)({ skip, take: limit, search, sortBy, sortOrder });
    // Hitung total halaman
    const totalPages = Math.ceil(totalItems / limit);
    return {
        items: cashiers,
        meta: {
            totalItems,
            totalPages,
            currentPage: page,
            limit,
        },
    };
});
exports.getAllCashiersService = getAllCashiersService;
// GET cashier by ID
const getCashierByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const cashier = yield (0, cashier_repository_1.findCashierById)(id);
    if (!cashier || cashier.isDeleted)
        throw http_error_1.notFound;
    return cashier;
});
exports.getCashierByIdService = getCashierByIdService;
// UPDATE cashier by ID
const updateCashierService = (id, dto) => __awaiter(void 0, void 0, void 0, function* () {
    const cashier = yield (0, cashier_repository_1.findCashierById)(id);
    if (!cashier || cashier.isDeleted)
        throw http_error_1.notFound;
    const updateData = Object.assign({}, dto);
    if (dto.password) {
        updateData.password = yield bcrypt_1.default.hash(dto.password, 10);
    }
    return yield (0, cashier_repository_1.updateCashier)(id, updateData);
});
exports.updateCashierService = updateCashierService;
/**
 * Soft delete cashier
 * Tidak boleh dihapus jika masih terlibat di transaksi (record historical data)
 * Tidak boleh dihapus dua kali
 */
const deleteCashierService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Cari cashier
    const cashier = yield (0, cashier_repository_1.findCashierById)(id);
    if (!cashier || cashier.isDeleted) {
        throw (0, http_error_1.notFound)("Cashier not found", error_codes_1.EC.NOT_FOUND);
    }
    try {
        // Cek apakah cashier masih punya transaksi
        const hasTransactions = yield prisma_1.default.transaction.findFirst({
            where: { cashierId: id },
        });
        if (hasTransactions) {
            throw (0, http_error_2.badRequest)("Cannot delete this cashier because they are associated with existing transactions.", error_codes_1.EC.CASHIER_HAS_TRANSACTIONS);
        }
        // Soft delete cashier
        yield (0, cashier_repository_1.softDeleteCashier)(id);
        return { message: "Cashier soft deleted successfully" };
    }
    catch (err) {
        // fallback — tangani error Prisma atau runtime
        throw (0, http_error_2.internalError)("Failed to delete cashier", error_codes_1.EC.INTERNAL_SERVER_ERROR, err);
    }
});
exports.deleteCashierService = deleteCashierService;
