# AWS EC2 Sizing & System Requirements

## 1. Operating System & Architecture
- **Recommended Operating System**: **Ubuntu 22.04 LTS (Jammy Jellyfish)**
- **System Architecture**: `x86_64` (AMD64)
- **Root Storage**: 30 GB GP3 EBS SSD volume (`3000 IOPS`, `125 MB/s throughput`)

---

## 2. Instance Sizing Recommendations

| Environment | Recommended Instance Type | vCPU | RAM | EBS Storage | Usage Scenario |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Staging** | `t3.small` | 2 | 2.0 GB | 20 GB GP3 | Internal pre-production testing |
| **Initial Production** | `t3.medium` | 2 | 4.0 GB | 30 GB GP3 | Baseline commercial launch |
| **Scale-Up Production** | `t3.large` / `c6i.large` | 2 | 8.0 GB | 50 GB GP3 | Increased concurrent member traffic |

---

## 3. Vertical & Horizontal Scaling Triggers
- **RAM Threshold**: If sustained memory usage exceeds `80%`, upgrade from `t3.small` to `t3.medium`.
- **CPU Threshold**: If sustained CPU utilization exceeds `75%` over 15 minutes, scale instance size vertically.
- **Database Scaling Trigger**: If database disk I/O exceeds `1500 IOPS` or table locks occur, migrate MySQL database from EC2 to **Amazon RDS for MySQL (db.t4g.medium)**.
