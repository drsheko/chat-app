import { useEffect, useState , useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { UserContext } from "../App";
import  Card from "@mui/material/Card";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box'
import { Paper, Typography } from "@mui/material";
import TextField from '@mui/material/TextField';
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from '@mui/material/Button';
const Login = (props) => {
  let navigate = useNavigate();
  let {setUser} =useContext(UserContext)
  const [error, setError] = useState();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [show, setShow] =useState(false);

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      var res = await axios.post("http://localhost:3001/api/login",{
        username: form.username,
        password: form.password
      })     
      let success = res.data.success;
      if(success){
        var user = res.data.user;
         // Save logged user to local storage
         localStorage.setItem("CHAT_APP_user", JSON.stringify(user));
         setUser(user);
         navigate("/", { replace: true });
      } 
      
    } catch (error) {
      setError(error.response.data.error.error)
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 

  return (
    <Paper sx={{width:'100%', height:'100vh'}} className='d-flex justify-content-center'>
    <Card className="p-2 p-sm-3 p-md-4 d-flex flex-column m-auto" elevation={15}>
      <Box className="card-header" >
        <Typography className=" text-center" variant='h2' color='primary'>Login</Typography>
        <Typography className="text-center text-muted h6">
          Don't have an account ?{" "}
          <span className="text-nowrap">
            <Link to="/signup">Sign-up</Link>
          </span>
        </Typography>
      </Box>
      {error&& (
          <Alert severity="error"  onClose={()=>setError('')} className='text-capitalize my-2'>
           
            {error} !!
          </Alert>
        ) }
      <form onSubmit={handleFormSubmit} className=" p-2 p-sm-3 p-md-4  d-flex flex-column">
        
        <TextField
          name="username"
          id="outlined-required"
          label='Username'
          value={form.username}
          onChange={handleChange}
          required
        />
       
        <FormControl sx={{ mt: 2 }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password *
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            value={form.password}
            name='password'
            onChange={handleChange}
            type={show ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShow(state => !state)}
                  edge="end"
                >
                  {show ? <VisibilityOff color='primary'/> : <Visibility color="primary" />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
           required
          />
        </FormControl>
    

       
        <Button
          type="submit"
          className="  text-center my-4"
          value="submit"
          variant="contained"
        >
          <Typography className="fw-bolder text-capitalize">Login</Typography>
        </Button>
        
      </form>
    </Card>
    </Paper>
  );
};

export default Login;
