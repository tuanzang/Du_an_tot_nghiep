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
        return (res += curr.product.price * curr.quantity);
      }, 0);
    },

    resetProductSelected: (state) => {
      state.productSelected = [];
      state.totalPrice = 0;
    },
  },
});

export const { updateProductSelected, resetProductSelected } =
  cartSlice.actions;
export const selectProductSelected = (state: any) => state.cart.productSelected;
export const selectTotalPrice = (state: any) => state.cart.totalPrice;
export default cartSlice.reducer;