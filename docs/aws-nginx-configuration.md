# AWS Nginx Configuration Guide

## 1. Nginx Installation
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
```

---

## 2. Server Block Configuration (`/etc/nginx/sites-available/mysakthimarketing`)

```nginx
# 1. Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name mysakthimarketing.in www.mysakthimarketing.in;
    return 301 https://$host$request_uri;
}

# 2. Production HTTPS Server Block
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name mysakthimarketing.in www.mysakthimarketing.in;

    # SSL Certificates (Managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/mysakthimarketing.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mysakthimarketing.in/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Root Directory for Vite React Production Build
    root /var/www/mysakthimarketing/frontend/dist;
    index index.html;

    # HTTP Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Request Body Size Limit (10MB for product images)
    client_max_body_size 10M;

    # SPA Client Route Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Reverse Proxy for Express REST API
    location /api/v1/ {
        proxy_pass http://127.0.0.1:5000/api/v1/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }

    # Static Media Caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 3. Enable Site & Test Syntax
```bash
sudo ln -s /etc/nginx/sites-available/mysakthimarketing /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```
