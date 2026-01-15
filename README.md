# Task Management App

This project is a **Task Management web application** developed as a **Single Page Application (SPA)**.  
It allows users to efficiently organize their tasks using lists and categories, with full control over task statuses and priorities.

---

## Features

The application provides the following core functionalities:

- **User Management**
  - User registration and login
  - Secure token-based authentication

- **Organization**
  - Creation and management of personalized task lists
  - Task categorization for better organization

- **Task Management**
  - Full CRUD operations (Create, Read, Update, Delete) for tasks
  - Task attributes include status, priority, deadline, and estimated time

- **Automation**
  - SQL trigger that automatically logs every task status change into a separate audit log table

- **Search & Filtering**
  - Dynamic task search
  - Filtering by status, priority, and category

- **Dashboard**
  - Overview of tasks
  - Display of tasks with upcoming deadlines and basic statistics

---

## Technologies Used

- **Backend:** Laravel 11 (PHP)
- **Frontend:** React.js
- **Database:** MySQL
- **Authentication:** Laravel Sanctum
- **API Architecture:** RESTful API

---

## RESTful API Principles

The project follows REST principles through:

- Proper use of HTTP methods: `GET`, `POST`, `PUT`, `DELETE`
- Nested resource routes:
  - `/api/v1/task-lists/{id}/tasks`
  - `/api/v1/task-categories/{id}/tasks`
- Stateless architecture without server-side sessions

---

## Security Measures

The application includes protection against common vulnerabilities:

- **IDOR Protection**
  - Resource ownership is verified using `Auth::id()`

- **SQL Injection Prevention**
  - Use of Laravel Eloquent ORM and prepared statements

- **Mass Assignment Protection**
  - Explicit `$fillable` definitions in models

---

## Installation & Setup

### Backend (Laravel)

1. Clone the repository:
      ```bash
   git clone [https://github.com/TijanaLero/task-management-app](https://github.com/TijanaLero/task-management-app.git)
2. Configure the environment file:
- Copy .env.example to .env
- Set database credentials
3. Install PHP dependencies:
  composer install
4. Run database migrations:
  php artisan migrate
5. Start the backend server:
  php artisan serve

### Frontend (React)  

1. Navigate to the frontend directory:
cd frontend
2. Install dependencies:
npm install
3. Run the application:
npm start

---

##Notes
- The frontend communicates with the backend via a REST API.
- Authentication is handled using Bearer tokens.
- This project was developed for educational purposes as part of a university course.
