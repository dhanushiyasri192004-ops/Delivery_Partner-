# System Workflows

This document diagrams and defines operating workflows for Delivery Partners, Service Technicians, and Business Executives.

---

## 1. Delivery Partner Workflow

```
[Customer Order placed] 
      │
      ▼
[Vendor prepares package] 
      │
      ▼
[System assigns Delivery Partner] (Status: pending)
      │
      ▼
[Partner clicks Accept Order] (Status: accepted, partner status: busy)
      │
      ▼
[Partner travels to Vendor outlet]
      │
      ▼
[Partner reaches Vendor] (Status: reached_vendor)
      │
      ▼
[Pickup OTP Verification] ──► Input code + Upload pickup photo
      │
      ▼
[Package Picked Up] (Status: picked_up, live telemetry starts)
      │
      ▼
[Partner travels to Customer dropoff]
      │
      ▼
[Partner reaches Customer] (Status: reached_customer)
      │
      ▼
[Delivery OTP Verification] ──► Input code + Upload dropoff photo
      │
      ▼
[Delivery Completed] (Status: delivered, partner status: online)
      │
      ▼
[Earnings Deposited to Wallet] ──► Live socket alert + Ledger updated
```

---

## 2. Service Technician Workflow

```
[Customer books a Home Service]
      │
      ▼
[Vendor dispatches Technician] (Status: pending)
      │
      ▼
[Technician Accepts Booking] (Status: accepted, technician status: busy)
      │
      ▼
[Technician starts transit to Customer site] (Status: transit)
      │
      ▼
[Technician reaches site] (Status: arrived)
      │
      ▼
[Before-Service Photo] ──► Upload photo proof (Status: service_started)
      │
      ▼
[Technician performs requested service tasks]
      │
      ▼
[After-Service Photo] ──► Upload completion proof
      │
      ▼
[OTP & Signature verification] ──► Input customer OTP + Draw signature on canvas
      │
      ▼
[Job Closed] (Status: service_completed, technician status: online)
      │
      ▼
[Service fees released to Wallet]
```

---

## 3. Executive Workflow

```
[Vendor requests Executive assignment]
      │
      ▼
[System assigns Trip to Executive] (Status: pending)
      │
      ▼
[Executive Accepts Trip] (Status: accepted, status: busy)
      │
      ▼
[Executive travels to target locations] (Status: transit)
      │
      ▼
[Executive closes trip tasks]
      │
      ▼
[Close Trip Verification] ──► Upload completion photo proof
      │
      ▼
[Trip Closed & Logged] (Status: completed, status: online)
```
