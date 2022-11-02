import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import moment from 'moment'

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
function ChatMsg({message, userId}) {
    const myColor =  "#ab47bc" ;
    const otherColor = '#eeeeee';
 
  return (
    <div style={{display:'flex' ,flexDirection:'column'}}>
        {
            message.postedBy._id ==userId?
                <Box
                    component="div"
                    sx={{
                    alignSelf: "end",
                    p: 1,
                    m: 1,
                    bgcolor: (theme) =>
                        theme.palette.mode === "dark" ? "#101010" : myColor,
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
                     {message.type==='photo'?
                     
                      <img src={message.message}  style={{width:'150px',height:'150px'}}/>
                      : <h3>{message.message}</h3>
                  
                  }
                    
                 </Box>
        :(  <div style={{alignSelf: "start", display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
             
                
                <Avatar sx={{alignSelf:'start'}} alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                <div>
                <Box
                    component="div"
                    sx={{
                    
                    p: 1,
                    m: 1,
                    bgcolor: (theme) =>
                        theme.palette.mode === "dark" ? "#101010" : otherColor,
                    color: (theme) =>
                        theme.palette.mode === "dark" ? "grey.300" : "grey.800",
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
                    : <h3>{message.message}</h3>
                  
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
