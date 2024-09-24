"use client";
import { useState } from 'react';
import axios from 'axios';
import OtpVerification from './Otp_verification';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { Email } from '@mui/icons-material';
import * as Yup from 'yup';  // For form validation
import Header from '@/app/common/ui/Header';

const ForgotPassword = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState(''); // State to hold the email

  const sendOtp = async (email: string) => {
    try {
      await axios.post('/api/auth/otp_sent', { email });
      setEmail(email); // Store the email in state
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const initialValues = {
    email: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
  });

  return (
    <>
      <Header/>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        p={3}
      >
        {!otpSent ? (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => sendOtp(values.email)}
          >
            {({ errors, touched }) => (
              <Form>
                <Typography variant="h4" gutterBottom>
                  Forgot Password
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <Email sx={{ mr: 1 }} />
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Send OTP
                </Button>
              </Form>
            )}
          </Formik>
        ) : (
          <OtpVerification email={email} />
        )}
      </Box>
    </>
  );
};

export default ForgotPassword;
