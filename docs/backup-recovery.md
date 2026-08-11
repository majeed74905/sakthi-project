# Operational Backup and Disaster Recovery Plan: My Sakthi Marketing

## 1. Automated MySQL Database Backup Strategy

### Daily Backup Execution Script (`/scripts/backup_mysql.sh`)
```bash
#!/bin/bash
set -e
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mysql/daily"
BACKUP_FILE="${BACKUP_DIR}/sakthi_db_${TIMESTAMP}.sql.gz"

mkdir -p ${BACKUP_DIR}

# Execute compressed mysqldump with transaction lock safety
mysqldump --single-transaction --quick --lock-tables=false \
  -u ${DB_USER:-root} -p"${DB_PASS}" ${DB_NAME:-mysakthimarketing} | gzip -9 > ${BACKUP_FILE}

# Remove daily backups older than 30 days
find ${BACKUP_DIR} -type f -name "*.sql.gz" -mtime +30 -delete

echo "✅ Backup created successfully: ${BACKUP_FILE}"
```

---

## 2. Retention Policy

| Backup Type | Schedule | Local Storage Location | Retention Period | Off-Site Sync |
| :--- | :--- | :--- | :--- | :--- |
| **Daily Dump** | Everyday at 02:00 IST | `/backups/mysql/daily` | **30 Days** | Encrypted S3 Bucket |
| **Weekly Snapshot** | Every Sunday 03:00 IST | `/backups/mysql/weekly` | **12 Months** | Encrypted S3 Bucket |
| **Pre-Deployment** | Manual before updates | `/backups/mysql/manual` | Indefinite until superseded | Encrypted S3 Bucket |

---

## 3. Off-Site Storage & Encryption
- All backup archives are encrypted using AES-256 (`gpg --symmetric --cipher-algo AES256`).
- Encrypted archives are automatically synced to an off-site S3 storage bucket using AWS CLI (`aws s3 sync /backups s3://sakthi-marketing-backups-secure/`).

---

## 4. Operational Restoration & Verification Procedure

Before approving production go-live, the disaster recovery procedure must be operationalized and tested:

```text
Create Dump Archive
        ↓
Verify Gzip Integrity (gzip -t archive.sql.gz)
        ↓
Restore to Staging Database (mysakthimarketing_stage)
        ↓
Execute Prisma Schema Validation (npx prisma validate)
        ↓
Verify Record Counts & Financial Ledger Records
```

### Restoration Command Workflow
1. Decompress target backup archive:
```bash
gunzip -c /backups/mysql/daily/sakthi_db_20260809_020000.sql.gz > /tmp/restore_dump.sql
```
2. Import dump into target MySQL instance:
```bash
mysql -u root -p mysakthimarketing < /tmp/restore_dump.sql
```
3. Run Prisma validation to confirm database integrity:
```bash
cd backend && npx prisma validate
```

---

## 5. Backup Failure Alerting Requirements
- **Automated Failure Detection**: If `mysqldump` or S3 upload exits with a non-zero exit code, an automated email / Webhook alert is immediately dispatched to `sysadmin@mysakthimarketing.in`.
- **Periodic Restore Testing**: System administrator must perform a test restore on the 1st of every month to guarantee dump files are non-corrupt.
