 const io = require('socket.io')(3000, {
    cors: {
      origin: "http://127.0.0.1:5500", // Replace with your frontend origin
      methods: ["GET", "POST"],
    },
  });
  
  const users = {};
  const messages = [];
  io.on('connection', socket => {
    socket.on('new-user', name => {
      users[socket.id] = name;
      socket.broadcast.emit('user-connected', name);
// Send the previous messages to the new user
socket.emit('previous-messages', messages);

    });
  
    socket.on('send-chat-message', message => {
      const currentTime = new Date();
      const timeString = currentTime.toLocaleTimeString();
      
      const chatMessage = {
        message: message,
        name: users[socket.id],
        time: timeString,
      };
  
      messages.push(chatMessage);
      socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    });
  
    socket.on('file-upload', data => {
      socket.broadcast.emit('file-upload', {
        name: users[socket.id],
        fileName: data.fileName,
        fileURL: data.fileURL,
      });
    });
  
    socket.on('disconnect', () => {
      socket.broadcast.emit('user-disconnected', users[socket.id]);
      delete users[socket.id];
    });
  });
  
