import '../utils/bootstrap';
// --- Post bootstrap -----
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import CloseIcon from '@material-ui/icons/Close';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
  background: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    composes: ['center'],
  },
  card: {
    [theme.breakpoints.up('xs')]: {
      width: '100%',
      height: '100%',
    },
    [theme.breakpoints.up(450)]: {
      width: 300,
      height: 'unset',
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  action: {
    '& button': {
      width: '50%',
      height: '50%',
    },
    composes: ['center'],
  },
  close: {
    padding: theme.spacing.unit / 2,
  },
  notice: {
    backgroundColor: theme.palette.error.dark,
  }
}));

function login(name, pa) {
  console.log('login');
}

export default function Gate() {
  const classes = useStyles();

  const [name, setName] = useState('');
  const [passwd, setPasswd] = useState('');
  const [showPasswd, setShowPasswd] = useState(false);

  const [loginError, setLoginError] = useState('');
  const notice = (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      open={!loginError}
      autoHideDuration={6000}
      message={loginError}
      action={[
        <IconButton
          color="inherit"
          className={classes.close}
          onClick={() => setLoginError('')}
        >
          <CloseIcon />
        </IconButton>,
      ]}
    />
  );

  return (
    <div className={classes.background}>
      {notice}

      <Card className={classes.card}>
        <CardContent className={classes.content}>
          <TextField
            variant="outlined"
            label="Account"
            value={name}
            onChange={e => setName(e.target.value.trim())}
            style={{ marginBottom: 16 }}
          />
          <TextField
            variant="outlined"
            label="Password"
            type={showPasswd ? 'text' : 'password'}
            value={passwd}
            onChange={e => setPasswd(e.target.value.trim())}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPasswd(!showPasswd)}>
                    {showPasswd ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
        <CardActions className={classes.action}>
          <Button variant="contained" color="primary" onClick={onClick}>
            Login
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
