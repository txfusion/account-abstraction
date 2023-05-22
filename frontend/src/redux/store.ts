import { configureStore } from '@reduxjs/toolkit';
import { accountReducer } from './account.slice';

const reducer = {
	account: accountReducer,
};

const store = configureStore({
	devTools: true,

	reducer,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;