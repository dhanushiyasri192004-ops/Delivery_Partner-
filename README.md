# Delivery Partner & Field Service Management System

A state-of-the-art dispatch, field service, and corporate travel management system built on the MERN stack (MongoDB, Express, React, Node.js) and integrated with Socket.io for real-time tracking, vehicle routing, and digital wallets.

---

## 🚀 Key Modules & Workflows

### 🛵 Delivery Partner
- **Onboarding**: Multi-step registration (personal, vehicle specs, bank routing, and document attachment).
- **Workflow**: Order accept, transit updates (reached vendor, picked up, reached customer, delivered), OTP checkouts, and package photos.
- **Earnings**: Wallet payouts dynamically calculated and credited.

### 🔧 Field Technician
- **Specialties**: Dropdown classifications (AC, plumber, carpenter, appliance repairs).
- **Service Verification**: Dual-photo status logs (before and after photo proofs), customer OTP verification, and touchscreen canvas signature drawing.

### 👔 Executive Trip
- **Business Trips**: Coordinate routing logs and completion photos.

---

## 🛠️ Architecture & Folder Structure

```
├── Frontend/               # Vite React SPA Client
│   ├── src/
│   │   ├── layouts/        # Auth and Sidebar Dashboard Layouts
│   │   ├── pages/          # Auth, Delivery, Technician, and Executive Views
│   │   ├── redux/          # Slices and Store Configurations
│   │   └── services/       # Central API Clients
├── Backend/                # Express REST API Server
│   ├── src/
│   │   ├── config/         # DB, Cloudinary, Sockets, and Mail Configs
│   │   ├── middleware/     # JWT Auth, Roles, and Multer Parsers
│   │   └── modules/        # MVC Routers, Schemas, and Controllers
├── docs/                   # Specifications and API docs
```

---

## ⚡ Quick Start Guide

### 1. Install Dependencies
From the root workspace folder, run:
```bash
npm run install:all
```

### 2. Configure Environment `.env`
Fill in database and storage API keys in the root `.env` template.

### 3. Run Development Servers
Start both the Frontend and Backend servers concurrently:
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000`
- **Frontend SPA**: `http://localhost:5173`
