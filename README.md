# SSE with Hono

## 📌 Project Overview
This project is a simple implementation of **Server-Sent Events (SSE)** using **Hono** in a Node.js environment. It allows clients to receive real-time updates from the server using SSE while sending messages via a RESTful POST request.

---

## 🚀 Features
- **Server-Sent Events (SSE):** Clients can subscribe to real-time updates.
- **Message Broadcasting:** Messages sent via POST are pushed to all connected SSE clients.
- **CORS Support:** Configured for cross-origin requests.
- **Keep-Alive Connection:** Ensures clients remain connected.
- **jQuery Frontend Integration:** Simple client interface for sending and receiving messages.

---

## 🛠️ Setup & Installation
### 1️⃣ Prerequisites
Ensure you have the following installed:
- **Node.js** (v18+ recommended)
- **npm or yarn**

### 2️⃣ Clone the Repository
```sh
git clone <repository-url>
cd <project-directory>
```

### 3️⃣ Install Dependencies
```sh
npm install
```

---

## 📜 Usage
### 1️⃣ Start the Server
Run the following command to start the server on port **3000**:
```sh
npm start
```
The server will be running at:
```
http://localhost:3000
```

### 2️⃣ Sending Messages
You can send messages via a POST request:
```sh
curl -X POST http://localhost:3000/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, SSE!"}'
```
Or use the provided **HTML client** to send messages.

### 3️⃣ Receiving SSE Updates
Open the SSE client HTML file in a browser. It will listen to messages from the server and display them.

---

## 📂 Project Structure
```
📦 project-folder
 ┣ 📜 index.ts           # Main server file with Hono & SSE implementation
 ┣ 📜 package.json       # Node.js dependencies & scripts
 ┣ 📜 README.md          # Project documentation
 ┣ 📜 public/            # Contains HTML files for client-side interaction
 ┗ 📜 node_modules/      # Dependencies (auto-generated)
```

---

## 📡 API Endpoints
### 1️⃣ **POST /message**
Sends a message to all connected SSE clients.
#### Request Body:
```json
{
  "message": "Hello, SSE!"
}
```
#### Response:
```json
{
  "message": "Message sent to clients"
}
```

### 2️⃣ **GET /sse**
Establishes an SSE connection with the client to receive real-time updates.
#### Response Format (SSE Event):
```json
{
  "data": "Hello, SSE!",
  "event": "message"
}
```

---

## 🖥️ Frontend (Client Side)
### 1️⃣ **Sending Messages (send.html)**
Use this simple jQuery-based form to send messages via AJAX.

```html
<input type="text" id="message-input" placeholder="Type a message">
<button id="send-message">Send Message</button>
<script>
$(document).ready(function () {
    $('#send-message').click(function () {
        const message = $('#message-input').val();
        $.ajax({
            url: 'http://localhost:3000/message',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ message: message }),
            success: function (response) {
                console.log('Message sent:', response);
            },
            error: function (error) {
                console.error('Error sending message:', error);
            }
        });
    });
});
</script>
```

### 2️⃣ **Receiving Messages (receive.html)**
This HTML file listens for SSE messages and displays them dynamically.
```html
<div id="sse-updates"></div>
<script>
$(document).ready(function () {
    const eventSource = new EventSource('http://localhost:3000/sse');
    eventSource.onmessage = function (event) {
        $('#sse-updates').append(`<p>${event.data}</p>`);
    };
    eventSource.onerror = function (error) {
        console.error('SSE error:', error);
        eventSource.close();
    };
});
</script>
```

---

## 🛠️ Troubleshooting
### 🔹 Common Issues & Fixes
1. **CORS Errors:** Ensure the server allows cross-origin requests.
2. **Connection Timeout:** Check that the client remains connected using the `keep-alive` headers.
3. **No SSE Updates:** Ensure the POST endpoint is correctly broadcasting messages.
4. **Port Conflict:** If port 3000 is in use, modify the `serve({ port: 3000 })` in `index.ts`.

---

## 🤝 Contributing
Want to improve this project? Follow these steps:
1. Fork the repository 📌
2. Create a feature branch 🚀
3. Commit your changes 🔥
4. Push to your branch ✅
5. Open a Pull Request! 🎉

---

## 📜 License
This project is licensed under the **MIT License**. Feel free to modify and use it as needed!

---

## 🌟 Acknowledgments
- **Hono** for lightweight web framework
- **Node.js** for backend processing
- **jQuery** for frontend AJAX & DOM manipulation

