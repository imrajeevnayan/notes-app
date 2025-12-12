## 📝 Complete Notes Application

A full-stack notes application built with **Spring Boot**, **PostgreSQL**, **JWT Authentication**, and a **responsive frontend**.

### ✨ Features

- 🔐 **User Authentication** - Register and login with JWT tokens
- 📝 **Note Management** - Create, read, update, and delete notes
- 📎 **File Attachments** - Upload and download files (PDF, images, documents)
- 🔒 **Authorization** - Users can only access their own notes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful dark theme with smooth animations
- 🔍 **Search** - Search through your notes
- 📊 **Multiple Views** - Grid and list view options

### 🛠️ Technology Stack

**Backend:**
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Lombok
- Maven

**Frontend:**
- HTML5
- CSS3 (Modern design with gradients and animations)
- Vanilla JavaScript (ES6+)

### 📋 Prerequisites

- Java 17 or higher
- PostgreSQL 12 or higher
- Maven 3.6 or higher

### 🚀 Getting Started

#### 1. Database Setup

Create a PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE notesapp;
\q
```

#### 2. Configure Database

Update `src/main/resources/application.properties` if needed:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/notesapp
spring.datasource.username=postgres
spring.datasource.password=123
```

#### 3. Build and Run

```bash
# Navigate to project directory
cd "e:\Notes App"

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

#### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:8080
```

### 📁 Project Structure

```
Notes App/
├── src/
│   ├── main/
│   │   ├── java/com/notesapp/
│   │   │   ├── controller/          # REST API Controllers
│   │   │   ├── domain/entity/       # JPA Entities
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── repository/          # JPA Repositories
│   │   │   ├── security/            # Security & JWT Configuration
│   │   │   ├── service/             # Business Logic Services
│   │   │   └── NotesApplication.java
│   │   └── resources/
│   │       ├── static/              # Frontend Files
│   │       │   ├── css/
│   │       │   ├── js/
│   │       │   ├── index.html
│   │       │   └── dashboard.html
│   │       └── application.properties
│   └── test/                        # Test Files
├── uploads/                         # File Upload Directory (auto-created)
├── pom.xml
└── README.md
```

### 🔑 API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Notes (Requires Authentication)
- `GET /api/notes` - Get all user notes
- `GET /api/notes/{id}` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/{id}` - Update note
- `DELETE /api/notes/{id}` - Delete note

#### Files (Requires Authentication)
- `POST /api/files/upload/{noteId}` - Upload file to note
- `GET /api/files/{fileId}` - Download file
- `DELETE /api/files/{fileId}` - Delete file

### 🎯 Usage Guide

1. **Register** - Create a new account with username, email, and password
2. **Login** - Sign in with your credentials
3. **Create Notes** - Click "New Note" to create a note
4. **Add Files** - Upload files to your notes (max 10MB)
5. **Search** - Use the search box to find notes
6. **Switch Views** - Toggle between grid and list view
7. **Edit/Delete** - Click on a note to edit or use the action buttons

### 🔒 Security Features

- Passwords hashed with BCrypt
- JWT token-based authentication
- Token expiration (24 hours)
- CORS configuration
- Authorization checks on all endpoints
- File type and size validation

### 📱 Responsive Design

The application is fully responsive and works on:
- 💻 Desktop (1920px and above)
- 💻 Laptop (1024px - 1919px)
- 📱 Tablet (768px - 1023px)
- 📱 Mobile (320px - 767px)

### 🎨 Design Features

- Modern dark theme
- Gradient backgrounds
- Smooth animations and transitions
- Card-based layout
- Hover effects
- Loading states
- Empty states
- Error handling

### 📝 File Upload Support

Supported file types:
- PDF documents
- Images (PNG, JPG, JPEG, GIF)
- Text files
- Word documents (DOC, DOCX)

Maximum file size: 10MB

### 🧪 Testing

Run tests with:
```bash
mvn test
```

### 🐛 Troubleshooting

**Application won't start:**
- Ensure PostgreSQL is running
- Check database credentials in application.properties
- Verify Java 17+ is installed

**Can't upload files:**
- Check file size (max 10MB)
- Verify file type is supported
- Ensure note is saved before uploading

**JWT token expired:**
- Login again to get a new token
- Tokens expire after 24 hours

### 📄 License

This project is open source and available for educational purposes.

### 👨‍💻 Author

Built with ❤️ using Spring Boot and modern web technologies.
### 📫 Contact
For questions or support, please contact:
- Email:imrajeevnayan@gmail.com
- GitHub: [Rajeev Nayan](https://github.com/imrajeevnayan)
- LinkedIn: [Rajeev Nayan](https://www.linkedin.com/in/imrajeevnayan/)
- Instagram: [@imrajeevnayan](https://www.instagram.com/imrajeevnayan/)
