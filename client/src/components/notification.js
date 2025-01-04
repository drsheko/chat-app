import { useState, useEffect } from "react";
import axios from 'axios'
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Grid from '@mui/material/Unstable_Grid2';

function TransitionDown(props) {
  return <Slide {...props} direction="down" />;
}

export default function Notification(props) {
  const [open, setOpen] = useState(false);
  const [transition, setTransition] = useState(undefined);
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [sender, setSender] =useState(null);
  const { vertical, horizontal } = state;
  const handleClick = (Transition) => () => {
   
    setTransition(() => Transition);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const getUserByUserId =async (id) =>{
    let url = 'https://chat-app-pi46.onrender.com/api/users/user'
    try{
        let res = await axios.post( url,{
            userId:id
        })
        setSender(res.data.user)
    }
    catch(error){
        console.log(error.msg)
    }
}

  useEffect(() => {
    
    if (props.notification) {
      if(props.notification.type === 'text'){
        setSender(props.notification.postedBy)
      }else{
        const getUserByUserId =async (id) =>{
            let url = 'https://chat-app-pi46.onrender.com/api/users/user'
            try{
                let res = await axios.post( url,{
                    userId:id
                })
                setSender(res.data.user)
            }
            catch(error){
                console.log(error.msg)
            }
        }
        getUserByUserId(props.notification.postedBy)
      }
      handleClick(TransitionDown)();
    }
  }, [props.notification]);
  return (
    
        <Snackbar
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical, horizontal }}
          TransitionComponent={transition}
          style={{minWidth:'100vw'}}
        >
            <Grid container display="flex" justifyContent="center" style={{minWidth:'100%'}}>
                <Grid xs={10} sm={8} md={7} lg={5}>

                
            
          <Card style={{ backgroundColor: "#fff9c4" }}>
            <CardHeader
                style={{margin:0}}
              avatar={<Avatar alt="Ted talk" src="" />}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  sx={{ p: 0.5 }}
                  onClick={handleClose}
                >
                  <CloseIcon />
                </IconButton>
              }
              title={sender?sender.username :''}
              subheader={props.notification.type ==='text'?
                props.notification.message
              :props.notification.type ==='photo' ?
              'PHOTO MESSAGE'
              :''
            }
            />
            {  props.notification.type ==='voice'?
              <Grid container display="flex" justifyContent="center" style={{minWidth:'100%',margin:0}}>
                <Grid xs={10}  display="flex" justifyContent="center">
                    <audio src={props.notification.message} controls style={{margin:'-20px 0 5px'}}/>
                </Grid>
              </Grid>  
              
              :''
            }
           
          </Card>
          </Grid>
            </Grid>
       
        </Snackbar>
     
  );
}
