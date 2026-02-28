# Studio Assistant - AI-Powered Internal Narrative Tool (Option A)

## 1. Project Name

**Studio Assistant - AI-Powered Internal Narrative Tool (Option A)**

This project implements **Section A (AI-Powered Studio Assistant)**.
It is a web-based AI tool designed for narrative and design teams in game studios, supporting structured command-based content generation with real-time streaming responses and multi-thread conversation support.

---

## 2. Live Demo

[https://studio-assistant-weld.vercel.app/](https://studio-assistant-weld.vercel.app/)

---

## 3. Tech Stack

**Frontend**

* Next.js (App Router)
* TypeScript
* TailwindCSS

**Backend**

* Next.js Route Handlers
* OpenAI API (streaming enabled)

**AI Service**

* OpenAI (GPT-4o-mini model)

**Deployment**

* Vercel

---

## 4. Time Log (WIB)

| Date         | Start | End   | Activity                                                        | Duration |
|--------------|-------|-------|-----------------------------------------------------------------|----------|
| Feb 28, 2026 | 13:00 | 14:00 | Project setup, Next.js initialization, base layout & API route | 1h       |
| Feb 28, 2026 | 14:00 | 15:00 | Chat UI implementation & API integration                        | 1h       |
| Feb 28, 2026 | 15:00 | 16:00 | AI service layer & command parser architecture                  | 1h       |
| Feb 28, 2026 | 16:00 | 17:00 | Structured prompt builder, memory support & UI polish           | 1h       |
| Mar 1, 2026  | 01:00 | 02:00 | Streaming implementation & integration testing                  | 1h       |
| Mar 1, 2026  | 02:00 | 02:30 | Responsive layout fixes & hydration issue resolution            | 0.5h     |
| Mar 1, 2026  | 02:30 | 03:00 | Final production testing, README completion & submission prep   | 0.5h     |

**Total: ~6 hours**

---

## 5. AI Tools Used

* **ChatGPT 5.2**
  Used to validate architectural decisions, refine streaming implementation, assist with debugging hydration issues, and improve UI responsiveness.

* **OpenAI API**
  Used as the core LLM service provider with streaming enabled for real-time response rendering.

---

## 6. Setup Instructions

```bash
git clone <repo-url>
cd studio-assistant
npm install
```

Create a `.env.local` file:

```
AI_API_KEY=your_key
AI_MODEL=gpt-4o-mini
```

Run locally:

```
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 7. Design Decisions

### Command-Based Prompt Abstraction

Commands such as `/write-dialogue` and `/asset-description` are parsed through a dedicated command parser and mapped to structured prompt builders. This keeps the system modular and easily extensible for additional commands (e.g., `/summarize`, `/draft-email`).

### Streaming Architecture

Implemented true streaming using:

* `stream: true` in the OpenAI SDK
* `ReadableStream` in the Next.js API route
* Incremental UI updates via `getReader()` on the frontend

This improves perceived responsiveness and user experience.

### Token Safety

Conversation history is limited to the latest 10 messages to prevent excessive token usage and maintain performance.

### Multi-Thread Support

Threads are implemented as arrays of message arrays, allowing users to switch conversations without backend persistence.

### Local Persistence

Threads are stored in `localStorage` to maintain session continuity without introducing database complexity.

---

## 8. What I Would Improve

With more time, I would:

* Add authentication & role-based access
* Implement database-backed persistent threads
* Add streaming typing indicators
* Introduce prompt versioning system
* Improve animation and micro-interactions
* Add usage metrics and logging

