"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Chip,
  Fade,
} from '@mui/material';
import {
  People,
  DateRange,
  LocationOn,
  Language,
  Email,
  LinkedIn,
  Twitter,
  Facebook,
} from '@mui/icons-material';
import { useParams } from 'next/navigation';
import Header from '@/app/common/ui/Header';
import styles from './CompanyDetail.module.css';
import { ThreeDots } from 'react-loader-spinner';

interface Company {
  _id: string;
  companyName: string;
  subCompanyName: string;
  companyLogo: string;
  description: string;
  totalEmployees: number;
  totalDepartments: number;
  workingCulture: string[];
  foundedDate: string;
  headquarters: {
    city: string;
    country: string;
  };
  industry: string;
  website: string;
  contactEmail: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

interface ApiResponse {
  companies: Company;
}

const CompanyDetail: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.post<ApiResponse>("/api/company/company-details", { id: companyId });
        setCompany(response.data.companies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching company details:', error);
        setLoading(false);
      }
    };

    if (companyId) {
      fetchCompanyDetails();
    }
  }, [companyId]);

  if (loading) {
    return <div className={styles.loader}>
        <ThreeDots
          height="80"
          width="80"
          color="#0073e6"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>

  }

  if (!company) {
    return <Typography className={styles.error}>Company not found</Typography>;
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" className={styles.container}>
        <Fade in={!loading} timeout={1000}>
          <Card className={styles.headerCard}>
            <CardMedia
              component="img"
              height="250"
              image={company.companyLogo}
              alt={company.companyName}
              className={styles.companyLogo}
            />
            <CardContent className={styles.headerContent}>
              <Typography variant="h3" component="h1" className={styles.companyName}>
                {company.companyName}
              </Typography>
              <Typography variant="h5" color="text.secondary" className={styles.subCompanyName}>
                {company.subCompanyName}
              </Typography>
              <Chip label={company.industry} color="primary" className={styles.industryChip} />
            </CardContent>
          </Card>
        </Fade>

        <Fade in={!loading} timeout={1500}>
          <div>
            <Typography variant="h5" className={styles.sectionTitle}>About the Company</Typography>
            <Card className={styles.descriptionCard}>
              <CardContent>
                <Typography variant="body1" paragraph dangerouslySetInnerHTML={{ __html: company.description }} />
              </CardContent>
            </Card>

            <Grid container spacing={4} className={styles.infoGrid}>
              <Grid item xs={12} md={6}>
                <Card className={styles.infoCard}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Company Information</Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon><People className={styles.icon} /></ListItemIcon>
                        <ListItemText primary="Total Employees" secondary={company.totalEmployees} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><DateRange className={styles.icon} /></ListItemIcon>
                        <ListItemText primary="Founded" secondary={new Date(company.foundedDate).getFullYear()} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><LocationOn className={styles.icon} /></ListItemIcon>
                        <ListItemText primary="Headquarters" secondary={`${company.headquarters.city}, ${company.headquarters.country}`} />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card className={styles.infoCard}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Contact Information</Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon><Language className={styles.icon} /></ListItemIcon>
                        <ListItemText 
                          primary="Website" 
                          secondary={<Link href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</Link>} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Email className={styles.icon} /></ListItemIcon>
                        <ListItemText 
                          primary="Email" 
                          secondary={<Link href={`mailto:${company.contactEmail}`}>{company.contactEmail}</Link>} 
                        />
                      </ListItem>
                      {Object.entries(company.socialLinks).map(([platform, url]) => (
                        url && (
                          <ListItem key={platform}>
                            <ListItemIcon>
                              {platform === 'linkedin' && <LinkedIn className={styles.icon} />}
                              {platform === 'twitter' && <Twitter className={styles.icon} />}
                              {platform === 'facebook' && <Facebook className={styles.icon} />}
                            </ListItemIcon>
                            <ListItemText 
                              primary={platform.charAt(0).toUpperCase() + platform.slice(1)} 
                              secondary={<Link href={url} target="_blank" rel="noopener noreferrer">{platform.charAt(0).toUpperCase() + platform.slice(1)} Profile</Link>} 
                            />
                          </ListItem>
                        )
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Typography variant="h5" className={styles.sectionTitle}>Working Culture</Typography>
            <Card className={styles.cultureCard}>
              <CardContent>
                <Grid container spacing={2}>
                  {company.workingCulture.map((culture, index) => (
                    <Grid item key={index}>
                      <Chip label={culture} className={styles.cultureChip} />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </div>
        </Fade>
      </Container>
    </>
  );
};

export default CompanyDetail;