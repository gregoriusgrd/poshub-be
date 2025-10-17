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
exports.deleteCashierController = exports.updateCashierController = exports.getCashierByIdController = exports.getAllCashiersController = exports.createCashierController = void 0;
const cashier_service_1 = require("../services/cashier.service");
const cashier_validation_1 = require("../validations/cashier.validation");
const logger_1 = require("../../../config/logger");
// CREATE Cashier
const createCashierController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dto = cashier_validation_1.createCashierSchema.parse(req.body);
        const cashier = yield (0, cashier_service_1.createCashierService)(dto);
        return res.json({
            success: true,
            message: "Cashier created successfully",
            data: cashier,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createCashierController = createCashierController;
// GET all Cashiers
const getAllCashiersController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info("Fetching all cashiers with query params", req.query);
        const result = yield (0, cashier_service_1.getAllCashiersService)(req.query);
        logger_1.logger.info(`Retrieved ${result.items.length} cashiers`);
        return res.json({
            success: true,
            message: "Cashiers retrieved successfully",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllCashiersController = getAllCashiersController;
// GET Cashier by ID
const getCashierByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info(`Fetching cashier with ID: ${req.params.id}`);
        const id = Number(req.params.id);
        const cashier = yield (0, cashier_service_1.getCashierByIdService)(id);
        logger_1.logger.info(`Cashier with ID: ${id} retrieved successfully`);
        return res.json({
            success: true,
            message: "Cashier retrieved successfully",
            data: cashier,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getCashierByIdController = getCashierByIdController;
// UPDATE Cashier
const updateCashierController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const dto = cashier_validation_1.updateCashierSchema.parse(req.body);
        const updatedCashier = yield (0, cashier_service_1.updateCashierService)(id, dto);
        logger_1.logger.info(`Cashier with ID: ${id} updated successfully`);
        return res.json({
            success: true,
            message: "Cashier updated successfully",
            data: updatedCashier,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.updateCashierController = updateCashierController;
// SOFT DELETE Cashier
const deleteCashierController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const deletedCashier = yield (0, cashier_service_1.deleteCashierService)(id);
        return res.json({
            success: true,
            message: "Cashier deleted successfully",
            data: deletedCashier,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteCashierController = deleteCashierController;
