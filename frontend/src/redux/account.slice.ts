import { SmartAccountType } from '@/libs/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

const initialState = { connected: false, accountAddress: '' };

const accountSlice = createSlice({
	name: 'account',
	initialState: initialState,
	reducers: {
		connectSmartAccount: (state, action: PayloadAction<SmartAccountType>) => {
			state = action.payload;
		},
		disconnectSmartAccount: (state) => {
			state = initialState;
		},
	},
});

export const accountReducer = accountSlice.reducer;

export const smartAccount = (state: RootState) => state.account;

export const { connectSmartAccount, disconnectSmartAccount } =
	accountSlice.actions;
