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
  isLogin: boolean;
}

const initialState: AuthState = {
  user: null,
  isLogin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isLogin = true;
      Cookies.set('user', JSON.stringify(action.payload), { expires: 7 });
      Cookies.set('isLogin', 'true', { expires: 7 });
    },
    logout: (state) => {
      state.user = null;
      state.isLogin = false;
      Cookies.remove('user');
      Cookies.remove('isLogin');
    },
    loadFromCookies: (state) => {
      const user = Cookies.get('user');
      const isLogin = Cookies.get('isLogin');
      if (user && isLogin === 'true') {
        state.user = JSON.parse(user);
        state.isLogin = true;
      }
    },
  },
});

export const { login, logout, loadFromCookies } = authSlice.actions; // Make sure this line is present
export default authSlice.reducer;
