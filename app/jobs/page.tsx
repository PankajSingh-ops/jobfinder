"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import Header from "../common/ui/Header";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Collapse,
  CardMedia,
  SelectChangeEvent,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";
import {
  employmentTypes,
  jobTypes,
  experiences,
  industryType,
} from "../employer/add-jobs/Jobdata";
import { useMediaQuery } from "@mui/material";
import styles from "./JobCard.module.css";

interface IJobPost {
  _id: string;
  jobTitle: string;
  jobDescription: string;
  experience: string;
  salaryFrom: string;
  salaryTo: string;
  jobType: string;
  location: string;
  genderPreference: string;
  openings: string;
  joiningTime: string;
  requirements: string;
  itSkills: string;
  role: string;
  industryType: string;
  education: string;
  workingDays: string;
  jobProfileUrl: string;
  employmentType: string;
  profileId: string;
  usersId: string[];
  createdAt: string;
  updatedAt: string;
}

export default function JobsPage() {
  const [filters, setFilters] = useState({
    industry: "",
    location: "",
    employmentType: "",
    salaryFrom: "",
    salaryTo: "",
    jobType: "",
    experience: "",
  });
  const [jobs, setJobs] = useState<IJobPost[]>([]);
  const [showFilters, setShowFilters] = useState(false); // State for toggling filters
  const isMobile = useMediaQuery("(max-width:600px)"); // Detect mobile screen

  const fetchJobs = async () => {
    try {
      const response = await axios.post("/api/jobs/view-jobs", filters);
      setJobs(response?.data?.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      industry: "",
      location: "",
      employmentType: "",
      salaryFrom: "",
      salaryTo: "",
      jobType: "",
      experience: "",
    });
    fetchJobs();
  };

  const handleFilterChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | { name: string; value: string }; // Use type assertion
    setFilters({
      ...filters,
      [name]: value,
    });
  };
  useEffect(() => {
    fetchJobs();
  }, []);

  // Toggle the filter visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <>
      <Header />
      <Box sx={{ padding: "16px", backgroundColor: "#f5f5f5" }}>
        {/* Mobile filter button */}
        {isMobile && (
          <Button variant="outlined" onClick={toggleFilters}>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        )}

        {/* Filters */}
        <Collapse in={showFilters || !isMobile}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Industry Type</InputLabel>
                <Select
                  label="Industry Type"
                  name="industry"
                  value={filters.industry}
                  onChange={handleFilterChange}
                >
                  {industryType.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Location */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: <LocationOnIcon sx={{ mr: 1 }} />,
                }}
              />
            </Grid>

            {/* Employment Type */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Employment Type</InputLabel>
                <Select
                  label="Employment Type"
                  name="employmentType"
                  value={filters.employmentType}
                  onChange={handleFilterChange}
                >
                  {employmentTypes.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Job Type */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Job Type</InputLabel>
                <Select
                  label="Job Type"
                  name="jobType"
                  value={filters.jobType}
                  onChange={handleFilterChange}
                >
                  {jobTypes.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Experience */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Experience</InputLabel>
                <Select
                  label="Experience"
                  name="experience"
                  value={filters.experience}
                  onChange={handleFilterChange}
                >
                  {experiences.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Salary From */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Salary From"
                name="salaryFrom"
                value={filters.salaryFrom}
                onChange={handleFilterChange}
                type="number"
              />
            </Grid>

            {/* Salary To */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Salary To"
                name="salaryTo"
                value={filters.salaryTo}
                onChange={handleFilterChange}
                type="number"
              />
            </Grid>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
              p={2}
            >
              <Grid item>
                <Button fullWidth variant="contained" onClick={fetchJobs}>
                  Apply Filters
                </Button>
              </Grid>
              <Grid item>
                <Button fullWidth variant="outlined" onClick={resetFilters}>
                  Reset
                </Button>
              </Grid>
            </Box>
          </Grid>
        </Collapse>

        {/* Job List */}
        <Box mt={4} display="flex" flexWrap="wrap" gap={4} justifyContent="center">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Box key={job._id} className={styles.card}>
                <CardMedia
                  component="img"
                  height="140"
                  image={job.jobProfileUrl || "/images/jobs.avif"}
                  alt={job.jobTitle}
                  className={styles.cardImage}
                />
                <h2 className={styles.cardTitle}>{job.jobTitle}</h2>
                <p className={styles.cardLocation}>{job.location}</p>
                <p className={styles.cardSalary}>
                  {job.salaryFrom} - {job.salaryTo}
                </p>
                <p className={styles.cardType}>Job Type: {job.jobType}</p>
                <p className={styles.cardExperience}>
                  Experience: {job.experience}
                </p>
                <p className={styles.cardRequirements}>
                  Requirements: {job.requirements}
                </p>
              </Box>
            ))
          ) : (
            <p>No jobs found</p>
          )}
        </Box>
      </Box>
    </>
  );
}
