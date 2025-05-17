import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  TextareaAutosize,
  InputLabel,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import api from "../../services/api";

type JobFormValues = {
  title: string;
  description: string;
  location: string;
  salary: string;
};

const JobSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  location: Yup.string().required("Location is required"),
  salary: Yup.string().required("Salary is required"),
});

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: yupResolver(JobSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      salary: "",
    },
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        const job = res.data;
        // ensure all values are strings for form compatibility
        reset({
          title: job.title || "",
          description: job.description || "",
          location: job.location || "",
          salary: String(job.salary || ""),
        });
      } catch (err) {
        console.error("Failed to load job", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, reset]);

  const onSubmit: SubmitHandler<JobFormValues> = async (data) => {
    try {
      await api.put(`/jobs/${id}`, data);
      navigate("/employer/jobs");
    } catch (err) {
      console.error("Job update failed", err);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h4" mb={2}>
        Edit Job
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputLabel shrink htmlFor="title">
          Title
        </InputLabel>
        <TextField
          fullWidth
          margin="normal"
          id="title"
          {...register("title")}
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <InputLabel shrink htmlFor="description">
          Description
        </InputLabel>
        <TextareaAutosize
          minRows={4}
          id="description"
          placeholder="Enter job description"
          {...register("description")}
          style={{
            width: "100%",
            fontSize: "1rem",
            padding: "12px",
            borderRadius: "4px",
            borderColor: errors.description ? "red" : "#ccc",
          }}
        />
        {errors.description && (
          <Typography color="error" variant="caption">
            {errors.description.message}
          </Typography>
        )}

        <InputLabel shrink htmlFor="location">
          Location
        </InputLabel>
        <TextField
          fullWidth
          margin="normal"
          id="location"
          {...register("location")}
          error={!!errors.location}
          helperText={errors.location?.message}
        />

        <InputLabel shrink htmlFor="salary">
          Salary
        </InputLabel>
        <TextField
          fullWidth
          type="number"
          margin="normal"
          id="salary"
          {...register("salary")}
          error={!!errors.salary}
          helperText={errors.salary?.message}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isSubmitting}
          sx={{ mt: 2 }}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Box>
  );
};

export default EditJob;
