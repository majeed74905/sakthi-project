# AWS System Monitoring & Alerting Guide

## 1. Monitoring Metrics & Tools

| Component | Metric Monitored | Threshold Alert | Tool Used |
| :--- | :--- | :--- | :--- |
| **CPU Usage** | High CPU Utilization | $> 85\%$ over 10m | AWS CloudWatch / `htop` |
| **RAM Usage** | Low Available Memory | $< 500 \text{ MB}$ free | PM2 Monit / CloudWatch Agent |
| **Disk Space** | EBS Volume Capacity | $> 80\%$ full | Linux `df -h` / Alert Cron |
| **Node Backend** | PM2 Process Crash / Restart | $> 5$ restarts / hr | PM2 Alert Webhook |
| **HTTP Errors** | 500 Internal Server Errors | $> 10$ errors / min | Nginx Error Log Analyzer |
| **SSL Expiry** | Days until TLS Cert Expires | $< 15$ days remaining | Certbot Status / Alert Cron |

---

## 2. PM2 Live Health Monitor Command
```bash
pm2 monit
```

---

## 3. Log Inspection Commands
- **Backend Express Logs**: `pm2 logs mysakthi-backend`
- **Nginx Access Logs**: `sudo tail -f /var/log/nginx/access.log`
- **Nginx Error Logs**: `sudo tail -f /var/log/nginx/error.log`
- **MySQL Error Logs**: `sudo tail -f /var/log/mysql/error.log`
