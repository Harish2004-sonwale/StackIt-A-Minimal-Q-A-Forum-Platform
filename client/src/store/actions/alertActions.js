import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    message: null,
    type: null,
    timeoutId: null
};

const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        setAlert: (state, action) => {
            const { message, type } = action.payload;
            
            // Clear existing timeout
            if (state.timeoutId) {
                clearTimeout(state.timeoutId);
            }

            // Set new alert
            state.message = message;
            state.type = type;

            // Auto-dismiss after 5 seconds
            state.timeoutId = setTimeout(() => {
                state.message = null;
                state.type = null;
                state.timeoutId = null;
            }, 5000);
        },
        clearAlert: (state) => {
            if (state.timeoutId) {
                clearTimeout(state.timeoutId);
            }
            state.message = null;
            state.type = null;
            state.timeoutId = null;
        }
    }
});

export const { setAlert, clearAlert } = alertSlice.actions;
export default alertSlice.reducer;
