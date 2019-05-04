import React from 'react';
import { CircularProgress, Theme } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles<Theme>(theme =>
  createStyles({
    container: {
      position: 'relative',
    },
    mask: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      background: theme.palette.grey[100],
      opacity: 0.7,
    },
    loading: {
      color: theme.palette.primary.main,
      position: 'absolute',
      top: '50%',
      left: '50%',
    },
  }),
);

export default function Loading({
  children,
  status = false,
  width = 40,
  height = 40,
}) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {children}
      {status && (
        <div className={classes.mask}>
          <CircularProgress
            className={classes.loading}
            style={{
              width,
              height,
              marginLeft: -width / 2,
              marginTop: -height / 2,
            }}
          />
        </div>
      )}
    </div>
  );
}
