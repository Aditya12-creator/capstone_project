# Simple Real-time Messaging Backend

A minimal Node.js backend for real-time messaging with Socket.IO.

## 🚀 Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## 📡 API Endpoints

- `GET /api/users` - Get all users
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Send a message
- `GET /health` - Server health check

## 🔌 Socket.IO Events

### Client to Server:
- `user_join` - User joins the chat
- `send_message` - Send a new message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator

### Server to Client:
- `new_message` - New message received
- `user_online` - User came online
- `user_offline` - User went offline
- `user_typing` - User is typing
- `user_stop_typing` - User stopped typing
- `online_users` - List of online users

## 👥 Demo Users

- **Aditya Kumar** (ID: 1)
- **Mom** (ID: 2)
- **Dad** (ID: 3)

## 🔧 Usage Example

```javascript
// Connect to backend
const socket = io('http://localhost:5000');

// Join as user
socket.emit('user_join', {
  id: '1',
  name: 'Aditya Kumar',
  avatar: 'avatar-url'
});

// Send message
socket.emit('send_message', {
  text: 'Hello everyone!',
  avatar: 'avatar-url'
});

// Listen for messages
socket.on('new_message', (message) => {
  console.log('New message:', message);
});
```

Simple and ready to use! 🎉