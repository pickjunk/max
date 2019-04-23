import React from 'react';
import { useRouter } from '@pickjunk/min/Router';
import { Typography, Theme, makeStyles } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import Layout from '../layouts/Dashboard';

const map = {
  '403': 'Forbidden',
  '404': 'Not Found',
  '500': 'Internal Server Error',
};

const useStyles = makeStyles<Theme>(
  createStyles({
    root: {
      composes: ['center'] as any,
      flexGrow: 1,
    },
    code: {
      borderRight: '1px solid',
      paddingRight: '0.35em',
      marginRight: '0.35em',
    },
  }),
);

function Exception() {
  const classes = useStyles();
  const {
    args: { code },
  } = useRouter();

  return (
    <Layout>
      <div className={classes.root}>
        <Typography variant="h2" className={classes.code}>
          {code}
        </Typography>
        <Typography variant="subtitle2">{map[code]}</Typography>
      </div>
    </Layout>
  );
}

export default Exception;
