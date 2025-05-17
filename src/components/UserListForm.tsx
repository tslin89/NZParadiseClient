import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAuth } from './AuthContext';
import { getUserList } from '../services/api';
import { UserDataDisplay } from '../types/formData';
import { format } from 'date-fns';

const UserListForm: React.FC = () => {
  const { user } = useAuth();
  const userID = user?.userID || -1;
  const [userList, setUserList] = useState<UserDataDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        setLoading(true);
        const result = await getUserList(userID);
        setUserList(result.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUserList();
  }, [userID]);


  const columns: GridColDef[] = [
    {
      field: 'fullName',
      headerName: 'Name',
      width: 180,
      valueGetter: (value: any, {firstName, lastName}) => {
        return `${firstName} ${lastName}`
      }
    },
    {
      field: 'userTypeID',
      headerName: 'Type',
      width: 90,
      valueFormatter: (value: any) => {
        return value === 9 ? 'Admin' : value === 1 ? 'Member' : 'Unknown'
      },
    },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'phoneNo', headerName: 'Phone', width: 140 },
    { field: 'agencyName', headerName: 'Agency', width: 180 },
    { field: 'propertyCount', headerName: 'Listings', width: 100},
    {
      field: 'createdDate',
      headerName: 'Member Since',
      width: 200,
      valueFormatter: (value: any) => {
        return value ? format(new Date(value), 'PPP') : 'N/A';
      }
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (userList.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography>No users found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 500, width: '100%', mt: 2 }}>
      <DataGrid
        rows={userList}
        columns={columns}
        getRowId={(row) => row.userID}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          sorting: {
            sortModel: [{ field: 'createdDate', sort: 'desc' }],
          },
        }}
      />
    </Box>
  );
};

export default UserListForm;
