# Contributing to StackIt

Thank you for considering contributing to StackIt! 🎉

## 📋 Prerequisites

- Node.js v18 or higher
- MongoDB v5.0 or higher
- Basic understanding of React and Node.js
- Familiarity with Git and GitHub

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/YOUR-USERNAME/StackIt-A-Minimal-Q-A-Forum-Platform.git
cd StackIt-A-Minimal-Q-A-Forum-Platform
```

3. Install dependencies:
```bash
cd client && npm install
cd ../server && npm install
```

4. Copy `.env.example` files:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

5. Start the development servers:
```bash
# In one terminal (backend)
cd server
npm run dev

# In another terminal (frontend)
cd client
npm start
```

## 📝 Code Style

- Follow ESLint rules
- Use Prettier for code formatting
- Write clear commit messages
- Follow React best practices
- Use proper TypeScript types
- Write tests for new features

## 🔄 Development Workflow

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes

3. Add tests if applicable

4. Commit your changes:
```bash
git add .
git commit -m "feat: describe your changes"
```

5. Push to the branch:
```bash
git push origin feature/your-feature-name
```

6. Create a Pull Request

## 🛠️ Testing

Run tests before submitting a PR:
```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server
npm test
```

## 📝 Documentation

- Update README.md for new features
- Add documentation for new components
- Update API documentation
- Keep examples up to date

## 🎯 Pull Request Guidelines

1. Reference the related issue in the PR description
2. Include screenshots or GIFs for UI changes
3. Add tests for new features
4. Update documentation
5. Follow the commit message convention

## 📝 Commit Message Convention

```
feat: add new feature
fix: fix bug
perf: improve performance
docs: update documentation
style: format code
refactor: improve code structure
test: add tests
chore: maintenance tasks
```

## 🛡️ Security

If you find a security issue, please:
1. Do NOT open a public issue
2. Email harishsonwale2004@gmail.com
3. Include full details of the vulnerability

## 🎉 License

By contributing, you agree that your contributions will be licensed under the MIT License.
