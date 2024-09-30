"use client";

import Header from '@/app/common/ui/Header';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Card, CardContent, CardMedia, IconButton, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Grid, Skeleton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import styles from './ViewJobs.module.css';  // Assuming you have a CSS module for styling

interface Job {
  _id: string;
  jobTitle: string;
  jobDescription: string;
  experience: string;
  location: string;
  jobProfileUrl?: string;
  createdAt: string;
}

export default function ViewJobs() {
  const token = Cookies.get('token');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  
  
  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await axios.get('/api/employer/jobs/view-jobs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (response?.data) {
          setJobs(response.data);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    getJobs();
  }, [token]);
  

  const handleDeleteClick = (job: Job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;

    try {
        const response = await axios.delete(`/api/employer/jobs/job-delete/${jobToDelete._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      setDeleteDialogOpen(false);
      console.log(response);
      
      
      // Optionally, refetch the jobs after deletion
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Header />
      <div className={styles.jobsContainer}>
        <Grid container spacing={2}>
          {loading ? (
            // Show skeleton while loading
            [1, 2, 3, 4].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} className={styles.cardmain} key={index}>
                <Card className={styles.skeletonCard}>
                  <Skeleton variant="rectangular" width="100%" height={140} />
                  <CardContent>
                    <Skeleton width="60%" />
                    <Skeleton width="40%" />
                    <Skeleton width="80%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            jobs.map((job: Job) => (
              <Grid item xs={12} sm={6} md={4} className={styles.cardmain} key={job._id}>
                <Card className={styles.jobCard}>
                  <div className={styles.cardImageContainer}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={job.jobProfileUrl || '/images/jobs.avif'}  // Use a default image if jobProfileUrl is missing
                      alt={job.jobTitle}
                      className={styles.jobImage}
                    />
                    <div className={styles.iconContainer}>
                      <IconButton
                        className={styles.editButton}
                        onClick={() => console.log(`Edit ${job.jobTitle}`)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        className={styles.deleteButton}
                        onClick={() => handleDeleteClick(job)}
                      >
                        <Delete />
                      </IconButton>
                    </div>
                  </div>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {job.jobTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Published: {new Date(job.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Location: {job.location}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Job</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the job {jobToDelete?.jobTitle}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>No</Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
