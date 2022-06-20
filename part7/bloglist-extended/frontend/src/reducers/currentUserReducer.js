import { createSlice } from '@reduxjs/toolkit';

export const setUser = (user) => {
  return async (dispatch) => {
    dispatch(setUserData(user));
  };
};

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: null,
  reducers: {
    setUserData(state, action) {
      return action.payload;
    },
  },
});

export const { setUserData } = currentUserSlice.actions;
export default currentUserSlice.reducer;
