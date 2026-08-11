# AWS Server OS Hardening Guide

## 1. System Updates & Non-Root Administration
1. Update system packages:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
2. Create non-root administrator account (`deployadmin`):
   ```bash
   sudo adduser deployadmin
   sudo usermod -aG sudo deployadmin
   ```

---

## 2. SSH Hardening & Key Authentication
1. Copy public SSH key to `deployadmin`:
   ```bash
   mkdir -p /home/deployadmin/.ssh
   chmod 700 /home/deployadmin/.ssh
   cat ~/.ssh/id_rsa.pub >> /home/deployadmin/.ssh/authorized_keys
   chmod 600 /home/deployadmin/.ssh/authorized_keys
   chown -R deployadmin:deployadmin /home/deployadmin/.ssh
   ```
2. Configure SSH daemon `/etc/ssh/sshd_config`:
   ```text
   PermitRootLogin no
   PasswordAuthentication no
   X11Forwarding no
   MaxAuthTries 3
   ```
3. Restart SSH service:
   ```bash
   sudo systemctl restart ssh
   ```

---

## 3. Uncomplicated Firewall (UFW) Configuration
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 4. Automatic Security Updates & Fail2Ban
1. Install Fail2Ban to block brute-force attempts:
   ```bash
   sudo apt install fail2ban unattended-upgrades -y
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

---

## 5. File & Directory Permissions
- Web root `/var/www/mysakthimarketing`: `chown -R deployadmin:www-data`, `chmod -R 755`.
- Environment secrets file `/var/www/mysakthimarketing/backend/.env`: `chmod 600`.
- MySQL options file `~/.my.cnf`: `chmod 600`.
