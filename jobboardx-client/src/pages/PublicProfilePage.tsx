import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  CircularProgress,
  Divider,
  Button,
  Link,
} from "@mui/material";
import { fetchProfileById } from "../services/profileService";
import { Profile } from "../types/profile";

const PublicProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (id) {
          const data = await fetchProfileById(id);
          setProfile(data);
        } else {
          setError("No profile ID provided");
        }
      } catch (err) {
        setError("Failed to load profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Profile not found</Typography>;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {profile.fullName}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            About
          </Typography>
          <Typography>{profile.bio}</Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Skills
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
            {profile.skills.map((skill, index) => (
              <Chip key={index} label={skill} sx={{ m: 0.5 }} />
            ))}
          </Stack>

          <Typography variant="h6" gutterBottom>
            Experience
          </Typography>
          <Typography paragraph>{profile.experience}</Typography>

          {profile.resumeLink && (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Resume
              </Typography>
              <Button
                component={Link}
                href={profile.resumeLink}
                target="_blank"
                rel="noopener"
                variant="contained">
                View Resume
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PublicProfilePage;
