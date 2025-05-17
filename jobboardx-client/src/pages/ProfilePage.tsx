import {
  TextField,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Link,
  InputLabel,
  Box,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { fetchMyProfile, updateProfile } from "../services/profileService";
import { Profile } from "../types/profile";

type ProfileFormValues = {
  fullName: string;
  bio: string;
  skills: string;
  experience: string;
  resumeLink: string;
};

const ProfileSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  bio: Yup.string().required("Bio is required"),
  skills: Yup.string().required("At least one skill is required"),
  experience: Yup.string().required("Experience is required"),
  resumeLink: Yup.string()
    .url("Enter a valid URL")
    .required("Resume link is required"),
});

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormValues | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(ProfileSchema),
    defaultValues: {
      fullName: "",
      bio: "",
      skills: "",
      experience: "",
      resumeLink: "",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchMyProfile();
        const formattedProfile = {
          fullName: data.fullName || "",
          bio: data.bio || "",
          skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
          experience: data.experience || "",
          resumeLink: data.resumeLink || "",
        };

        setProfileData(formattedProfile);
        reset(formattedProfile);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [reset]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    try {
      const updatedProfile: Profile = {
        fullName: data.fullName,
        bio: data.bio,
        experience: data.experience,
        resumeLink: data.resumeLink,
        skills: data.skills.split(",").map((s) => s.trim()),
      };

      await updateProfile(updatedProfile);
      setProfileData(data);
      setEditMode(false);
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile.");
    }
  };

  if (loading)
    return <CircularProgress sx={{ mx: "auto", mt: 4, display: "block" }} />;

  if (!profileData) return <Typography>Profile not found</Typography>;

  return (
    <Stack spacing={3} sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4">My Profile</Typography>

      {editMode ? (
        <Box component="div">
          <Box sx={{ mb: 3 }}>
            <InputLabel shrink htmlFor="fullName">
              Full Name
            </InputLabel>
            <TextField
              fullWidth
              margin="normal"
              id="fullName"
              {...register("fullName")}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />

            <InputLabel shrink htmlFor="bio" sx={{ mt: 2 }}>
              Bio
            </InputLabel>
            <TextField
              fullWidth
              margin="normal"
              id="bio"
              multiline
              minRows={3}
              {...register("bio")}
              error={!!errors.bio}
              helperText={errors.bio?.message}
            />

            <InputLabel shrink htmlFor="skills" sx={{ mt: 2 }}>
              Skills (comma-separated)
            </InputLabel>
            <TextField
              fullWidth
              margin="normal"
              id="skills"
              {...register("skills")}
              error={!!errors.skills}
              helperText={errors.skills?.message}
            />

            <InputLabel shrink htmlFor="experience" sx={{ mt: 2 }}>
              Experience
            </InputLabel>
            <TextField
              fullWidth
              margin="normal"
              id="experience"
              {...register("experience")}
              error={!!errors.experience}
              helperText={errors.experience?.message}
            />

            <InputLabel shrink htmlFor="resumeLink" sx={{ mt: 2 }}>
              Resume Link
            </InputLabel>
            <TextField
              fullWidth
              margin="normal"
              id="resumeLink"
              {...register("resumeLink")}
              error={!!errors.resumeLink}
              helperText={errors.resumeLink?.message}
            />

            <Box sx={{ mt: 3 }}>
              <Button
                onClick={handleSubmit(onSubmit)}
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
                sx={{ mb: 1 }}>
                {isSubmitting ? "Saving..." : "Save Profile"}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  reset(profileData);
                  setEditMode(false);
                }}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Stack spacing={2}>
          <Typography>
            <strong>Name:</strong> {profileData.fullName}
          </Typography>
          <Typography>
            <strong>Bio:</strong> {profileData.bio}
          </Typography>
          <Typography>
            <strong>Skills:</strong> {profileData.skills}
          </Typography>
          <Typography>
            <strong>Experience:</strong> {profileData.experience}
          </Typography>
          <Typography>
            <strong>Resume:</strong>{" "}
            <Link href={profileData.resumeLink} target="_blank" rel="noopener">
              View Resume
            </Link>
          </Typography>
          <Button variant="contained" onClick={() => setEditMode(true)}>
            Edit Profile
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default ProfilePage;
