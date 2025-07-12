import React from 'react';
import { Card, CardContent, Typography, Button, Box, Avatar, Chip, Rating } from '@mui/material';
import { Link } from 'react-router-dom';

const QuestionCard = ({ question, onVote, onAnswer }) => {
    const tags = question.tags || [];
    const hasAcceptedAnswer = question.acceptedAnswerId !== undefined;

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        {question.user?.username?.[0] || 'U'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component={Link} to={`/question/${question._id}`} color="primary">
                            {question.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Asked by {question.user?.username}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={question.votes || 0} readOnly precision={0.5} size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            {question.votes || 0}
                        </Typography>
                    </Box>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 2 }}>
                    {question.content}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
                    {tags.map((tag) => (
                        <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                        />
                    ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => onVote(question._id, 'up')}
                            sx={{ mr: 1 }}
                        >
                            Upvote
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => onVote(question._id, 'down')}
                        >
                            Downvote
                        </Button>
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => onAnswer(question._id)}
                    >
                        {hasAcceptedAnswer ? 'View Answer' : 'Answer'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default QuestionCard;
