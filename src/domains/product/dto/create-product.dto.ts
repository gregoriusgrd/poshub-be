export interface CreateProductDTO {
    name: string;
    price: number;
    stock: number;
    categoryId: number;
    images?: string[];
}