import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  spacer: {
    flex: 1,
  },
  actions: {
    color: theme.palette.text.secondary,
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
    marginTop: -20,
    marginLeft: -20,
  },
}));

export default function({
  title,
  columns,
  data,
  rowKey = 'id',

  showSearch,
  pageSize,
  labelDisplayedRows,
}) {
  const classes = useStyles();

  const [search, setSearch] = useState('');
  function changeSearch(e) {
    setSearch(e.target.value);
  }
  function enterSearch(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearch(search);
    }
  }
  function clearSearch() {
    setSearch('');
  }

  const [list, setList] = useState({ data: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  async function load() {
    setLoading(true);
    const result = await data({ page, search });
    setList(result);
    setLoading(false);
  }
  useEffect(
    function() {
      load();
    },
    [page, search],
  );

  return (
    <Paper className={classes.root}>
      {(title || showSearch) && (
        <Toolbar>
          {title && <Typography variant="h6">{title}</Typography>}
          <div className={classes.spacer} />
          <div className={classes.actions}>
            {showSearch && (
              <TextField
                value={search}
                onChange={changeSearch}
                onKeyPress={enterSearch}
                InputProps={{
                  startAdornment: <SearchIcon />,
                  endAdornment: (
                    <IconButton onClick={clearSearch}>
                      <ClearIcon />
                    </IconButton>
                  ),
                }}
              />
            )}
          </div>
        </Toolbar>
      )}

      <Table>
        <TableHead>
          <TableRow>
            {columns.map(({ title, field, render, ...props }) => (
              <TableCell key={field || title} {...props}>
                {title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {list.data.map(row => (
            <TableRow key={row[rowKey]}>
              {columns.map(({ title, field, render, ...props }) => (
                <TableCell key={field} {...props}>
                  {render ? render(row) : row[field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[]}
        labelDisplayedRows={labelDisplayedRows}
        page={page}
        rowsPerPage={pageSize}
        onChangePage={(_, page) => setPage(page)}
        count={list.total}
        component="div"
      />

      {loading && (
        <div className={classes.mask}>
          <CircularProgress className={classes.loading} />
        </div>
      )}
    </Paper>
  );
}
