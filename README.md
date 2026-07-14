#  VacantX — AI-Powered Smart Parking Management System

> **Smart Parking. Smarter Decisions.**

VacantX is a modern web-based Smart Parking Management System designed to optimize parking operations in university campuses and institutional environments. It provides real-time parking slot visualization, intelligent parking recommendations, occupancy prediction, and an administrative dashboard to improve parking efficiency and reduce congestion.

Built as a full-stack application using **React**, **Python Flask**, **MongoDB**, and **Machine Learning**, VacantX demonstrates how intelligent software can simplify parking management through real-time data and predictive analytics.

---

##  Project Overview

Finding an available parking space in a busy campus often results in unnecessary traffic, fuel consumption, and wasted time. VacantX addresses this challenge by providing users with a centralized web platform where they can:

- View live parking availability
- Locate the nearest available parking slot
- Monitor parking occupancy
- Predict busy hours using historical data
- Assist administrators in managing parking operations

The project is designed as a scalable prototype that can later be extended to smart cities, shopping malls, airports, hospitals, and corporate campuses.

---

##  Objectives

- Provide real-time parking slot monitoring.
- Recommend the nearest available parking slot.
- Predict parking occupancy using historical trends.
- Improve parking resource utilization.
- Reduce congestion and parking search time.
- Deliver a responsive and intuitive user experience.

---

#  Key Features

##  Real-Time Parking Map

- Interactive campus parking map
- Live parking slot status
- Color-coded slot indicators
- Zone-wise parking organization

<img width="1600" height="770" alt="image" src="https://github.com/user-attachments/assets/eed64395-f0ff-4845-b4bc-6e4902ecffd9" />

---

##  Smart Parking Recommendation

The system automatically recommends the nearest available parking slot based on the selected campus entry gate.

Benefits:

- Faster parking
- Reduced vehicle movement
- Better traffic flow

---

##  Occupancy Prediction

Using historical parking data, VacantX predicts:

- Peak parking hours
- Occupancy trends
- Expected parking availability

This helps users plan their arrival and assists administrators in managing campus traffic.

<img width="1600" height="843" alt="image" src="https://github.com/user-attachments/assets/7f928c7a-6b92-44e4-a2de-42d0a1a2c455" />


---

##  Dashboard Analytics

Visual analytics include:

- Total Parking Slots
- Available Slots
- Occupied Slots
- Occupancy Percentage
- Prediction Charts
- Zone Utilization

<img width="1600" height="758" alt="image" src="https://github.com/user-attachments/assets/345c97f4-62f9-48f2-a75d-a14487426ebe" />

---

##  Authentication

Role-based authentication allows different levels of access:

- Student
- Faculty
- Staff
- Administrator

---

##  Admin Dashboard

Administrators can:

- Monitor parking status
- Update slot occupancy
- View parking statistics
- Simulate parking conditions
- Manage system activity

<img width="1600" height="822" alt="image" src="https://github.com/user-attachments/assets/61279dbe-07f8-4a59-9702-0d426a02092d" />

---

#  System Architecture

```
                    User
                      │
                      ▼
             React Frontend
                      │
             REST API Requests
                      │
                      ▼
               Flask Backend
          ┌───────────┴───────────┐
          ▼                       ▼
     MongoDB Database      AI Prediction Model
          │                       │
          └───────────┬───────────┘
                      ▼
               JSON Responses
                      │
                      ▼
              Frontend Updates
```

---

#  Workflow

### Step 1

The user opens the VacantX web application.

↓

### Step 2

The frontend requests parking data from the Flask backend.

↓

### Step 3

The backend retrieves parking information from MongoDB.

↓

### Step 4

Parking slot information is returned as JSON.

↓

### Step 5

The frontend renders the parking map with live availability.

↓

### Step 6

The user selects an entry gate.

↓

### Step 7

The backend calculates the nearest available parking slot.

↓

### Step 8

The recommendation is displayed on the parking map.

↓

### Step 9

The AI prediction module forecasts future parking occupancy.

↓

### Step 10

Prediction graphs and occupancy statistics are displayed to the user.

---

#  Tech Stack

## Frontend

- React
- Vite
- JavaScript
- CSS
- Axios
- Recharts

## Backend

- Python
- Flask
- Flask-CORS
- REST APIs

## Database

- MongoDB
- PyMongo

## Machine Learning

- Python
- Pandas
- NumPy
- Scikit-learn

---

#  Project Structure

```
VacantX
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   ├── hooks
│   ├── services
│   └── assets
│
├── backend
│   ├── app.py
│   ├── routes
│   ├── models
│   ├── services
│   ├── database
│   ├── utils
│   └── config
│
├── ml-model
│   ├── dataset
│   ├── training
│   ├── prediction
│   └── models
│
└── README.md
```

---

#  REST APIs

| Method | Endpoint | Description |
|----------|----------------------|-----------------------------|
| GET | `/api/slots` | Retrieve parking slot data |
| POST | `/api/login` | User authentication |
| POST | `/api/register` | User registration |
| GET | `/api/dashboard` | Dashboard statistics |
| GET | `/api/recommend` | Nearest parking recommendation |
| GET | `/api/predictions` | Occupancy prediction |
| PUT | `/api/slots/:id` | Update parking slot |

---

#  Database

MongoDB stores:

- Parking Slot Information
- User Details
- Parking History
- Occupancy Logs
- Prediction Data

Example document:

```json
{
  "slotId": "A12",
  "zone": "A",
  "status": "Available",
  "accessible": false
}
```

---

#  Machine Learning Module

The AI module analyzes historical parking data to predict:

- Peak occupancy hours
- Parking demand
- Zone utilization

Possible models include:

- Random Forest
- Decision Tree
- Linear Regression

---

#  Installation

Clone the repository

```bash
git clone https://github.com/yourusername/VacantX.git
```

Navigate into the project

```bash
cd VacantX
```

Install frontend dependencies

```bash
cd frontend
npm install
npm run dev
```

Install backend dependencies

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Ensure MongoDB is running locally before starting the backend.

---

#  Design Philosophy

VacantX is inspired by modern university infrastructure and campus wayfinding systems rather than generic SaaS dashboards.

The interface emphasizes:

- Simplicity
- Accessibility
- Readability
- Real-time information
- Professional institutional design

---

#  Future Enhancements

- Camera-based parking detection
- IoT parking sensors
- Mobile application
- QR-based entry system
- Google Maps integration
- EV charging slot management
- Multi-floor parking support
- Smart city deployment
- Navigation with shortest-path algorithms
- Push notifications for parking availability

---

#  Team

### Frontend Developer - https://github.com/Ananyapanwar01

Responsible for:

- React application
- User Interface
- Dashboard
- Parking Map
- Charts
- Authentication UI

---

### Backend Developer - https://github.com/Aditya1727neutron

Responsible for:

- Flask APIs
- MongoDB
- Authentication
- Business Logic
- Recommendation System
- API Integration

---

### AI/ML Developer - https://github.com/shivamkumargupta0

Responsible for:

- Dataset preparation
- Model training
- Occupancy prediction
- Prediction API

---

# 📌 Use Cases

VacantX can be adapted for:

- Universities
- Shopping Malls
- Hospitals
- Airports
- Corporate Offices
- Smart Cities
- Public Parking Facilities

---

# 📜 License

This project is developed for educational and academic purposes as part of a Bachelor of Technology (B.Tech) project.

---

# ⭐ Acknowledgements

Special thanks to our faculty mentor and project team members for their guidance and collaboration throughout the development of VacantX.

---

## 💡 Vision

> **VacantX aims to transform traditional parking management into an intelligent, data-driven experience by combining real-time monitoring, predictive analytics, and modern web technologies to create a smarter, more efficient campus parking ecosystem.**
