"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Header from '@/app/common/ui/Header'
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Chip,
  Avatar,
  Divider,
  Box,
  Skeleton,
  Alert,
  Button // Import Button from MUI
} from '@mui/material'
import {
  WorkOutline,
  LocationOn,
  AttachMoney,
  WatchLater,
  Person,
  School,
  Code,
  Business,
  CalendarToday
} from '@mui/icons-material'

// Define the structure for Company details
interface CompanyDetails {
  _id: string
  companyName: string
  description: string
  industry: string
  headquarters: {
    city: string
    state: string
    country: string
  }
  totalEmployees: number
  totalDepartments: number
  workingCulture: string[]
  website: string
}

// Update the JobDetails interface to include companyId
interface JobDetails {
  _id: string
  jobTitle: string
  jobDescription: string
  experience: string
  salaryFrom: string
  salaryTo: string
  jobType: string
  location: string
  genderPreference: string
  openings: string
  joiningTime: string
  requirements: string
  itSkills: string
  role: string
  industryType: string
  education: string
  workingDays: string
  employmentType: string
  jobProfileUrl: string
  companyId: CompanyDetails; // Include company details
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <Box display="flex" alignItems="center" mb={2}>
    {icon}
    <Box ml={2}>
      <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  </Box>
)

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`/api/jobs/view-details/${id}`)
        setJobDetails(response.data.job)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching job details:', error)
        setError('Failed to load job details. Please try again later.')
        setLoading(false)
      }
    }

    if (id) {
      fetchJobDetails()
    }
  }, [id])

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={200} />
        <Skeleton variant="text" sx={{ mt: 2 }} />
        <Skeleton variant="text" sx={{ mt: 1 }} />
        <Skeleton variant="text" sx={{ mt: 1 }} />
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    )
  }

  if (!jobDetails) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">Job not found</Alert>
      </Container>
    )
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar 
                src={jobDetails.jobProfileUrl} 
                alt={jobDetails.jobTitle}
                sx={{ width: 100, height: 100 }}
              />
            </Grid>
            <Grid item xs>
              <Typography variant="h4" component="h1" gutterBottom>
                {jobDetails.jobTitle}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
               <LocationOn /> {jobDetails?.companyId?.companyName} • {jobDetails.location}
              </Typography>
              <Box mt={2}>
                <Chip icon={<WorkOutline />} label={jobDetails.jobType} sx={{ mr: 1, mb: 1 }} />
                <Chip icon={<AttachMoney />} label={`₹${jobDetails.salaryFrom} - ₹${jobDetails.salaryTo}`} sx={{ mr: 1, mb: 1 }} />
                <Chip icon={<WatchLater />} label={jobDetails.joiningTime} sx={{ mr: 1, mb: 1 }} />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Job Description</Typography>
              <Divider sx={{ mb: 2 }} />
              <div dangerouslySetInnerHTML={{ __html: jobDetails.jobDescription }} />
            </Paper>
            
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Requirements</Typography>
              <Divider sx={{ mb: 2 }} />
              <div dangerouslySetInnerHTML={{ __html: jobDetails.requirements }} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Job Details</Typography>
              <Divider sx={{ mb: 2 }} />
              <DetailItem icon={<WorkOutline color="primary" />} label="Experience" value={jobDetails.experience} />
              <DetailItem icon={<Person color="primary" />} label="Gender Preference" value={jobDetails.genderPreference} />
              <DetailItem icon={<Business color="primary" />} label="Industry" value={jobDetails.industryType} />
              <DetailItem icon={<School color="primary" />} label="Education" value={jobDetails.education} />
              <DetailItem icon={<Code color="primary" />} label="IT Skills" value={jobDetails.itSkills} />
              <DetailItem icon={<CalendarToday color="primary" />} label="Working Days" value={jobDetails.workingDays} />
              <DetailItem icon={<WorkOutline color="primary" />} label="Employment Type" value={jobDetails.employmentType} />
            </Paper>
          </Grid>
        </Grid>

        {/* Company Details Section */}
        {jobDetails?.companyId&&
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>Company Details</Typography>
          <Divider sx={{ mb: 2 }} />
          <DetailItem 
            icon={<Business color="primary" />} 
            label="Company Name" 
            value={jobDetails.companyId.companyName} 
          />
          <DetailItem 
            icon={<LocationOn color="primary" />} 
            label="Headquarters" 
            value={`${jobDetails.companyId.headquarters.city}, ${jobDetails.companyId.headquarters.state}, ${jobDetails.companyId.headquarters.country}`} 
          />
          <DetailItem 
            icon={<AttachMoney color="primary" />} 
            label="Total Employees" 
            value={jobDetails.companyId.totalEmployees.toString()} 
          />
          <DetailItem 
            icon={<WorkOutline color="primary" />} 
            label="Industry" 
            value={jobDetails.companyId.industry} 
          />
          <DetailItem 
            icon={<Person color="primary" />} 
            label="Working Culture" 
            value={jobDetails.companyId.workingCulture.join(", ")} 
          />
          <Divider sx={{ mb: 2 }} />
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2 }}
            onClick={() => alert('Applied!')} // Placeholder for apply action
          >
            Apply
          </Button>
        </Paper>
}
      </Container>
    </>
  )
}
