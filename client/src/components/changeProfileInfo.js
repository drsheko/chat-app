import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "../App";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";

function ChangeProfileInfo(props) {
  let { user, setUser } = useContext(UserContext);
  const [success, setSuccess] = useState("");
  const [username, setUsername] = useState({
    message: "",
    value: "",
  });
  const changeInfo = async (e) => {
    e.preventDefault();

    // validation
    let validationScore = 0;
    if (username.value.trim().length < 6) {
      setUsername({ ...username, message: "username is too short" });
      validationScore++;
    }

    if (validationScore > 0) {
      return;
    } else {
      try {
        let url = "http://localhost:3001/api/user/editProfile/changeInfo";
        let res = await axios.post(url, {
          userId: user._id,
          username: username.value,
        });
        let success = await res.data.success;
        if (success) {
          setSuccess(true);
          let updatedUser = res.data.user;
          setUser(updatedUser);
          localStorage.setItem("CHAT_APP_user", JSON.stringify(updatedUser));

          setUsername({ ...username, value: "", message: "" });
        } else {
          setSuccess(false);
          setUsername({ ...username, message: "incorrect username!!!" });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
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
            Success — Profile has been updated!
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
            Error — Please try again later!!!
          </Alert>
        ) : (
          ""
        )}
        <FormControl sx={{ mt: 2, width: "25ch" }} variant="outlined">
          <InputLabel htmlFor="username">Username</InputLabel>
          <OutlinedInput
            id="username"
            value={username.value}
            onChange={(e) => {
              setUsername({ ...username, value: e.target.value });
            }}
            type="text"
            label="Username"
          />
        </FormControl>
        <FormHelperText className="px-3 mt-0">
          {username.message}
        </FormHelperText>

        <div className="px-2 mt-4">
          <Button variant="contained" className="px-5" onClick={changeInfo}>
            Save
          </Button>
        </div>
      </Card>
    </form>
  );
}

export default ChangeProfileInfo;
