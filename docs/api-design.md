# REST API Specification: My Sakthi Marketing Platform

## Standard API Response Envelope

All API endpoints return standard JSON envelopes.

### Success Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "User-friendly error description",
  "errorCode": "ERROR_CODE_NAME"
}
```

### Validation Error Response Format
```json
{
  "success": false,
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "mobile",
      "message": "Mobile number must be exactly 10 numerical digits"
    }
  ]
}
```

---

## Auth Endpoints Specification (`/api/v1/auth`)

### 1. Sponsor Verification
- **URL**: `GET /api/v1/auth/verify-sponsor/:userCode`
- **Auth**: None
- **Response**:
```json
{
  "success": true,
  "message": "Sponsor verification completed",
  "data": {
    "valid": true,
    "userCode": "MSM10001",
    "sponsorName": "Demo Super Admin"
  }
}
```

### 2. Member Registration
- **URL**: `POST /api/v1/auth/register`
- **Auth**: None (Rate limited)
- **Request Body**:
```json
{
  "sponsorId": "MSM10001",
  "fullName": "New Member Name",
  "email": "newmember@example.com",
  "mobile": "9876543210",
  "loginPassword": "Password123!",
  "transactionPassword": "TxnPassword123!",
  "bankDetails": {
    "accountName": "New Member Name",
    "accountNumber": "999900001007",
    "ifsc": "HDFC0001234",
    "bankName": "HDFC Bank",
    "branchName": "Chennai Branch"
  }
}
```
- **Response**: `201 Created` returning user identity and JWT tokens.

### 3. Login
- **URL**: `POST /api/v1/auth/login`
- **Auth**: None (Rate limited)
- **Request Body**:
```json
{
  "identifier": "MSM10002",
  "password": "DemoPassword123!"
}
```

---

## Member Endpoints Specification (`/api/v1/member`)

### 1. Member Dashboard
- **URL**: `GET /api/v1/member/dashboard`
- **Auth**: Bearer JWT (`MEMBER`, `ADMIN`, `SUPER_ADMIN`)
- **Response**:
```json
{
  "success": true,
  "data": {
    "userCode": "MSM10002",
    "fullName": "Demo Member 01",
    "referralLink": "http://localhost:5173/register?sponsor=MSM10002",
    "walletBalance": 1000.00,
    "totalEarnings": 1000.00,
    "totalPaidPayouts": 0.00,
    "pendingPayouts": 100.00,
    "directReferralsCount": 2,
    "totalTeamSize": 2
  }
}
```

### 2. Member Bank Details (Masked)
- **URL**: `GET /api/v1/member/bank-details`
- **Response**:
```json
{
  "success": true,
  "data": {
    "accountName": "Demo Member 01",
    "accountNumberMasked": "XXXXXX1002",
    "ifscCode": "HDFC0005678",
    "bankName": "HDFC Bank",
    "branchName": "Coimbatore Main",
    "isVerified": false
  }
}
```

### 3. Submit Payout Request
- **URL**: `POST /api/v1/member/payout-request`
- **Request Body**:
```json
{
  "amount": 500,
  "transactionPassword": "DemoTxn123!"
}
```

---

## Admin Endpoints Specification (`/api/v1/admin`)

### 1. Process Payout Approval (Strict State Machine)
- **URL**: `PUT /api/v1/admin/payouts/:id`
- **Auth**: Bearer JWT (`ADMIN`, `SUPER_ADMIN`)
- **Request Body**:
```json
{
  "status": "APPROVED",
  "transactionRef": "IMPS_PAYOUT_REF_998877",
  "adminNotes": "Approved following bank details verification"
}
```
