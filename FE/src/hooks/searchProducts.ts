// hooks/useSearchProducts.js
import { useState } from "react";
import axios from "axios";
import { IProduct } from "../interface/Products";

interface UseSearchProductsResult {
    searchProducts: (query: string) => void;
    searchResults: IProduct[];
    loading: boolean;
    error: string | null;
  }

  const useSearchProducts = (): UseSearchProductsResult => {
  const [searchResults, setSearchResults] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = async (query:string) => {
    try {
      setLoading(true);
      const response = await axios.get<{data:IProduct[]}>(`http://localhost:3001/api/products/search?query=${query}`);
      setSearchResults(response.data.data);
    } catch (error:any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { searchProducts, searchResults, loading, error };
};

export default useSearchProducts;
