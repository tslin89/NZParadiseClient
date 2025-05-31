import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
} from '@mui/material';

interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    message: string;
    onClose: (confirmed: boolean) => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title = 'Confirm',
    message,
    onClose,
}) => {
    return (
        <Dialog open={open} onClose={() => onClose(false)}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText fontSize="medium">{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Box padding={2}>
                    <Button onClick={() => onClose(false)}>Cancel</Button>
                    <Button onClick={() => onClose(true)} color="error" variant="contained" sx={{ml: 1}}>
                        Confirm
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
