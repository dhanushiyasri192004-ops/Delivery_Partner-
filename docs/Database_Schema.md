# Database Schema Documentation

This document describes all collections in the MongoDB database for the Delivery Partner, Technician, and Executive Management System.

---

## 1. `users`
**Purpose**: Stores authentication credentials, identity, and role types for all users.

### Schema Fields
- `_id` (ObjectId): Unique identifier
- `name` (String): Full name of the user
- `email` (String, Unique): E-mail address used for login
- `password` (String): BCRYPT-hashed password
- `mobileNumber` (String): User's primary mobile phone number
- `role` (String): Target portal access role (`admin`, `vendor`, `customer`, `delivery_partner`, `technician`, `executive`)
- `isVerified` (Boolean): Activation audit flag
- `createdAt` (Date): Account creation timestamp

---

## 2. `deliveryPartners`
**Purpose**: Profile details, licensing details, bank information, and live geolocations for delivery partners.

### Schema Fields
- `_id` (ObjectId)
- `userId` (ObjectId, Ref: `users`)
- `aadhaarNumber` (String)
- `panNumber` (String)
- `vehicle` (Subdocument):
  - `name` (String)
  - `number` (String)
  - `licenseNumber` (String)
  - `rcBookUrl` (String)
- `bankDetails` (Subdocument):
  - `bankName` (String)
  - `accountHolderName` (String)
  - `ifscCode` (String)
  - `accountNumber` (String)
  - `branch` (String)
- `isApproved` (Boolean)
- `status` (String): Current availability state (`online`, `offline`, `busy`)
- `currentLocation` (GeoJSON Point): Coordinates `[longitude, latitude]` for geographical distance calculations.

---

## 3. `technicians`
**Purpose**: Stores field service categories, certifications, bank routing, and live coordinates for home technicians.

### Schema Fields
- `_id` (ObjectId)
- `userId` (ObjectId, Ref: `users`)
- `aadhaarNumber` (String)
- `panNumber` (String)
- `technicianType` (String): Specialty skill category (e.g. `AC Technician`, `Plumber`)
- `bankDetails` (Subdocument): Bank routing info
- `isApproved` (Boolean)
- `status` (String): Availability status
- `currentLocation` (GeoJSON Point)

---

## 4. `orders`
**Purpose**: Logs package dispatches, pickup/delivery verification checks, time-stamping, and per-trip earnings.

### Schema Fields
- `customerId` (ObjectId)
- `vendorId` (ObjectId)
- `deliveryPartnerId` (ObjectId, Ref: `deliveryPartners`)
- `status` (String): Flow stages (`pending`, `accepted`, `reached_vendor`, `picked_up`, `reached_customer`, `delivered`, `cancelled`)
- `pickupOtp` (String): 4-digit code generated for pickup
- `deliveryOtp` (String): 4-digit code generated for delivery
- `pickupPhoto` (String): URL proof uploaded during pickup
- `deliveryPhoto` (String): URL proof uploaded during delivery
- `pickupTime` (Date)
- `deliveryTime` (Date)
- `pickupCoordinates` (Subdocument): Latitude/Longitude map coords
- `deliveryCoordinates` (Subdocument)
- `earnings` (Subdocument):
  - `tripPay` (Number)
  - `tips` (Number)
  - `incentives` (Number)

---

## 5. `wallets`
**Purpose**: Ledger statement logging balance points, earnings, and withdrawal request balances.

### Schema Fields
- `userId` (ObjectId, Ref: `users`)
- `balance` (Number): Current cash balance
- `transactions` (Array):
  - `amount` (Number)
  - `type` (String): `credit` or `debit`
  - `description` (String)
  - `timestamp` (Date)
