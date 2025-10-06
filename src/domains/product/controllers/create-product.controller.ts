import { Request, Response, NextFunction } from "express";
import { createProductSchema } from "../validations/product.validations";
import { badRequest } from "../../../core/errors/http-error";
import { EC } from "../../../core/errors/error-codes";
import { createProductService } from "../services/create-product.service";

export const createProductController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createProductSchema.parse(req.body);
    const files = req.files as Express.Multer.File[] | undefined;

    if (files && files.length > 5) {
        throw badRequest("Maximum 5 images allowed", EC.BAD_REQUEST);
    }

    const newProduct = await createProductService(data, files);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (err) {
    next(err);
  }
};