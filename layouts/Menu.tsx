import React, { useState, Fragment } from 'react';
import clsx from 'clsx';
import router, { useRouter } from '@pickjunk/min/Router';
import color from 'color';
import {
  makeStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Theme,
} from '@material-ui/core';
import { useTheme, createStyles } from '@material-ui/core/styles';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

const useMenuStyles = makeStyles<Theme>(theme =>
  createStyles({
    item: {
      cursor: 'pointer',
      color: color(theme.palette.secondary.contrastText)
        .darken(0.2)
        .hex(),
      '&:hover': {
        color: theme.palette.secondary.contrastText,
      },
    },
    icon: {
      color: 'inherit',
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    text: { color: 'inherit' },
    arrow: { flexShrink: 'unset' },
    collapse: { boxShadow: 'inset 0 2px 8px rgba(0,0,0,.45)' },
    opened: {
      color: theme.palette.secondary.contrastText,
    },
    selected: {
      color: theme.palette.secondary.contrastText,
      backgroundColor: theme.palette.primary.main,
    },
  }),
);

export default function Menu({ data, level = 1 }) {
  const theme = useTheme<Theme>();
  const classes = useMenuStyles();
  const listStyle = {
    backgroundColor: color(theme.palette.secondary.main)
      .darken(0.25 * level)
      .hex(),
  };
  const itemStyle = { paddingLeft: theme.spacing(2 + 5 * (level - 1)) };

  const [collapseIndex, setCollapseIndex] = useState(-1);
  const { location } = useRouter();

  return (
    <List style={listStyle}>
      {data.map(({ icon, label, path, name, args, children }, i) => {
        if (children && children.length > 0) {
          const open = i === collapseIndex;

          return (
            <Fragment key={label}>
              <ListItem
                className={clsx(classes.item, {
                  [classes.opened]: open,
                })}
                style={itemStyle}
                onClick={function() {
                  if (open) {
                    setCollapseIndex(-1);
                  } else {
                    setCollapseIndex(i);
                  }
                }}
              >
                {icon && (
                  <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
                )}
                <ListItemText
                  classes={{ primary: classes.text }}
                  primary={label}
                />
                {open ? (
                  <ExpandLess className={classes.arrow} />
                ) : (
                  <ExpandMore className={classes.arrow} />
                )}
              </ListItem>
              <Collapse className={classes.collapse} in={open}>
                <Menu data={children} level={level + 1} />
              </Collapse>
            </Fragment>
          );
        }

        return (
          <ListItem
            className={clsx(classes.item, {
              [classes.selected]: location === router.link(path, args),
            })}
            style={itemStyle}
            key={label}
            onClick={function() {
              if (name || path) {
                router.push(name || path, args);
              }
            }}
          >
            {icon && (
              <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
            )}
            <ListItemText classes={{ primary: classes.text }} primary={label} />
          </ListItem>
        );
      })}
    </List>
  );
}
