/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') ?? null,
  username: '',
  currentChannelId: '1',
  currentChannelName: 'general',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    changeChannel: (state, action) => {
      const { name, id } = action.payload;
      state.currentChannelId = id;
      state.currentChannelName = name;
    },
    setUserData: (state, action) => {
      state.token = action.payload.token;
      state.username = action.payload.username;
    },
  },
});

export const { changeChannel, setUserData } = appSlice.actions;
export default appSlice.reducer;
