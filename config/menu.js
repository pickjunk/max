import React from 'react';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AssignmentIcon from '@material-ui/icons/Assignment';

export default [
  {
    icon: <ListAltIcon color="inherit" />,
    label: 'Tabel',
    children: [
      {
        label: 'Table-1',
        path: '/',
      },
      {
        label: 'Table-2',
        path: '/',
        args: {
          hello: 'world',
        }
      },
    ],
  },
  {
    icon: <AssignmentIcon color="inherit" />,
    label: 'Form',
  },
];
