import { configureStore } from '@reduxjs/toolkit';
import { cartReducer } from './cart.slice';
import { transactionsReducer } from './transactions.slice';

const reducer = {
	transactions: transactionsReducer,
	cart: cartReducer,
};

const store = configureStore({
	reducer,
});

export default store;
