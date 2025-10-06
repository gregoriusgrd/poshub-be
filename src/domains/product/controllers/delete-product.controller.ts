import { Request, Response, NextFunction } from "express";
import { productIdSchema } from "../validations/product.validations";
import { deleteProductService } from "../services/delete.product.service";

export const deleteProductController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = productIdSchema.parse(req.params);
        const result = await deleteProductService(id);

        return res.json({
            success: true,
            message: result.message,
        });
    } catch (err) {
        next(err);
    }
}