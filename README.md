# Web-Sketch

Web-Sketch is a real-time collaborative web drawing application. It allows multiple users to be together on a shared canvas, supporting interactive features and live updates. The project features a React/Vite frontend and a Node.js/Express backend with Socket.IO for real-time communication.

---

## Features

- Real-time collaborative drawing
- Multi-user support with room and user management
- Modern React frontend (Vite)
- Express.js backend with Socket.IO
- User join/leave tracking

---

## Project Structure

Web-Sketch/
 - client/ # React + Vite frontend
 -  server/ # Node.js + Express + Socket.IO backend
 - README.md # Project documentation


---

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Installation

1. **Clone the repository**
    ```
    git clone https://github.com/ankitbanshi/Web-Sketch.git
    cd Web-Sketch
    ```

2. **Install dependencies**
    ```
    cd client
    npm install
    cd ../server
    npm install
    ```

3. **Start the backend server**
    ```
    node server.js
    ```

4. **Start the frontend**
    ```
    cd ../client
    npm run dev
    ```

5. **Open the provided local URL in your browser**

---

## Technologies Used

- React, Vite, Tailwind CSS, ESLint (Frontend)
- Node.js, Express, Socket.IO (Backend)
- CORS, custom user/session management

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements, bug fixes, or new features.

---

## License

This project is licensed under the MIT License.
