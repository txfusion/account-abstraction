import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: [],
    reducers: {
        addToCart: (state, action) => {
            state.push({ ...action.payload, ammount: action.payload.ammount});
        },
        removeFromCart: (state, action) => {
            const index = state.findIndex((data) => data.item.symbol == action.payload.item.symbol);
            state.splice(index, 1);
        },
    },
});

export const cartReducer = cartSlice.reducer;

export const {
    addToCart,
    removeFromCart,
} = cartSlice.actions;