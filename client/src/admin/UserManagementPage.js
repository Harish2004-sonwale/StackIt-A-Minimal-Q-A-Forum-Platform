import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Switch,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Person,
    Email,
    Block,
    CheckCircle,
    Download,
    Search
} from '@mui/icons-material';
import axios from 'axios';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-activityScore');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [banDialogOpen, setBanDialogOpen] = useState(false);
    const [banReason, setBanReason] = useState('');
    const [banDuration, setBanDuration] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/admin/users', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                params: {
                    page: page + 1,
                    limit: rowsPerPage,
                    sort,
                    search: search.trim()
                }
            });
            setUsers(response.data.users);
            setTotalUsers(response.data.totalUsers);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching users');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, rowsPerPage, sort, search]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(0);
    };

    const handleSort = (column) => {
        if (sort === column) {
            setSort(`-${column}`);
        } else {
            setSort(column);
        }
        setPage(0);
    };

    const handleBanUser = async () => {
        try {
            await axios.put(
                `/api/admin/users/${selectedUser._id}/ban`,
                {
                    reason: banReason,
                    durationDays: banDuration
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            setSuccessMessage('User banned successfully');
            setBanDialogOpen(false);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Error banning user');
        }
    };

    const handleUnbanUser = async (userId) => {
        try {
            await axios.put(
                `/api/admin/users/${userId}/unban`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            setSuccessMessage('User unbanned successfully');
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Error unbanning user');
        }
    };

    const handleExport = async () => {
        try {
            const response = await axios.post(
                '/api/admin/reports/export',
                {
                    type: 'users',
                    period: 'month'
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    responseType: 'blob'
                }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'users-report.csv');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.message || 'Error exporting data');
        }
    };

    const renderSortIcon = (column) => {
        if (sort === column || sort === `-${column}`) {
            return sort.startsWith('-') ? 'expand_less' : 'expand_more';
        }
        return 'unfold_more';
    };

    if (loading) {
        return (
            <Box sx={{ p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="Search users"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <Search sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            )
                        }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<Download />}
                        onClick={handleExport}
                    >
                        Export CSV
                    </Button>
                </Box>
                {successMessage && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        {successMessage}
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </Box>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => handleSort('username')}
                                        startIcon={<Person />}
                                    >
                                        Username
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => handleSort('email')}
                                        startIcon={<Email />}
                                    >
                                        Email
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => handleSort('role')}
                                    >
                                        Role
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => handleSort('activityScore')}
                                    >
                                        Activity Score
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="text"
                                        size="text"
                                        onClick={() => handleSort('createdAt')}
                                    >
                                        Joined
                                    </Button>
                                </TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.activityScore}</TableCell>
                                    <TableCell>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Tooltip title="Ban User">
                                                <IconButton
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setBanDialogOpen(true);
                                                    }}
                                                    color={user.banned ? 'success' : 'error'}
                                                >
                                                    {user.banned ? (
                                                        <CheckCircle />
                                                    ) : (
                                                        <Block />
                                                    )}
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={totalUsers}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                />
            </Paper>

            <Dialog open={banDialogOpen} onClose={() => setBanDialogOpen(false)}>
                <DialogTitle>{selectedUser?.username} - Ban User</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Ban Reason"
                        type="text"
                        fullWidth
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Ban Duration (days)"
                        type="number"
                        fullWidth
                        value={banDuration}
                        onChange={(e) => setBanDuration(parseInt(e.target.value) || 0)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBanDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleBanUser} variant="contained" color="error">
                        Ban User
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserManagementPage;
