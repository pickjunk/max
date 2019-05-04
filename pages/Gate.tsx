import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  TextField,
  IconButton,
  Fade,
  Theme,
} from '@material-ui/core';
import { Person, Lock, Visibility, VisibilityOff } from '@material-ui/icons';
import { createStyles, makeStyles } from '@material-ui/styles';
import router from '@pickjunk/min/Router';
import Cookies from 'js-cookie';
import Timeout from '../components/Timeout';
import Loading from '../components/Loading';
import graphql from '../utils/graphql';
import useForm from '../utils/form';
import { payload } from '../utils/jwt';
import profile$ from '../subjects/profile$';

const useStyles = makeStyles<Theme>(theme =>
  createStyles({
    background: {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: theme.palette.common.white,
    },
    box: {
      [theme.breakpoints.up('xs')]: {
        width: '100%',
        height: '100%',
        '& $tip': {
          top: 0,
        },
      },
      [theme.breakpoints.up(450)]: {
        width: 280,
        height: 'unset',
        '& $tip': {
          top: -50,
        },
      },
      marginTop: 230,
      position: 'relative',
    },
    icon: {
      width: 24,
      height: 24,
      margin: '8px 8px 8px 0',
    },
    visible: {
      padding: 8,
      '& $icon': {
        margin: 0,
      },
    },
    input: {
      '& input': {
        padding: '8px 0',
      },
    },
    login: {
      width: '100%',
      height: 36,
    },
    tip: {
      position: 'absolute',
      left: 0,
      right: 0,
      background: theme.palette.error.main,
      height: 36,
      textAlign: 'center',
      lineHeight: '36px',
      color: theme.palette.error.contrastText,
    },
  }),
);

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
    setLoginError('');

    const valid = await form.validate();
    if (!valid) {
      setLoginError('Name and Passwd are required');
      return;
    }

    try {
      setSubmitting(true);
      await graphql('/api/gate', schema, form.data());
      const token = Cookies.get('token');
      profile$.next(payload(token));
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
      <div className={classes.box} onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          login();
        }
      }}>
        <Timeout
          status={Boolean(loginError)}
          duration={3000}
          onExpire={() => setLoginError('')}
        >
          {status => (
            <Fade in={status}>
              <div className={classes.tip}>{loginError}</div>
            </Fade>
          )}
        </Timeout>

        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
        >
          <Grid item style={{ marginBottom: 16 }}>
            {form.field('name', ({ value, setValue }) => (
              <TextField
                className={classes.input}
                fullWidth
                InputProps={{
                  startAdornment: <Person className={classes.icon} />,
                  placeholder: 'Name',
                }}
                value={value}
                onChange={e => {
                  setLoginError('');
                  const v = e.target.value.trim();
                  setValue(v);
                }}
              />
            ))}
          </Grid>
          <Grid item style={{ marginBottom: 28 }}>
            {form.field('passwd', ({ value, setValue }) => (
              <TextField
                className={classes.input}
                fullWidth
                type={showPasswd ? 'text' : 'password'}
                InputProps={{
                  startAdornment: <Lock className={classes.icon} />,
                  endAdornment: (
                    <IconButton
                      className={classes.visible}
                      onClick={() => setShowPasswd(!showPasswd)}
                    >
                      {showPasswd ? (
                        <Visibility className={classes.icon} />
                      ) : (
                        <VisibilityOff className={classes.icon} />
                      )}
                    </IconButton>
                  ),
                  placeholder: 'Password',
                }}
                value={value}
                onChange={e => {
                  setLoginError('');
                  const v = e.target.value.trim();
                  setValue(v);
                }}
              />
            ))}
          </Grid>
          <Grid item>
            <Loading status={submitting} width={20} height={20}>
              <Button
                variant="contained"
                color="primary"
                className={classes.login}
                onClick={login}
              >
                Login
              </Button>
            </Loading>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
