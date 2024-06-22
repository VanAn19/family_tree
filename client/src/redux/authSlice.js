import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      // localStorage.clear()
      // state.user = action.payload.metadata.user
      // state.token = action.payload.metadata.tokens.accessToken
      localStorage.clear();
      const { user, tokens } = action.payload.metadata; 
      state.user = user;
      state.token = tokens.accessToken;
    },
    register(state, action) {
      // localStorage.clear()
      // state.user = action.payload.metadata.user
      // state.token = action.payload.metadata.tokens.accessToken
      localStorage.clear();
      const { user, tokens } = action.payload.metadata; 
      state.user = user;
      state.token = tokens.accessToken;
    },
    logout(state, action) {
       state.user = null
       state.token = null
       localStorage.clear()
    },
  },
})

export const { login, register, logout } = authSlice.actions

export default authSlice.reducer