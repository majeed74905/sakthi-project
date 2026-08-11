# Production Deployment Guide: My Sakthi Marketing

## Architectural Overview

```text
Client Browser
     │ (HTTPS / TLS 1.3)
     ▼
Nginx Reverse Proxy (Port 443)
 ├── /         ──> Vite Production Build SPA Static Files (/var/www/frontend/dist)
 └── /api/v1/  ──> Node.js Express API Process (PM2 / Port 5000)
                      │
                      ▼
               XAMPP / MySQL DB Server (Port 3306)
```

---

## Step 1: Server Prerequisites & Environment
1. Node.js `v18+` or `v20+` LTS installed.
2. XAMPP MySQL or Dedicated MySQL `8.0` running on port `3306`.
3. PM2 Process Manager installed globally (`npm install -g pm2`).

---

## Step 2: Backend Setup & Environment Variables
Copy `.env.example` to `.env` inside `/backend`:
```env
PORT=5000
NODE_ENV=production
DATABASE_URL="mysql://root:@localhost:3306/mysakthimarketing"
JWT_SECRET="CHANGE_THIS_TO_A_32_CHAR_SECURE_RANDOM_SECRET_IN_PRODUCTION"
JWT_REFRESH_SECRET="CHANGE_THIS_TO_ANOTHER_SECURE_SECRET"
CLIENT_URL="https://mysakthimarketing.in"
```

Start backend with PM2:
```bash
cd backend
npm install --production
npx prisma db push
pm2 start src/server.js --name "sakthi-backend"
```

---

## Step 3: Frontend Production Build
```bash
cd frontend
npm install
npm run build
```

---

## Step 4: Nginx Reverse Proxy & Fallback Routing
Nginx configuration block for SPA routing fallback:
```nginx
server {
    listen 80;
    server_name mysakthimarketing.in;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name mysakthimarketing.in;

    ssl_certificate /etc/letsencrypt/live/mysakthimarketing.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mysakthimarketing.in/privkey.pem;

    root /var/www/mysakthimarketing/frontend/dist;
    index index.html;

    # SPA Client Route Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api/v1/ {
        proxy_pass http://127.0.0.1:5000/api/v1/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
