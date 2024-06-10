"use client";

import { useQuery } from 'react-query';
import axios from 'axios';
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

const fetchProductsFromFakeStoreApi = async (): Promise<Product[]> => {
  const response = await axios.get('https://fakestoreapi.com/products');
  return response.data;
};

const HomePage = () => {
  const { data, error, isLoading } = useQuery<Product[]>('products', fetchProductsFromFakeStoreApi);

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>An error occurred: {error.message}</div>;

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Product List</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data?.map((product: Product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
              <div className="flex-grow">
                <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="object-contain h-full"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p className="text-gray-500 text-sm">{product.description}</p>
                <p className="text-gray-900 font-semibold">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePage;
