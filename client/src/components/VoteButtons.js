import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import axios from 'axios';

const VoteButtons = ({ answerId, currentUser, onVoteChange }) => {
    const [voteCount, setVoteCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [userVote, setUserVote] = useState(null);

    useEffect(() => {
        // Fetch initial vote count and user's vote
        const fetchVoteData = async () => {
            try {
                const [voteCountRes, userVoteRes] = await Promise.all([
                    axios.get(`/api/votes/answer/${answerId}`),
                    currentUser && axios.get(`/api/votes/answer/${answerId}/user/${currentUser.id}`)
                ]);
                setVoteCount(voteCountRes.data.total);
                setUserVote(userVoteRes?.data?.vote || null);
            } catch (error) {
                console.error('Error fetching vote data:', error);
            }
        };

        fetchVoteData();
    }, [answerId, currentUser]);

    const handleVote = async (value) => {
        if (!currentUser) {
            window.location.href = '/login';
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                `/api/votes/answer/${answerId}`,
                { value },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );

            // Update local state
            setVoteCount(prev => prev + (userVote === value ? 0 : value));
            setUserVote(value);

            // Notify parent component if needed
            if (onVoteChange) {
                onVoteChange(answerId, value);
            }
        } catch (error) {
            console.error('Error voting:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Upvote">
                <IconButton
                    onClick={() => handleVote(1)}
                    disabled={loading}
                    color={userVote === 1 ? 'primary' : 'default'}
                >
                    <ThumbUpIcon />
                </IconButton>
            </Tooltip>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {voteCount}
            </Typography>
            <Tooltip title="Downvote">
                <IconButton
                    onClick={() => handleVote(-1)}
                    disabled={loading}
                    color={userVote === -1 ? 'error' : 'default'}
                ></IconButton>
            </Tooltip>
        </Box>
    );
};

export default VoteButtons;
