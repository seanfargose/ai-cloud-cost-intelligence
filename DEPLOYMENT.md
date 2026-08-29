# 🚀 Multi-Cloud Cost Intelligence Platform — Production Deployment Guide

This guide details how to deploy and host the full-stack **AI-Powered Cloud Cost Intelligence Platform** using **Vercel** (Frontend) and **Render / Railway** (Backend, PostgreSQL 16 & Redis 7).

---

## 🏗️ Architecture Overview

```mermaid
graph TD
    Client[Users / FinOps Teams] -->|HTTPS / WSS| Vercel[Vercel: Next.js 14 Dashboard]
    Vercel -->|REST API & WebSockets| Backend[Render / Railway: Node.js Express Backend]
    Backend --> Postgres[(Managed PostgreSQL 16)]
    Backend --> Redis[(Managed Redis 7)]
    Backend --> MultiCloud[Multi-Cloud MCP Engine: AWS + Azure + GCP]
```

---

## ⚡ Step 1: Deploy Backend, PostgreSQL & Redis (Render)

### Option A: 1-Click Blueprint via Render Web Console
1. Log in to [Render.com](https://render.com).
2. Click **New +** -> **Blueprint**.
3. Connect your GitHub repository: `https://github.com/seanfargose/ai-cloud-cost-intelligence`.
4. Render will automatically detect [`render.yaml`](file:///Users/seananandfargose/Downloads/AI-Powered-Cloud-Cost-Intelligence-Platform-fixed%202/render.yaml) and provision:
   - **`cost-intelligence-db`**: PostgreSQL 16 database.
   - **`cost-intelligence-redis`**: Redis key-value cache.
   - **`ai-cost-intelligence-backend`**: Node.js Web service with automatic schema migration and health checks.
5. Click **Apply**.
6. Once deployed, copy your backend URL (e.g., `https://ai-cost-intelligence-backend.onrender.com`).

---

## 🌐 Step 2: Deploy Frontend Dashboard (Vercel)

1. Log in to [Vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository: `https://github.com/seanfargose/ai-cloud-cost-intelligence`.
4. Configure Project Settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./dashboard` (or leave default root with [`vercel.json`](file:///Users/seananandfargose/Downloads/AI-Powered-Cloud-Cost-Intelligence-Platform-fixed%202/vercel.json))
   - **Build Command**: `npm run build --workspace=dashboard`
   - **Install Command**: `npm ci`
5. Add **Environment Variables**:
   | Variable | Value | Description |
   |---|---|---|
   | `NEXT_PUBLIC_API_URL` | `https://ai-cost-intelligence-backend.onrender.com` | Your live backend URL |
   | `NEXT_PUBLIC_WS_URL` | `wss://ai-cost-intelligence-backend.onrender.com` | Live WebSocket endpoint |
6. Click **Deploy**.
7. In ~60 seconds, your dashboard will be live at `https://ai-cloud-cost-intelligence.vercel.app`!

---

## 🔒 Step 3: Configure Environment Variables

### Backend Service Environment Variables (Render / Railway):
```env
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://ai-cloud-cost-intelligence.vercel.app

# Database & Cache (automatically injected by Render blueprint)
SKIP_DATABASE=false
SKIP_REDIS=false
DATABASE_URL=postgresql://user:password@hostname:5432/cost_optimization
REDIS_URL=rediss://user:password@hostname:6379

# Optional AI API Key (falls back to mock AI reasoning if omitted)
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Optional Multi-Cloud Live Credentials (falls back to sandbox if omitted)
AWS_ROLE_ARN=arn:aws:iam::123456789012:role/FinOpsCostReaderRole
AZURE_SUBSCRIPTION_ID=your-azure-subscription-id
GCP_PROJECT_ID=your-gcp-project-id
```

---

## 🖥️ Alternative Option B: Single VM Deploy (AWS EC2 / DigitalOcean VPS)

If you prefer hosting on a single Linux server ($10-20/mo) with automated Docker Compose:

1. SSH into your VM:
   ```bash
   ssh ubuntu@your-server-ip
   ```
2. Clone the repository:
   ```bash
   git clone https://github.com/seanfargose/ai-cloud-cost-intelligence.git
   cd ai-cloud-cost-intelligence
   ```
3. Run the containerized stack in daemon mode:
   ```bash
   docker compose up --build -d
   ```
4. Verify all 4 containers are running and healthy:
   ```bash
   docker compose ps
   ```
5. *(Optional)* Setup Nginx & Free SSL via Certbot:
   ```bash
   sudo apt-get install -y nginx certbot python3-certbot-nginx
   sudo certbot --nginx -d cost-intelligence.yourdomain.com
   ```

---

## 🏥 Verification & Health Check

After deployment, verify that all services are communicating:
```bash
# Test backend health
curl https://ai-cost-intelligence-backend.onrender.com/health

# Test multi-cloud endpoint
curl 'https://ai-cost-intelligence-backend.onrender.com/api/multicloud/costs?provider=all'
```
