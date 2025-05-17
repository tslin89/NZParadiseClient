import { Typography, Box } from '@mui/material';
import UserListForm from '../components/UserListForm';

const UserList = () => {
  return (
    <Box>
      <Typography variant="h2" gutterBottom sx={{ pb: 1 }}>
        User List
      </Typography>
      <Typography gutterBottom>View all registered users.</Typography>
      <UserListForm />
    </Box>
  );
};

export default UserList;
