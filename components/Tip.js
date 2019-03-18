import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
}));

export default function({
  type,
  anchorOrigin,
  message,
  autoHideDuration,
  onClose,
}) {
  const classes = useStyles();

  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      open={!!message}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
    >
      <SnackbarContent
        className={classes[type]}
        message={message}
        action={[
          <IconButton
            color="inherit"
            key="close"
            className={classes.close}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </Snackbar>
  );
}
