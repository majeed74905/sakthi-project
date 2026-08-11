# AWS Cost Estimation & Resource Planning

## 1. Estimated Monthly Infrastructure Cost Breakdown

| Component | AWS Resource | Monthly Sizing / Data | Estimated Cost (USD) |
| :--- | :--- | :--- | :---: |
| **Compute** | EC2 `t3.medium` (Ubuntu 22.04 LTS) | 2 vCPU, 4GB RAM (730 hrs) | ~$30.37 |
| **Storage** | EBS GP3 SSD Volume | 30 GB SSD | ~$2.40 |
| **DNS** | Route 53 Hosted Zone | 1 Hosted Zone | ~$0.50 |
| **Backups** | S3 Standard / Glacier | 10 GB Backup Storage | ~$0.25 |
| **Data Transfer** | Egress Bandwidth | ~50 GB / Month | ~$4.50 |
| **Total Estimated Cost** | | | **~$38.00 / Month** |

---

## 2. Cost Optimization Recommendations
- **Reserved Instances / Savings Plans**: Purchasing a 1-Year Savings Plan for `t3.medium` reduces EC2 compute costs by up to `38%`.
- **S3 Lifecycle Policies**: Transitioning backups to S3 Glacier Flexible Retrieval after 30 days reduces backup storage costs to `$0.0036 / GB`.
