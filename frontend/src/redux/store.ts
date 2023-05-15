import { configureStore } from '@reduxjs/toolkit';
import { transactionsReducer } from './transactions.slice';
import { accountReducer } from './account.slice';

const reducer = {
	transactions: transactionsReducer,
	account: accountReducer
};

const store = configureStore({
	devTools: true,

	reducer,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
