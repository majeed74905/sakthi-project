# AWS SSL / TLS Certificate Manual (Certbot / Let's Encrypt)

## 1. Certbot Installation
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

---

## 2. Certificate Issuance Command
Run Certbot to issue and automatically configure TLS for Nginx:
```bash
sudo certbot --nginx -d mysakthimarketing.in -d www.mysakthimarketing.in
```

---

## 3. Automated Renewal Verification
Certbot configures a systemd timer for automatic renewal (`/etc/systemd/system/timers.target.wants/certbot.timer`).

Test dry-run renewal:
```bash
sudo certbot renew --dry-run
```

---

## 4. HTTPS Security Validation
After issuance, verify certificate status using SSL Labs test (`https://www.ssllabs.com/ssltest/analyze.html?d=mysakthimarketing.in`). Ensure Grade A/A+ rating.
