/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CartApi from "../config/cartApi";

export const useMyCartQuery = () => {
  const data = useQuery({
    queryKey: ["MY_CART"],
    queryFn: () => CartApi.getAllCart(),
  });

  return data;
};

interface IUseCartMutation {
  action: "ADD" | "DELETE" | "UPDATE";
  onSuccess?: () => void;
  onError?: (error?: any) => void;
}

const useCartMutation = ({ action, onSuccess, onError }: IUseCartMutation) => {
  const queryClient = useQueryClient();

  const data = useMutation({
    mutationFn: async (payload: any) => {
      switch (action) {
        case "ADD": {
          return await CartApi.addCart(payload);
        }
        case "DELETE": {
          return await CartApi.deleteProduct(payload);
        }
        case "UPDATE": {
          return await CartApi.updateQuantity(payload);
        }
        default:
          return null;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MY_CART"] });
      onSuccess && onSuccess();
    },
    onError: (error) => {
      onError && onError(error)
    }
  });

  return data;
};

export default useCartMutation;
