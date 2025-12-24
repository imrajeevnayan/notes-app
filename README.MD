## 📝 Complete Notes Application

A full-stack notes application built with **Spring Boot**, **PostgreSQL**, **JWT Authentication**, and a **React (Vite) Frontend**.

### ✨ Features

- 🔐 **User Authentication** - Register and login with JWT tokens
- 📝 **Note Management** - Create, read, update, and delete notes
- 📎 **File Attachments** - Upload and download files (PDF, images, documents)
- 🔒 **Authorization** - Users can only access their own notes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile (Tailwind CSS)
- 🎨 **Modern UI** - Beautiful dark theme with smooth animations
- 🔍 **Search** - Search through your notes
- 📊 **Multiple Views** - Grid and list view options

### 🛠️ Technology Stack

**Backend:**
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Maven

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Lucide React (Icons)
- Axios

**DevOps:**
- Docker & Docker Compose

### 📋 Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL 12 or higher
- Docker (optional)

### 🚀 Getting Started

You can run the application either locally or using Docker.

#### Option 1: Run with Docker (Recommended)

1.  Ensure Docker is installed and running.
2.  Run the following command:
    ```bash
    docker-compose up --build
    ```
3.  Access the application:
    - Frontend: `http://localhost:5173`
    - Backend: `http://localhost:8080`

#### Option 2: Run Locally

**1. Database Setup**
```bash
psql -U postgres
CREATE DATABASE notesapp;
\q
```

**2. Backend Setup**
Update `backend/src/main/resources/application.properties` with your DB credentials.
```bash
cd backend
./mvnw.cmd spring-boot:run
```

**3. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`.

### 📁 Project Structure

```
Notes App/
├── backend/                 # Spring Boot Backend
│   ├── src/                 # Java Source Code
│   ├── Dockerfile           # Backend Docker Image
│   └── pom.xml
├── frontend/                # React Frontend
│   ├── src/                 # React Source Code
│   ├── Dockerfile           # Frontend Docker Image
│   ├── nginx.conf           # Nginx Config for Docker
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml       # Docker Orchestration
└── README.md
```

### 🔒 Security Features

- Passwords hashed with BCrypt
- JWT token-based authentication
- Token expiration (24 hours)
- CORS configuration
- Authorization checks on all endpoints
- File type and size validation

### 👨‍💻 Author

Built with ❤️ using Spring Boot and React.
