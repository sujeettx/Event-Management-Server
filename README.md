# 🎫 Event Management System

A robust Node.js backend system for managing college events with multi-level user authentication and real-time email notifications.

![Event Management](https://img.shields.io/badge/Event-Management-blue)
![Node.js](https://img.shields.io/badge/Node.js-Success-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Success-green)
![Express](https://img.shields.io/badge/Express-Success-green)

## 🌟 Features

### Super Admin Powers 👑
- Create and manage host accounts (colleges)
- Generate unique host IDs
- Monitor system-wide activities
- Manage all events across platforms

### Host Features (College Admin) 🏫
- Distribute college IDs to students
- Create and manage events
- Track event registrations
- View participant analytics
- Student account management

### Student Features 👨‍🎓
- Create accounts using college ID
- Register for events
- Manage profile
- Track registered events
- Receive email notifications

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: Bcrypt
- **Email Service**: Nodemailer

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm/yarn
- Email service credentials

## ⚙️ Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/event-management.git
cd event-management
```

2. Install dependencies
```bash
# Core dependencies
npm install express mongoose jsonwebtoken bcrypt nodemailer

# Development dependencies
npm install -D nodemon

# Or install all at once
npm install express mongoose jsonwebtoken bcrypt nodemailer cors dotenv
npm install -D nodemon
```

3. Configure environment variables
```bash
cp .env.example .env
```

Add the following configurations to your `.env` file:
```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

4. Start the server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🔒 Security Features

- Password hashing using Bcrypt
- JWT-based authentication
- Role-based access control
- Request validation
- Secure email notifications

## 📧 Email Notifications

Students receive email notifications for:
- Account creation
- Event registration
- Event updates
- Registration confirmations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

---
⭐️ **Feel free to star this repository if you find it helpful!**