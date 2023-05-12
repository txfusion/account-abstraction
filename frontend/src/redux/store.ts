import { configureStore } from '@reduxjs/toolkit';
import { cartReducer } from './cart.slice';
import { transactionsReducer } from './transactions.slice';

const reducer = {
	transactions: transactionsReducer,
	cart: cartReducer,
};

const store = configureStore({
	devTools: true,

	reducer,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
