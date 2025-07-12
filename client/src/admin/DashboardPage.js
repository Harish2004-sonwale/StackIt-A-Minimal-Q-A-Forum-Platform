import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Stack,
    LinearProgress,
    useTheme,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination
} from '@mui/material';
import {
    TrendingUp,
    People,
    QuestionAnswer,
    BarChart,
    AccessTime,
    EmojiEvents
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        activeUsers: 0,
        totalQuestions: 0,
        totalAnswers: 0
    });
    const [topUsers, setTopUsers] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('/api/admin/dashboard', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setStats(response.data.stats);
                setTopUsers(response.data.topUsers);
                setRecentActivity(response.data.recentActivity);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const StatCard = ({ title, value, icon, color }) => (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>
                        {icon}
                    </Avatar>
                    <Stack>
                        <Typography color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div">
                            {value}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );

    const RecentActivityTable = ({ activity }) => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Question</TableCell>
                        <TableCell>Author</TableCell>
                        <TableCell>Answers</TableCell>
                        <TableCell>Views</TableCell>
                        <TableCell>Created</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activity.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{item.author.username}</TableCell>
                            <TableCell>{item.answers.length}</TableCell>
                            <TableCell>{item.views || 0}</TableCell>
                            <TableCell>
                                {format(new Date(item.createdAt), 'MMM dd, yyyy HH:mm')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    if (loading) {
        return (
            <Box sx={{ p: 4 }}>
                <LinearProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Stats Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Users"
                        value={stats.activeUsers}
                        icon={<People />}
                        color={theme.palette.success.main}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Questions"
                        value={stats.totalQuestions}
                        icon={<QuestionAnswer />}
                        color={theme.palette.primary.main}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Answers"
                        value={stats.totalAnswers}
                        icon={<EmojiEvents />}
                        color={theme.palette.warning.main}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="User Growth"
                        value="+12%"
                        icon={<TrendingUp />}
                        color={theme.palette.info.main}
                    />
                </Grid>

                {/* Top Users */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Top Users
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Username</TableCell>
                                            <TableCell>Questions</TableCell>
                                            <TableCell>Answers</TableCell>
                                            <TableCell>Score</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {topUsers.map((user) => (
                                            <TableRow key={user._id}>
                                                <TableCell>{user.username}</TableCell>
                                                <TableCell>{user.questions.length}</TableCell>
                                                <TableCell>{user.answers.length}</TableCell>
                                                <TableCell>{user.activityScore}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Activity */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Recent Activity
                            </Typography>
                            <RecentActivityTable activity={recentActivity} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;
