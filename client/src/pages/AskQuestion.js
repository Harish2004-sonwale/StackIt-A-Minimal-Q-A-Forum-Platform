import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Container, Chip, Autocomplete } from '@mui/material';
import RichTextEditor from '../components/RichTextEditor';
import axios from 'axios';

const AskQuestion = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('/api/questions', {
                title,
                description,
                tags
            });

            navigate(`/question/${response.data.question._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to post question');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Ask a Question
                </Typography>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Question Title"
                        margin="normal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        helperText="Make your title clear and specific"
                    />
                    <RichTextEditor
                        value={description}
                        onChange={setDescription}
                        placeholder="Write your question details here..."
                    />
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Tags
                        </Typography>
                        <Autocomplete
                            multiple
                            freeSolo
                            options={[]}
                            value={tags}
                            onChange={(event, newValue) => {
                                setTags(newValue);
                            }}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        variant="outlined"
                                        label={option}
                                        {...getTagProps({ index })}
                                        sx={{ mr: 1, mb: 1 }}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Add tags (e.g., javascript, react)"
                                    placeholder="Add tags"
                                />
                            )}
                        />
                    </Box>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading || !title || !description}
                        >
                            {loading ? 'Posting...' : 'Post Question'}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default AskQuestion;
