import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import  Typography  from "@mui/material/Typography";
import moment from 'moment'
import PhoneMissedRoundedIcon from '@mui/icons-material/PhoneMissedRounded';
import PhoneSharpIcon from '@mui/icons-material/PhoneSharp';


const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));
function ChatMsg({message, userId, sender}) {
    const myColor =  "#ab47bc" ;
    const otherColor = '#eeeeee';

   
 
  return (
    <div style={{display:'flex' ,flexDirection:'column'}}>
        {
            message.postedBy._id ===userId?
                <Box
                    
                    sx={{
                      maxWidth: [250,300,450,650],
                    alignSelf: "end",
                    p: 1,
                    m: 1,
                    bgcolor: (theme) =>
                        theme.palette.mode === "dark" ? myColor : myColor,
                    color: (theme) =>
                        theme.palette.mode === "dark" ? "grey.300" : "white",
                    border: "1px solid",
                    borderColor: (theme) =>
                        theme.palette.mode === "dark" ? "grey.800" : "grey.300",
                    borderRadius: 2,
                    fontSize: "0.875rem",
                    fontWeight: "700",
                    
                    }}
                >
                     {
                    message.type==='photo'?
                     
                      <img src={message.message}  style={{width:'150px',height:'150px'}}/>
                      : message.type==='text'?
                       <h3>{message.message}</h3>
                       :message.type==='call'?
                       message.message==='missed'?
                       
                        <Grid container spacing={1} style={{width:'180px'}}>
                            <Grid item xs={3} className='d-flex flex-column justify-content-center'>
                              <div style={{borderRadius:'50%', height:'34px', width:'34px', backgroundColor:'red',textAlign:'center' ,paddingTop:'3px'}} >
                              <PhoneMissedRoundedIcon style={{color:'white'}}/>
                              </div>
                            </Grid>
                            <Grid item xs={9}>
                              <Stack>
                                <Typography variant="h6" >
                                  Missed Call
                                </Typography>
                                <Typography variant='caption'>
                                   Tap here to call again
                                </Typography>
                               
                              </Stack>
                            </Grid>
                        </Grid>
                          
                           
                        
                       
                       :
                        
                          <Grid container spacing={1} style={{width:'180px'}}>
                            <Grid item xs={3} className='d-flex flex-column justify-content-center'>
                              <div 
                                style={{borderRadius:'50%', height:'34px',
                                width:'34px', backgroundColor:'green',textAlign:'center' ,
                                paddingTop:'3px'}} >
                                  <PhoneSharpIcon style={{color:'white'}}/>
                              </div>
                            </Grid>
                            <Grid item xs={9}>
                                <Stack>
                                <Typography variant="h6" >
                                  Media Call
                                </Typography>
                                  <Typography variant='caption'>
                                      {message.message}
                                  </Typography>
                                </Stack>
                            </Grid>
                          </Grid>
                        
                          
                        
                        
                       :message.type==='voice'?
                       <Box sx={{
                        maxWidth:[200, 300, 450, 600]
                       }}>
                          <audio src={message.message} controls style={{maxWidth:'100%'}}/>
                       </Box>
                       :''
                  
                  }
                    
                 </Box>
        :(  <div style={{alignSelf: "start", display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
             
                <div className="mt-2">
                <Avatar sx={{alignSelf:'start'}} alt="Remy Sharp" src={sender[0].avatarURL} />
                </div>
                
                <div>
                <Box
                    component="div"
                    sx={{
                    p: 1,
                    m: 1,
                    bgcolor: (theme) =>
                        theme.palette.mode === "dark" ? 'grey.700' : otherColor,
                    color: (theme) =>
                        theme.palette.mode === "dark" ? "grey.50" : "grey.800",
                    border: "1px solid",
                    borderColor: (theme) =>
                        theme.palette.mode === "dark" ? "grey.800" : "grey.300",
                    borderRadius: 2,
                    fontSize: "0.875rem",
                    fontWeight: "700",
                    }}
                >
                  {message.type==='photo'?
                    <img src={message.message} alt='photMsg' style={{width:'150px',height:'150px'}}/>
                    : message.type==='text'?
                    <h3>{message.message}</h3>
                    :message.type==='call'?
                       message.message==='missed'?
                       
                       <Grid container spacing={1} style={{width:'180px'}}>
                       <Grid item xs={3} className='d-flex flex-column justify-content-center'>
                         <div style={{borderRadius:'50%', height:'34px', width:'34px', backgroundColor:'red',textAlign:'center' ,paddingTop:'3px'}} >
                         <PhoneMissedRoundedIcon style={{color:'white'}}/>
                         </div>
                       </Grid>
                       <Grid item xs={9}>
                         <Stack>
                           <Typography variant="h6" >
                             Missed Call
                           </Typography>
                           <Typography variant='caption'>
                              Tap here to call again
                           </Typography>
                          
                         </Stack>
                       </Grid>
                   </Grid>
                        
                       :
                        
                            <Grid container spacing={1} style={{width:'180px'}}>
                            <Grid item xs={3} className='d-flex flex-column justify-content-center'>
                              <div 
                                style={{borderRadius:'50%', height:'34px',
                                width:'34px', backgroundColor:'green',textAlign:'center' ,
                                paddingTop:'3px'}} >
                                  <PhoneSharpIcon style={{color:'white'}}/>
                              </div>
                            </Grid>
                            <Grid item xs={9}>
                                <Stack>
                                <Typography variant="h6" >
                                  Media Call
                                </Typography>
                                  <Typography variant='caption'>
                                      {message.message}
                                  </Typography>
                                </Stack>
                            </Grid>
                          </Grid>
                         
                       :message.type==='voice'?
                       <Box sx={{
                        maxWidth:[200, 300, 450, 600]
                       }}>
                          <audio src={message.message} controls style={{maxWidth:'100%'}}/>
                       </Box>
                       
                       :''
                  }
                   
                    
                 </Box>
                 <h6>{moment(message.timestamp).format('h:mm a')}</h6>
                </div>
            </div>
        )
        }
        </div>
  );
}

export default ChatMsg;
