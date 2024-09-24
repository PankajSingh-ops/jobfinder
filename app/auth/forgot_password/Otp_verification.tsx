"use client"
import { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

interface Email{
email:string;
}
const OtpVerification = ({ email }: Email) => {
    console.log(email);
    
  const router = useRouter();
  const [otpVerified, setOtpVerified] = useState(false);

  const verifyOtp = async (otp: string) => {
    try {
      await axios.post('/api/auth/verifyOtp', { email, otp });
      setOtpVerified(true);
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const resetPassword = async (newPassword: string) => {
    try {
      await axios.post('/api/auth/forgetPassword', { email, newPassword });
      alert('Password reset successfully!');
      router.push('/auth/login');
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const otpSchema = Yup.object({
    otp: Yup.string().required('OTP is required'),
  });

  const passwordSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={3}
    >
      {!otpVerified ? (
        <Formik
          initialValues={{ otp: '' }}
          validationSchema={otpSchema}
          onSubmit={(values) => verifyOtp(values.otp)}
        >
          {({ errors, touched }) => (
            <Form>
              <Typography variant="h5" gutterBottom>
                Enter OTP
              </Typography>
              <Field
                as={TextField}
                name="otp"
                label="OTP"
                fullWidth
                error={touched.otp && Boolean(errors.otp)}
                helperText={touched.otp && errors.otp}
                margin="normal"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Verify OTP
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={{ newPassword: '', confirmPassword: '' }}
          validationSchema={passwordSchema}
          onSubmit={(values) => resetPassword(values.newPassword)}
        >
          {({ errors, touched }) => (
            <Form>
              <Typography variant="h5" gutterBottom>
                Reset Password
              </Typography>
              <Field
                as={TextField}
                name="newPassword"
                label="New Password"
                type="password"
                fullWidth
                error={touched.newPassword && Boolean(errors.newPassword)}
                helperText={touched.newPassword && errors.newPassword}
                margin="normal"
              />
              <Field
                as={TextField}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
                margin="normal"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Reset Password
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Box>
  );
};

export default OtpVerification;
