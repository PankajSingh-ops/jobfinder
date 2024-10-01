"use client";
import React, { useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Typography,
  Box,
  MenuItem,
  Button,
} from "@mui/material";
import { Country, State, City } from "country-state-city";
import { Save, LinkedIn, Twitter, Facebook } from "@mui/icons-material";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import Header from "@/app/common/ui/Header";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Cookies from "js-cookie";
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });


export interface ICompany {
  userId: string;
  companyLogo: string;
  companyName: string;
  subCompanyName:string;
  description: string;
  totalEmployees: number;
  totalDepartments: number;
  workingCulture: string[];
  ratings: { profileId: string; rating: number }[];
  ratingCount: number;
  headquarters: {
    city: string;
    state: string;
    country: string;
  };
  industry: string;
  website: string;
  contactEmail: string;
  socialLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
  };
  isActive: boolean;
  foundedDate: Date | null;
}

const initialCompanyState: ICompany = {
  userId: "",
  companyLogo: "",
  companyName: "",
  subCompanyName:"",
  description: "",
  totalEmployees: 0,
  totalDepartments: 0,
  workingCulture: [],
  ratings: [],
  ratingCount: 0,
  headquarters: { city: "", state: "", country: "" },
  industry: "",
  website: "",
  contactEmail: "",
  socialLinks: { linkedin: "", twitter: "", facebook: "" },
  isActive: true,
  foundedDate: null,
};

const Home: React.FC = () => {
  const [company, setCompany] = useState<ICompany>(initialCompanyState);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const { user } = useSelector((state: RootState) => state.auth);


  const countries = Country.getAllCountries();
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];
  const cities = selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : [];
  let token=null;

  if (typeof window !== 'undefined') {
    token = Cookies.get("token");
  }
  console.log(token,"token");
  

  const handleSave = async () => {
    const companyData = {
        ...company,
        companyName: user?.companyname || '',
        headquarters: {
            city: selectedCity,
            state: selectedState,
            country: selectedCountry,
          },
      };
    try {
      await axios.post("/api/company/add-company", companyData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Data saved successfully!");
    } catch (error) {
      console.error("Error saving company data: ", error);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom textAlign="center">
            Add Company
        </Typography>
        <Grid container spacing={4}>
          {/* Company Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Name"
              variant="outlined"
              value={user?.companyname}
              InputProps={{
                readOnly: true,
              }}
              />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Sub Company Name"
              variant="outlined"
              value={company.subCompanyName}
              onChange={(e) => setCompany({ ...company, subCompanyName: e.target.value })}
            />
          </Grid>

          {/* Total Employees */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Total Employees"
              type="number"
              variant="outlined"
              value={company.totalEmployees}
              onChange={(e) => setCompany({ ...company, totalEmployees: parseInt(e.target.value) })}
            />
          </Grid>

          {/* Total Departments */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Total Departments"
              type="number"
              variant="outlined"
              value={company.totalDepartments}
              onChange={(e) =>
                setCompany({ ...company, totalDepartments: parseInt(e.target.value) })
              }
            />
          </Grid>

          {/* Working Culture */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Working Culture"
              variant="outlined"
              placeholder="E.g. Collaborative, Remote-first"
              value={company.workingCulture.join(", ")}
              onChange={(e) =>
                setCompany({ ...company, workingCulture: e.target.value.split(", ") })
              }
            />
          </Grid>

          {/* Country */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Country"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {countries.map((country) => (
                <MenuItem key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* State */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="State"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              disabled={!selectedCountry}
            >
              {states.map((state) => (
                <MenuItem key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* City */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="City"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={!selectedState}
            >
              {cities.map((city) => (
                <MenuItem key={city.name} value={city.name}>
                  {city.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Industry */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Industry"
              variant="outlined"
              value={company.industry}
              onChange={(e) => setCompany({ ...company, industry: e.target.value })}
            />
          </Grid>

          {/* Website */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Website"
              variant="outlined"
              value={company.website}
              onChange={(e) => setCompany({ ...company, website: e.target.value })}
            />
          </Grid>

          {/* Contact Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Email"
              variant="outlined"
              value={company.contactEmail}
              onChange={(e) => setCompany({ ...company, contactEmail: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    label="Founded Date"
    type="date"
    variant="outlined"
    value={company.foundedDate ? company.foundedDate.toISOString().split('T')[0] : ""}
    onChange={(e) => setCompany({ ...company, foundedDate: new Date(e.target.value) })}
    InputLabelProps={{
      shrink: true,
    }}
  />
</Grid>

          {/* Social Links */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="LinkedIn"
              variant="outlined"
              placeholder="LinkedIn Profile URL"
              value={company.socialLinks.linkedin}
              onChange={(e) =>
                setCompany({ ...company, socialLinks: { ...company.socialLinks, linkedin: e.target.value } })
              }
              InputProps={{
                endAdornment: <LinkedIn />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Twitter"
              variant="outlined"
              placeholder="Twitter Profile URL"
              value={company.socialLinks.twitter}
              onChange={(e) =>
                setCompany({ ...company, socialLinks: { ...company.socialLinks, twitter: e.target.value } })
              }
              InputProps={{
                endAdornment: <Twitter />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Facebook"
              variant="outlined"
              placeholder="Facebook Profile URL"
              value={company.socialLinks.facebook}
              onChange={(e) =>
                setCompany({ ...company, socialLinks: { ...company.socialLinks, facebook: e.target.value } })
              }
              InputProps={{
                endAdornment: <Facebook />,
              }}
            />
          </Grid>

          {/* Company Description */}
          <Grid item xs={12}>
            <Typography>Description</Typography>
            <ReactQuill
              theme="snow"
              value={company.description}
              onChange={(value) => setCompany({ ...company, description: value })}
              style={{ height: "200px", marginBottom: "30px" }}
            />
          </Grid>

          {/* Save Button */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button color="primary" variant="contained" onClick={handleSave}>
                <Save />
                <Typography ml={1}>Save</Typography>
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
