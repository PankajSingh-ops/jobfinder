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
  Button, // Import Button from MUI
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions
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
  CalendarToday,
} from '@mui/icons-material'
import PeopleIcon from '@mui/icons-material/People';
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { MultiFileDropzone,type FileState, } from '@/app/common/image upload/MultipleFileUpload'
import { useEdgeStore } from '@/lib/edgestore'
import styles from '../../JobCard.module.css'

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
interface UserDetails {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
  permanentAddress: string;
  profilePic: string; // Base64 image string
  pincode: string;
  additionalInfo: string;
  resumeUrls: string[]; // Array of URLs
  profileId: string;
  jobId: string;
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
  usersId:UserDetails[];
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
  const { edgestore } = useEdgeStore();

  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [profileData, setProfileData] = useState({
    fullname: '',
    email: '',
    phone: '',
    permanentAddress: '',
    profilePic: '',
    pincode: '',
    additionalInfo: '',
    resumeUrls: [] as string[],
    profileId:''

  })


  const {user} = useSelector((state: RootState) => state.auth);
  const {fullname,email,phone,permanentAddress,profilePic,pincode,_id} = useSelector((state: RootState) => state.profile);
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


  useEffect(() => {
    if (id) {
      fetchJobDetails()
    }
    setProfileData(prevData => ({
      ...prevData,
      fullname,
      email,
      phone,
      permanentAddress,
      profilePic,
      pincode,
      profileId:_id
    }))
  }, [id,_id])
  
  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }
  function updateFileProgress(key: string, progress: FileState['progress']) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key,
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }
  const handleApply = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`/api/jobs/applied-jobs/${id}`,{profileData})
      setLoading(false)
      console.log(response);
    } catch (error) {
      console.error('Error fetching job details:', error)
      setLoading(false)
    }
    handleCloseDialog()
  }
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
      <Container maxWidth="md" sx={{ mt: 4 }} className={styles.jobDetailsMain}>
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
            <Paper elevation={3} sx={{ p: 3, mb: 3, overflow:'hidden' }}>
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
            icon={<PeopleIcon color="primary" />} 
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
          {user?.userType=="employer"?null:(
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2 }}
            onClick={handleOpenDialog}
            disabled={jobDetails?.usersId?.some(user => user.profileId === _id)}
          >
{jobDetails?.usersId?.some(user => user.profileId === _id) ? "Already Applied for Job" : "Apply for Job"}
</Button>
)}
        </Paper>
}
<Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Apply for {jobDetails?.jobTitle}</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              id="fullname"
              name="fullname"
              label="Full Name"
              type="text"
              fullWidth
              variant="outlined"
              value={profileData.fullname}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              id="email"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={profileData.email}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              id="phone"
              name="phone"
              label="Phone"
              type="tel"
              fullWidth
              variant="outlined"
              value={profileData.phone}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              id="permanentAddress"
              name="permanentAddress"
              label="Permanent Address"
              type="text"
              fullWidth
              variant="outlined"
              value={profileData.permanentAddress}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              id="pincode"
              name="pincode"
              label="Pincode"
              type="text"
              fullWidth
              variant="outlined"
              value={profileData.pincode}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              id="additionalInfo"
              name="additionalInfo"
              label="Additional Information"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={profileData.additionalInfo}
              onChange={handleInputChange}
            />
             <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Add Resume</Typography>
            <MultiFileDropzone
              value={fileStates}
              onChange={(files) => {
                setFileStates(files);
              }}
              onFilesAdded={async (addedFiles) => {
                setFileStates([...fileStates, ...addedFiles]);
                await Promise.all(
                  addedFiles.map(async (addedFileState) => {
                    try {
                      const res = await edgestore.publicFiles.upload({
                        file: addedFileState.file,
                        onProgressChange: async (progress) => {
                          updateFileProgress(addedFileState.key, progress);
                          if (progress === 100) {
                            await new Promise((resolve) => setTimeout(resolve, 1000));
                            updateFileProgress(addedFileState.key, 'COMPLETE');
                          }
                        },
                      });
                      console.log(res);
                      setProfileData(prevData => ({
                        ...prevData,
                        resumeUrls: [...prevData.resumeUrls, res.url]
                      }));
                    } catch (err) {
                      console.log(err);     
                      updateFileProgress(addedFileState.key, 'ERROR');
                    }
                  }),
                );
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleApply} variant="contained" color="primary">Apply</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  )
}
