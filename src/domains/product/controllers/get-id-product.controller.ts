import { Request, Response, NextFunction } from "express";
import { productIdSchema } from "../validations/product.validations";
import { getProductByIdService } from "../services/get-id-product.service";

export const getProductByIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // validasi & parsing id
        const { id } = productIdSchema.parse(req.params);

        // ambil data product dari service
        const product = await getProductByIdService(id);

        return res.json({
            success: true,
            message: "Product retrieved successfully",
            data: product,
        })
    } catch (err) {
        next(err);
    }
}