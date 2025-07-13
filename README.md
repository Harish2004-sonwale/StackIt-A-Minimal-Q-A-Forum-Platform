# StackIt - Minimal Q&A Forum Platform

[![GitHub license](https://img.shields.io/github/license/Harish2004-sonwale/StackIt-A-Minimal-Q-A-Forum-Platform)](https://github.com/Harish2004-sonwale/StackIt-A-Minimal-Q-A-Forum-Platform/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/Harish2004-sonwale/StackIt-A-Minimal-Q-A-Forum-Platform)](https://github.com/Harish2004-sonwale/StackIt-A-Minimal-Q-A-Forum-Platform/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/Harish2004-sonwale/StackIt-A-Minimal-Q-A-Forum-Platform)](https://github.com/Harish2004-sonwale/StackIt-A-Minimal-Q-A-Forum-Platform/pulls)

StackIt is a modern, full-stack Q&A platform built with React, Node.js, Express, and MongoDB. It provides a minimal yet powerful interface for asking and answering technical questions, similar to Stack Overflow.

## 🚀 Features

- 📝 Rich text question and answer posting
- 👍 Voting system with upvotes/downvotes
- ✅ Accepted answers
- 🔍 Search functionality
- 📊 Admin dashboard with user and content management
- 🔔 Real-time notifications
- 📱 Mobile-responsive design
- 🔐 Secure authentication
- 📊 Comprehensive testing suite
- 🔄 Production-ready deployment

## 🛠️ Tech Stack

- Frontend:
  - React 18
  - Material-UI
  - React Router
  - React Testing Library
  - MSW (Mock Service Worker)

- Backend:
  - Node.js 18+
  - Express
  - MongoDB
  - JWT Authentication
  - Helmet
  - Compression

- Testing:
  - Jest
  - React Testing Library
  - MSW
  - E2E tests

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Harish2004-sonwale/StackIt-A-Minimal-Q-A-Forum-Platform.git
cd StackIt-A-Minimal-Q-A-Forum-Platform
```

2. Install dependencies:
```bash
cd client && npm install
cd ../server && npm install
```

3. Set up environment variables:
Create `.env` files in both `client` and `server` directories:

```
# client/.env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development

# server/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stackit
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret
CLIENT_URL=http://localhost:3000
```

4. Start the development servers:
```bash
# In one terminal (backend)
cd server
npm run dev

# In another terminal (frontend)
cd client
npm start
```

## 🚀 Deployment

StackIt is deployed using Render with:

- Frontend: React application deployed on Render
- Backend: Node.js application deployed on Render
- Database: MongoDB Atlas
- Backup: GitHub Actions weekly backup
- Monitoring: UptimeRobot and Sentry

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- Security headers with Helmet
- Input validation
- XSS protection
- CSRF protection

## 📊 Monitoring

- Uptime monitoring with UptimeRobot
- Error tracking with Sentry
- MongoDB Atlas monitoring
- GitHub Actions for CI/CD
- Express Status Monitor

## 🔄 Backup Strategy

- Weekly MongoDB Atlas snapshots
- GitHub Actions weekly exports
- Log rotation
- Health checks

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🤝 Support

For support, email harishsonwale0408@gmail.com or create an issue in the repository.

## 👨‍💻 Authors

- **Harish Sonwale** - Initial work - [Harish2004-sonwale](https://github.com/Harish2004-sonwale)
