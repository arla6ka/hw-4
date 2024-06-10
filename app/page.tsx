"use client";

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchProducts, deleteProduct, Product } from './services/productsService';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const HomePage = () => {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery<Product[]>('products', fetchProducts);

  const deleteMutation = useMutation(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <div>An error occurred: {error.message}</div>;


  const sortedData = data?.sort((a, b) => b.id - a.id);

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {sortedData?.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="w-full h-150 flex items-center justify-center overflow-hidden bg-gray-100">
                {product.images && product.images.length > 0 && (
                  <Carousel showThumbs={false} dynamicHeight={true}>
                    {product.images.map((image, index) => (
                      <div key={index} className="h-full flex items-center justify-center">
                        <img
                          src={image.replace(/["\[\]]/g, '')}
                          alt={product.title}
                          className="object-cover h-full w-full"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      </div>
                    ))}
                  </Carousel>
                )}
              </div>
              <div className="p-8">
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p className="text-gray-500 text-sm">{product.description}</p>
                <p className="text-gray-900 font-semibold">${product.price}</p>
                <button
                  onClick={() => deleteMutation.mutate(product.id)}
                  className="mt-2 p-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePage;
