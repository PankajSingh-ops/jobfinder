"use client"
import React, { useEffect, useState } from 'react';
import { Box, CardMedia } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import styles from '../../jobs/JobCard.module.css'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ThreeDots } from 'react-loader-spinner';


interface Job {
  _id: string;
  jobTitle: string;
  location: string;
  salaryFrom: string;
  salaryTo: string;
  jobType: string;
  experience: string;
  requirements: string;
  jobProfileUrl: string;
}

export default function LikedJobs() {
  const [loading, setLoading] = useState(true);
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const token = Cookies.get("token");
  const router = useRouter();
  const isLogin = !!token;
  const { likedJobs } = useSelector((state: RootState) => state.profile);


  const getAppliedJobs = async () => {
    try {
      const response = await axios.post("/api/users/applied-jobs", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobsData(response.data.profile.likedJobs);
      setLoading(false);
    } catch (err) {
      console.log(err, "Error message");
      setLoading(false);
    }
  }

  useEffect(() => {
    getAppliedJobs();
  }, [token]);

  const toggleLike = async(jobId: string) => {
    try {
      const response = await axios.post('/api/jobs/liked-jobs', { jobId },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      
      if (response.status === 200) {
        getAppliedJobs()
      }
    } catch (error) {
      console.error('Error updating job like status:', error);
    }
  };

  const sanitizeHTML = (html: string): string => {
    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(html, 'text/html');
    return parsedDoc.body.textContent || "";
  };

  if (loading) {
    return <div style={{ display:"flex", alignItems:'center', justifyContent:"center" }}>
    <ThreeDots
     height="80"
     width="80"
     color="#0073e6"
     ariaLabel="three-dots-loading"
     visible={true}
   />
   </div>
  }

  return (
    <Box mt={4} display="flex" flexWrap="wrap" gap={4} justifyContent="center">
      {jobsData && jobsData.length > 0 ? (
        jobsData.map((job) => (
          <Box key={job._id} className={styles.card}>
            {isLogin && (
              <>
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
                )}
              </>
            )}
            <CardMedia
              component="img"
              height="140"
              image={job.jobProfileUrl || "/images/jobs.avif"}
              alt={job.jobTitle}
              className={styles.cardImage}
              onClick={() => router.push(`/jobs/details/${job._id}`)}
            />
            <h2 className={styles.cardTitle}>{job.jobTitle}</h2>
            <p className={styles.cardLocation}>{job.location}</p>
            <p className={styles.cardSalary}>₹{job.salaryFrom} - ₹{job.salaryTo}</p>
            <p className={styles.cardType}>Job Type: {job.jobType}</p>
            <p className={styles.cardExperience}>Experience: {job.experience}</p>
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
  );
}