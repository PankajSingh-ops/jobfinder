import React, { useState, useEffect } from 'react';
import { 
  Box, Card, CardContent, Typography, Grid, Skeleton,
  useTheme
} from '@mui/material';
import { 
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from 'recharts';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import { SvgIconComponent } from '@mui/icons-material';

interface StatCardProps {
    title: string;
    value: number;
    icon: SvgIconComponent;
  }

const demoData = {
  totalUsers: 15000,
  totalEmployers: 500,
  totalJobSeekers: 14500,
  totalCompanies: 300,
  totalAppliedJobs: 25000,
  totalJobs: 1000,
  totalMale: 8000,
  totalFemale: 7000,
  monthlyJobStats: [
    { name: 'Jan', jobs: 150 },
    { name: 'Feb', jobs: 200 },
    { name: 'Mar', jobs: 180 },
    { name: 'Apr', jobs: 220 },
    { name: 'May', jobs: 250 },
    { name: 'Jun', jobs: 300 },
  ],
};

const genderData = [
  { name: 'Male', value: 8000 },
  { name: 'Female', value: 7000 },
];

const COLORS = ['#0088FE', '#00C49F'];

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => (  
<Card>
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" component="div">
          {value.toLocaleString()}
        </Typography>
        <Icon color="primary" />
      </Box>
    </CardContent>
  </Card>
);

const SkeletonCard = () => (
  <Card>
    <CardContent>
      <Skeleton variant="text" width="60%" />
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
        <Skeleton variant="rectangular" width="40%" height={32} />
        <Skeleton variant="circular" width={24} height={24} />
      </Box>
    </CardContent>
  </Card>
);

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return (
      <Box p={3}>
        <Grid container spacing={3}>
          {[...Array(8)].map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <SkeletonCard />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Users" value={demoData.totalUsers} icon={PersonIcon} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Employers" value={demoData.totalEmployers} icon={BusinessIcon} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Job Seekers" value={demoData.totalJobSeekers} icon={PersonIcon} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Companies" value={demoData.totalCompanies} icon={BusinessIcon} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Applied Jobs" value={demoData.totalAppliedJobs} icon={DescriptionIcon} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Jobs" value={demoData.totalJobs} icon={WorkIcon} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Male Users" value={demoData.totalMale} icon={PersonIcon} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Female Users" value={demoData.totalFemale} icon={PersonIcon} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Job Postings
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={demoData.monthlyJobStats}>
                  <Line type="monotone" dataKey="jobs" stroke={theme.palette.primary.main} />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gender Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}