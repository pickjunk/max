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
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import router from 'next/router';
import Cookies from 'js-cookie';
import graphql from '../utils/graphql';
import useForm from '../utils/form';
import Tip from '../components/Tip';

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
}));

const fields = {
  name: {
    initValue: '',
    validators: [v => (!v ? 'name is required' : '')],
  },
  passwd: {
    initValue: '',
    validators: [v => (!v ? 'passwd is required' : '')],
  },
};

const schema = `
mutation ($name: String!, $passwd: String!) {
  login(name: $name, passwd: $passwd)
}
`;

export default function Gate() {
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      router.replace('/');
    }
  });

  const classes = useStyles();

  const form = useForm(fields);
  const [showPasswd, setShowPasswd] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  async function login() {
    const valid = await form.validate();
    if (!valid) {
      return;
    }

    try {
      setSubmitting(true);
      await graphql('/api/gate', schema, form.data());
      router.replace('/');
    } catch ({ code }) {
      switch (code) {
        case 100:
          setLoginError('Name or Passwd is incorrect');
          break;
        default:
          setLoginError('Internal Server Error');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={classes.background}>
      <Tip
        type="error"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        autoHideDuration={2000}
        message={loginError}
        onClose={() => setLoginError('')}
      />

      <Card className={classes.card}>
        <CardContent className={classes.content}>
          {form.field(
            'name',
            ({ value, setValue, status, error, validate }) => (
              <TextField
                variant="outlined"
                label="Name"
                style={{ marginBottom: 16 }}
                value={value}
                onChange={e => {
                  const v = e.target.value.trim();
                  setValue(v);
                  validate(v);
                }}
                onBlur={() => validate()}
                error={status === 'fail'}
                helperText={error}
              />
            ),
          )}
          {form.field(
            'passwd',
            ({ value, setValue, status, error, validate }) => (
              <TextField
                variant="outlined"
                label="Password"
                type={showPasswd ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPasswd(!showPasswd)}>
                      {showPasswd ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                }}
                value={value}
                onChange={e => {
                  const v = e.target.value.trim();
                  setValue(v);
                  validate(v);
                }}
                onBlur={() => validate()}
                error={status === 'fail'}
                helperText={error}
              />
            ),
          )}
        </CardContent>
        <CardActions className={classes.action}>
          <Button
            variant="contained"
            color="primary"
            onClick={login}
            disabled={submitting}
          >
            Login
          </Button>
        </CardActions>
      </Card>
    </div>
  );
}
