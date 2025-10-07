import { Request, Response, NextFunction } from "express";
import { productIdSchema, updateProductSchema } from "../validations/product.validations";
import { updateProductService } from "../services/update-product.service";

export const updateProductController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = productIdSchema.parse(req.params);
        const data = updateProductSchema.parse(req.body);
        const file = req.file as Express.Multer.File | undefined;

        const updatedProduct = await updateProductService(id, data, file);

        return res.json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        })
    } catch (err) {
        next(err);
    }
}