import React from 'react';
import { Tooltip, IconButton } from '@material-ui/core';
import { Edit, Stop, PlayArrow, Delete } from '@material-ui/icons';
import router from '@pickjunk/min/Router';
import Table from '../../components/Table';
import graphql from '../../utils/graphql';
import { dashboard } from '../../utils/request';

const schema = `
query ($page: Int, $search: String) {
  admins(page: $page, search: $search) {
    data {
      id
      name
      ltime
      ctime
      mtime
      btime
    }
    total
  }
}
`;

const banSchema = `
mutation ($ids: [ID!]!, $status: Boolean!) {
  banAdmins(ids: $ids, status: $status)
}
`;

const delSchema = `
mutation ($ids: [ID!]!) {
  deleteAdmins(ids: $ids)
}
`;

const columns = [
  { title: 'Name', field: 'name' },
  {
    title: 'Role',
    render({ id }) {
      if (id == 1) {
        return 'root';
      }
      return '-';
    },
  },
  {
    title: 'Last Login',
    render({ ltime }) {
      if (ltime) {
        return ltime;
      }
      return '-';
    },
  },
  { title: 'Created At', field: 'ctime' },
  { title: 'Updated At', field: 'mtime' },
  {
    title: 'Actions',
    render({ id, btime }) {
      return (
        <>
          <Tooltip title="edit">
            <IconButton onClick={() => router.push(`/admin/${id}`)}>
              <Edit />
            </IconButton>
          </Tooltip>
          {!btime ? (
            <Tooltip title="ban">
              <IconButton
                onClick={() =>
                  dashboard(
                    graphql('/api/admin', banSchema, {
                      ids: [id],
                      status: true,
                    }),
                  )
                }
              >
                <Stop />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="unban">
              <IconButton
                onClick={() =>
                  dashboard(
                    graphql('/api/admin', banSchema, {
                      ids: [id],
                      status: false,
                    }),
                  )
                }
              >
                <PlayArrow />
              </IconButton>
            </Tooltip>
          )}
          {id != 1 && (
            <Tooltip title="delete">
              <IconButton
                onClick={() =>
                  dashboard(
                    graphql('/api/admin', delSchema, {
                      ids: [id],
                    }),
                  )
                }
              >
                <Delete />
              </IconButton>
            </Tooltip>
          )}
        </>
      );
    },
  },
];

export default function() {
  async function load({ page, search }) {
    const { admins } = await dashboard(
      graphql('/api/admin', schema, {
        page,
        search,
      }),
    );
    return admins;
  }

  return (
    <Table columns={columns} data={load} pageSize={20} showSearch={true} />
  );
}
