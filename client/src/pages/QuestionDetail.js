import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography, Card, CardContent, Button, TextField } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import RichTextEditor from '../components/RichTextEditor';
import AnswerCard from '../components/AnswerCard';
import axios from 'axios';

const QuestionDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [newAnswer, setNewAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.get(`/api/questions/${id}`);
                setQuestion(response.data.question);
                setAnswers(response.data.answers);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch question');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [id]);

    const handlePostAnswer = async () => {
        if (!newAnswer.trim()) return;

        try {
            const response = await axios.post(
                '/api/answers',
                {
                    questionId: id,
                    content: newAnswer
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );

            setAnswers([response.data.answer, ...answers]);
            setNewAnswer('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post answer');
        }
    };

    const handleVoteChange = (answerId, value) => {
        // Update local state immediately
        setAnswers(prev => prev.map(answer =>
            answer._id === answerId
                ? { ...answer, voteCount: answer.voteCount + value }
                : answer
        ));
    };

    const handleAcceptAnswer = (updatedAnswer) => {
        setAnswers(prev => prev.map(answer =>
            answer._id === updatedAnswer.id
                ? { ...answer, isAccepted: updatedAnswer.isAccepted }
                : answer
        ));
    };

    const handleEditAnswer = (answerId) => {
        // Implement answer editing
    };

    const handleDeleteAnswer = (answerId) => {
        // Implement answer deletion
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {question.title}
                        </Typography>
                        <div
                            dangerouslySetInnerHTML={{ __html: question.description }}
                            style={{ marginBottom: 20, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
                        />
                        <Typography variant="subtitle2" color="text.secondary">
                            Asked by {question.authorName} • {moment(question.createdAt).fromNow()}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                            {question.tags.map((tag) => (
                                <Chip key={tag} label={tag} variant="outlined" />
                            ))}
                        </Box>
                    </CardContent>
                </Card>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Answers ({answers.length})
                    </Typography>
                    {answers.map((answer) => (
                        <AnswerCard
                            key={answer._id}
                            answer={answer}
                            onVoteChange={handleVoteChange}
                            onEdit={handleEditAnswer}
                            onDelete={handleDeleteAnswer}
                            onAcceptAnswer={handleAcceptAnswer}
                            isQuestionOwner={question.author === user?.id}
                        />
                    ))}
                </Box>

                {user && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Your Answer
                        </Typography>
                        <RichTextEditor
                            value={newAnswer}
                            onChange={setNewAnswer}
                            placeholder="Write your answer here..."
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handlePostAnswer}
                            sx={{ mt: 2 }}
                        >
                            Post Your Answer
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default QuestionDetail;
