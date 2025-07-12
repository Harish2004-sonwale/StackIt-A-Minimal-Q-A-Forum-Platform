import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, Typography } from '@mui/material';

const RichTextEditor = ({ value, onChange, placeholder = 'Start writing your content here...' }) => {
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            [{ align: [] }],
            ['clean'],
            [{ color: [] }, { background: [] }],
            ['emoji']
        ],
        clipboard: {
            matchVisual: false,
        }
    };

    const formats = [
        'header',
        'bold', 'italic', 'strike',
        'list', 'bullet', 'ordered',
        'link', 'image',
        'align',
        'color', 'background',
        'emoji'
    ];

    return (
        <Box sx={{ width: '100%', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Description
            </Typography>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                style={{ minHeight: '200px' }}
            />
        </Box>
    );
};

export default RichTextEditor;
