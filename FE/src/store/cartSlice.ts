/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { ICartItem } from "../pages/client/Cart";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    productSelected: [],
    totalPrice: 0,
  },
  reducers: {
    updateProductSelected: (state, { payload }) => {
      state.productSelected = payload;
      state.totalPrice = (payload as ICartItem[]).reduce((res, curr) => {
        let price = curr.variant.price * curr.quantity;

        if (curr.option) {
          price += curr.quantity * curr.option.price;
        }

        return res += price;
      }, 0);
    },

    resetProductSelected: (state) => {
      state.productSelected = [];
      state.totalPrice = 0;
    },

    removeProduct: (state, { payload }) => {
      const newProducts = state.productSelected.filter(
        (it: ICartItem) => it.product._id !== payload
      );
      state.productSelected = newProducts;

      state.totalPrice = (newProducts as ICartItem[]).reduce((res, curr) => {
        let price = curr.variant.price * curr.quantity;

        if (curr.option) {
          price += curr.quantity * curr.option.price;
        }

        return res += price;
      }, 0);
    },

    updateStatus: (state, { payload }) => {
      state.productSelected = payload.prevData.map((it: any) => {
        if (it?.variant) {
          const findOption = payload.newData.find((x: any) => x?.variant?._id === it.variant._id);

          return {
            ...it, 
            variant: {
              ...it.variant,
              status: findOption?.variant?.status
            }
          }
        }

        return it;
      }) as any;
    },

    unCheckProduct: (state, { payload }) => {
      if (payload) {
        const curentProductSelectedIds = state.productSelected.map((it: any) => it._id);
        const newProducts = payload.products.filter((it: any) => curentProductSelectedIds.includes(it._id)).filter((it: any) => {
          if (it.option) {
            return it.option.status && it.variant.status && it.option.quantity > 0 && it.variant.quantity > 0;
          };

          return it.variant.status && it.variant.quantity > 0;
        });
        state.productSelected = newProducts;

        state.totalPrice = (newProducts as ICartItem[]).reduce((res, curr) => {
          let price = curr.variant.price * curr.quantity;
  
          if (curr.option) {
            price += curr.quantity * curr.option.price;
          }
  
          return res += price;
        }, 0);
      }
    }
  },
});

export const { updateProductSelected, resetProductSelected, removeProduct, updateStatus, unCheckProduct } =
  cartSlice.actions;
export const selectProductSelected = (state: any) => state.cart.productSelected;
export const selectTotalPrice = (state: any) => state.cart.totalPrice;
export default cartSlice.reducer;
