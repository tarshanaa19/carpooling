- 🚗 Carpooling Website – Full Stack (Backend + Frontend)

This is a full-stack **Carpooling Web Application** that allows users to register, login, offer rides, find rides, view their ride history, and give feedback. The project includes a secure **Spring Boot backend** and a ** HTML/CSS/JS frontend**.


##   🛠️ Technologies Used

### 🔙 Backend
- Java 17+
- Spring Boot
- Spring Security
- JWT (JSON Web Tokens)
- Maven
- RESTful APIs

 🔜 Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Fetch API

---

## 📁 Project Structure

### Backend (`/backend`)
src/
├── controller/
│   ├── AuthController.java
│   └── UserController.java
│
├── dto/
│   ├── LoginRequest.java
│   └── DigitalRequest.java
│
├── model/
│   └── User.java
│
├── repository/
│   └── UserRepository.java
│
├── security/
│   ├── JWTFilter.java
│   ├── JWTUtil.java
│   └── SecurityConfig.java
│
├── service/
│   ├── AuthService.java
│   ├── UserDetailsImpl.java
│   └── UserDetailsServiceImpl.java

-------------------------------------------
### Frontend ('/frontend')
frontend/
├── index.html
├── login.js
├── register.html
├── register.js
│
├── dashboard.html
├── dashboard.js
├── dashboard.css
│
├── auth.css
│
├── find-ride.html
├── find-ride.js
├── find-ride.css
│
├── offer-ride.html
├── offer-ride.js
├── offer-ride.css
│
├── ride.html
├── ride.js
│
├── my-ride.html
├── my-ride.js
├── my-ride.css
│
├── profile.html
├── profile.js
├── profile.css
│
├── feedback.html
├── feedback.js
├── feedback.css
│
├── message.html
├── message.js
├── message.css


-----------------------------


## 🔐 Backend – Authentication Flow

- JWT-based authentication
- Login with username/password → Receive token → Use token in Authorization header
- Secured endpoints available only with valid token


## 📦 Backend Package Overview

 Package           Description 

 `controller`   - Handles API endpoints (login, user operations) 
 `dto`          -Data Transfer Objects like `LoginRequest`, `DigitalRequest` 
 `model`        - User entity definition 
 `repository`   - JPA repository for user data 
 `security`     - JWT token filter, utility, and Spring Security configuration 
 `service`      - Business logic for auth and user management 

---

## 💻 Frontend Pages Overview
 
 File            Description 

 `index.html`  -  Entry page 
 `register.html` / `register.js` - User registration 
 `login.js`     - Handles login requests 
 `dashboard.html/.js/.css` - User dashboard UI 
 `findwrite.html/.js/.css` -Page to find available rides 
 `offerride.html/.js/.css` - Page to offer a ride 
 `ride.html/.js`   -Detailed ride info 
 `myride.html/.js/.css` - View and manage user’s own rides 
 `profile.html/.js/.css` - Profile information and edit 
 `feedback.html/.js/.css` - Submit and view feedback 
 `message.html/.js/.css` - Chat/message feature 
 `auth.css`     - Login/register styles 

---

##  Getting Started
### Run the Backend
cd backend
./mvnw spring-boot🇧🇳
--------------------
###Open the Frontend
open index.html
| Or just double-click index.html to launch it in the browser.

###API Endpoints
Method       Endpoint                  Description
POST      /api/auth/login            Login and receive JWT
POST      /api/auth/register         Register a new user
GET       /api/user/me               Get current user info
…         /api/rides/**              Ride offering/finding APIs
---------------
###Features
  •	✅ User Registration and Login
	•	✅ Secure JWT Authentication
	•	✅ Offer and Find Rides
	•	✅ View My Rides
	•	✅ Profile Management
	•	✅ Feedback System
	•	✅ Clean, responsive UI
