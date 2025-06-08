# Web-Sketch

**Web-Sketch** is a collaborative web-based sketching application that allows multiple users to draw on a shared whiteboard in real-time. Built using React, TypeScript, WebSockets, and Node.js, this application enables seamless sketch sharing, chat functionality, and room-based collaboration.

## ✨ Features

- 🎨 Real-time collaborative sketching
- 💬 Chat functionality within sketch rooms
- 🆔 Room-based joining using shared ID
- 📦 Full-stack architecture (React + Node.js + Socket.IO)
- 🔧 Easy to set up and extend

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, HTML Canvas
- **Backend**: Node.js, Express.js, Socket.IO
- **Others**: WebSockets, UUID

## 📁 Project Structure

```bash
Web-Sketch/
├── client/               # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── App.tsx
├── server/               # Node.js backend
│   ├── index.js
├── package.json
└── README.md



🚀 Getting Started
Prerequisites
Node.js (v14 or above)

npm

Installation
Clone the repository:

bash
Copy
Edit
git clone https://github.com/ankitbanshi/Web-Sketch.git
cd Web-Sketch
Install server dependencies:

bash
Copy
Edit
cd server
npm install
Install client dependencies:

bash
Copy
Edit
cd ../client
npm install
Running the App
Start the backend server:

bash
Copy
Edit
cd server
npm start
Start the frontend React app:

bash
Copy
Edit
cd ../client
npm start
Visit the app:

Open your browser and go to: http://localhost:3000

🧪 Usage
Enter your name and a room ID to join.

Share the room ID with others to collaborate.

Start sketching on the canvas in real-time.

Use the chat to communicate.

📄 License
This project is licensed under the MIT License.

🙌 Acknowledgments
Thanks to all open-source tools that made this project possible.
