import {
  Box,
  Button,
  TextField,
  Typography,
  InputLabel,
  TextareaAutosize,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const JobSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  location: Yup.string().required("Location is required"),
  salary: Yup.string().required("Salary is required"),
});

type JobFormValues = {
  title: string;
  description: string;
  location: string;
  salary: string;
};

const CreateJob = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
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

  const onSubmit = async (data: JobFormValues) => {
    try {
      await api.post("/jobs", data);
      navigate("/employer/jobs");
    } catch (err) {
      console.error("Job creation failed", err);
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      <Typography variant="h4" mb={2}>
        Post New Job
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
          {isSubmitting ? "Posting..." : "Post Job"}
        </Button>
      </form>
    </Box>
  );
};

export default CreateJob;
