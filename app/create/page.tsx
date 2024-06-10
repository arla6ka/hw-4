"use client";

import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { createProduct } from '../services/productsService';

const CreateProductPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation(createProduct, {
    onSuccess: async () => {
      setIsLoading(false); 
      setIsSuccess(true);
      queryClient.invalidateQueries('products');
      setTimeout(() => {
        router.push('/');
      }, 2000); 
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      setErrorMessage('Failed to create product. Please try again.');
      setIsLoading(false); 
    },
  });

  const handleImageUpload = async (): Promise<string[]> => {
    if (!images) return [];
    const uploadPromises = Array.from(images).map(async (image) => {
      const formData = new FormData();
      formData.append('file', image);
      try {
        const response = await axios.post('https://api.escuelajs.co/api/v1/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data.location;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    });
    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      const imageUrls = await handleImageUpload();
      console.log('Image URLs:', imageUrls);
      mutation.mutate({ title, description, price: Number(price), categoryId: 1, images: imageUrls });
    } catch (error) {
      console.error('Error during submit:', error); 
      setErrorMessage('Failed to upload images. Please try again.');
      setIsLoading(false); 
    }
  };

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-2xl font-semibold mb-6">Create Product</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="file"
            multiple
            onChange={(e) => setImages(e.target.files)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </form>
        {isLoading && <p className="text-blue-500 mt-4">Uploading...</p>}
        {isSuccess && <p className="text-green-500 mt-4">Product created successfully!</p>}
        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
      </div>
    </section>
  );
};

export default CreateProductPage;
