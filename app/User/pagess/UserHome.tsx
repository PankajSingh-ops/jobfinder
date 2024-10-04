import React from 'react';
import { Box, Typography, Grid, Paper, Avatar, Chip, List, ListItem, ListItemText } from '@mui/material';
import { Briefcase, MapPin, Calendar, Linkedin, GraduationCap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

// Example data based on the Mongoose model
const userData = {
  fullname: "John Doe",
  email: "john.doe@example.com",
  country: "United States",
  experience: "5 years",
  joinIn: "2019",
  linkedin: "linkedin.com/in/johndoe",
  phone: "+1 234 567 8900",
  gender: "Male",
  bio: "Passionate software developer with a focus on web technologies.",
  profilePic: "/api/placeholder/150/150",
  maritalStatus: "Single",
  category: "IT Professional",
  differentlyAbled: "No",
  careerBreak: "No",
  permanentAddress: "123 Main St, Anytown, USA",
  hometown: "Smallville",
  pincode: "12345",
  dob: new Date("1990-01-01"),
  lovesTravelling: "Yes",
  lovesOfficeParties: "Yes",
  softSkills: {
    "Communication": 85,
    "Teamwork": 90,
    "Problem Solving": 80,
    "Adaptability": 75
  },
  ITSkills: [
    { skill: "JavaScript", experienceYears: 4, experienceMonths: 6 },
    { skill: "React", experienceYears: 3, experienceMonths: 2 },
    { skill: "Node.js", experienceYears: 2, experienceMonths: 8 }
  ],
  education: {
    graduation: {
      degree: "Bachelor of Science in Computer Science",
      institution: "Tech University",
      year: "2015"
    }
  },
  interests: ["Web Development", "AI", "Machine Learning", "Data Science"]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const UserHome = () => {
  const softSkillsData = Object.entries(userData.softSkills).map(([name, value]) => ({ name, value }));

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar src={userData.profilePic} sx={{ width: 100, height: 100, mb: 2 }} />
              <Typography variant="h5" gutterBottom>{userData.fullname}</Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>{userData.email}</Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <MapPin size={16} style={{ marginRight: 8 }} />
                <Typography variant="body2">{userData.country}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Briefcase size={16} style={{ marginRight: 8 }} />
                <Typography variant="body2">{userData.experience} experience</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Calendar size={16} style={{ marginRight: 8 }} />
                <Typography variant="body2">Joined in {userData.joinIn}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Linkedin size={16} style={{ marginRight: 8 }} />
                <Typography variant="body2">{userData.linkedin}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Skills Overview */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Skills Overview</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>Soft Skills</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={softSkillsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {softSkillsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" gutterBottom>IT Skills</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={userData.ITSkills}>
                    <XAxis dataKey="skill" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="experienceYears" fill="#8884d8" name="Years" />
                  </BarChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Additional Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Additional Information</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Marital Status" secondary={userData.maritalStatus} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Category" secondary={userData.category} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Differently Abled" secondary={userData.differentlyAbled} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Career Break" secondary={userData.careerBreak} />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Interests */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Interests</Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {userData.interests.map((interest, index) => (
                <Chip key={index} label={interest} />
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Education */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Education</Typography>
            <Box display="flex" alignItems="center">
              <GraduationCap size={24} style={{ marginRight: 16 }} />
              <Box>
                <Typography variant="subtitle1">{userData.education.graduation.degree}</Typography>
                <Typography variant="body2">{userData.education.graduation.institution}, {userData.education.graduation.year}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserHome;