import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  Chip
} from '@mui/material';
import Cookies from "js-cookie";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  companyName?: string;
  userType: 'employer' | 'jobseeker' | 'admin';
  createdAt: string;
}

interface ApiResponse {
  users: User[];
  totalPages: number;
}

export default function AllUsers(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const token = Cookies.get("token");

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  const fetchUsers = async (): Promise<void> => {
    try {
      const response = await axios.post<ApiResponse>('/api/admin/users',
        { page: page + 1, limit: rowsPerPage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (userId: string): Promise<void> => {
    try {
      await axios.delete('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const getUserTypeColor = (userType: User['userType']): "primary" | "secondary" | "error" | "default" => {
    switch (userType) {
      case 'employer':
        return 'primary';
      case 'jobseeker':
        return 'secondary';
      case 'admin':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Paper className="p-4">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>User Type</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {users && users.length > 0 ? (
    users.map((user) => (
      <TableRow key={user._id}>
        <TableCell>{user.email}</TableCell>
        <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
        <TableCell>{user.gender}</TableCell>
        <TableCell>{user.companyName || 'N/A'}</TableCell>
        <TableCell>
          <Chip 
            label={user.userType} 
            color={getUserTypeColor(user.userType)}
            size="small"
          />
        </TableCell>
        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
        <TableCell>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(user._id)}
          >
            Delete
          </Button>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={7} align="center">
        No users found.
      </TableCell>
    </TableRow>
  )}
</TableBody>

        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalPages * rowsPerPage}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}