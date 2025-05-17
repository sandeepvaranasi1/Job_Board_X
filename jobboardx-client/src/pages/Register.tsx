import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const RegisterSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6).required("Password is required"),
  role: Yup.string()
    .oneOf(["jobseeker", "employer"])
    .required("Role is required"),
});

type RegisterFormData = Yup.InferType<typeof RegisterSchema>;

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(RegisterSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "jobseeker",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const success = await registerUser(data);
      if (success) navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={6}>
      <Typography variant="h4" gutterBottom>
        Create an Account
      </Typography>

      <TextField
        label="Full Name"
        fullWidth
        margin="normal"
        {...register("fullName")}
        error={!!errors.fullName}
        helperText={errors.fullName?.message}
      />

      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <TextField
        select
        label="Role"
        fullWidth
        margin="normal"
        defaultValue="jobseeker"
        {...register("role")}
        error={!!errors.role}
        helperText={errors.role?.message}
      >
        <MenuItem value="jobseeker">Job Seeker</MenuItem>
        <MenuItem value="employer">Employer</MenuItem>
      </TextField>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? <CircularProgress size={24} /> : "Register"}
      </Button>

      <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
        Already have an account?{" "}
        <Button color="primary" onClick={() => navigate("/login")}>
          Login here
        </Button>
      </Typography>
    </Box>
  );
};

export default Register;
