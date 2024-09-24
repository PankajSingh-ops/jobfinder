"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box, Grid, Link, Avatar, CircularProgress } from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import { Formik, Form, Field,} from 'formik';
import * as Yup from 'yup';
import Header from '@/app/common/ui/Header';
import { useDispatch } from 'react-redux';
import { login } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

// Yup Validation Schema
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router=useRouter()


  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', values);
      console.log('Login successful:', response.data);
      dispatch(login(response.data.user));
      router.push('/')

    } catch (error) {
      setError('Invalid email or password.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header /> {/* Ensure the header is functional */}
      <Container maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>

          {/* Formik Form */}
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleLogin(values);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form>
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  // Show error only if the field has been touched and there's an error
                  helperText={touched.email && errors.email ? errors.email : ''}
                  error={touched.email && Boolean(errors.email)}
                />
                <Field
                  as={TextField}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  // Show error only if the field has been touched and there's an error
                  helperText={touched.password && errors.password ? errors.password : ''}
                  error={touched.password && Boolean(errors.password)}
                />

                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isSubmitting || loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Login'}
                </Button>

                <Grid container>
                  <Grid item xs>
                    <Link href="/auth/forgot_password" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="/auth/signup" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </>
  );
}
