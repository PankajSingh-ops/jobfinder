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
  Slider,
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
import GitHub from "@mui/icons-material/GitHub";

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
    userId:user?.id,
    country: "",
    experience: "Fresher",
    joinIn: "10 days",
    linkedin: "",
    github:"",
    phone: "",
    bio: "",
    dob:null,
    maritalStatus: "", // Added for marital status radio options
  category: "", // Added for category selection (General, OBC, etc.)
  differentlyAbled: "", // Added for Differently Abled status (Yes/No)
  careerBreak: "", // Added for Career Break status (Yes/No)
  permanentAddress: "", // Added for address details
  postalOffice: "",
  hometown: "",
  pincode: "",
  softSkills: {
    communication: 0,
    leadership: 0,
    problemSolving: 0,
    workEthic: 0,
    timeManagement: 0,
    teamwork: 0,
  },
  ITSkills: [
    { skill: "", experienceMonths: 0, experienceYears: 0 }, // Initialize with one empty skill entry
  ],
    education: {
      class10: { degree: "10th Class", institution: "", year: null as number | null },
      class12: { degree: "12th Class", institution: "", year: null as number | null },
      graduation: { degree: "Graduation", institution: "", year: null as number | null },
      postGraduation: { degree: "Post-Graduation", institution: "", year: null as number | null },
      diploma: { degree: "Diploma", institution: "", year: null as number | null },
    },
  });
  const [resume, setResume] = useState<string | null>(null);
  const [certificates, setCertificates] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
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
  const handleRadioChange = (field: keyof typeof profileData, value: string) => {
    setProfileData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof typeof profileData) => {
    setProfileData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };
  
  

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
) => {
    const file = e.target.files?.[0];
    if (file) {
        // Convert the file to Base64 and store it
        convertToBase64(file).then((base64) => {
          if (typeof base64 === 'string') { // Check if base64 is a string

            if (type === "resume") {
                setResume(base64); // Store Base64 string for resume
            } else {
                setCertificates(base64); // Store Base64 string for certificates
            }
          }
        });
    }
};

const handleSliderChange = (field: string) => (event: Event, value: number | number[]) => {
  // If you're only using a single slider, you can assume `value` will be a number.
  const newValue = Array.isArray(value) ? value[0] : value;

  setProfileData((prevData) => ({
    ...prevData,
    softSkills: {
      ...prevData.softSkills,
      [field]: newValue,
    },
  }));
};



const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
      // Convert the profile picture to Base64 and store it
      convertToBase64(file).then((base64) => {
          if (typeof base64 === 'string') { // Ensure base64 is a string
              setProfilePic(base64); // Store Base64 string for profile picture
          }
      });
  }
};

  const convertToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result); // Return Base64 string
        reader.onerror = (error) => reject(error); // Handle error
    });
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



  const addSkill = () => {
    setProfileData((prevData) => ({
      ...prevData,
      ITSkills: [...prevData.ITSkills, { skill: "", experienceMonths: 0, experienceYears: 0 }],
    }));
  };

  const removeSkill = (index:number) => {
    setProfileData((prevData) => {
      const updatedSkills = [...prevData.ITSkills];
      updatedSkills.splice(index, 1); // Remove skill at specified index
      return {
        ...prevData,
        ITSkills: updatedSkills,
      };
    });
  };

  type SkillField = 'skill' | 'experienceMonths' | 'experienceYears';

const handleSkillChange = (
    index: number,
    field: SkillField, // Use a union type for field
    value: string | number // Value can be either string or number
) => {
    setProfileData((prevData) => {
        const updatedSkills = [...prevData.ITSkills];

        // Update the corresponding field based on the field name
        if (field === 'experienceMonths' || field === 'experienceYears') {
            updatedSkills[index][field] = Number(value); // Convert to number for experience fields
        } else {
            updatedSkills[index][field] = value as string; // Otherwise treat as string
        }

        return {
            ...prevData,
            ITSkills: updatedSkills,
        };
    });
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
    formData.append("github",profileData.github);
    formData.append("userId", profileData.userId || "");
    formData.append("maritalStatus", profileData.maritalStatus || "");
  formData.append("category", profileData.category || "");
  formData.append("differentlyAbled", profileData.differentlyAbled || "");
  formData.append("careerBreak", profileData.careerBreak || "");
  formData.append("permanentAddress", profileData.permanentAddress || "");
  formData.append("postalOffice", profileData.postalOffice || "");
  formData.append("hometown", profileData.hometown || "");
  formData.append("pincode", profileData.pincode || "");
  Object.entries(profileData.softSkills).forEach(([skill, value]) => {
    formData.append(`softSkills[${skill}]`, value.toString() || "0");
  });
  
  // Append IT skills
  profileData.ITSkills.forEach((itSkill, index) => {
    formData.append(`ITSkills[${index}][skill]`, itSkill.skill || "");
    formData.append(`ITSkills[${index}][experienceMonths]`, itSkill.experienceMonths.toString() || "0");
    formData.append(`ITSkills[${index}][experienceYears]`, itSkill.experienceYears.toString() || "0");
  });

  
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
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <GitHub sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      GitHub: {profileData.github}
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
{dialogText === "Add Personal Details" && (
        <DialogContent>
          {/* Marital Status */}
          <Typography variant="h6">Marital Status</Typography>
          <div className={styles["custom-radio-group"]}>
            {["Single", "Married", "Widowed", "Divorced", "Other"].map((status) => (
              <div
                key={status}
                className={`${styles["custom-radio"]} ${
                  profileData.maritalStatus === status ? styles["selected"] : ""
                }`}
                onClick={() => handleRadioChange("maritalStatus", status)}
              >
                {status}
              </div>
            ))}
          </div>

          {/* Category */}
          <Typography variant="h6">Category</Typography>
          <div className={styles["custom-radio-group"]}>
            {["General", "Scheduled Caste", "Scheduled Tribe", "OBC", "Others"].map((category) => (
              <div
                key={category}
                className={`${styles["custom-radio"]} ${
                  profileData.category === category ? styles["selected"] : ""
                }`}
                onClick={() => handleRadioChange("category", category)}
              >
                {category}
              </div>
            ))}
          </div>

          {/* Differently Abled */}
          <Typography variant="h6">Are you differently abled?</Typography>
          <div className={styles["custom-radio-group"]}>
            {["Yes", "No"].map((abled) => (
              <div
                key={abled}
                className={`${styles["custom-radio"]} ${
                  profileData.differentlyAbled === abled ? styles["selected"] : ""
                }`}
                onClick={() => handleRadioChange("differentlyAbled", abled)}
              >
                {abled}
              </div>
            ))}
          </div>

          {/* Career Break */}
          <Typography variant="h6">Have you taken a career break?</Typography>
          <div className={styles["custom-radio-group"]}>
            {["Yes", "No"].map((careerBreak) => (
              <div
                key={careerBreak}
                className={`${styles["custom-radio"]} ${
                  profileData.careerBreak === careerBreak ? styles["selected"] : ""
                }`}
                onClick={() => handleRadioChange("careerBreak", careerBreak)}
              >
                {careerBreak}
              </div>
            ))}
          </div>

          {/* Address Section */}
          <Typography variant="h6">Permanent Address</Typography>
          <TextField
            margin="dense"
            name="permanentAddress"
            label="Permanent Address"
            fullWidth
            value={profileData.permanentAddress}
            onChange={(e) => handleInputChange(e, "permanentAddress")}
          />

          <TextField
            margin="dense"
            name="postalOffice"
            label="Postal Office"
            fullWidth
            value={profileData.postalOffice}
            onChange={(e) => handleInputChange(e, "postalOffice")}
          />

          <TextField
            margin="dense"
            name="hometown"
            label="Hometown"
            fullWidth
            value={profileData.hometown}
            onChange={(e) => handleInputChange(e, "hometown")}
          />

          <TextField
            margin="dense"
            name="pincode"
            label="Pincode"
            fullWidth
            value={profileData.pincode}
            onChange={(e) => handleInputChange(e, "pincode")}
          />
        </DialogContent>
      )}
      
      {dialogText === "Add Soft Skills" && (
  <DialogContent>
    <Typography variant="h6">Good Communication and Interpersonal Skills</Typography>
    <Slider
      value={profileData.softSkills.communication}
      onChange={handleSliderChange("communication")}
      aria-labelledby="communication-slider"
      min={0}
      max={10}
      valueLabelDisplay="on"
    />
    
    <Typography variant="h6">Leadership</Typography>
    <Slider
      value={profileData.softSkills.leadership}
      onChange={handleSliderChange("leadership")}
      aria-labelledby="leadership-slider"
      min={0}
      max={10}
      valueLabelDisplay="on"
    />
    
    <Typography variant="h6">Problem-Solving</Typography>
    <Slider
      value={profileData.softSkills.problemSolving}
      onChange={handleSliderChange("problemSolving")}
      aria-labelledby="problem-solving-slider"
      min={0}
      max={10}
      valueLabelDisplay="on"
    />
    
    <Typography variant="h6">Work Ethic</Typography>
    <Slider
      value={profileData.softSkills.workEthic}
      onChange={handleSliderChange("workEthic")}
      aria-labelledby="work-ethic-slider"
      min={0}
      max={10}
      valueLabelDisplay="on"
    />
    
    <Typography variant="h6">Time Management</Typography>
    <Slider
      value={profileData.softSkills.timeManagement}
      onChange={handleSliderChange("timeManagement")}
      aria-labelledby="time-management-slider"
      min={0}
      max={10}
      valueLabelDisplay="on"
    />
    
    <Typography variant="h6">Teamwork</Typography>
    <Slider
      value={profileData.softSkills.teamwork}
      onChange={handleSliderChange("teamwork")}
      aria-labelledby="teamwork-slider"
      min={0}
      max={10}
      valueLabelDisplay="on"
    />
  </DialogContent>
)}

{dialogText === "Add IT Skills" && (
        <DialogContent>
          <Typography variant="h6">Add Your IT Skills</Typography>
          {profileData.ITSkills.map((skillData, index) => (
            <div key={index}>
              <TextField
                label="Skill"
                value={skillData.skill}
                onChange={(e) => handleSkillChange(index, 'skill', e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Experience (Months)"
                type="number"
                value={skillData.experienceMonths}
                onChange={(e) => handleSkillChange(index, 'experienceMonths', Number(e.target.value))}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Experience (Years)"
                type="number"
                value={skillData.experienceYears}
                onChange={(e) => handleSkillChange(index, 'experienceYears', Number(e.target.value))}
                fullWidth
                margin="normal"
              />
              <Button onClick={() => removeSkill(index)} color="error">Remove Skill</Button>
            </div>
          ))}
          <Button onClick={addSkill} variant="outlined">Add More Skill</Button>
        </DialogContent>
      )}



      
        <DialogActions>
          <Button onClick={handleEducationDialogClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ProfilePage;
