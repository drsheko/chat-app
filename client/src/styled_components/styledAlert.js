import React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { BootstrapDialog, BootstrapDialogTitle } from './bootstrapDialog';

function StyledAlert({open=true,title='Alert',  content, handleClose, handleConfirm }) {
    return (
        <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth={false}
        maxWidth='sm'
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          className="text-center"
        >
         {title}
        </BootstrapDialogTitle>
        <DialogContent dividers>
        <DialogContentText >
            {content}
          </DialogContentText>

          <DialogActions>
                    <Button
                      size="small"
                      onClick={handleConfirm}
                      className="text-capitalize"
                    >
                      Confirm
                    </Button>
                    <Button
                      size="small"
                      onClick={handleClose}
                      className="text-capitalize"
                    >
                      Cancel
                    </Button>
                    
          
        </DialogActions>
        </DialogContent>
      </BootstrapDialog>
    );
}

export default StyledAlert;