# AWS S3 Automated Backup & Security Architecture

## 1. Encrypted S3 Backup Pipeline

```text
AWS EC2
   │
   ▼
mysqldump (via ~/.my.cnf options file)
   │
   ▼
gzip Compression
   │
   ▼
Client-Side GPG AES-256 Encryption
   │
   ▼
AWS CLI Sync (via EC2 IAM Role)
   │
   ▼
Private AWS S3 Bucket (Block Public Access Enabled + KMS Encryption)
```

---

## 2. Automated S3 Backup Script (`/scripts/aws_s3_backup.sh`)

```bash
#!/bin/bash
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mysql"
DUMP_FILE="${BACKUP_DIR}/sakthi_db_${TIMESTAMP}.sql.gz"
ENC_FILE="${DUMP_FILE}.gpg"
S3_BUCKET="s3://sakthi-marketing-backups-secure/mysql"

mkdir -p ${BACKUP_DIR}

# 1. Execute dump using options file (no CLI passwords)
mysqldump --defaults-file=/home/deployadmin/.my.cnf --single-transaction --quick mysakthimarketing | gzip -9 > ${DUMP_FILE}

# 2. Encrypt dump archive using GPG AES-256 passphrase
gpg --batch --yes --passphrase-file /home/deployadmin/.gpg_passphrase -c --cipher-algo AES256 ${DUMP_FILE}

# 3. Sync encrypted file to S3 using IAM Role
aws s3 cp ${ENC_FILE} ${S3_BUCKET}/daily/

# 4. Remove local dump files older than 7 days
rm -f ${DUMP_FILE} ${ENC_FILE}

echo "✅ Backup successfully encrypted and uploaded to S3: ${S3_BUCKET}"
```

---

## 3. Private S3 Bucket Configuration Checklist
- [x] **Block Public Access**: Enabled for all 4 settings (No public read/write).
- [x] **Server-Side Encryption**: SSE-S3 or AWS KMS enabled.
- [x] **Bucket Policy**: Allows access ONLY to EC2 IAM Role `role-ec2-sakthi-backup`.
- [x] **Lifecycle Rules**: Automatically transition daily backups to S3 Glacier after 30 days.
