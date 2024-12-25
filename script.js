
// const socket = io('http://localhost:3000')
// const messageContainer = document.getElementById('message-container')
// const messageForm = document.getElementById('send-container')
// const messageInput = document.getElementById('message-input')
// const fileInput = document.getElementById('file-input');
// const fileLabel = document.getElementById('file-label');

// const name = prompt('What is your name?')
// appendMessage('You joined')
// socket.emit('new-user', name)


// socket.on('chat-message', data => {
//   appendMessage(`${data.name}: ${data.message}`);
//   console.log(`Message received from ${data.name}: ${data.message}`); // Debug log for received messages
// });

// socket.on('file-upload', data => {
//   appendFileMessage(data.name, data.fileName, data.fileURL);
// });
// socket.on('user-connected', name => {
//   console.log('name' ,name)
//   appendMessage(`${name} connected`)
// })

// socket.on('user-disconnected', name => {
//   appendMessage(`${name} disconnected`)
// })

// messageForm.addEventListener('submit', e => {
//   e.preventDefault();
//   const message = messageInput.value.trim(); // Trim spaces
//   if (!message) return; // Ignore empty messages
//   appendMessage(`You: ${message}`);
//   console.log('Message sent:', message); // Debug log for the message
//   socket.emit('send-chat-message', message);
//   messageInput.value = '';
// });
// fileInput.addEventListener('change', () => {
//   const file = fileInput.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = () => {
//       const fileURL = reader.result;
//       const fileName = file.name;
//       appendFileMessage('You', fileName, fileURL);
//       socket.emit('file-upload', { name, fileName, fileURL });
//     };
//     reader.readAsDataURL(file);
//   }
// });
// function appendMessage(message) {
//   const messageElement = document.createElement('div');
//   const timestamp = document.createElement('span');

//   function appendFileMessage(sender, fileName, fileURL) {
//   const fileElement = document.createElement('div');
//   fileElement.innerHTML = `
//     <strong>${sender}:</strong> <a href="${fileURL}" target="_blank">${fileName}</a>
//   `;
//   messageContainer.appendChild(fileElement);
// }

//   // Add message text
//   messageElement.innerText = message;
//   messageElement.style.marginBottom = '5px';

//   // Add timestamp
//   timestamp.innerText = ` ${getCurrentTime()}`;
//   timestamp.style.fontSize = '0.8em';
//   timestamp.style.color = '#555';
//   timestamp.style.marginLeft = '10px';

//   // Append timestamp to the message
//   messageElement.appendChild(timestamp);
//   messageContainer.append(messageElement);
// }

// // Function to get current time in HH:MM format
// function getCurrentTime() {
//   const now = new Date();
//   const hours = now.getHours().toString().padStart(2, '0');
//   const minutes = now.getMinutes().toString().padStart(2, '0');
//   return `${hours}:${minutes}`;
// }



// //  This is all above  only in Backend message send in one way  andsome styling 
const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const fileInput = document.getElementById('file-input');
const fileLabel = document.getElementById('file-label');

const name = prompt('What is your name?');
appendMessage('You joined');
socket.emit('new-user', name);

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on('file-upload', data => {
  appendFileMessage(data.name, data.fileName, data.fileURL);
});

socket.on('user-connected', name => {
  appendMessage(`${name} connected`);
});

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`);
});
// Handle previous messages sent from the backend
socket.on('previous-messages', messages => {
  messages.forEach(data => {
    appendMessage(`${data.name}: ${data.message} - ${data.time}`, 'other');
  });
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;
  appendMessage(`You: ${message}`, 'you');
  socket.emit('send-chat-message', message);
  messageInput.value = '';
});


fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const fileURL = reader.result;
      const fileName = file.name;
      appendFileMessage('You', fileName, fileURL);
      socket.emit('file-upload', { name, fileName, fileURL });
    };
    reader.readAsDataURL(file);
  }
});

function appendMessage(message, sender = 'other') {
  const messageElement = document.createElement('div');
  const currentTime = new Date();
  const timeString = currentTime.toLocaleTimeString(); // This gives the time in the format HH:MM:SS

  messageElement.innerText = message;
  messageElement.innerHTML = `
  <span>${message}</span>
  <span style="font-size: 12px; color: gray; margin-left: 10px;">${timeString}</span>
`;
  // Apply different classes based on the sender
  if (sender === 'you') {
    messageElement.classList.add('message-right');
  } else {
    messageElement.classList.add('message-left');
  }

  messageContainer.appendChild(messageElement);
}


function appendFileMessage(sender, fileName, fileURL) {
  const fileElement = document.createElement('div');
  fileElement.innerHTML = `
    <strong>${sender}:</strong> <a href="${fileURL}" target="_blank">${fileName}</a>
  `;
  messageContainer.appendChild(fileElement);
}
