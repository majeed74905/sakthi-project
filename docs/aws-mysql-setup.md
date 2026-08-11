# AWS MySQL 8.0 Database Setup & Security Guide

## 1. Installation & Secure Configuration
1. Install MySQL Server:
   ```bash
   sudo apt install mysql-server -y
   ```
2. Run MySQL secure installation script:
   ```bash
   sudo mysql_secure_installation
   ```

---

## 2. Least-Privilege Database Users Setup

Log into MySQL shell as root (`sudo mysql`):

```sql
-- 1. Create Application Database
CREATE DATABASE mysakthimarketing CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Create Application User (Restricted to localhost)
CREATE USER 'sakthi_app'@'localhost' IDENTIFIED BY 'GENERATE_STRONG_APP_PASSWORD';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES ON mysakthimarketing.* TO 'sakthi_app'@'localhost';

-- 3. Create Dedicated Backup User (Least Privilege)
CREATE USER 'sakthi_backup'@'localhost' IDENTIFIED BY 'GENERATE_STRONG_BACKUP_PASSWORD';
GRANT SELECT, LOCK TABLES, SHOW VIEW, PROCESS ON *.* TO 'sakthi_backup'@'localhost';

FLUSH PRIVILEGES;
```

---

## 3. Dedicated MySQL Option File (`/home/deployadmin/.my.cnf`)

Create `/home/deployadmin/.my.cnf` for command-line backup operations without password exposure:
```ini
[client]
user = sakthi_backup
password = GENERATE_STRONG_BACKUP_PASSWORD
host = localhost
```
Restrict option file permissions:
```bash
chmod 600 /home/deployadmin/.my.cnf
```

---

## 4. Bind Address & Network Isolation
Ensure `/etc/mysql/mysql.conf.d/mysqld.cnf` contains:
```ini
bind-address = 127.0.0.1
```
Port `3306` is restricted to local connections only.
