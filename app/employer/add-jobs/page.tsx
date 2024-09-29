'use client';

import React, { useState } from 'react';
import { TextField, MenuItem, Button, Select, InputLabel, FormControl, Grid, Typography, SelectChangeEvent, Box } from '@mui/material';
import { useEdgeStore } from '@/lib/edgestore';
import styles from './AddJobs.module.css';
import { SingleImageDropzone } from '@/app/common/image upload/SingleImageUpload';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Circles } from 'react-loader-spinner';
import Header from '@/app/common/ui/Header';


const jobTypes = ['Remote', 'Hybrid', 'Office', 'Other'];
const genderPreferences = ['Male', 'Female', 'Any'];
const workingDaysOptions = ['5 Days', '6 Days', 'Other'];

const JobPosting = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    experience: '',
    salaryFrom: '',
    salaryTo: '',
    jobType: '',
    location: '',
    genderPreference: '',
    openings: '',
    joiningTime: '',
    requirements: '',
    itSkills: '',
    role: '',
    industryType: '',
    education: '',
    workingDays: '',
    jobProfileUrl:'',
  });

  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false); // Loading state

  const { edgestore } = useEdgeStore();
  const token = Cookies.get('token');
 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent, name: string) => {
    setFormData({
      ...formData,
      [name]: e.target.value as string,
    });
  };

  const handleUpload = async () => {
    if (file) {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          console.log(progress);
        },
      });
      console.log(res);
      setFormData({
        ...formData,
        jobProfileUrl: res.url,
      });
      
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      throw new Error('No token found');
    }

    setLoading(true); // Start loading

    try {
      const response = await axios.post('/api/employer/jobs/add-jobs', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);
      // Reset form data after successful submission
      setFormData({
        jobTitle: '',
        jobDescription: '',
        experience: '',
        salaryFrom: '',
        salaryTo: '',
        jobType: '',
        location: '',
        genderPreference: '',
        openings: '',
        joiningTime: '',
        requirements: '',
        itSkills: '',
        role: '',
        industryType: '',
        education: '',
        workingDays: '',
        jobProfileUrl: '',
      });

      setFile(undefined); // Clear the file upload
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false); // Stop loading after the request completes
    }
  };

  return (
    <><Header/>
    <div className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Add a Job Posting
      </Typography>
      {loading ? (
        <div className={styles.loader}>
          <Circles
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="circles-loading"
            visible={true}
          />
        </div>):(
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
           {/* Image Upload Section */}
           <Grid item xs={12} sm={6}>
            <SingleImageDropzone
              width={200}
              height={200}
              value={file}
              onChange={(file) => setFile(file)}
            />
            <Button variant="contained" onClick={handleUpload}>
              Upload Image
            </Button>
          </Grid>
          <Box width="50%" mt={2}>
          <Grid item mb={2}>
            <TextField
              label="Job Title"
              name="jobTitle"
              fullWidth
              value={formData.jobTitle}
              onChange={handleChange}
            />
          </Grid>
          <Grid item mb={2}>
            <TextField
              label="Experience"
              name="experience"
              fullWidth
              value={formData.experience}
              onChange={handleChange}
            />
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <InputLabel>Job Type</InputLabel>
              <Select
                value={formData.jobType}
                onChange={(e) => handleSelectChange(e, 'jobType')}
                label="Job Type"
              >
                {jobTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          </Box>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Salary From"
              name="salaryFrom"
              type="number"
              fullWidth
              value={formData.salaryFrom}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Salary To"
              name="salaryTo"
              type="number"
              fullWidth
              value={formData.salaryTo}
              onChange={handleChange}
            />
          </Grid>
         
          <Grid item xs={12} sm={6}>
            <TextField
              label="Location"
              name="location"
              fullWidth
              value={formData.location}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Gender Preference</InputLabel>
              <Select
                value={formData.genderPreference}
                onChange={(e) => handleSelectChange(e, 'genderPreference')}
                label="Gender Preference"
              >
                {genderPreferences.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Openings"
              name="openings"
              type="number"
              fullWidth
              value={formData.openings}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Joining Time"
              name="joiningTime"
              fullWidth
              value={formData.joiningTime}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Requirements"
              name="requirements"
              fullWidth
              multiline
              rows={3}
              value={formData.requirements}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="IT Skills"
              name="itSkills"
              fullWidth
              value={formData.itSkills}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Role"
              name="role"
              fullWidth
              value={formData.role}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Industry Type"
              name="industryType"
              fullWidth
              value={formData.industryType}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Education"
              name="education"
              fullWidth
              value={formData.education}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Working Days</InputLabel>
              <Select
                value={formData.workingDays}
                onChange={(e) => handleSelectChange(e, 'workingDays')}
                label="Working Days"
              >
                {workingDaysOptions.map((days) => (
                  <MenuItem key={days} value={days}>
                    {days}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Submit Job Posting
            </Button>
          </Grid>
        </Grid>
      </form>
        )}
    </div>
    </>
  );
};

export default JobPosting;
