export interface UpdateProductDTO {
    name?: string;
    price?: number;
    stock?: number;
    categoryId?: number;
    isDeleted?: boolean;
    images?: string[];
}