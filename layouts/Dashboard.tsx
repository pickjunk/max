import React, { useState, useEffect, Fragment } from 'react';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import router from '@pickjunk/min/Router';
import color from 'color';
import {
  makeStyles,
  Theme,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  FormatIndentDecrease,
  AccountCircle,
} from '@material-ui/icons';
import { createStyles } from '@material-ui/core/styles';
import NavMenu from './Menu';
import { name } from '../config/app';
import menu from '../config/menu';

const drawerWidth = 256;

const useStyles = makeStyles<Theme>(theme =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      position: 'absolute',
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      backgroundColor: theme.palette.common.white,
      borderBottom: `1 solid ${theme.palette.divider}`,
      boxShadow: '0 1px 4px rgba(0,21,41,.08)',
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      zIndex: theme.zIndex.drawer - 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginLeft: 12,
    },
    spacer: {
      flexGrow: 1,
      marginRight: 36,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxShadow: theme.shadows[4],
      zIndex: theme.zIndex.drawer,
    },
    drawerPaper: {
      backgroundColor: color(theme.palette.secondary.main)
        .darken(0.25)
        .hex(),
      color: theme.palette.secondary.contrastText,
      border: 'none',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: 0,
    },
    drawerHeader: {
      ...theme.mixins.toolbar,
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
    },
    appBarPlaceholder: {
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
  }),
);

export default function Dashboard({ children }) {
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.replace('/gate');
    }
  });

  const classes = useStyles();

  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  function logout() {
    setAnchorEl(null);
    Cookies.remove('token');
    router.replace('/gate');
  }

  return (
    <div className={classes.root}>
      <AppBar
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar style={{ paddingLeft: 0 }}>
          {open ? (
            <IconButton
              className={classes.menuButton}
              onClick={() => setOpen(false)}
            >
              <FormatIndentDecrease />
            </IconButton>
          ) : (
            <IconButton
              className={classes.menuButton}
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <div className={classes.spacer} />
          <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx(classes.drawerPaper, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        open={open}
      >
        <div className={classes.drawerHeader}>
          <Typography variant="h6" color="inherit">
            {name}
          </Typography>
        </div>
        <Divider />
        <NavMenu data={menu} />
      </Drawer>
      <main className={classes.content}>
        {/* AppBar's position is absolute, need a placeholder */}
        <div className={classes.appBarPlaceholder} />

        {children}
      </main>
    </div>
  );
}
