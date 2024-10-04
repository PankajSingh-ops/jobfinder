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
import { ThreeDots } from "react-loader-spinner";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useDispatch } from "react-redux";
import { fetchProfileData } from "@/store/slices/profileSlice";
import { useRouter } from "next/navigation";




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
  const [loading, setLoading]=useState(true)
  const [showFilters, setShowFilters] = useState(false); // State for toggling filters
  const isMobile = useMediaQuery("(max-width:600px)"); // Detect mobile screen
  const token = Cookies.get("token");
  const dispatch=useDispatch()
  const { likedJobs } = useSelector((state: RootState) => state.profile);
  const { isLogin } = useSelector((state: RootState) => state.auth);

  const router=useRouter()



  const toggleLike = async(jobId: string) => {
    try {
      const response = await axios.post('/api/jobs/liked-jobs', { jobId },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      
      if (response.status === 200) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dispatch(fetchProfileData() as any);
      }
    } catch (error) {
      console.error('Error updating job like status:', error);
    }
  };
  


  const fetchJobs = async () => {
    try {
      const response = await axios.post("/api/jobs/view-jobs", filters);
      setJobs(response?.data?.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }finally{
        setLoading(false)
    }
  };

  // Reset filters
  const resetFilters = async() => {
    setFilters({
      industry: "",
      location: "",
      employmentType: "",
      salaryFrom: "",
      salaryTo: "",
      jobType: "",
      experience: "",
    });
    try {
      setLoading(true)
      const response = await axios.post("/api/jobs/view-jobs", {});
      setJobs(response?.data?.jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }finally{
        setLoading(false)
    }
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
  const sanitizeHTML = (html: string): string => {
    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(html, 'text/html');
    return parsedDoc.body.textContent || "";
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
        {loading ? (
          <div className={styles.loader}>
           <ThreeDots
            height="80"
            width="80"
            color="#0073e6"
            ariaLabel="three-dots-loading"
            visible={true}
          />
          </div>
        ) : (
        <Box mt={4} display="flex" flexWrap="wrap" gap={4} justifyContent="center">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Box key={job._id} className={styles.card}>
                {isLogin&&(<>
                {likedJobs.includes(job._id) ? (
          <FavoriteIcon
            className={styles.heartIcon}
            onClick={() => toggleLike(job._id)}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: 'red',
              cursor: 'pointer',
            }}
          />
        ) : (
          <FavoriteBorderIcon
            className={styles.heartIcon}
            onClick={() => toggleLike(job._id)}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: 'red',
              cursor: 'pointer',
            }}
          />
        )}</>)}
                <CardMedia
                  component="img"
                  height="140"
                  image={job.jobProfileUrl || "/images/jobs.avif"}
                  alt={job.jobTitle}
                  className={styles.cardImage}
                  onClick={()=>router.push(`/jobs/details/${job._id}`)}
                />
                <h2 className={styles.cardTitle}>{job.jobTitle}</h2>
                <p className={styles.cardLocation}>{job.location}</p>
                <p className={styles.cardSalary}>₹{job.salaryFrom} - ₹{job.salaryTo}</p>
                <p className={styles.cardType}>Job Type: {job.jobType}</p>
                <p className={styles.cardExperience}>
                  Experience: {job.experience}
                </p>
                <p
            className={styles.cardRequirements}
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(job.requirements) }}
          />
              </Box>
            ))
          ) : (
            <p>No jobs found</p>
          )}
        </Box>
        )}
      </Box>
    </>
  );
}
