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
exports.softDeleteCashier = exports.updateCashier = exports.findCashierById = exports.countCashiers = exports.getAllCashiers = exports.createCashier = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
// Create a new cashier
const createCashier = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.create({
        data: {
            username: data.username,
            password: data.password,
            fullName: data.fullName,
            role: 'CASHIER',
        },
    });
});
exports.createCashier = createCashier;
// Get all cashiers
const getAllCashiers = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const where = {
        role: 'CASHIER',
        isDeleted: false,
    };
    if (options === null || options === void 0 ? void 0 : options.search) {
        where.OR = [
            { username: { contains: options.search, mode: 'insensitive' } },
            { fullName: { contains: options.search, mode: 'insensitive' } },
        ];
    }
    return yield prisma_1.default.user.findMany({
        where,
        orderBy: {
            [(options === null || options === void 0 ? void 0 : options.sortBy) || 'createdAt']: (options === null || options === void 0 ? void 0 : options.sortOrder) || 'desc',
        },
        skip: options === null || options === void 0 ? void 0 : options.skip,
        take: options === null || options === void 0 ? void 0 : options.take,
    });
});
exports.getAllCashiers = getAllCashiers;
// Count total cashiers (for pagination)
const countCashiers = (search) => __awaiter(void 0, void 0, void 0, function* () {
    const where = {
        role: "CASHIER",
        isDeleted: false,
    };
    if (search) {
        where.OR = [
            { username: { contains: search, mode: "insensitive" } },
            { fullName: { contains: search, mode: "insensitive" } },
        ];
    }
    return prisma_1.default.user.count({ where });
});
exports.countCashiers = countCashiers;
// Find a cashier by ID
const findCashierById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.findFirst({
        where: { id, role: 'CASHIER', isDeleted: false },
    });
});
exports.findCashierById = findCashierById;
// Update a cashier by ID
const updateCashier = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.update({
        where: { id },
        data,
    });
});
exports.updateCashier = updateCashier;
// Soft delete a cashier by ID
const softDeleteCashier = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.update({
        where: { id },
        data: { isDeleted: true },
    });
});
exports.softDeleteCashier = softDeleteCashier;
