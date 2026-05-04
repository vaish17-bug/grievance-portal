# 🏛️ Citizen Grievance Portal

A full-stack web application that allows citizens to report and track civic complaints — potholes, garbage, broken streetlights, water supply issues — and follow them through to resolution.

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-brightgreen?style=flat-square&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square&logo=mysql)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=flat-square&logo=vite)

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Database Setup](#-database-setup)
- [API Endpoints](#-api-endpoints)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Known Issues & Fixes](#-known-issues--fixes)

---

## 📌 About

The Citizen Grievance Portal connects citizens with their municipality. Citizens submit complaints with photos and map pins. Admins assign complaints to field workers. Workers resolve them. Everyone stays updated through real-time notifications.

**The public dashboard shows live city statistics — no login required.**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 JWT Authentication | Stateless login with role-based access (Citizen / Worker / Admin) |
| 📝 Submit Complaints | Title, description, category, department selection |
| 📸 Multiple Photos | Upload up to 5 photos with live preview and remove option |
| 📍 Interactive Map | Pin complaint location on Leaflet/OpenStreetMap — free, no API key |
| 🔔 Notifications | In-app bell with unread badge, auto-polls every 30 seconds |
| ⭐ Rating System | Citizens rate resolved complaints 1–5 stars with optional feedback |
| 🔍 Search & Filter | Filter by status, search by title/description instantly |
| 📊 Public Dashboard | Live city stats visible to everyone without login |
| 📁 Export CSV | Admin can export all complaints to a CSV file |
| ⏱️ SLA Tracking | 3-day deadline auto-set when complaint is assigned to worker |
| 📜 Status History | Full timeline of every status change with timestamps and remarks |

---

## 🛠️ Tech Stack

### Backend
- **Java 17** + **Spring Boot 3.2.4**
- **Spring Security** — JWT-based authentication
- **Spring Data JPA** + **Hibernate** — ORM, no raw SQL
- **MySQL 8** — relational database
- **Lombok** — reduces boilerplate
- **jjwt 0.11.5** — JWT token generation and validation
- **Maven** — dependency management

### Frontend
- **React 18** + **Vite 5**
- **Axios** — HTTP client with interceptor for auto-auth headers
- **React Router DOM** — client-side routing
- **Leaflet.js** + **react-leaflet** — interactive maps
- **React Hot Toast** — notifications
- **Tailwind CSS** (CDN) — utility-first styling
- **Lucide React** — icons

---

## 📁 Project Structure

```
grievance-portal/
├── backend/
│   └── src/main/java/com/grievance/backend/
│       ├── config/
│       │   ├── JwtUtil.java            ← token create/validate/extract
│       │   ├── JwtFilter.java          ← runs on every request
│       │   └── SecurityConfig.java     ← CORS + endpoint permissions
│       ├── controller/
│       │   ├── AuthController.java     ← /api/auth/login & register
│       │   ├── ComplaintController.java← all complaint endpoints
│       │   ├── NotificationController.java
│       │   ├── PublicController.java   ← no-auth stats/departments
│       │   └── RatingController.java
│       ├── dto/
│       │   ├── AuthRequest.java
│       │   ├── AuthResponse.java
│       │   └── ComplaintRequest.java
│       ├── model/
│       │   ├── User.java               ← users table
│       │   ├── Complaint.java          ← complaints table
│       │   ├── Department.java
│       │   ├── Assignment.java         ← worker assignments
│       │   ├── StatusHistory.java      ← status change log
│       │   ├── Notification.java
│       │   └── Rating.java
│       ├── repository/                 ← JPA interfaces (auto-generates SQL)
│       └── service/
│           ├── AuthService.java
│           ├── ComplaintService.java   ← core business logic
│           ├── NotificationService.java
│           └── RatingService.java
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── CitizenDashboard.jsx
        │   ├── WorkerDashboard.jsx
        │   ├── AdminDashboard.jsx
        │   └── PublicDashboard.jsx
        ├── components/
        │   ├── MapPicker.jsx           ← location pin on Leaflet map
        │   ├── MapView.jsx             ← read-only map on complaint card
        │   ├── NotificationBell.jsx    ← bell icon with badge
        │   └── RatingModal.jsx         ← 5-star rating popup
        ├── services/
        │   └── api.js                  ← all axios calls in one place
        ├── context/
        │   └── AuthContext.jsx         ← global user state
        └── App.jsx                     ← routes + private route guard
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

- [Java 17+](https://adoptium.net/) — `java -version`
- [Node.js 18+](https://nodejs.org/) — `node -v`
- [MySQL 8](https://dev.mysql.com/downloads/) — running locally
- [IntelliJ IDEA](https://www.jetbrains.com/idea/) (Community Edition is free) — for backend
- [VS Code](https://code.visualstudio.com/) — for frontend

---

### 1. Clone the Repository

```bash
git clone https://github.com/vaish17-bug/grievance-portal.git
cd grievance-portal
git checkout new_f
```

---

### 2. Database Setup

Open **MySQL Workbench** or MySQL command line and run:

```sql
CREATE DATABASE grievance_db;
USE grievance_db;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('CITIZEN', 'WORKER', 'ADMIN') NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE complaints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    photo_urls TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    status ENUM('PENDING','ASSIGNED','IN_PROGRESS','RESOLVED','REJECTED') DEFAULT 'PENDING',
    citizen_id BIGINT,
    department_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES users(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT,
    worker_id BIGINT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sla_deadline TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id),
    FOREIGN KEY (worker_id) REFERENCES users(id)
);

CREATE TABLE status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT,
    status VARCHAR(50),
    remark TEXT,
    updated_by BIGINT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    complaint_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (complaint_id) REFERENCES complaints(id)
);

CREATE TABLE ratings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT UNIQUE,
    citizen_id BIGINT,
    stars INT NOT NULL CHECK (stars BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id),
    FOREIGN KEY (citizen_id) REFERENCES users(id)
);

-- Default departments
INSERT INTO departments (name, description) VALUES
('Sanitation', 'Garbage and waste management'),
('Roads', 'Pothole and road damage'),
('Electricity', 'Street lights and power issues'),
('Water Supply', 'Water pipeline issues'),
('Drainage', 'Drain overflow and blockage');

-- Default admin user  (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@municipality.com',
 '$2a$10$N.zmdr9zkzoGtM1ta5IuiOSfgX9Z3Y6RaM8VURrkFSKKR5WD4B2Hy', 'ADMIN');

-- Sample worker  (password: admin123)
INSERT INTO users (name, email, password, role) VALUES
('Worker One', 'worker1@municipality.com',
 '$2a$10$N.zmdr9zkzoGtM1ta5IuiOSfgX9Z3Y6RaM8VURrkFSKKR5WD4B2Hy', 'WORKER');
```

---

### 3. Configure Backend

Open `backend/src/main/resources/application.properties` and set your MySQL password:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/grievance_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD_HERE   ← change this
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

server.port=8080

jwt.secret=grievancePortalSecretKey2024VeryLongSecretForSecurity
jwt.expiration=86400000

spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
spring.application.name=grievance-portal
```

---

### 4. Run the Backend

Open the `backend` folder in IntelliJ IDEA, then click **Run** — or in terminal:

```bash
cd backend
./mvnw spring-boot:run
```

✅ You should see: `Started BackendApplication on port 8080`

---

### 5. Install & Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

✅ You should see: `Local: http://localhost:5173`

---

### 6. Open in Browser

Go to **http://localhost:5173**

| Account | Email | Password | Role |
|---|---|---|---|
| Admin | admin@municipality.com | admin123 | ADMIN |
| Worker | worker1@municipality.com | admin123 | WORKER |
| Citizen | Register yourself | your choice | CITIZEN |

---

## 🗄️ API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login, returns JWT token |

### Complaints (Requires JWT)
| Method | Endpoint | Who | Description |
|---|---|---|---|
| POST | `/api/complaints` | Citizen | Submit complaint with photos |
| GET | `/api/complaints/my` | Citizen | Get own complaints |
| GET | `/api/complaints` | Admin | Get all complaints |
| POST | `/api/complaints/{id}/assign?workerId=2` | Admin | Assign to worker |
| PATCH | `/api/complaints/{id}/status?status=RESOLVED` | Worker | Update status |
| GET | `/api/complaints/{id}/history` | Any | Status timeline |
| GET | `/api/complaints/worker-tasks` | Worker | Get assigned tasks |

### Public (No Auth Required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/public/stats` | Total/pending/resolved counts |
| GET | `/api/public/departments` | List of departments |
| GET | `/api/public/workers` | List of workers |

### Notifications (Requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notifications` | All notifications for current user |
| GET | `/api/notifications/unread-count` | Badge count |
| POST | `/api/notifications/mark-read` | Mark all as read |

### Ratings (Requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ratings/{complaintId}?stars=4&feedback=text` | Submit rating |
| GET | `/api/ratings/{complaintId}` | Get rating for complaint |

---

## 👥 User Roles

```
CITIZEN  →  Register/Login  →  Submit complaint with photo + map pin
                             →  Track status updates
                             →  Get notified when status changes
                             →  Rate resolved complaints
                             →  Search and filter own complaints

ADMIN    →  Login           →  View all complaints + stats dashboard
                             →  Assign complaints to workers
                             →  Get notified on new submissions
                             →  Export complaints to CSV

WORKER   →  Login           →  View assigned tasks with SLA deadline
                             →  Mark complaint as In Progress
                             →  Mark complaint as Resolved
                             →  Get notified when assigned

PUBLIC   →  No login        →  View live city statistics
```

---

## ⚙️ How JWT Authentication Works

```
1. User logs in  →  POST /api/auth/login
2. Server creates JWT token containing { email, role }
3. Token returned to browser, stored in localStorage
4. Every API request: axios interceptor adds  Authorization: Bearer <token>
5. JwtFilter.java reads token, validates signature, extracts email + role
6. Spring Security marks user as authenticated
7. Controller calls auth.getName() to get the logged-in user's email
8. Token expires after 24 hours  →  user must log in again
```

---

## 🐛 Known Issues & Fixes

| Issue | Cause | Fix |
|---|---|---|
| 403 on complaint submit | OPTIONS preflight blocked by Spring Security | Added `HttpMethod.OPTIONS, "/**"` to permitAll and `"OPTIONS"` to allowed methods |
| Photos not saving | `if (photo)` check used wrong variable name | Removed guard, use `photos.forEach(p => formData.append('photos', p))` |
| Map crash `c is not defined` | `MapView` used complaint variable `c` inside form | Changed to `form.latitude` / `form.longitude` inside the form |
| Rating modal duplicated | `RatingModal` rendered inside `.map()` loop | Moved modal outside loop, single instance controlled by state |
| Workers missing from dropdown | No WORKER users in database | Run the INSERT SQL in setup, or register a user via API with role=WORKER |

---

## 📦 Dependencies Summary

### Backend `pom.xml`
```xml
spring-boot-starter-web
spring-boot-starter-data-jpa
spring-boot-starter-security
spring-boot-starter-validation
mysql-connector-j
lombok
jjwt-api (0.11.5)
jjwt-impl (0.11.5)
jjwt-jackson (0.11.5)
```

### Frontend `package.json`
```
react, react-dom
vite
axios
react-router-dom
react-hot-toast
leaflet
react-leaflet
lucide-react
```

---

## 🌱 Future Improvements

- [ ] Email notifications via Spring Mail (SMTP)
- [ ] WhatsApp alerts via Twilio API
- [ ] Analytics charts for admin (complaints per month)
- [ ] Worker performance reports (average resolution time)
- [ ] Photo storage on AWS S3 or Cloudinary
- [ ] PWA support — citizens can install on phone
- [ ] Multilingual support (Marathi / Hindi)
- [ ] OTP-based login for citizens
- [ ] Docker + docker-compose for easy deployment

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

*Built with ❤️ for learning full-stack development — Java Spring Boot + React*
