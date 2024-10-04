"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Pagination,
  Box,
  Button,
} from "@mui/material";
import { Business, People, DateRange } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import styles from "../CompanyList.module.css";
import { ThreeDots } from "react-loader-spinner";
import Header from "@/app/common/ui/Header";
import Cookies from "js-cookie";
import { PlusCircle } from "lucide-react";


interface Company {
  _id: string;
  companyName: string;
  subCompanyName: string;
  companyLogo: string;
  industry: string;
  totalEmployees: number;
  foundedDate: string;
}

interface CompanyResponse {
  companies: Company[];
  totalPages: number;
}

const MyCompany: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]=useState(true)
  const router = useRouter();
  const token = Cookies.get("token")

  const fetchCompanies = async (pageNumber: number) => {
    try {
      const response = await axios.post<CompanyResponse>("/api/company/my-company", { page: pageNumber },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompanies(response.data.companies);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchCompanies(page);
  }, [page]);

  const handleCardClick = (companyId: string) => {
    router.push(`/company/company-details/${companyId}`);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <>
      <Header />
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
      <Container maxWidth="lg" className={styles.container}>
        <Typography variant="h4" component="h1" gutterBottom className={styles.title}>
          My Companies
        </Typography>
        <Button variant="contained" endIcon={<PlusCircle />} onClick={()=>router.push('/company/add-company')}>Add New Company</Button>
        <Grid container spacing={4} mt={2}>
          {companies.map((company) => (
            <Grid item key={company._id} xs={12} sm={6} md={4}>
              <Card className={styles.card}>
                <CardActionArea onClick={() => handleCardClick(company._id)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={company.companyLogo}
                    alt={company.companyName}
                    className={styles.cardMedia}
                  />
                  <CardContent className={styles.cardContent}>
                    <Typography gutterBottom variant="h6" component="h2" className={styles.companyName}>
                      {company.companyName}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" className={styles.subCompanyName}>
                      {company.subCompanyName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className={styles.infoItem}
                    >
                      <Business className={styles.icon} /> {company.industry}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className={styles.infoItem}
                    >
                      <People className={styles.icon} /> {company.totalEmployees} employees
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className={styles.infoItem}
                    >
                      <DateRange className={styles.icon} /> Founded: {new Date(company.foundedDate).getFullYear()}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box className={styles.paginationContainer}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Container>
      )}
    </>
  );
};

export default MyCompany;