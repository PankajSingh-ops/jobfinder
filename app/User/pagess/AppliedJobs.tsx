"use client"
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Chip, Tooltip, useTheme, useMediaQuery } from '@mui/material';
import { MapPin, DollarSign, Briefcase, Clock, Users } from 'lucide-react';
import Cookies from "js-cookie";
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';


interface Job {
  id: string;
  jobTitle: string;
  experience: string;
  salaryFrom: string;
  salaryTo: string;
  jobType: string;
  location: string;
  openings: string;
  joiningTime: string;
  companyName: string;
  jobProfileUrl: string;
}


const AppliedJobs: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading]=useState(true)
  const [jobsData, setJobsData]=useState<Job[]>()
  const token = Cookies.get("token");

  const getAppliedJobs=async()=>{
    try{
      const response = await axios.post("/api/users/applied-jobs",{},{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobsData(response.data.profile.appliedJobs)
      setLoading(false)
      

    }catch(err){
      console.log(err,"Error message");
      
    }
  }

  useEffect(()=>{
  getAppliedJobs();
  },[token])

  

  return (
    <>{loading?( <div style={{ display:"flex", alignItems:'center', justifyContent:"center" }}>
      <ThreeDots
       height="80"
       width="80"
       color="#0073e6"
       ariaLabel="three-dots-loading"
       visible={true}
     />
     </div>):(
   
    <Box sx={{ flexGrow: 1, p: isMobile ? 2 : 3 }}>
      <Grid container spacing={isMobile ? 2 : 3}>
        {jobsData?.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                },
              }}
            >
              <CardMedia
                component="img"
                height={isMobile ? "100" : "140"}
                image={job.jobProfileUrl}
                alt={job.jobTitle}
              />
              <CardContent sx={{ flexGrow: 1, padding: isMobile ? 1.5 : 2 }}>
                <Typography gutterBottom variant={isMobile ? "h6" : "h5"} component="div">
                  {job.jobTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {job.companyName}
                </Typography>
                <Box display="flex" alignItems="center" mb={isMobile ? 0.5 : 1}>
                  <MapPin size={isMobile ? 14 : 16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" fontSize={isMobile ? '0.8rem' : '0.875rem'}>
                    {job.location}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={isMobile ? 0.5 : 1}>
                  <DollarSign size={isMobile ? 14 : 16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" fontSize={isMobile ? '0.8rem' : '0.875rem'}>
                    ₹{job.salaryFrom} - ₹{job.salaryTo}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={isMobile ? 0.5 : 1}>
                  <Briefcase size={isMobile ? 14 : 16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" fontSize={isMobile ? '0.8rem' : '0.875rem'}>
                    {job.experience}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={isMobile ? 0.5 : 1}>
                  <Clock size={isMobile ? 14 : 16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" fontSize={isMobile ? '0.8rem' : '0.875rem'}>
                    Join in {job.joiningTime}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={isMobile ? 1 : 2}>
                  <Users size={isMobile ? 14 : 16} style={{ marginRight: 8 }} />
                  <Typography variant="body2" fontSize={isMobile ? '0.8rem' : '0.875rem'}>
                    {job.openings} openings
                  </Typography>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  <Tooltip title="Job Type">
                    <Chip label={job.jobType} size={isMobile ? "small" : "medium"} />
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    )}
    </>
  );
};

export default AppliedJobs;