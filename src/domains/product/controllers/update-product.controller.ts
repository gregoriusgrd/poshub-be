import { Request, Response, NextFunction } from "express";
import { productIdSchema, updateProductSchema } from "../validations/product.validations";
import { badRequest } from "../../../core/errors/http-error";
import { EC } from "../../../core/errors/error-codes";
import { updateProductService } from "../services/update-product.service";

export const updateProductController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = productIdSchema.parse(req.params);
        const data = updateProductSchema.parse(req.body);
        const files = req.files as Express.Multer.File[] | undefined;

        if (files && files.length > 5) {
            throw badRequest("Maximum 5 images allowed", EC.BAD_REQUEST);
        }

        const updatedProduct = await updateProductService(id, data, files);

        return res.json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        })
    } catch (err) {
        next(err);
    }
}