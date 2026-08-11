# AWS Production Deployment Execution Manual

This 24-step guide details the exact operational deployment process for system administrators launching **My Sakthi Marketing Platform** on AWS EC2.

---

## Master 24-Step Deployment Sequence

1. **Provision EC2**: Launch Ubuntu 22.04 LTS `t3.medium` instance in preferred AWS Region (e.g. `ap-south-1` Mumbai).
2. **Elastic IP**: Allocate and associate an Elastic IP (`EIP`) to the EC2 instance.
3. **Security Group**: Configure `sg-sakthi-production` allowing inbound port 80, 443, and restricted port 22 SSH.
4. **SSH Authentication**: Connect via SSH using keypair (`ssh -i key.pem ubuntu@EIP`).
5. **System Hardening**: Run OS updates, create user `deployadmin`, configure UFW firewall, and enable Fail2Ban.
6. **Install Node.js 20 LTS**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```
7. **Install MySQL 8.0**: Run `sudo apt install mysql-server -y` and `sudo mysql_secure_installation`.
8. **Create MySQL Users**: Create database `mysakthimarketing`, user `sakthi_app`, and backup user `sakthi_backup`.
9. **Configure Option File**: Create `/home/deployadmin/.my.cnf` (`chmod 600`) for `sakthi_backup`.
10. **Install PM2 & Nginx**: Install PM2 globally and Nginx web server.
11. **Clone Application Repository**: Clone codebase to `/var/www/mysakthimarketing`.
12. **Install Backend Dependencies**: Run `cd backend && npm install --production`.
13. **Configure Environment Secrets**: Copy `.env.production.example` to `backend/.env` with secure secrets.
14. **Deploy Prisma Migrations**: Run `cd backend && npx prisma migrate deploy`. (Do NOT run `db push` or `db seed`).
15. **Install & Build Frontend**: Run `cd frontend && npm install && npm run build`.
16. **Configure Nginx**: Create `/etc/nginx/sites-available/mysakthimarketing` reverse proxy block.
17. **Configure DNS**: Point DNS A records `@` and `www` to the Elastic IP address.
18. **Issue SSL Certificate**: Run `sudo certbot --nginx -d mysakthimarketing.in -d www.mysakthimarketing.in`.
19. **Start Backend via PM2**: Run `cd backend && pm2 start ecosystem.config.cjs --env production`.
20. **Configure PM2 Autostart**: Run `pm2 save && pm2 startup`.
21. **Verify Health Endpoint**: Test `curl https://mysakthimarketing.in/api/health`.
22. **Purge Test Data**: Run `cd backend && node scripts/clean-demo-data.js --force-production-purge`.
23. **Create Initial Admin Account**: Execute initial admin account initialization script.
24. **Perform Smoke Test**: Perform end-to-end user registration and portal flow tests.
