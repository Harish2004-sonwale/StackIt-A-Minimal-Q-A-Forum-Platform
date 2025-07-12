import React from 'react';
import {
    TableRow,
    TableCell,
    Typography,
    Box,
    IconButton,
    Tooltip,
    Chip,
    Collapse,
    Paper,
    Divider,
    Alert
} from '@mui/material';
import {
    Delete as DeleteIcon,
    QuestionAnswer as QuestionIcon,
    Comment as AnswerIcon,
    Flag as FlagIcon,
    Visibility as VisibilityIcon,
    Warning as WarningIcon
} from '@mui/icons-material';

const ContentRow = ({
    content,
    onDelete,
    isQuestion,
    flagged,
    onDeleteError
}) => {
    const [expanded, setExpanded] = React.useState(false);

    const handleDelete = async () => {
        try {
            await onDelete(content._id);
        } catch (error) {
            console.error('Error deleting content:', error);
        }
    };

    const formatContentPreview = (content) => {
        // Strip HTML tags and truncate
        const text = content.replace(/<[^>]+>/g, '');
        return text.length > 100 ? `${text.substring(0, 100)}...` : text;
    };

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isQuestion ? (
                            <QuestionIcon color="primary" />
                        ) : (
                            <AnswerIcon color="secondary" />
                        )}
                        <Typography variant="body2" color="text.secondary">
                            {isQuestion ? 'Question' : 'Answer'}
                        </Typography>
                        {flagged && (
                            <Chip
                                icon={<FlagIcon fontSize="small" />}
                                label="Flagged"
                                color="warning"
                                size="small"
                            />
                        )}
                    </Box>
                </TableCell>
                <TableCell>{content.title || formatContentPreview(content.content)}</TableCell>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24 }}>
                            {content.author?.username?.[0] || 'U'}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                            {content.author?.username || 'Unknown'}
                        </Typography>
                    </Box>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" color="text.secondary">
                        {content.voteCount || 0}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" color="text.secondary">
                        {new Date(content.createdAt).toLocaleDateString()}
                    </Typography>
                </TableCell>
                <TableCell align="right">
                    <Tooltip title="View full content">
                        <IconButton onClick={() => setExpanded(!expanded)}>
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete content">
                        <IconButton
                            onClick={handleDelete}
                            color="error"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={6}>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2 }}>
                            <Paper elevation={1}>
                                <Typography variant="body1" sx={{ mb: 1 }}>
                                    {isQuestion ? 'Question' : 'Answer'} Content:
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {content.content}
                                </Typography>
                                {content.tags && content.tags.length > 0 && (
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="body1" sx={{ mb: 1 }}>
                                            Tags:
                                        </Typography>
                                        {content.tags.map((tag) => (
                                            <Chip
                                                key={tag}
                                                label={tag}
                                                size="small"
                                                sx={{ mr: 1, mb: 1 }}
                                            />
                                        ))}
                                    </Box>
                                )}
                                {onDeleteError && (
                                    <Box sx={{ mt: 2 }}>
                                        <Alert severity="error">
                                            {onDeleteError}
                                        </Alert>
                                    </Box>
                                )}
                            </Paper>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

export default ContentRow;
