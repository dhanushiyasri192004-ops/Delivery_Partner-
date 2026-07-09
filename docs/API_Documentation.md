# API Documentation

This document describes all REST API endpoints for the Delivery Partner, Technician, and Executive Management System.

---

## Base URL
`http://localhost:5000/api`

---

## 1. Authentication (`/auth`)

### Register User
* **Method**: `POST`
* **Endpoint**: `/auth/register`
* **Payload Type**: `multipart/form-data`
* **Payload**:
  - `name` (String, required)
  - `email` (String, required)
  - `password` (String, required)
  - `mobileNumber` (String, required)
  - `role` (String: `delivery_partner`, `technician`, `executive`)
  - `aadhaarNumber` (String, conditionally required)
  - `panNumber` (String, conditionally required)
  - `vehicleName` (String, conditionally required)
  - `vehicleNumber` (String, conditionally required)
  - `licenseNumber` (String, conditionally required)
  - `rcBook` (File, optional)
  - `technicianType` (String, conditionally required)
  - `bankName` (String, required)
  - `accountHolderName` (String, required)
  - `ifscCode` (String, required)
  - `accountNumber` (String, required)
  - `branch` (String, required)
* **Response**: `201 Created`
  ```json
  {
    "success": true,
    "token": "eyJhbG...",
    "user": {
      "id": "603d2b...",
      "name": "Ramesh Kumar",
      "email": "ramesh@example.com",
      "role": "delivery_partner"
    }
  }
  ```

---

## 2. Delivery Partner (`/delivery`)
All endpoints require a valid header: `Authorization: Bearer <JWT_TOKEN>`.

### Get Dashboard
* **Method**: `GET`
* **Endpoint**: `/delivery/dashboard`
* **Response**: `200 OK`
  ```json
  {
    "success": true,
    "partnerStatus": "online",
    "metrics": {
      "todayEarnings": 1680,
      "todayOrdersCount": 8,
      "completedCount": 8,
      "cancellationCount": 0
    },
    "activeOrder": null,
    "assignedOrder": null
  }
  ```

### Verify Pickup
* **Method**: `POST`
* **Endpoint**: `/delivery/orders/:orderId/verify-pickup`
* **Payload Type**: `multipart/form-data`
* **Payload**:
  - `otp` (String, required, 4-digits)
  - `photo` (File, required)
  - `latitude` (Number)
  - `longitude` (Number)
* **Response**: `200 OK`

---

## 3. Technician Module (`/technician`)

### Complete Job
* **Method**: `POST`
* **Endpoint**: `/technician/services/:bookingId/complete`
* **Payload Type**: `multipart/form-data`
* **Payload**:
  - `otp` (String, required)
  - `signature` (File, required, canvas image blob)
* **Response**: `200 OK`
