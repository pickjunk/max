import React, { useState, useEffect, ReactNode } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  CircularProgress,
  Typography,
  TextField,
  IconButton,
  Toolbar,
  Paper,
  Theme,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Search, Clear } from '@material-ui/icons';
import Loading from './Loading';

interface Row {
  [key: string]: any;
}

interface DataList {
  data: Row[];
  total: number;
}

interface LoadData {
  (params: { page: number; search: string }): Promise<DataList>;
}

interface Column {
  title?: string;
  field?: string;
  render?: (r: Row) => ReactNode;
}

const useStyles = makeStyles<Theme>(theme =>
  createStyles({
    spacer: {
      flex: 1,
    },
    actions: {
      color: theme.palette.text.secondary,
      '& button': {
        padding: 8,
      }
    },
    table: {
      '& th': {
        paddingTop: 8,
        paddingBottom: 8,
      },
      '& td': {
        paddingTop: 8,
        paddingBottom: 8,
      },
      '& td>button': {
        padding: 4,
      },
    },
  }),
);

function defaultDisplayRows({
  from,
  to,
  count,
}: {
  from: number;
  to: number;
  count: number;
}): string {
  return `${from}-${to} / ${count}`;
}

export default function _Table({
  title,
  columns,
  data,
  rowKey = 'id',
  showSearch = false,
  pageSize = 20,
  labelDisplayedRows = defaultDisplayRows,
}: {
  title?: string;
  columns: Column[];
  data: LoadData;
  rowKey?: string | number;
  showSearch?: boolean;
  pageSize?: number;
  labelDisplayedRows?: typeof defaultDisplayRows;
}) {
  const classes = useStyles();

  const [search, setSearch] = useState('');
  function changeSearch(e) {
    setSearch(e.target.value);
  }
  function enterSearch(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      load();
    }
  }
  function clearSearch() {
    setSearch('');
  }

  const [list, setList] = useState<DataList>({ data: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  async function load(page = 0) {
    setLoading(true);
    const result = await data({ page: page + 1 || 1, search: search || '' });
    setPage(page);
    setList(result);
    setLoading(false);
  }
  useEffect(function() {
    load();
  }, []);

  return (
    <Paper>
      <Loading status={loading}>
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
                    startAdornment: <Search />,
                    endAdornment: (
                      <IconButton onClick={clearSearch}>
                        <Clear />
                      </IconButton>
                    ),
                  }}
                />
              )}
            </div>
          </Toolbar>
        )}

        <Table className={classes.table}>
          <TableHead>
            <TableRow key="th">
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
                  <TableCell key={field || title} {...props}>
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
          onChangePage={(_, page) => load(page)}
          count={list.total}
          component={'div' as any}
        />
      </Loading>
    </Paper>
  );
}
