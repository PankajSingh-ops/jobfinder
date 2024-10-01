"use client";

import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Typography,
  SelectChangeEvent,
  Box,
} from "@mui/material";
import { useEdgeStore } from "@/lib/edgestore";
import styles from "./AddJobs.module.css";
import { SingleImageDropzone } from "@/app/common/image upload/SingleImageUpload";
import axios from "axios";
import Cookies from "js-cookie";
import { Circles } from "react-loader-spinner";
import Header from "@/app/common/ui/Header";
import { useRouter } from "next/navigation";
import {
  jobTypes,
  joining,
  genderPreferences,
  workingDaysOptions,
  experiences,
  industryType,
  employmentTypes,
} from "./Jobdata";
import "react-quill/dist/quill.snow.css";

import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Company {
  _id: string;
  companyName: string;
  subCompanyName?: string;
 
}
const JobPosting = () => {
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    experience: "",
    salaryFrom: "",
    salaryTo: "",
    jobType: "",
    location: "",
    genderPreference: "",
    openings: "",
    joiningTime: "",
    requirements: "",
    itSkills: "",
    role: "",
    industryType: "",
    education: "",
    workingDays: "",
    jobProfileUrl: "",
    employmentType: "",
    companyId: "",
  });

  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false); // Loading state
  const [companiesList, setCompaniesList] = useState<Company[]>([]);
  const router = useRouter();

  const { edgestore } = useEdgeStore();
  let token = null;

  if (typeof window !== "undefined") {
    token = Cookies.get("token");
  }
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent, name: string) => {
    setFormData({
      ...formData,
      [name]: e.target.value as string,
    });
  };

  const handleUpload = async () => {
    if (file) {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          console.log(progress);
        },
      });
      console.log(res);

      setFormData((prevData) => ({
        ...prevData,
        jobProfileUrl: res.url,
      }));

      return res.url;
    }
  };
  useEffect(() => {
    const getCompanies = async () => {
      const response = await axios.post("/api/company/view-company",{}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompaniesList(response?.data);
      console.log(response.data, "companies");
    };
    getCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      throw new Error("No token found");
    }

    setLoading(true); // Start loading

    try {
      const uploadedUrl = await handleUpload();

      const updatedFormData = {
        ...formData,
        jobProfileUrl: uploadedUrl, // Ensure the URL is added
      };
      const response = await axios.post(
        "/api/employer/jobs/add-jobs",
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);
      router.push("/employer/view-jobs");
      setFormData({
        jobTitle: "",
        jobDescription: "",
        experience: "",
        salaryFrom: "",
        salaryTo: "",
        jobType: "",
        location: "",
        genderPreference: "",
        openings: "",
        joiningTime: "",
        requirements: "",
        itSkills: "",
        role: "",
        industryType: "",
        education: "",
        workingDays: "",
        jobProfileUrl: "",
        employmentType: "",
        companyId: "",
      });

      setFile(undefined); // Clear the file upload
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false); // Stop loading after the request completes
    }
  };

  return (
    <>
      <Header />
      <div className={styles.container}>
        <Typography variant="h4" className={styles.title}>
          Add a Job Posting
        </Typography>
        {loading ? (
          <div className={styles.loader}>
            <Circles
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="circles-loading"
              visible={true}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Image Upload Section */}
              <Grid item xs={12} sm={6}>
                <SingleImageDropzone
                  width={200}
                  height={200}
                  value={file}
                  onChange={(file) => setFile(file)}
                />
              </Grid>
              <Box width="50%" mt={2}>
                <Grid item mb={2}>
                  <TextField
                    label="Job Title"
                    name="jobTitle"
                    fullWidth
                    value={formData.jobTitle}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item mb={2}>
                  <FormControl fullWidth>
                    <InputLabel>Experience</InputLabel>
                    <Select
                      value={formData.experience}
                      onChange={(e) => handleSelectChange(e, "experience")}
                      label="Job Type"
                    >
                      {experiences.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl fullWidth>
                    <InputLabel>Job Type</InputLabel>
                    <Select
                      value={formData.jobType}
                      onChange={(e) => handleSelectChange(e, "jobType")}
                      label="Job Type"
                    >
                      {jobTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Box>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Salary From"
                  name="salaryFrom"
                  type="number"
                  fullWidth
                  value={formData.salaryFrom}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Salary To"
                  name="salaryTo"
                  type="number"
                  fullWidth
                  value={formData.salaryTo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Employment Type</InputLabel>
                  <Select
                    value={formData.employmentType}
                    onChange={(e) => handleSelectChange(e, "employmentType")}
                    label="Employment Type"
                  >
                    {employmentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Company</InputLabel>
                  <Select
                    value={formData.companyId}
                    onChange={(e) => handleSelectChange(e, "companyId")}
                    label="Company"
                  >
                    {companiesList.map((company:Company) => (
                      <MenuItem key={company._id} value={company._id}>
                        {company.companyName}{" "}
                        {company.subCompanyName
                          ? `- ${company.subCompanyName}`
                          : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Location"
                  name="location"
                  fullWidth
                  value={formData.location}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender Preference</InputLabel>
                  <Select
                    value={formData.genderPreference}
                    onChange={(e) => handleSelectChange(e, "genderPreference")}
                    label="Gender Preference"
                  >
                    {genderPreferences.map((gender) => (
                      <MenuItem key={gender} value={gender}>
                        {gender}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Openings"
                  name="openings"
                  type="number"
                  fullWidth
                  value={formData.openings}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Joining Time</InputLabel>
                  <Select
                    value={formData.joiningTime}
                    onChange={(e) => handleSelectChange(e, "joiningTime")}
                    label="Joining Time"
                  >
                    {joining.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="IT Skills"
                  name="itSkills"
                  fullWidth
                  value={formData.itSkills}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Role"
                  name="role"
                  fullWidth
                  value={formData.role}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Industry Type</InputLabel>
                  <Select
                    value={formData.industryType}
                    onChange={(e) => handleSelectChange(e, "industryType")}
                    label="Industry Type"
                  >
                    {industryType.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Education"
                  name="education"
                  fullWidth
                  value={formData.education}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Working Days</InputLabel>
                  <Select
                    value={formData.workingDays}
                    onChange={(e) => handleSelectChange(e, "workingDays")}
                    label="Working Days"
                  >
                    {workingDaysOptions.map((days) => (
                      <MenuItem key={days} value={days}>
                        {days}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} mb={2}>
                <Typography variant="h6">Job Description</Typography>
                <ReactQuill
                  theme="snow"
                  value={formData.jobDescription}
                  onChange={(content) =>
                    setFormData({ ...formData, jobDescription: content })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} mb={2}>
                <Typography variant="h6">Requirements</Typography>
                <ReactQuill
                  theme="snow"
                  value={formData.requirements}
                  onChange={(content) =>
                    setFormData({ ...formData, requirements: content })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit">
                  Submit Job Posting
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </div>
    </>
  );
};

export default JobPosting;
