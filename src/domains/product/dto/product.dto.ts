export interface CreateProductDTO {
    name: string;
    price: number;
    stock: number;
    categoryId: number;
    imageUrl?: string;
}

export interface UpdateProductDTO {
    name?: string;
    price?: number;
    stock?: number;
    categoryId?: number;
    imageUrl?: string;
    isDeleted?: boolean;
}