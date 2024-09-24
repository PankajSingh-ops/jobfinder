"use client";
import React, { useState } from 'react';
import axios from 'axios';
import {
  Button, TextField, Checkbox, Box, Typography,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import Header from "@/app/common/ui/Header";
import { SelectChangeEvent } from '@mui/material/Select';
import styles from './Signup.module.css';
import { useRouter } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
  rePassword: string;
  firstName: string;
  lastName: string;
  gender: string;
  companyName: string;
  agree: boolean;
}

export default function Signup() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<string>(''); 
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rePassword: '',
    firstName: '',
    lastName: '',
    gender: '',
    companyName: '',
    agree: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleNext = () => {
    if (step === 1) {
      if (!userType) {
        setErrors({ userType: 'Please select a role' });
        return;
      }
      setErrors({});
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    setFormData({ ...formData, [e.target.name as string]: e.target.value });
  };

  const handleAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, agree: e.target.checked });
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!emailPattern.test(formData.email)) newErrors.email = 'Please enter a valid email';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters long';
    
    if (formData.password !== formData.rePassword) newErrors.rePassword = 'Passwords do not match';
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.agree) newErrors.agree = 'You must agree to the terms and conditions';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      try {
        const dataToSend = { ...formData, userType }; 
        const response = await axios.post('/api/auth/signup', dataToSend);
        console.log('Form submitted successfully:', response.data);
        router.push('/auth/login');
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        {step === 1 && (
          <Box className={styles.optionBox}>
            <Typography variant="h6" className={styles.legend}>
              Select your role
            </Typography>
            <div className={styles.roleSelection}>
              <div
                className={`${styles.roleBox} ${userType === 'employer' ? styles.selected : ''}`}
                onClick={() => setUserType('employer')}
              >
                <Typography variant="body1">Are you an employer?</Typography>
              </div>
              <div
                className={`${styles.roleBox} ${userType === 'jobseeker' ? styles.selected : ''}`}
                onClick={() => setUserType('jobseeker')}
              >
                <Typography variant="body1">Are you looking for a job?</Typography>
              </div>
            </div>
            <div className={styles.buttonGroup}>
              <Button variant="contained" disabled={!userType} onClick={handleNext}>
                Next
              </Button>
            </div>
          </Box>
        )}
        
        {step === 2 && (
          <div className={styles.form}>
            <Typography variant="h6" className={styles.legend}>
              Enter your credentials
            </Typography>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              margin="normal"
              required
              type="email"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Re-enter Password"
              name="rePassword"
              type="password"
              value={formData.rePassword}
              onChange={handleChange}
              error={!!errors.rePassword}
              helperText={errors.rePassword}
              fullWidth
              margin="normal"
              required
            />
            {userType === 'employer' && (
              <TextField
                label="Enter your Company Name"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            )}
            <FormControl fullWidth margin="normal">
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                error={!!errors.gender}
                displayEmpty
              >
                <MenuItem value="" disabled>Select Gender</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
              {errors.gender && <Typography color="error">{errors.gender}</Typography>}
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  name="agree"
                  checked={formData.agree}
                  onChange={handleAgreeChange}
                />
              }
              label="I agree to the terms and conditions"
            />
            {errors.agree && <Typography color="error">{errors.agree}</Typography>}
            <div className={styles.buttonGroup}>
              <Button variant="contained" onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: '10px' }}
                onClick={handleSubmit}
                disabled={!formData.agree}
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
