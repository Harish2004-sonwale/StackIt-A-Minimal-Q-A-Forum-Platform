# StackIt - Minimal Q&A Forum Platform

[![GitHub license](https://img.shields.io/github/license/Harish2004-sonwale/StackIt-A-Minimal-Q-A-Forum-Platform)](https://github.com/Harish2004-sonwale/StackIt-A-Minimal-Q-A-Forum-Platform/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/Harish2004-sonwale/StackIt-A-Minimal-Q-A-Forum-Platform)](https://github.com/Harish2004-sonwale/StackIt-A-Minimal-Q-A-Forum-Platform/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/Harish2004-sonwale/StackIt-A-Minimal-Q-A-Forum-Platform)](https://github.com/Harish2004-sonwale/StackIt-A-Minimal-Q-A-Forum-Platform/pulls)

## 🌟 About UNLOCKED SERIES

StackIt is part of the UNLOCKED SERIES - a collection of open-source projects designed to be accessible, easy to use, and free for everyone. The UNLOCKED SERIES aims to make technology accessible and understandable for everyone, regardless of their background or experience level.

### 📖 What makes it UNLOCKED?
- ✅ No restrictions on usage
- ✅ Free for personal and commercial use
- ✅ Easy to modify and distribute
- ✅ Comprehensive documentation
- ✅ Community support
- ✅ Regular updates and improvements

### 🤝 How to Contribute
We welcome contributions from everyone! Whether you're a beginner or an experienced developer, there are ways to help:
1. Report bugs and issues
2. Submit feature requests
3. Contribute code improvements
4. Help with documentation
5. Share your experiences using the project

### 📄 License
This project is licensed under the UNLOCKED SERIES LICENSE, which is compatible with the MIT License. For full license details, see the LICENSE file.

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

## 🚀 Quick Start

### Windows Setup

1. **Install Required Software**
   - Download and install Node.js from: https://nodejs.org/
   - Download and install MongoDB from: https://www.mongodb.com/try/download/community
   - Install Git from: https://git-scm.com/download/windows

2. **Run the Project**
   - Double-click `run-local.bat` in the project root directory
   - This will:
     - Start MongoDB
     - Install all dependencies
     - Build the frontend
     - Start the backend server
     - Start the frontend server

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - API: http://localhost:5000/api

### Alternative Start Methods

1. **Using Command Line**
```bash
npm run run-anywhere
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

## 🚀 Cloud Deployment

### Using Render (Recommended)

1. Create a Render account at https://render.com

2. Connect your GitHub repository:
   - Go to https://render.com
   - Click 'New +', then 'Web Service'
   - Connect your GitHub repository
   - Select the appropriate branch

3. Deploy Backend:
   - Name: stackit-backend
   - Build Command: npm install
   - Start Command: npm start
   - Environment Variables:
     ```
     NODE_ENV=production
     PORT=5000
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/stackit
     JWT_SECRET=your-secret-key
     SESSION_SECRET=your-session-secret
     CLIENT_URL=https://stackit-frontend.onrender.com
     ```

4. Deploy Frontend:
   - Name: stackit-frontend
   - Build Command: npm install && npm run build
   - Start Command: npm start
   - Environment Variables:
     ```
     NODE_ENV=production
     REACT_APP_API_URL=https://stackit-backend.onrender.com/api
     REACT_APP_ENV=production
     ```

5. MongoDB Setup:
   - Sign up for MongoDB Atlas at https://www.mongodb.com/cloud/atlas/register
   - Create a new cluster
   - Add your IP address to the whitelist
   - Create a database user
   - Update the MONGODB_URI with your credentials

### Alternative Deployment Options

- Heroku
- DigitalOcean
- AWS Elastic Beanstalk
- Google Cloud Platform

### Post-Deployment

1. Set up SSL/TLS certificates
2. Configure environment variables
3. Set up backup schedule
4. Configure monitoring
5. Set up error tracking

Your application will be live at:
- Frontend: https://stackit-frontend.onrender.com
- Backend: https://stackit-backend.onrender.com

### Monitoring and Maintenance

- Use Render's built-in monitoring
- Set up error tracking with Sentry
- Configure backup schedule
- Monitor resource usage
- Regular security updates

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
