import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

let timeoutHandle = null;

export const setNotification = (text, error, time) => {
  return (dispatch) => {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
      timeoutHandle = null;
    }

    dispatch(showNotification({ text, error }));

    timeoutHandle = setTimeout(() => {
      dispatch(removeNotification());
    }, time * 1000);
  };
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    showNotification(state, action) {
      console.log(action.payload);
      return (state = {
        content: action.payload.text,
        error: action.payload.error,
      });
    },
    removeNotification() {
      return '';
    },
  },
});

export const { showNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
