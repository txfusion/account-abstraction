import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { BigNumber, ethers } from 'ethers';
import { RootState } from './store';

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
		transactionAdded: {
			reducer: transactionsAdapter.addOne,
			prepare: (payload: Omit<TransactionType, 'transactionId'>) => {
				const id = uuidv4();
				return {
					payload: { ...payload, transactionId: id },
				};
			},
		},
		batchTransactionsAdded: {
			reducer: transactionsAdapter.addMany,
			prepare: (payload: Omit<TransactionType, 'transactionId'>[]) => {
				const txsWithUniqueIds = payload.map((transaction) => {
					return {
						...transaction,
						transactionId: uuidv4(),
					};
				});

				return {
					payload: txsWithUniqueIds,
				};
			},
		},
		transactionRemoved: transactionsAdapter.removeOne,
	},
});

export const transactionsReducer = transactionSlice.reducer;

export const { transactionAdded, transactionRemoved, batchTransactionsAdded } =
	transactionSlice.actions;

export const selectTransactions = transactionsAdapter.getSelectors<RootState>(
	(state) => state.transactions
);
