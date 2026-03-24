This is a fantastic idea. Having a dedicated, step-by-step deployment guide is a hallmark of professional software engineering and will be a great asset for your Adik Labs consultancy portfolio. 

You can save this as a separate file (e.g., `DEPLOYMENT.md`) in your repository, or add it to a documentation site later. 

Here is the comprehensive documentation encompassing everything we configured to get this monorepo live:

***

# 🚀 AI Architecture Reviewer: Production Deployment Guide

This guide outlines the steps to deploy the AI Architecture Reviewer to production environments. Because this repository is a monorepo containing two distinct environments (a Python backend and a Node.js frontend), they must be deployed as separate services.

## Architecture Overview
* **Backend:** FastAPI application hosted on **Render** (Web Service).
* **Frontend:** Next.js application hosted on **Vercel**.
* **Database:** Local SQLite/ChromaDB vector database (ephemeral in the cloud, auto-seeds on startup).

---

## Part 1: Backend Deployment (Render)

Render is ideal for our Python FastAPI backend as it natively supports `requirements.txt` and easily runs Uvicorn servers.

### 1. Create the Web Service
1. Log in to [Render](https://render.com/) and navigate to your Dashboard.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select the `ai-architecture-reviewer` repository.

### 2. Configure Build Settings
Fill out the service settings exactly as follows:
* **Name:** `ai-architecture-reviewer-api`
* **Region:** Select the region closest to your target users.
* **Branch:** `main`
* **Root Directory:** `backend` *(Critical: This tells Render to ignore the frontend folder).*
* **Runtime:** `Python 3`
* **Build Command:** `pip install -r requirements.txt`
* **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 3. Set Environment Variables
Scroll down to the **Environment Variables** section and add:
* **Key:** `OPENAI_API_KEY`
* **Value:** `sk-proj-...` *(Your secret OpenAI API Key)*

### 4. Deploy
Click **Create Web Service**. Render will install the dependencies and start the Uvicorn server. 
* **Important:** Copy the live URL provided by Render (e.g., `https://ai-architecture-reviewer-api.onrender.com`). You will need this for the frontend setup.

---

## Part 2: Frontend Deployment (Vercel)

Vercel is the native hosting platform for Next.js, offering the best performance and build optimizations.

### 1. Create the Vercel Project
1. Log in to [Vercel](https://vercel.com/) and go to your Dashboard.
2. Click **Add New...** -> **Project**.
3. Import the `ai-architecture-reviewer` GitHub repository.

### 2. Configure Monorepo Settings
Before clicking deploy, you **must** configure Vercel to look at the correct folder and use the correct framework:
* **Framework Preset:** Click the dropdown and explicitly select **Next.js**. *(If left on "Other", Vercel will attempt a static HTML build and fail looking for a `public` folder).*
* **Root Directory:** Click Edit and type `frontend`.

### 3. Set Environment Variables
Expand the **Environment Variables** section and add the connection to your new backend:
* **Key:** `NEXT_PUBLIC_API_URL`
* **Value:** `https://ai-architecture-reviewer-api.onrender.com` *(Paste your Render URL here. Ensure there is **no trailing slash**).*

### 4. Deploy
Click **Deploy**. Vercel will read the `next.config.js` file (which bypasses strict TypeScript 6.0 deprecation warnings), compile the React application, and publish it globally.

---

## Part 3: Post-Deployment Verification

### 1. CORS Policy Check
Ensure the FastAPI backend is configured to accept requests from the Vercel frontend. In `backend/app/main.py`, the `CORSMiddleware` should be set to allow wildcard origins for a public app:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False, 
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Cold Start Behavior
If you are using the free tier of Render, the backend server will spin down after 15 minutes of inactivity. 
* **Impact:** The very first time a user visits the app after a period of inactivity, analyzing an architecture may take an additional 30–60 seconds while the Render server wakes up and the ChromaDB vector database re-seeds its best practices. Subsequent requests will be lightning-fast.

***