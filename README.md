This is the perfect final touch. Adding clear deployment instructions makes this repository look incredibly professional and acts as a great reference guide for when you build your next project.

Here is the complete, updated `README.md` file. I have appended a comprehensive **Deployment Guide** section that includes all the critical Vercel and Render configurations we just solved.

You can copy this entire block and replace the contents of your `README.md` file in the root of your project:

````markdown
# AI Architecture Reviewer 🚀

An intelligent, multi-modal system design critique tool built for Adik Labs. This application acts as an "AI Staff Engineer," allowing users to upload UML diagrams or describe their software architecture to receive a highly structured, expert-level critique on bottlenecks, scalability, reliability, and cost.

## 🏗️ Project Structure
This repository contains both the Next.js frontend and the FastAPI backend.

```text
ai-architecture-reviewer/
├── backend/       # FastAPI, OpenAI, ChromaDB (Python)
└── frontend/      # Next.js, Tailwind CSS, React Dropzone (TypeScript)
````

## ⚙️ Prerequisites

Before running the application, ensure you have the following installed:

  * **Node.js** (v18 or higher)
  * **Python** (v3.9 or higher)
  * An active **OpenAI API Key** (with access to `gpt-4o` and a funded billing account)

-----

## 🐍 Local Backend Setup (FastAPI)

The backend powers the AI engine, utilizing OpenAI's Structured Outputs, Vision parsing, and a local ChromaDB Vector Database for RAG.

### 1\. Installation & Environment Setup

Open your terminal and navigate to the backend directory:

```bash
cd backend
```

Create and activate a Python virtual environment:

  * **Windows:**
    ```bash
    python -m venv venv
    .\venv\Scripts\activate
    ```
  * **Mac/Linux:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

### 2\. Environment Variables

Create a file named `.env` in the root of the `backend/` folder and add your OpenAI API key:

```text
OPENAI_API_KEY=sk-proj-YourActualKeyGoesHere...
```

### 3\. How to Start the Backend Server

Ensure your virtual environment is activated, then run the Uvicorn server:

```bash
uvicorn app.main:app --reload
```

  * The API will now be running at: **http://127.0.0.1:8000**
  * You can view the interactive API documentation (Swagger UI) at: **https://www.google.com/search?q=http://127.0.0.1:8000/docs**

-----

## 💻 Local Frontend Setup (Next.js)

The frontend is a modern, responsive React dashboard featuring drag-and-drop file uploads and visually distinct critique cards.

### 1\. Installation

Open a *new* terminal window (leave the backend running) and navigate to the frontend directory:

```bash
cd frontend
```

Install the Node dependencies:

```bash
npm install
```

### 2\. Environment Variables

Create a file named `.env.local` in the root of the `frontend/` folder to tell Next.js where your local backend is running:

```text
NEXT_PUBLIC_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)
```

### 3\. How to Start the Frontend Server

Run the Next.js development server:

```bash
npm run dev
```

  * The web application will now be running at: **http://localhost:3000**

-----

## 🚀 Deployment Guide

Because this is a monorepo containing two different tech stacks, the frontend and backend must be deployed as separate services.

### Step 1: Deploying the Backend (Render)

We recommend using [Render](https://render.com/) for the FastAPI backend.

1.  Create a new **Web Service** on Render connected to your GitHub repository.
2.  **Root Directory:** `backend`
3.  **Build Command:** `pip install -r requirements.txt`
4.  **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5.  **Environment Variables:**
      * Add `OPENAI_API_KEY` with your actual secret key.
6.  Deploy the service and copy your live backend URL (e.g., `https://your-app.onrender.com`).

*(Note: If using Render's free tier, the SQLite ChromaDB database is ephemeral and will reset when the server spins down. The app is configured to automatically re-seed the vector database upon the next request).*

### Step 2: Deploying the Frontend (Vercel)

We recommend using [Vercel](https://vercel.com/) for the Next.js frontend.

1.  Create a new project on Vercel and import your GitHub repository.
2.  **CRITICAL Configurations:**
      * **Root Directory:** Edit this and set it to `frontend`.
      * **Framework Preset:** Ensure this is explicitly set to **Next.js** (it may default to "Other", which will break the build).
3.  **Environment Variables:**
      * Add `NEXT_PUBLIC_API_URL` and set the value to your deployed Render backend URL (e.g., `https://your-app.onrender.com`). *Ensure there is no trailing slash.*
4.  Click **Deploy**. Vercel will build the frontend and automatically link it to your live AI backend.

*(Note: The `next.config.js` file is configured to bypass strict TypeScript 6.0 build warnings during the Vercel cloud compilation).*

-----

## 🧠 Under the Hood: The AI Pipeline

1.  **Input Normalization:** The FastAPI router accepts either a text description or a `multipart/form-data` image upload.
2.  **Vision Extraction (`gpt-4o`):** If a UML diagram is uploaded, the image is encoded to Base64 and sent to GPT-4o to extract a strictly objective text representation of the system components and data flow.
3.  **Context Retrieval (ChromaDB):** The user's system design is queried against a local Vector Database seeded with industry best practices (Data Engineering, ML Serving, Event-Driven patterns) to ground the AI's advice.
4.  **Structured Critique (`gpt-4o`):** The combined design and RAG context are sent to the LLM using OpenAI's Structured Outputs feature, guaranteeing a perfectly formatted JSON response validated by Pydantic models.
5.  **Visualization:** The Next.js frontend parses the JSON into distinct, readable UI cards highlighting bottlenecks, cost warnings, and suggested improvements.

<!-- end list -->

````

Once you save this, you can push it to your `main` branch:
```bash
git add README.md
git commit -m "docs: add detailed production deployment steps"
git push origin main
````