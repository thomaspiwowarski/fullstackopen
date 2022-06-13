import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

let timeoutHandle = null;

export const setNotification = (text, time) => {
  return (dispatch) => {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle);
      timeoutHandle = null;
    }

    dispatch(showNotification(text));

    timeoutHandle = setTimeout(() => {
      dispatch(removeNotification());
    }, time * 1000);
  };
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    showNotification(state, action) {
      return (state = action.payload);
    },
    removeNotification(state, action) {
      return (state = "");
    },
  },
});

export const { showNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
