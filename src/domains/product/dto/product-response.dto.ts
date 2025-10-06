import { Category } from "@prisma/client";

// belum dipake

export interface ProductImageResponseDTO {
  id: number;
  url: string;
  productId: number;
}

export interface ProductResponseDTO {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: Category;
  categoryId: number;
  images: ProductImageResponseDTO[];
  createdAt: Date;
  updatedAt: Date;
}
