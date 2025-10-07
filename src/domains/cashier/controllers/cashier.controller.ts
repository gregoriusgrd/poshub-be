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
export const createCashierController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto: CreateCashierDTO = req.body;
    const adminId = req.user!.userId; // pastikan auth middleware menambahkan req.user
    const cashier = await createCashierService(dto, adminId);
    return res.json({
      success: true,
      message: "Cashier created successfully",
      data: cashier,
    });
  } catch (err) {
    next(err);
  }
};

// GET all Cashiers for the admin
export const getAllCashiersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminId = req.user!.userId;
    const cashiers = await getAllCashiersService(adminId, req.query);
    return res.json({
      success: true,
      message: "Cashiers retrieved successfully",
      data: cashiers,
    });
  } catch (err) {
    next(err);
  }
};

// GET Cashier by ID (belongs to admin)
export const getCashierByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const adminId = req.user!.userId;
    const cashier = await getCashierByIdService(id, adminId);
    return res.json({
      success: true,
      message: "Cashier retrieved successfully",
      data: cashier,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE Cashier (belongs to admin)
export const updateCashierController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const dto: UpdateCashierDTO = req.body;
    const adminId = req.user!.userId;
    const updatedCashier = await updateCashierService(id, dto, adminId);
    return res.json({
      success: true,
      message: "Cashier updated successfully",
      data: updatedCashier,
    });
  } catch (err) {
    next(err);
  }
};

// SOFT DELETE Cashier (belongs to admin)
export const deleteCashierController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const adminId = req.user!.userId;
    const deletedCashier = await deleteCashierService(id, adminId);
    return res.json({
      success: true,
      message: "Cashier deleted successfully",
      data: deletedCashier,
    });
  } catch (err) {
    next(err);
  }
};
