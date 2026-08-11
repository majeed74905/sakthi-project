# AWS Domain & DNS Configuration Manual

## 1. Domain Names
- **Production Apex**: `mysakthimarketing.in`
- **Production Subdomain**: `www.mysakthimarketing.in`
- **Staging Subdomain**: `staging.mysakthimarketing.in`

---

## 2. DNS Record Mapping

| Record Type | Hostname / Name | Value / Destination | Purpose |
| :--- | :--- | :--- | :--- |
| **A Record** | `@` (apex) | `EC2_ELASTIC_IP` (e.g. `13.233.x.x`) | Direct apex domain traffic to EC2 |
| **A Record** | `www` | `EC2_ELASTIC_IP` (e.g. `13.233.x.x`) | Direct www subdomain to EC2 |
| **A Record** | `staging` | `STAGING_EC2_IP` | Direct staging traffic to Staging server |

---

## 3. Route 53 vs External DNS Registrar (GoDaddy, Namecheap)
- **Option A (Route 53 Hosted Zone)**: Create Hosted Zone in AWS Route 53, update NS records at registrar.
- **Option B (External Registrar)**: Keep existing registrar DNS control panel, add A record pointing `@` and `www` directly to the EC2 Elastic IP address.
