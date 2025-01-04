import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import resizePhoto from "../tools/compressUpload";

const Signup = () => {
  let navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [upload, setUpload] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [image, setImage] = useState(null);
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      var formData = new FormData();
      formData.append("username", form.username);
      formData.append("password", form.password);
      formData.append("confirmPassword", form.confirmPassword);
      formData.append("avatarURL", upload);
      var res = await axios.post("http://localhost:3001/api/sign-up", formData);
      let success = res.data.success;
      if (success) {
        navigate("/login", { replace: true });
      }
    } catch (error) {
     
     setErrors(error.response.data.errors);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadFile = async (e) => {
    var file = e.target.files[0];
    file = await resizePhoto(file);
    setUpload(file);
    setIsSelected(true);
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <Paper
      sx={{ width: "100%", height: "100vh", overflowY: "scroll" }}
      className="d-flex justify-content-center"
    >
      <Card className="p-1  d-flex flex-column m-auto" elevation={15}>
        <Box className="card-header">
          <Typography className=" text-center" variant="h2" color="primary">
            Sign up
          </Typography>
          <Typography className="text-center text-muted h6">
            Do you have an account?{' '}
            <Typography component={Link} to="/login" style={{textDecoration:'none'}} color='primary'>
              Login
            </Typography>
          </Typography>
        </Box>
        <form 
          className=" p-2 p-sm-3 p-md-4  d-flex flex-column"
          onSubmit={handleFormSubmit}
        >
          {errors.length > 0 &&
            errors.map((error) => (
              <Alert severity="error" onClose={() => setErrors([])}>
                {error} !!
              </Alert>
            ))}
          <Box className="text-center col-12 mb-2 d-flex flex-column align-items-center">
            <Badge
              className="m-2"
              color="primary"
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <label htmlFor="avatar" className="bi bi-camera-fill" type="button">
                  {" "}
                </label>
              }
            >
              <Avatar
                src={image ? image : require("../images/unknown.jpg")}
                sx={{ width: 80, height: 80 }}
              />
            </Badge>
          </Box>
          <input
            type="file"
            id="avatar"
            name="avatarURL"
            onChange={uploadFile}
            onClick={() => {
              setUpload(null);
              setImage(null);
            }}
            style={{ display: "none" }}
          />
          <TextField
            name="username"
            id="outlined-required"
            label="Username"
            value={form.username}
            onChange={handleChange}
            size="small"
            required
          />
          <FormControl sx={{ mt: 2 }} variant="outlined" size="small">
            <InputLabel htmlFor="outlined-adornment-password">
              Password *
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              value={form.password}
              name="password"
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((state) => !state)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff color="primary" />
                    ) : (
                      <Visibility color="primary" />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              required
            />
          </FormControl>
          <FormControl sx={{ mt: 2 }} variant="outlined" size="small">
            <InputLabel htmlFor="outlined-adornment-password">
              Password Confirmation *
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              value={form.confirmPassword}
              name="confirmPassword"
              onChange={handleChange}
              type={showConfirmation ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowConfirmation((state) => !state)}
                    edge="end"
                  >
                    {showConfirmation ? (
                      <VisibilityOff color="primary" />
                    ) : (
                      <Visibility color="primary" />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Password Confirmation"
              required
            />
          </FormControl>
          <Button
            type="submit"
            className="text-center mt-2 mb-2"
            value="submit"
            variant="contained"
          >
            <Typography className="fw-bolder text-capitalize">
              Sign
              <span className="text-lowercase">up</span>
            </Typography>
          </Button>
        </form>
      </Card>
    </Paper>
  );
};

export default Signup;
