import '../../utils/bootstrap';
// --- Post bootstrap -----
import React, { useState } from 'react';
import Layout from '../../layouts/manager';
import Table from '../../components/Table';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DeleteIcon from '@material-ui/icons/Delete';
import graphql from '../../utils/graphql';
import { manager } from '../../utils/request';

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
        return 'role';
      }
      return '-';
    },
  },
  { title: 'Last Login', field: 'ltime' },
  { title: 'Created At', field: 'ctime' },
  { title: 'Updated At', field: 'mtime' },
  {
    title: 'Actions',
    render({ id, btime }) {
      return (
        <>
          <Tooltip title="edit">
            <IconButton
              onClick={() =>
                router.push(`/admin/${id}`, `/admin/form?id=${id}`)
              }
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          {!btime ? (
            <Tooltip title="ban">
              <IconButton
                onClick={() =>
                  manager(
                    graphql('/api/admin', banSchema, {
                      ids: [id],
                      status: true,
                    }),
                  )
                }
              >
                <StopIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="unban">
              <IconButton
                onClick={() =>
                  manager(
                    graphql('/api/admin', banSchema, {
                      ids: [id],
                      status: false,
                    }),
                  )
                }
              >
                <PlayArrowIcon />
              </IconButton>
            </Tooltip>
          )}
          {id != 1 && (
            <Tooltip title="delete">
              <IconButton
                onClick={() =>
                  manager(
                    graphql('/api/admin', delSchema, {
                      ids: [id],
                    }),
                  )
                }
              >
                <DeleteIcon />
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
    const { admins } = await manager(
      graphql('/api/admin', schema, {
        page,
        search,
      }),
    );
    return admins;
  }

  return (
    <Layout>
      <Table
        columns={columns}
        data={load}
        pageSize={20}
        showSearch={true}
      />
    </Layout>
  );
}
