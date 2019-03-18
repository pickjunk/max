import '../utils/bootstrap';
// --- Post bootstrap -----
import React from 'react';
import { withRouter } from 'next/router';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import Layout from '../layouts/manager';

const map = {
  '403': 'Forbidden',
  '404': 'Not Found',
  '500': 'Internal Server Error',
};

const useStyles = makeStyles(() => ({
  root: {
    composes: ['center'],
    flexGrow: 1,
  },
  code: {
    borderRight: '1px solid',
    paddingRight: '0.35em',
    marginRight: '0.35em',
  },
}));

function _error({
  router: {
    query: { code },
  },
}) {
  const classes = useStyles();

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

export default withRouter(_error);
