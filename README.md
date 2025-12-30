# Spur AI Chat Agent

A live chat support agent powered by React, Node.js, and Hugging Face LLM.

## Tech Stack

- **Frontend**: React (Vite), TypeScript, Vanilla CSS
- **Backend**: Node.js, Express, TypeScript, Prisma (SQLite)
- **AI**: Hugging Face Inference API

## Prerequisite

- Node.js (v18+)
- Hugging Face API Key (free)

## Setup and Run

1. **Clone/Open the repository**

2. **Backend Setup**
   ```bash
   cd server
   npm install
   # Create a .env file based on the example below
   # Run migration
   npx prisma migrate dev --name init
   # Start server
   npm run dev
   ```

   **`.env` Configuration**:
   ```env
   DATABASE_URL="file:./dev.db"
   PORT=3000
   HUGGINGFACE_API_KEY="your_hf_token_here"
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the App**
   Open the URL shown in the frontend terminal (e.g., `http://localhost:5173`).

## Architecture

- **Frontend**:
  - `App.tsx`: Manages chat state and session.
  - `ChatWindow`: Renders message history with auto-scroll.
  - `ChatInput`: Handles user input and submission.
  - `api.ts`: Inter acts with the backend API.
  
- **Backend**:
  - `server.ts`: Express app entry point.
  - `routes.ts`: Defines API endpoints.
  - `services/chat.ts`: Manages conversation logic and DB persistence.
  - `services/llm.ts`: Integration with Hugging Face Inference API.
  - **Database**: SQLite with Prisma ORM (`Session`, `Message` models).

## LLM Notes

- Provider: **Hugging Face Inference API**
- Model: `mistralai/Mistral-7B-Instruct-v0.3` (configurable in `src/services/llm.ts`)
- The system prompt configures the agent as a helpful support assistant for "Spur".

## Trade-offs

- **Database**: SQLite was chosen for simplicity and zero-configuration local development. For production, PostgreSQL would be preferred.
- **LLM**: Used Hugging Face free tier. Rate limits may apply.
- **Auth**: No authentication implemented as per requirements.
