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
    Chip
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

    const formatTime = (timestamp) => {
        return moment(timestamp).fromNow();
    };

    // Handle mention click
    const handleMentionClick = (username) => {
        // Navigate to user profile or search
        navigate(`/search?query=${username}`);
    };

    // Format content with mention links
    const formatContent = (content) => {
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
            const response = await axios.put(
                `/api/answers/${answerId}/accept`,
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            onAcceptAnswer(response.data.answer);
        } catch (error) {
            console.error('Error accepting answer:', error);
        }
    };

    return (
        <Card sx={{ marginBottom: 2, boxShadow: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2 }}>
                        {answer.authorName?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="subtitle1" color="primary">
                            {answer.authorName}
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

                <Box sx={{ mb: 3 }}>
                    {formatContent(answer.content)}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <VoteButtons
                            answerId={answer._id}
                            currentUser={user}
                            onVoteChange={onVoteChange}
                        />
                        {answer.isAccepted && (
                            <Chip
                                icon={<CheckCircleIcon sx={{ color: 'success.main' }} />}
                                label="Accepted Answer"
                                color="success"
                                variant="outlined"
                                size="small"
                            />
                        )}
                    </Box>
                    {isQuestionOwner && !answer.isAccepted && (
                        <Tooltip title="Mark as accepted answer">
                            <IconButton
                                onClick={() => handleAcceptAnswer(answer._id)}
                                sx={{
                                    color: 'success.main',
                                    '&:hover': {
                                        bgcolor: 'success.light'
                                    }
                                }}
                            >
                                <CheckCircleIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default AnswerCard;
