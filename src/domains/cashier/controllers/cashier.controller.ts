import { Request, Response, NextFunction } from "express";
import { CreateCashierDTO, UpdateCashierDTO } from "../dto/cashier.dto";
import {
  createCashierService,
  getAllCashiersService,
  getCashierByIdService,
  updateCashierService,
  deleteCashierService,
} from "../services/cashier.service";
import { createCashierSchema, updateCashierSchema } from "../validations/cashier.validation";
import { logger } from "../../../config/logger";

// CREATE Cashier
export const createCashierController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto: CreateCashierDTO = createCashierSchema.parse(req.body);
    const cashier = await createCashierService(dto);

    return res.json({
      success: true,
      message: "Cashier created successfully",
      data: cashier,
    });
  } catch (err) {
    next(err);
  }
};

// GET all Cashiers
export const getAllCashiersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info("Fetching all cashiers with query params", req.query);
    const result = await getAllCashiersService(req.query);
    logger.info(`Retrieved ${result.items.length} cashiers`);

    return res.json({
      success: true,
      message: "Cashiers retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// GET Cashier by ID
export const getCashierByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info(`Fetching cashier with ID: ${req.params.id}`);
    const id = Number(req.params.id);
    const cashier = await getCashierByIdService(id);
    logger.info(`Cashier with ID: ${id} retrieved successfully`);

    return res.json({
      success: true,
      message: "Cashier retrieved successfully",
      data: cashier,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE Cashier
export const updateCashierController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const dto: UpdateCashierDTO = updateCashierSchema.parse(req.body);
    const updatedCashier = await updateCashierService(id, dto);

    logger.info(`Cashier with ID: ${id} updated successfully`);
    
    return res.json({
      success: true,
      message: "Cashier updated successfully",
      data: updatedCashier,
    });
  } catch (err) {
    next(err);
  }
};

// SOFT DELETE Cashier
export const deleteCashierController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const deletedCashier = await deleteCashierService(id);
    
    return res.json({
      success: true,
      message: "Cashier deleted successfully",
      data: deletedCashier,
    });
  } catch (err) {
    next(err);
  }
};
