import { createSlice } from '@reduxjs/toolkit';

const channelsSlice = createSlice({
    name: 'channels',
    initialState: [],
    reducers: {
        setChannels(state, action) {
            return action.payload;
        },
    },
});

export const { setChannels } = channelsSlice.actions;
export default channelsSlice.reducer;
