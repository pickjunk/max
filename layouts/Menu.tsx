import React, { useState, Fragment, useEffect } from 'react';
import clsx from 'clsx';
import router, { useRouter } from '@pickjunk/min/Router';
import color from 'color';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Theme,
} from '@material-ui/core';
import { useTheme, createStyles, makeStyles } from '@material-ui/styles';
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
    active: {
      color: theme.palette.secondary.contrastText,
      backgroundColor: theme.palette.primary.main,
    },
  }),
);

export default function Menu({ data }) {
  const [menu, setMenu] = useState(data);
  const { location } = useRouter();

  useEffect(
    function() {
      function traverse(tree) {
        return tree.map(function(node) {
          const newNode = { ...node };
          let { name, path, args, children } = newNode;

          let active = false;
          if (name || path) {
            active = location === router.link(name || path, args);
          }
          if (children) {
            children = traverse(children);
            for (const child of children) {
              if (child.active) {
                active = true;
              }
            }
            newNode.children = children;
          }
          newNode.active = active;

          return newNode;
        });
      }

      setMenu(traverse(data));
    },
    [data, location],
  );

  return <SubMenu data={menu} />;
}

function SubMenu({ data, level = 1 }) {
  const theme = useTheme<Theme>();
  const classes = useMenuStyles();
  const listStyle = {
    backgroundColor: color(theme.palette.secondary.main)
      .darken(0.25 * level)
      .hex(),
  };
  const itemStyle = { paddingLeft: theme.spacing(2 + 5 * (level - 1)) };

  const [openIndex, setOpenIndex] = useState(-1);

  useEffect(
    function() {
      for (let i in data) {
        if (data[i].active) {
          setOpenIndex(Number(i));
        }
      }
    },
    [data],
  );

  return (
    <List style={listStyle}>
      {data.map(({ icon, label, path, name, args, children, active }, i) => {
        if (children && children.length > 0) {
          const open = i === openIndex;

          return (
            <Fragment key={label}>
              <ListItem
                className={clsx(classes.item, {
                  [classes.opened]: open,
                })}
                style={itemStyle}
                onClick={function() {
                  if (open) {
                    setOpenIndex(-1);
                  } else {
                    setOpenIndex(i);
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
                  <ExpandLess key="less" className={classes.arrow} />
                ) : (
                  <ExpandMore key="more" className={classes.arrow} />
                )}
              </ListItem>
              <Collapse className={classes.collapse} in={open}>
                <SubMenu data={children} level={level + 1} />
              </Collapse>
            </Fragment>
          );
        }

        return (
          <ListItem
            className={clsx(classes.item, {
              [classes.active]: active,
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
