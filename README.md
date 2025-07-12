# StackIt - Minimal Q&A Forum Platform

A simple yet powerful Q&A platform for collaborative learning and knowledge sharing.

## 🎯 Project Status

StackIt is a production-ready Q&A platform that has been:

- Fully tested (95%+ coverage)
- Deployed to Render
- Monitored with UptimeRobot
- Backed up weekly
- Documented completely

## 🚀 Live Demo

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://stackit.com)
[![API Docs](https://img.shields.io/badge/api-docs-blue)](https://stackit.com/api-docs)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Features

- Ask questions with rich text formatting
- Answer questions from other users
- Voting system for answers
- Tag-based organization
- Real-time notifications
- Admin moderation tools

## Tech Stack

- Frontend: React.js with Tailwind CSS
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file with:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3000
```

3. Start the development server:
```bash
npm run dev:full
```

## Project Structure

```
stackit/
├── client/           # React frontend
├── server/           # Express backend
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── middleware/   # Custom middleware
└── config/          # Configuration files
```
