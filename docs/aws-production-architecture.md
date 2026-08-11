# AWS Production Architecture: My Sakthi Marketing

## 1. Initial Production Architecture (EC2 Monolith)

For initial commercial deployment, the application is deployed on a single **AWS EC2 instance** running Ubuntu 22.04 LTS. This provides a cost-effective, straightforward, and performant baseline.

```text
                                INTERNET
                                   │
                                   ▼
                         Route 53 / External DNS
                        (mysakthimarketing.in)
                                   │
                                   ▼
                           HTTPS / TLS 1.3
                                   │
                                   ▼
              ┌────────────────────────────────────────┐
              │              AWS EC2                   │
              │         Ubuntu 22.04 LTS               │
              │                                        │
              │   ┌────────────────────────────────┐   │
              │   │      Nginx Reverse Proxy       │   │
              │   │          Port 80/443           │   │
              │   └───────────────┬────────────────┘   │
              │                   │                    │
              │         ┌─────────┴─────────┐          │
              │         ▼                   ▼          │
              │   Frontend Dist       Node.js API      │
              │   (Static SPA)        (PM2 :5000)      │
              │                             │          │
              │                             ▼          │
              │                       MySQL 8.0 DB     │
              │                       (Port 3306)      │
              └────────────────────────────────────────┘
```

---

## 2. Future High-Availability Architecture (Decoupled Amazon RDS)

As traffic grows, the database tier can be seamlessly migrated to **Amazon RDS for MySQL** without changing the backend application code or REST API contracts.

```text
                                INTERNET
                                   │
                                   ▼
                         Route 53 / External DNS
                                   │
                                   ▼
                         AWS Application LB (ALB)
                                   │
                                   ▼
                       ┌───────────────────────┐
                       │    AWS EC2 Cluster    │
                       │ Node.js API + Nginx   │
                       └───────────┬───────────┘
                                   │
                                   ▼ (Private VPC Subnet)
                       ┌───────────────────────┐
                       │  Amazon RDS (MySQL)   │
                       │ Multi-AZ Read Replica │
                       └───────────────────────┘
```

---

## 3. Component Responsibilities
- **Route 53 / DNS**: Directs apex domain (`mysakthimarketing.in`) and subdomains (`www`, `staging`) to the EC2 Elastic IP address.
- **Certbot / SSL**: Terminates TLS/SSL connection securely at Nginx.
- **Nginx Web Server**: Serves compiled React static assets (`dist`) directly and reverse proxies `/api/v1/*` requests to the PM2 Express application on port 5000.
- **Node.js Express / PM2**: Executes backend application logic with automatic process restarts and cluster management.
- **MySQL 8.0 / Prisma**: Houses relational data with transactions, foreign keys, and indexes.
