import { createSlice } from '@reduxjs/toolkit';
import usersService from '../services/users';

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await usersService.getAll();
    dispatch(initUsers(users));
  };
};

const usersReducer = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    initUsers(state, action) {
      return action.payload;
    },
  },
});

export const { initUsers } = usersReducer.actions;
export default usersReducer.reducer;
