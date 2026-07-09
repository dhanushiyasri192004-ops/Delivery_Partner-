# Project Report: Delivery Partner Management System

## 1. Executive Summary
The Delivery Partner Management System is a state-of-the-art dispatch and field operations management portal built on the MERN stack (MongoDB, Express, React, Node.js). The system orchestrates registration, document compliance, visual verification checkouts, digital ledger wallets, and live GPS tracking for three distinct operating roles:
1. **Delivery Partners** (🛵): Food/product distribution agents.
2. **Field Technicians** (🔧): Residential hardware/utility repair specialists.
3. **Company Executives** (👔): Corporate trip coordinators.

---

## 2. Technology Stack & Architecture
The system utilizes a decoupled MVC (Model-View-Controller) backend architecture and a responsive React Single Page Application (SPA) frontend.

### Frontend
- **React.js**: Modular component architecture.
- **Redux Toolkit**: Centralized state store managing dispatch telemetry and wallet transactions.
- **React Router DOM**: Layout routing mapping authentication and console panels.
- **Tailwind CSS**: Modern CSS design system tailored to dashboard mockups.
- **Socket.io Client**: Real-time websocket channels for telemetry synchronization.

### Backend
- **Node.js & Express.js**: High-performance asynchronous REST API routing.
- **MongoDB Atlas & Mongoose**: Object Document Mapper (ODM) using GeoJSON Point queries.
- **Socket.io**: WebSockets server pushing live dispatch status notifications.
- **Cloudinary & Multer**: Binary document file capture and cloud image hosting.

---

## 3. Core System Workflows

### 3.1 Delivery Partner Dispatch
The distribution loop ensures strict package handovers:
1. **Pickup OTP Verification**: The partner enters a 4-digit code provided by the vendor outlet and uploads photo proof of the package.
2. **Live Routing**: Telemetry updates broadcast live rider pins.
3. **Delivery OTP Verification**: The partner enters a customer code and uploads a package photo to release payout.

### 3.2 Technician Service Flow
1. **Transit & Arrival**: Tracking updates transition from transit to arrived.
2. **Double-photo Proof**: Technician uploads before-service and after-service verification photos.
3. **Closeout Signature**: Customer draws a signature on the touchscreen canvas and enters an OTP code to close the ticket.

### 3.3 Executive Trip Tracking
1. **Assigned Run**: Executive coordinates transit between regional company offices.
2. **Completion Proof**: Executive uploads verification photo proof of trip closure.

---

## 4. Security & Compliance
- **JWT Authentication**: Secured route requests using signed JSON Web Tokens.
- **Password Protection**: Hashed credentials using BCRYPT.
- **File Validation**: Restricted uploads to valid images/PDFs with size limits using Multer filters.
- **Environment Isolation**: Configured API ports and service credentials via a `.env` template.
