# 📝 Awesome Notes App

Welcome to the **Awesome Notes App**! This is a modern, full-stack application designed to help you organize your thoughts, tasks, and ideas securely and efficiently. Built with the robust **Spring Boot** framework on the backend and a sleek **React** interface on the frontend, it’s the perfect playground for learning full-stack development or managing your daily notes.

---

## 📑 Table of Contents

1.  [Features](#-features)
2.  [Tech Stack](#-tech-stack)
3.  [Prerequisites](#-prerequisites)
4.  [🚀 Quick Start (Docker)](#-run-with-docker-recommended)
5.  [🔧 Manual Developer Setup](#-manual-setup-for-developers)
    *   [1. Database Setup](#1-database-setup)
    *   [2. Backend Setup](#2-backend-setup)
    *   [3. Frontend Setup](#3-frontend-setup)
6.  [📖 usage Guide](#-usage-guide)
7.  [📂 Project Structure](#-project-structure)
8.  [❓ Troubleshooting](#-troubleshooting)

---

## 🌟 Features

*   **🔐 Secure Authentication**: Sign up and log in securely. Your sessions are protected with **JWT (JSON Web Tokens)**.
*   **📝 CRUD Operations**: Create, Read, Update, and Delete notes seamlessly.
*   **🔍 Smart Search**: Instantly find what you're looking for by searching note titles or contents.
*   **📱 Fully Responsive**: Works perfectly on your laptop, tablet, or mobile phone.
*   **🎨 Modern UI/UX**: Designed with **Tailwind CSS** for a clean, beautiful, and distraction-free experience.
*   **📎 File Attachments**: Attach files or images to your notes (stored locally).
*   **🗄️ Robust Database**: Your data is safe in a **PostgreSQL** relational database.

---

## 🛠️ Tech Stack

**Backend (The Brains)**
*   **Language**: Java 25
*   **Framework**: Spring Boot 3
*   **Security**: Spring Security & JWT
*   **Database**: PostgreSQL 15
*   **ORM**: Hibernate / JPA

**Frontend (The Face)**
*   **Library**: React 18
*   **Build Tool**: Vite (Lightning fast!)
*   **Styling**: Tailwind CSS
*   **HTTP Client**: Axios

**DevOps (The Delivery)**
*   **Docker**: Containerization
*   **Docker Compose**: Multi-container orchestration

---

## ✅ Prerequisites

Before you begin, make sure you have the following installed on your machine.

**For Docker Users (Recommended):**
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
*   [Git](https://git-scm.com/downloads)

**For Manual Application Users:**
*   [Java JDK 25](https://jdk.java.net/25/) (or JDK 17+ recommended)
*   [Node.js](https://nodejs.org/) (LTS Version)
*   [PostgreSQL](https://www.postgresql.org/download/) (running locally)
*   [Git](https://git-scm.com/downloads)

---

## 🐳 Run with Docker (Recommended)

This is the **easiest** way to get the app running. You don't need to install Java, Node, or Postgres individually!

### Step 1: Clone the Repository
Open your terminal (Command Prompt, PowerShell, or Terminal) and run:
```bash
git clone https://github.com/imrajeevnayan/notes-app.git
cd notes-app
```

### Step 2: Launch the App
Run this command to build and start all services (Frontend, Backend, and Database):
```bash
docker-compose up --build
```
*   *Note: This might take a few minutes the first time as it downloads necessary images.*

### Step 3: Open in Browser
Once the logs stop scrolling and you see "Started NotesAppApplication", open your browser:
*   **Frontend (The App):** `http://localhost:5173`
*   **Backend (API):** `http://localhost:8080`

### Stops the App
To stop the application, press `Ctrl + C` in the terminal, or run:
```bash
docker-compose down
```

---

## 🔧 Manual Setup (For Developers)

If you want to run the code locally for development or without Docker.

### 1. Database Setup
You need a running PostgreSQL database.
1.  Open pgAdmin or your terminal.
2.  Create a database named `notesapp`.
3.  Ensure your Postgres user is `postgres` and password is `123`.
    *   *If your credentials are different, update `backend/src/main/resources/application.properties`.*

### 2. Backend Setup
1.  **Open a new terminal** and navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  **Build the application** (this skips tests for speed):
    ```bash
    ./mvnw clean package -DskipTests
    ```
    *(Windows users: use `mvnw` instead of `./mvnw` if needed)*
3.  **Run the server**:
    ```bash
    java -jar target/notesapp-0.0.1-SNAPSHOT.jar
    ```
4.  The backend server will start on `http://localhost:8080`.

### 3. Frontend Setup
1.  **Open a second terminal** and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start the development server**:
    ```bash
    npm run dev
    ```
4.  The frontend will start on `http://localhost:5173`.

---

## 📖 Usage Guide

1.  **Register**: Go to the Signup page. Enter your Full Name, Email, and Password.
2.  **Login**: Use your new credentials to log in.
3.  **Create a Note**:
    *   Click the **"Add Note"** or **"+"** button.
    *   Enter a title, some content, and optional tags.
    *   Click "Save".
4.  **Edit/Delete**: Use the icons on the note cards to modify or remove notes.
5.  **Search**: Use the search bar at the top to filter notes instantly.

---

## 📂 Project Structure

Here is a quick overview of what's inside:

```
notes-app/
├── 📂 backend/               # Spring Boot Application
│   ├── src/main/java         # Java Source Code
│   ├── src/main/resources    # Config (application.properties) & Static files
│   ├── Dockerfile            # Backend Docker Instructions
│   └── pom.xml               # Maven Dependencies
├── 📂 frontend/              # React Application
│   ├── src/                  # React Components & Logic
│   ├── public/               # Static assets
│   ├── Dockerfile            # Frontend Docker Instructions
│   └── package.json          # Node Dependencies
├── 📂 screenshots/           # Images for this README
├── docker-compose.yml        # Docker Orchestration File
└── README.md                 # This file!
```

---

## 📸 Screenshots

| Login | Register | Dashboard |
|:---:|:---:|:---:|
| ![Login](screenshots/login.svg) | ![Register](screenshots/register.svg) | ![Dashboard](screenshots/dashboard.svg) |

---

## ❓ Troubleshooting

### ❌ Port 8080/5432 is already in use?
*   **Error**: `Web server failed to start. Port 8080 was already in use.`
*   **Fix**: Identify what's using the port and stop it.
    *   Windows: `netstat -ano | findstr :8080` then `taskkill /PID <PID> /F`
    *   Or simply change the port in `application.properties`.

### ❌ Backend can't connect to Database?
*   **Error**: `Connection to localhost:5432 refused`
*   **Fix**:
    *   If running **Manual**: Ensure your local Postgres service is running.
    *   If running **Docker**: Ensure the `db` container is healthy (`docker ps`).
    *   Check username/password in `application.properties`.

### ❌ Frontend API errors?
*   **Check**: Is the backend running? Go to `http://localhost:8080/actuator/health` (if enabled) or just `http://localhost:8080`. It should not be a "Connection Refused" error.

---

Made with ❤️. Happy Coding! 🚀
