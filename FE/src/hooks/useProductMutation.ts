import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { IProduct } from "../interface/Products";
import { useNavigate } from "react-router-dom";
import {
  addProduct,
  deleteProduct,
  updateProduct,
} from "../services/products/product";
import { uploadImage } from "../services/upload/upload";

type useProductMutationProps = {
  action: "CREATE" | "UPDATE" | "DELETE";
  image?: File; // Specify the correct type for the image
};

export const useProductMutation = ({
  action,
  image,
}: useProductMutationProps) => {
  const queryClient = useQueryClient();
  const form = useForm<IProduct>();
  const navigate = useNavigate();

  const { mutate, ...rest } = useMutation({
    mutationFn: async (product: IProduct) => {
      switch (action) {
        case "CREATE":
          return await addProduct(product);
        case "DELETE":
          return (
            window.confirm("Are you sure you want to delete this product?") &&
            (await deleteProduct(product))
          );
        case "UPDATE":
          console.log(product);
          return await updateProduct(product);
        default:
          return null;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
      navigate("/admin/product");
    },
  });

  const onSubmit: SubmitHandler<IProduct> = async (product) => {
    console.log(product);
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "dmpti8a7u");

      try {
        const imageUrl = await uploadImage(formData);
        if (imageUrl) {
          mutate({ ...product, image: imageUrl });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      mutate(product);
    }
  };

  return { mutate, form, onSubmit, ...rest };
};
