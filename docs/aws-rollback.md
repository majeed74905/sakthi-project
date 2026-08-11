# AWS Application & Database Rollback Procedure

## 1. Rollback Scenarios & Rules
- **Rule 1 (Zero Data Loss)**: Never roll back database schema migrations if live user data has been written under the newer schema version.
- **Rule 2 (Code Rollback)**: If a new deployment causes application errors, roll back backend and frontend code to the previous git tag or release build immediately.

---

## 2. Frontend Rollback
Revert static build in Nginx:
```bash
cd /var/www/mysakthimarketing/frontend
git checkout PREVIOUS_RELEASE_TAG
npm run build
sudo systemctl reload nginx
```

---

## 3. Backend Code Rollback
```bash
cd /var/www/mysakthimarketing/backend
git checkout PREVIOUS_RELEASE_TAG
npm install --production
pm2 reload mysakthi-backend
```

---

## 4. Database Migration Rollback Procedure
If a database rollback is required before commercial traffic:
1. Restore database snapshot from pre-deployment backup:
   ```bash
   gunzip -c /backups/mysql/manual/sakthi_db_pre_deploy.sql.gz | mysql --defaults-file=~/.my.cnf mysakthimarketing
   ```
2. Verify schema status:
   ```bash
   cd backend && npx prisma validate
   ```
