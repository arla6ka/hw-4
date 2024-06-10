import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.escuelajs.co/api/v1',
});

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
}

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  categoryId: number;
  images: string[];
}

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await axiosInstance.get('/products');
  return response.data;
};

export const createProduct = async (productData: CreateProductData): Promise<Product> => {
  const response = await axiosInstance.post('/products', productData);
  return response.data;
};
