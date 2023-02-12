import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../App";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";

function ChangePasswordForm(props) {
  let {user, setUser} = useContext(UserContext);
  const [oldPassword, setOldPassword] = useState({
    show: false,
    message: "",
    value: "",
  });
  const [newPassword, setNewPassword] = useState({
    show: false,
    message: "",
    value: "",
  });
  const [confirmPassword, setConfirmPassword] = useState({
    show: false,
    message: "",
    value: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const changePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    //reset error message
    setOldPassword({...oldPassword, message:''});
    // validation
    let validationScore = 0;
    if (oldPassword.value.trim().length < 6) {
      setOldPassword({ ...oldPassword, message: "password is too short" });
      validationScore++;
    }
    if (newPassword.value.trim().length < 6) {
      setNewPassword({
        ...newPassword,
        message: "password should be atleast 6 letters",
      });
      validationScore++;
    } else {
      setNewPassword({ ...newPassword, message: "" });
    }
    if (newPassword.value !== confirmPassword.value) {
      setConfirmPassword({
        ...confirmPassword,
        message: "password does not match",
      });
      validationScore++;
    } else {
      setConfirmPassword({ ...confirmPassword, message: "" });
    }
    if (validationScore > 0) {
      setLoading(false);
      return;
    } else {
      try {
        let url = "http://localhost:3001/api/user/editProfile/changePassword";
        let res = await axios.post(url, {
          userId: user._id,
          oldPassword: oldPassword.value,
          newPassword: newPassword.value,
        });
        let success = await res.data.success;
        if (success) {
          setSuccess(true);
          setOldPassword({ ...oldPassword, value: "", message: "" });
          setNewPassword({ ...newPassword, value: "", message: "" });
          setConfirmPassword({ ...confirmPassword, value: "", message: "" });
          let updatedUser = res.data.user;
          setUser(updatedUser);
          localStorage.setItem("CHAT_APP_user", JSON.stringify(updatedUser));
          
        } else {
          setSuccess(false);
          setOldPassword({ ...oldPassword, message: "incorrect password!!!" });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess("");
    }, 10000);
    return () => clearTimeout(timer);
  }, [success]);
  
  return (
    <form>
      <Card className="d-flex flex-column p-3" elevation={10}>
        {success === true ? (
          <Alert
            severity="success"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setSuccess("");
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            Success — Password has been updated!
          </Alert>
        ) : success === false ? (
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setSuccess("");
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            Error — Please reenter your password!
          </Alert>
        ) : (
          ""
        )}
        <FormControl sx={{ mt: 2, width: "25ch" }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Old Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            value={oldPassword.value}
            onChange={(e) => {
              setOldPassword({ ...oldPassword, value: e.target.value });
            }}
            type={oldPassword.show ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setOldPassword({ ...oldPassword, show: !oldPassword.show });
                  }}
                  edge="end"
                >
                  {oldPassword.show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Old Password"
          />
        </FormControl>
        <FormHelperText className="px-3 mt-0">
          {oldPassword.message}
        </FormHelperText>
        <FormControl sx={{ mt: 2, width: "25ch" }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            New Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            value={newPassword.value}
            onChange={(e) => {
              setNewPassword({ ...newPassword, value: e.target.value });
            }}
            type={newPassword.show ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setNewPassword({ ...newPassword, show: !newPassword.show });
                  }}
                  edge="end"
                >
                  {newPassword.show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="New Password"
          />
        </FormControl>
        <FormHelperText className="px-3 mt-0">
          {newPassword.message}
        </FormHelperText>
        <FormControl sx={{ mt: 2, width: "25ch" }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Confirm Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            value={confirmPassword.value}
            onChange={(e) => {
              setConfirmPassword({ ...confirmPassword, value: e.target.value });
            }}
            type={confirmPassword.show ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setConfirmPassword({
                      ...confirmPassword,
                      show: !confirmPassword.show,
                    });
                  }}
                  edge="end"
                >
                  {confirmPassword.show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Confirm Password"
          />
        </FormControl>
        <FormHelperText className="px-3 mt-0">
          {confirmPassword.message}
        </FormHelperText>
        <div className="px-2 mt-4">
          <Button variant="contained" className="px-5" onClick={changePassword}>
            Save
          </Button>
        </div>
      </Card>
    </form>
  );
}

export default ChangePasswordForm;
