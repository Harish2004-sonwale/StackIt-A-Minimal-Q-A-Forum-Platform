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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import ContentRow from './ContentRow';
import axios from 'axios';

const ContentManagementPage = () => {
    const [content, setContent] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalContent, setTotalContent] = useState(0);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [flaggedContent, setFlaggedContent] = useState(0);

    const fetchContent = async () => {
        try {
            const response = await axios.get('/api/admin/content', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                params: {
                    page: page + 1,
                    limit: rowsPerPage,
                    type: typeFilter,
                    search: search.trim()
                }
            });
            
            // Fetch flagged content count
            const flaggedResponse = await axios.get('/api/admin/content/flagged', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            setContent(response.data.content);
            setTotalContent(response.data.totalContent);
            setFlaggedContent(flaggedResponse.data.count);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching content');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, [page, rowsPerPage, typeFilter, search]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(0);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/admin/content/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setDeleteError(null);
            fetchContent();
        } catch (err) {
            setDeleteError(err.response?.data?.message || 'Error deleting content');
        }
    };

    const handleTypeFilterChange = (event) => {
        setTypeFilter(event.target.value);
        setPage(0);
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
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography variant="h6">
                        Content Management
                    </Typography>
                    {flaggedContent > 0 && (
                        <Chip
                            label={`Flagged: ${flaggedContent}`}
                            color="warning"
                            sx={{ ml: 2 }}
                        />
                    )}
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl size="small">
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={typeFilter}
                            label="Type"
                            onChange={handleTypeFilterChange}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="question">Questions</MenuItem>
                            <MenuItem value="answer">Answers</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Search content"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>Content</TableCell>
                                <TableCell>Author</TableCell>
                                <TableCell>Votes</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {content.map((item) => (
                                <ContentRow
                                    key={item._id}
                                    content={item}
                                    isQuestion={item.type === 'question'}
                                    flagged={item.flagged}
                                    onDelete={handleDelete}
                                    onDeleteError={deleteError}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={totalContent}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                />
            </Paper>
        </Box>
    );
};

export default ContentManagementPage;
