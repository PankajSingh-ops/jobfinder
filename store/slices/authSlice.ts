import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie'; // Import js-cookie

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  companyname?: string;
  userType: 'employer' | 'jobseeker';
}

interface AuthState {
  user: User | null;
  token: string | null;  // Add token to state
  isLogin: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,  // Initialize token as null
  isLogin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isLogin = true;
      Cookies.set('user', JSON.stringify(user), { expires: 1 });
      Cookies.set('token', token, { expires: 1 });
      Cookies.set('isLogin', 'true', { expires: 1 });
    },
    logout: (state) => {
      state.user = null;
      state.token = null;  // Clear token on logout
      state.isLogin = false;
      Cookies.remove('user');
      Cookies.remove('token');  // Remove token from cookies
      Cookies.remove('isLogin');
    },
    loadFromCookies: (state) => {
      const user = Cookies.get('user');
      const token = Cookies.get('token');  // Load token from cookies
      const isLogin = Cookies.get('isLogin');
      if (user && token && isLogin === 'true') {
        state.user = JSON.parse(user);
        state.token = token;
        state.isLogin = true;
      }
    },
  },
});

export const { login, logout, loadFromCookies } = authSlice.actions;
export default authSlice.reducer;
