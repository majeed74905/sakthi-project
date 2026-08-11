# AWS Security Group Specification

## 1. Security Group Configuration (`sg-sakthi-production`)

The AWS Security Group operates as a virtual firewall controlling inbound and outbound network traffic to the EC2 instance.

---

## 2. Inbound Security Group Rules

| Port | Protocol | Source CIDR | Purpose | Exposed Publicly? |
| :--- | :--- | :--- | :--- | :---: |
| **22** | TCP | `ADMIN_OFFICE_IP/32` | Restricted SSH Administration | ❌ NO (Restricted to Admin IP) |
| **80** | TCP | `0.0.0.0/0` | Public HTTP (Redirected to HTTPS) | ✅ YES |
| **443** | TCP | `0.0.0.0/0` | Secure Public HTTPS | ✅ YES |

---

## 3. Strict Port Isolation Rules (NEVER Exposed Inbound)
- **Port 3306 (MySQL)**: **BLOCKED**. MySQL accepts local connections only (`127.0.0.1`).
- **Port 5000 (Express Node.js)**: **BLOCKED**. Backend API is accessible only via Nginx local reverse proxy (`http://127.0.0.1:5000`).

---

## 4. Outbound Security Group Rules
- **Protocol**: `ALL Traffic`
- **Destination**: `0.0.0.0/0` (Allows OS updates, package installation, S3 backup sync, and Let's Encrypt renewal).
