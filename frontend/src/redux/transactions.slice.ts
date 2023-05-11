import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { BigNumber, ethers } from 'ethers';

interface TransactionType {
	transactionId: string | number;
	from: string;
	to: string;
	tokenAmount: BigNumber | number;
	value?: BigNumber | number;
	txCalldata: ethers.PopulatedTransaction;
}

const transactionsAdapter = createEntityAdapter<TransactionType>({
	selectId: (transaction) => transaction.transactionId,
});

const transactionSlice = createSlice({
	name: 'transactions',
	initialState: transactionsAdapter.getInitialState(),
	reducers: {
		// Can pass adapter functions directly as case reducers.  Because we're passing this
		// as a value, `createSlice` will auto-generate the `bookAdded` action type / creator
		transactionAdded: transactionsAdapter.addOne,
		transactionRemoved: transactionsAdapter.removeOne,
	},
});

// const transactionSlie = createSlice({
// 	name: 'transactions',
// 	initialState: [],
// 	reducers: {
// 		addToCart: (state, action) => {
// 			state.push({ ...action.payload, ammount: action.payload.ammount });
// 		},
// 		removeFromCart: (state, action) => {
// 			const index = state.findIndex(
// 				(data) => data.item.symbol == action.payload.item.symbol
// 			);
// 			state.splice(index, 1);
// 		},
// 	},
// });

export const transactionsReducer = transactionSlice.reducer;

export const { transactionAdded, transactionRemoved } =
	transactionSlice.actions;
