import { Request, Response, NextFunction } from "express";
import { CreateCashierDTO } from "../dto/create-cashier.dto";
import { UpdateCashierDTO } from "../dto/update-cashier.dto";
import {
  createCashierService,
  getAllCashiersService,
  getCashierByIdService,
  updateCashierService,
  deleteCashierService,
} from "../services/cashier.service";

// CREATE Cashier

export const createCashierController = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const dto: CreateCashierDTO = req.body;
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

// GET all Cashier

export const getAllCashiersController = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const cashiers = await getAllCashiersService();
    return res.json({
      success: true,
      message: "Cashiers retrieved successfully",
      data: cashiers,
    });
  } catch (err) {
    next(err);
  }
};

// GET Cashier by ID

export const getCashierByIdController = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const cashier = await getCashierByIdService(id);
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

export const updateCashierController = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const dto: UpdateCashierDTO = req.body;
    const updatedCashier = await updateCashierService(id, dto);
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

export const deleteCashierController = async ( req: Request, res: Response, next: NextFunction) => {
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
