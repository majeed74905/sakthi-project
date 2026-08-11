# AWS PM2 Ecosystem Configuration Guide

## 1. PM2 Installation & System Setup
```bash
sudo npm install -g pm2
pm2 startup systemd
```

---

## 2. PM2 Ecosystem File (`backend/ecosystem.config.cjs`)

```javascript
module.exports = {
  apps: [
    {
      name: 'mysakthi-backend',
      script: 'src/server.js',
      cwd: '/var/www/mysakthimarketing/backend',
      instances: 2,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
```

---

## 3. PM2 Process Lifecycle Commands
- **Start Application**: `pm2 start ecosystem.config.cjs --env production`
- **Save Process State for Autostart**: `pm2 save`
- **Graceful Zero-Downtime Reload**: `pm2 reload mysakthi-backend`
- **View Live Logs**: `pm2 logs mysakthi-backend`
- **Monitor RAM/CPU**: `pm2 monit`
