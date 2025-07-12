import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Avatar,
    Box,
    IconButton,
    Tooltip,
    Rating,
    Link,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import moment from 'moment';
import VoteButtons from './VoteButtons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const AnswerCard = ({ 
    answer, 
    onVoteChange, 
    onEdit, 
    onDelete, 
    onAcceptAnswer,
    isQuestionOwner 
}) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const isAuthor = user?.id === answer.author;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const formatTime = (timestamp) => {
        return moment(timestamp).fromNow();
    };

    // Handle mention click
    const handleMentionClick = (username) => {
        try {
            navigate(`/search?query=${username}`);
        } catch (err) {
            setError('Failed to navigate to user profile');
            console.error(err);
        }
    };

    // Format content with mention links
    const formatContent = (content) => {
        if (!content) return <Typography>No content available</Typography>;
        
        const mentionRegex = /@([a-zA-Z0-9_]+)/g;
        return content.replace(mentionRegex, (match, username) => (
            <Link
                key={match}
                onClick={() => handleMentionClick(username)}
                sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    cursor: 'pointer'
                }}
            >
                {match}
            </Link>
        ));
    };

    const handleAcceptAnswer = async (answerId) => {
        try {
            setLoading(true);
            const response = await axios.put(
                `/api/answers/${answerId}/accept`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            onAcceptAnswer(response.data.answer);
        } catch (error) {
            setError('Failed to accept answer');
            console.error('Error accepting answer:', error);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Card sx={{ marginBottom: 2, boxShadow: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        {answer.authorName?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle1" color="primary">
                            {answer.authorName || 'Anonymous'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formatTime(answer.createdAt)}
                        </Typography>
                    </Box>
                    {isAuthor && (
                        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                            <Tooltip title="Edit answer">
                                <IconButton onClick={() => onEdit(answer._id)}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete answer">
                                <IconButton onClick={() => onDelete(answer._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    {answer.content ? formatContent(answer.content) : 'No content available'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <VoteButtons 
                            answerId={answer._id} 
                            votes={answer.votes || 0} 
                            onVoteChange={onVoteChange}
                            loading={loading}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {isQuestionOwner && !answer.isAccepted && (
                            <Tooltip title="Accept this answer">
                                <IconButton 
                                    onClick={() => handleAcceptAnswer(answer._id)}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <CircularProgress size={20} />
                                    ) : (
                                        <CheckCircleIcon color="primary" />
                                    )}
                                </IconButton>
                            </Tooltip>
                        )}
                        {answer.isAccepted && (
                            <Chip 
                                label="Accepted" 
                                color="success" 
                                size="small"
                                sx={{ ml: 1 }}
                            />
                        )}
                    </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default AnswerCard;
