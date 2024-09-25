"use client";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import Header from "../common/ui/Header";
import styles from "./Profile.module.css";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkIcon from "@mui/icons-material/Work";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Country, ICountry } from "country-state-city";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import WcIcon from '@mui/icons-material/Wc';

type EducationLevel =
  | "class10"
  | "class12"
  | "graduation"
  | "postGraduation"
  | "diploma";

function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [countries, setCountries] = useState<ICountry[]>([]); // Explicitly type countries

  // State for editing dialog
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    fullname: user?.firstname + " " + user?.lastname,
    email: user?.email,
    country: "",
    experience: "Fresher",
    joinIn: "10 days",
    linkedin: "",
    phone: "",
    bio: "",
    dob:null,
    education: {
      class10: { degree: "10th Class", institution: "", year: null as number | null },
      class12: { degree: "12th Class", institution: "", year: null as number | null },
      graduation: { degree: "Graduation", institution: "", year: null as number | null },
      postGraduation: { degree: "Post-Graduation", institution: "", year: null as number | null },
      diploma: { degree: "Diploma", institution: "", year: null as number | null },
    },
  });
  const [resume, setResume] = useState<File | null>(null);
  const [certificates, setCertificates] = useState<File | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [dialogText, setDialogText]=useState('')

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Open the dialog
  const handleEducationDialogOpen = (text:string) =>{ setEducationDialogOpen(true);
    setDialogText(text)
  }

  // Close the dialog
  const handleEducationDialogClose = () => setEducationDialogOpen(false);
  useEffect(() => {
    // Fetch countries using the country-state-city library
    const countryList = Country.getAllCountries();
    setCountries(countryList);
  }, []);
  const handleEducationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    educationLevel: EducationLevel
  ) => {
    const { name, value } = e.target;

    setProfileData((prevState) => ({
      ...prevState,
      education: {
        ...prevState.education,
        [educationLevel]: {
          ...prevState.education[educationLevel],
          [name]: value,
        },
      },
    }));
  };

  // Handle the date change for the DatePicker
  const handleDateChange = (
    date: dayjs.Dayjs | null,
    educationLevel: EducationLevel
  ) => {
    if (date) {
      setProfileData((prevData) => ({
        ...prevData,
        education: {
          ...prevData.education,
          [educationLevel]: {
            ...prevData.education[educationLevel],
            year: date.format("YYYY"),
          },
        },
      }));
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "resume") {
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
  const handlePhoneChange = (value: string) => {
    setProfileData({ ...profileData, phone: value });
  };
  const sections = [
    "Add Personal Details",
    "Add Education",
    "Add Soft Skills",
    "Add IT Skills",
    "Add Interests",
    "Add Projects",
    "Add Accomplishments",
    "Add Certifications",
    "Add Languages",
  ];

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const handleScrollToCard = (index: number) => {
    cardRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSave = async () => {
    const formData = new FormData();
  
    // Append basic information
    if (profileData.email) {
      formData.append("email", profileData.email);
    } else {
      console.error("Email is undefined.");
    }
    formData.append("fullname", profileData.fullname || "");
    formData.append("email", profileData.email || "example@gmail.com");
    formData.append("country", profileData.country || "");
    formData.append("experience", profileData.experience || "");
    formData.append("joinIn", profileData.joinIn || "");
    formData.append("linkedin", profileData.linkedin || "");
    formData.append("phone", profileData.phone || "");
    formData.append("bio", profileData.bio || "");
  
    // Explicitly define the union of education keys
    type EducationLevel = "class10" | "class12" | "graduation" | "postGraduation" | "diploma";
    const educationLevels: EducationLevel[] = ["class10", "class12", "graduation", "postGraduation", "diploma"];
  
    educationLevels.forEach((level) => {
      const educationData = profileData.education[level];
      formData.append(`${level}_degree`, educationData.degree || "");
      formData.append(`${level}_institution`, educationData.institution || "");
      formData.append(
        `${level}_year`,
        educationData.year ? educationData.year.toString() : ""
      );
    });
  
    // Append files (resume, certificates, profilePic)
    if (resume) formData.append("resume", resume);
    if (certificates) formData.append("certificates", certificates);
    if (profilePic) formData.append("profilePic", profilePic);
  
    // Send the form data
    try {
      const response = await axios.post("/api/profile/update", formData);
      console.log("Profile updated:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  
    handleClose();
  };
  
  

  return (
    <>
      <Header />

      <Box className={styles.ProfileMainPage}>
        <Box sx={{ padding: 2 }}>
          <Card
            elevation={3}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              position: "relative",
            }}
          >
            <CardContent>
              <Box
                sx={{ position: "relative", width: 150, height: 100 }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget.querySelector(
                    "#change-profile"
                  ) as HTMLElement;
                  if (target) target.style.display = "flex";
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget.querySelector(
                    "#change-profile"
                  ) as HTMLElement;
                  if (target) target.style.display = "none";
                }}
              >
                <Image
                  src={
                    user?.gender == "female"
                      ? "/images/profile/girl1.png"
                      : "/images/profile/boy1.png"
                  }
                  alt="profile"
                  width={150}
                  height={100}
                />
                <Box
                  id="change-profile"
                  sx={{
                    display: "none",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    document.getElementById("upload-profile-pic")!.click()
                  }
                >
                  <AddIcon />
                  <Typography>Change Profile</Typography>
                </Box>
              </Box>
              <input
                id="upload-profile-pic"
                type="file"
                style={{ display: "none" }}
                onChange={handleProfilePicChange}
              />
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
                  {profileData?.bio}
                </Typography>
              </CardContent>
              <Box sx={{ display: "flex" }}>
                {/* First Card Content */}
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOnIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Country: {profileData.country}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <WorkIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Experience: {profileData.experience}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CalendarTodayIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      When to join: {profileData.joinIn}
                    </Typography>
                  </Box>
                </CardContent>

                {/* Second Card Content */}
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <PhoneIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Phone: {profileData.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <EmailIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Email: {profileData.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <WcIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Gender: {profileData.email}
                    </Typography>
                  </Box>
                </CardContent>

                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CalendarTodayIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      DOB: {profileData.dob}
                    </Typography>
                  </Box>
                 
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LinkedInIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      LinkedIn: {profileData.linkedin}
                    </Typography>
                  </Box>
                </CardContent>
              </Box>
            </Box>
            <Box>
              <CardContent sx={{ display: "flex", flexDirection: "column" }}>
                <Button component="label" variant="outlined">
                  Upload Resume
                  <input
                    hidden
                    accept=".pdf,.doc,.docx"
                    type="file"
                    onChange={(e) => handleFileChange(e, "resume")}
                  />
                </Button>
                <Button component="label" variant="outlined">
                  Upload Certificates
                  <input
                    hidden
                    accept=".pdf,.doc,.docx"
                    type="file"
                    onChange={(e) => handleFileChange(e, "certificates")}
                  />
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
                {sections.map((section, index) => (
                  <div key={index}>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        cursor: "pointer",
                        "&:hover": { color: "primary.main" },
                      }}
                      onClick={() => handleScrollToCard(index)}
                    >
                      {section} <AddCircleOutlineIcon />
                    </Typography>
                    {index < sections.length - 1 && (
                      <hr style={{ marginTop: "1rem", marginBottom: "1rem" }} />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Right Side - Box containing 9 cards */}
          <Grid item xs={12} md={9}>
            <Box>
              <Grid container spacing={2}>
                {sections.map((section, index) => (
                  <Grid item xs={12} key={index}>
                    {/* Assign ref to each card */}
                    <Card
                      elevation={3}
                      ref={(el: HTMLDivElement | null) => {
                        cardRefs.current[index] = el;
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          {section}{" "}
                          <EditIcon
                            sx={{ cursor: "pointer" }}
                            onClick={()=>handleEducationDialogOpen(section)}
                          />
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Content for {section}.
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
          <label>FULL NAME:</label>
          <TextField
            autoFocus
            margin="dense"
            name="fullname"
            label=""
            fullWidth
            value={profileData.fullname}
            onChange={handleChange}
          />
          <label>EMAIL:</label>

          <TextField
            margin="dense"
            name="email"
            label=""
            fullWidth
            value={profileData.email}
            onChange={handleChange}
          />
          <label>BIO:</label>

          <TextField
            margin="dense"
            name="bio"
            label=""
            fullWidth
            value={profileData.bio}
            onChange={handleChange}
          />
          <label>PHONE NO:</label>
          <PhoneInput
            country={"us"} // Default country code
            value={profileData?.phone}
            onChange={handlePhoneChange}
            inputStyle={{ width: "100%" }} // Customize input styles if needed
          />

          <label>COUNTRY:</label>

          <TextField
            select
            margin="dense"
            name="country"
            label="Country"
            fullWidth
            value={profileData.country}
            onChange={handleChange}
          >
            {countries.map((country) => (
              <MenuItem key={country.isoCode} value={country.name}>
                {country.name}
              </MenuItem>
            ))}
          </TextField>
          <label>WORK EXPERIENCE</label>
          <RadioGroup
            row
            name="experience"
            value={profileData.experience}
            onChange={handleChange}
          >
            <FormControlLabel
              value="Fresher"
              control={<Radio />}
              label="Fresher"
            />
            <FormControlLabel
              value="Experienced"
              control={<Radio />}
              label="Experienced"
            />
          </RadioGroup>
          <label>AVAILABLE TO JOIN:</label>

          <Select
            fullWidth
            name="joinIn"
            value={profileData.joinIn}
            onChange={(e: SelectChangeEvent<string>) => handleChange(e)}
          >
            <MenuItem value="Immediately">Immediately</MenuItem>
            <MenuItem value="10 days">10 days</MenuItem>
            <MenuItem value="30 days">30 days</MenuItem>
            <MenuItem value="Immediately">60 days</MenuItem>
            <MenuItem value="Immediately">90 days</MenuItem>
            <MenuItem value="Immediately">90+ days</MenuItem>
          </Select>
          <label>LINKEDIN PROFILE</label>

          <TextField
            margin="dense"
            name="linkedin"
            label=""
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

      {/* Edit Education Dialog */}
      <Dialog open={educationDialogOpen} onClose={handleEducationDialogClose}>
        <DialogTitle>{dialogText}</DialogTitle>
        {dialogText==="Add Education"&&
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* 10th Class */}
            <Typography variant="h6">10th Class</Typography>
            <TextField
              margin="dense"
              name="institution"
              label="Institution"
              fullWidth
              value={profileData.education.class10.institution}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => handleEducationChange(e, "class10")}
            />

            <DatePicker
              label="Year of Completion"
              views={["year"]}
              value={
                profileData.education.class10.year
                  ? dayjs(profileData.education.class10.year)
                  : null
              }
              onChange={(date: dayjs.Dayjs | null) =>
                handleDateChange(date, "class10")
              }
              slotProps={{
                textField: { margin: "dense", fullWidth: true },
              }}
            />

            {/* 12th Class */}
            <Typography variant="h6">12th Class</Typography>
            <TextField
              margin="dense"
              name="institution"
              label="Institution"
              fullWidth
              value={profileData.education.class12.institution}
              onChange={(e) => handleEducationChange(e, "class12")}
            />
            <DatePicker
              label="Year of Completion"
              views={["year"]}
              value={
                profileData.education.class12.year
                  ? dayjs(profileData.education.class12.year)
                  : null
              }
              onChange={(date) => handleDateChange(date, "class12")}
              slotProps={{
                textField: { margin: "dense", fullWidth: true },
              }}
            />

            {/* Graduation */}
            <Typography variant="h6">Graduation</Typography>
            <TextField
              margin="dense"
              name="institution"
              label="Institution"
              fullWidth
              value={profileData.education.graduation.institution}
              onChange={(e) => handleEducationChange(e, "graduation")}
            />
            <DatePicker
              label="Year of Completion"
              views={["year"]}
              value={
                profileData.education.graduation.year
                  ? dayjs(profileData.education.graduation.year)
                  : null
              }
              onChange={(date) => handleDateChange(date, "graduation")}
              slotProps={{
                textField: { margin: "dense", fullWidth: true },
              }}
            />

            {/* Post-Graduation */}
            <Typography variant="h6">Post-Graduation</Typography>
            <TextField
              margin="dense"
              name="institution"
              label="Institution"
              fullWidth
              value={profileData.education.postGraduation.institution}
              onChange={(e) => handleEducationChange(e, "postGraduation")}
            />
            <DatePicker
              label="Year of Completion"
              views={["year"]}
              value={
                profileData.education.postGraduation.year
                  ? dayjs(profileData.education.postGraduation.year)
                  : null
              }
              onChange={(date) => handleDateChange(date, "postGraduation")}
              slotProps={{
                textField: { margin: "dense", fullWidth: true },
              }}
            />

            {/* Diploma */}
            <Typography variant="h6">Diploma</Typography>
            <TextField
              margin="dense"
              name="institution"
              label="Institution"
              fullWidth
              value={profileData.education.diploma.institution}
              onChange={(e) => handleEducationChange(e, "diploma")}
            />
            <DatePicker
              label="Year of Completion"
              views={["year"]}
              value={
                profileData.education.diploma.year
                  ? dayjs(profileData.education.diploma.year)
                  : null
              }
              onChange={(date) => handleDateChange(date, "diploma")}
              slotProps={{
                textField: { margin: "dense", fullWidth: true },
              }}
            />
          </LocalizationProvider>
        </DialogContent>
}
        <DialogActions>
          <Button onClick={handleEducationDialogClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ProfilePage;
