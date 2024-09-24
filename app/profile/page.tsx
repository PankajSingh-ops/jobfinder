"use client"
import { useState } from 'react';
import { Card, CardContent, Typography, Box, Grid, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Radio, RadioGroup, FormControlLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import Header from '../common/ui/Header';
import styles from './Profile.module.css'
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  
  // State for editing dialog
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: user?.firstname + ' ' + user?.lastname,
    email: user?.email,
    country: '',
    experience: 'Fresher',
    joinIn: '10 days',
    linkedin: '',
  });
  const [resume, setResume] = useState<File | null>(null);
  const [certificates, setCertificates] = useState<File | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'resume') {
        setResume(file);
      } else {
        setCertificates(file);
      }
    }
  };
  
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
    }
  };

  const handleSave = async () => {
    // Save profile data and upload resume/certificates via API (axios call)
   
    const formData = new FormData();
    if (profileData.email) {
        formData.append('email', profileData.email);
      } else {
        console.error("Email is undefined.");
      }
    formData.append('fullname', profileData.fullname);
    formData.append('email', profileData.email || "example@gmail.com");
    formData.append('country', profileData.country);
    formData.append('experience', profileData.experience);
    formData.append('joinIn', profileData.joinIn);
    formData.append('linkedin', profileData.linkedin);
    
    if (resume) formData.append('resume', resume);
    if (certificates) formData.append('certificates', certificates);
    if (profilePic) formData.append('profilePic', profilePic);

    try {
      const response = await axios.post('/api/profile/update', formData);
      console.log('Profile updated:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }

    handleClose();
  };

  return (
    <>
      <Header />

      <Box className={styles.ProfileMainPage}>
        <Box sx={{ padding: 2 }}>
          <Card elevation={3} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
            <CardContent>
              <Box
                sx={{ position: 'relative', width: 150, height: 100 }}
                onMouseEnter={(e) => {
                    const target = e.currentTarget.querySelector('#change-profile') as HTMLElement;
                    if (target) target.style.display = 'flex';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget.querySelector('#change-profile') as HTMLElement;
                    if (target) target.style.display = 'none';
                  }}
              >
                <Image src={user?.gender=='female'?'/images/profile/girl1.png':'/images/profile/boy1.png'} alt='profile' width={150} height={100} />
                <Box
                  id="change-profile"
                  sx={{
                    display: 'none',
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                  onClick={() => document.getElementById('upload-profile-pic')!.click()}
                >
                  <AddIcon />
                  <Typography>Change Profile</Typography>
                </Box>
              </Box>
              <input id="upload-profile-pic" type="file" style={{ display: 'none' }} onChange={handleProfilePicChange} />
            </CardContent>
            <Box sx={{ flex: 1 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {profileData.fullname}
                  <IconButton onClick={handleOpen} sx={{ ml: 1 }}>
                    <EditIcon />
                  </IconButton>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Main profile information
                </Typography>
              </CardContent>
              <Box sx={{ display: 'flex' }}>
                {/* First Card Content */}
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">Country: {profileData.country}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WorkIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">Experience: {profileData.experience}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarTodayIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">When to join: {profileData.joinIn}</Typography>
                  </Box>
                </CardContent>

                {/* Second Card Content */}
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">Phone: Not specified</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">Email: {profileData.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LinkedInIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">LinkedIn: {profileData.linkedin}</Typography>
                  </Box>
                </CardContent>
              </Box>
            </Box>
            <Box>
              <CardContent>
                <Button component="label">
                  Upload Resume
                  <input hidden accept=".pdf,.doc,.docx" type="file" onChange={(e) => handleFileChange(e, 'resume')} />
                </Button>
                <Button component="label">
                  Upload Certificates
                  <input hidden accept=".pdf,.doc,.docx" type="file" onChange={(e) => handleFileChange(e, 'certificates')} />
                </Button>
              </CardContent>
            </Box>
          </Card>
        </Box>

        {/* Bottom Cards Section */}
        <Grid container spacing={2} sx={{ padding: 2 }}>
          {/* Left Side - Single Card */}
          <Grid item xs={12} md={3}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" component="div">
                  Left Card
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Content for the left card, e.g., user details or additional info.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Side - Box containing 5 cards */}
          <Grid item xs={12} md={9}>
            <Box>
              {/* Right side cards */}
              <Grid container spacing={2}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <Grid item xs={12} key={index}>
                    <Card elevation={3}>
                      <CardContent>
                        <Typography variant="h6" component="div">
                          Card {index}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Content for card {index}.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
       {/* Edit Profile Dialog */}
       <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="fullname"
              label="Full Name"
              fullWidth
              value={profileData.fullname}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              fullWidth
              value={profileData.email}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="country"
              label="Country"
              fullWidth
              value={profileData.country}
              onChange={handleChange}
            />
            <RadioGroup
              row
              name="experience"
              value={profileData.experience}
              onChange={handleChange}
            >
              <FormControlLabel value="Fresher" control={<Radio />} label="Fresher" />
              <FormControlLabel value="Experienced" control={<Radio />} label="Experienced" />
            </RadioGroup>
            <Select
              fullWidth
              name="joinIn"
              value={profileData.joinIn}
              onChange={(e: SelectChangeEvent<string>) => handleChange(e)}
              >
              <MenuItem value="10 days">10 days</MenuItem>
              <MenuItem value="30 days">30 days</MenuItem>
              <MenuItem value="Immediately">Immediately</MenuItem>
            </Select>
            <TextField
              margin="dense"
              name="linkedin"
              label="LinkedIn Profile"
              fullWidth
              value={profileData.linkedin}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>
    </>
  );
}

export default ProfilePage;
