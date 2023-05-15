import { SmartAccountType } from '@/libs/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

const initialState: SmartAccountType = { connected: false, accountAddress: '' };

const accountSlice = createSlice({
	name: 'account',
	initialState: initialState,
	reducers: {
		connectSmartAccount: (state, action: PayloadAction<SmartAccountType>) => {
			console.log(action.payload)
			state.accountAddress = action.payload.accountAddress;
			state.connected = true;
		},
		disconnectSmartAccount: (state) => {
			state.connected = false;
			state.accountAddress = '';
		},
	},
});

export const accountReducer = accountSlice.reducer;

export const smartAccount = (state: RootState) => state.account;

export const { connectSmartAccount, disconnectSmartAccount } =
	accountSlice.actions;
