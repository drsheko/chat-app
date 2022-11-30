import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


function TransitionDown(props) {
  return <Slide {...props} direction="down" />;
}

export default function DirectionSnackbar() {
  const [open, setOpen] = React.useState(false);
  const [transition, setTransition] = React.useState(undefined);

  const handleClick = (Transition) => () => {
    setTransition(() => Transition);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
  });
  const { vertical, horizontal } = state;

  return (
    <div>
      <Button onClick={handleClick(TransitionDown)}>Down</Button>
      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin ={{vertical,horizontal}}
        TransitionComponent={transition}
        
        
        
      > 
         <div style={{padding:'40px', backgroundColor:'red'}}>
         <IconButton
            aria-label="close"
            color="inherit"
            sx={{ p: .5 }}
            onClick={handleClose}
            
          >
            <CloseIcon />
          </IconButton>
          <br/>
          <div >
          <h2 style={{alignSelf:'flex-start'}}>shadyyyyy</h2>
          </div>
         
    </div>
      
      </Snackbar>
      
    </div>
  );
}
