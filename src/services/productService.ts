
import api from './api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  image: string;
  images?: string[];
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  specifications?: Record<string, any>;
}

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get('/productos');
    return response.data.productos;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/productos/${id}`);
    return response.data.producto;
  }
};
