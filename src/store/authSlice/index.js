import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  user: null,
  id: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.id = action.payload.id;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.id = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
