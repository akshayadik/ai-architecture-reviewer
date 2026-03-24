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

## 🐍 Backend Setup (FastAPI)

The backend powers the AI engine, utilizing OpenAI's Structured Outputs, Vision parsing, and a local ChromaDB Vector Database for RAG (Retrieval-Augmented Generation).

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

  * The API will now be running at: **https://www.google.com/search?q=http://127.0.0.1:8000**
  * You can view the interactive API documentation (Swagger UI) at: **https://www.google.com/search?q=http://127.0.0.1:8000/docs**

### 4\. How to Stop the Backend Server

Click inside the terminal window running the Uvicorn server and press **`Ctrl + C`**.

-----

## 💻 Frontend Setup (Next.js)

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

### 2\. How to Start the Frontend Server

Run the Next.js development server:

```bash
npm run dev
```

  * The web application will now be running at: **http://localhost:3000**
  * Open this URL in your browser to interact with the AI Architecture Reviewer.

### 3\. How to Stop the Frontend Server

Click inside the terminal window running Next.js and press **`Ctrl + C`**.
*(On Windows, it may ask "Terminate batch job (Y/N)?", type `Y` and press Enter).*

-----

## 🧠 Under the Hood: The AI Pipeline

1.  **Input Normalization:** The FastAPI router accepts either a text description or a `multipart/form-data` image upload.
2.  **Vision Extraction (`gpt-4o`):** If a UML diagram is uploaded, the image is encoded to Base64 and sent to GPT-4o to extract a strictly objective text representation of the system components and data flow.
3.  **Context Retrieval (ChromaDB):** The user's system design is queried against a local Vector Database seeded with industry best practices (Data Engineering, ML Serving, Event-Driven patterns) to ground the AI's advice.
4.  **Structured Critique (`gpt-4o`):** The combined design and RAG context are sent to the LLM using OpenAI's Structured Outputs feature, guaranteeing a perfectly formatted JSON response validated by Pydantic models.
5.  **Visualization:** The Next.js frontend parses the JSON into distinct, readable UI cards highlighting bottlenecks, cost warnings, and suggested improvements.

<!-- end list -->

```

---

```

---

That marks the completion of the AI Architecture Reviewer! You have a highly sophisticated, multi-modal AI application ready for your consultancy. 

Is there anything else you want to explore with this codebase, or perhaps brainstorm ideas for your next Adik Labs project?
```

