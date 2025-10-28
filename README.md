# 🌐 WebLink — Intelligent Bookmarking, Visualization & Discovery  
_All your links, linked._  

WebLink is a modern web + extension ecosystem that reimagines bookmarking as an **interactive, intelligent network graph**.  
It allows you to **save, tag, organize, and explore** your digital resources visually — and even uses **AI embeddings** to connect related content automatically.  

---

## 🚀 Overview

**WebLink** unifies two key experiences:
1. **A responsive web dashboard** — manage and visualize your bookmarks in an elegant interface ✨  
2. **A compact Chrome extension** — save links instantly as you browse  

Behind the scenes, it uses:
- **Supabase** for authentication, storage, and Postgres database management  
- **OpenAI Embeddings + pgvector** to discover and link semantically related bookmarks  
- **D3.js** for a real‑time, draggable graph visualization  

Together, these components transform the humble bookmark into a **connected knowledge map**.

---

## 🧠 Core Features

### 🖥️ Web App (Dashboard)
- Built with **React** and **TailwindCSS**  
- Intuitive collapsible sidebar (shadcn‑inspired)  
- Dynamic sections:
  - **Home** – your global bookmark overview  
  - **Tags** – filter and view categorized links  
  - **Graph** – explore semantic relationships visually  
  - **Settings** – manage theme, preferences, account  

### 🔗 Chrome Extension
- Compact **15 rem × 15 rem** popup, matching the WebLink glow aesthetic  
- **Logged‑out view:** Google OAuth (“Sign in with Google”)  
- **Logged‑in view:**  
  - “Bookmark this page” button  
  - Smooth tag dropdown + inline “Add Tag” option  
  - Real‑time sync with web dashboard  

### 🧩 Interactive Graph
- Powered by **D3.js ForceGraph**  
- Drag, pin, or delete nodes dynamically  
- Filter bookmarks by tag or relevance  
- Right‑click contextual actions:  
  - **Node:** `DELETE /api/nodes/:id`  
  - **Link:** `DELETE /api/links/:sourceId/:targetId`  

### 🤖 AI‑Powered Discovery
- Each saved bookmark is embedded using the **OpenAI `text-embedding-3-small`** model  
- **Supabase Edge Functions + pgvector** detect semantic similarity  
- Automatically connects related bookmarks with weighted edges  
- Example: *“Supabase Auth Docs” ↔ “Postgres Row Level Security Guide”*  

---

## 🧩 Architecture & DB Schema

```
User ──< Bookmark ──< Embedding
        │
        ├─< bookmark_tags >── Tag
        └─< bookmark_links >── Bookmark
```

### Database Highlights
- **Supabase Postgres** with `pgvector` for cosine similarity  
- **Tables:**
  - `users` — auth and identity  
  - `bookmarks` — metadata + URLs  
  - `tags` — user‑owned categories  
  - `embeddings` — OpenAI vector representations  
  - `bookmark_links` — relationship edges between bookmarks  
  - `bookmark_tags` — many‑to‑many tagging  

### Example SQL Function – `match_bookmarks`
Identifies semantically related bookmarks via embeddings:
```sql
CREATE OR REPLACE FUNCTION match_bookmarks(
  query_embedding vector(1536),
  similarity_threshold float,
  user_id_param uuid
)
RETURNS TABLE (bookmark_id uuid, similarity float)
LANGUAGE sql AS $$
  SELECT
    e.bookmark_id,
    1 - (e.vector <=> query_embedding) AS similarity
  FROM embeddings e
  JOIN bookmark b ON b.bookmark_id = e.bookmark_id
  WHERE b.user_id = user_id_param
    AND (1 - (e.vector <=> query_embedding)) >= similarity_threshold
  ORDER BY similarity DESC;
$$;
```

---

## 🛠️ Tech Stack

| Category | Tools |
|-----------|-------|
| **Frontend** | Next.js · React · TypeScript · TailwindCSS |
| **UI Components** | Custom Tailwind (shadcn‑inspired) |
| **Browser Extension** | Chrome Extension (Manifest V3 + Vite) |
| **Backend** | Supabase Edge Functions (Deno) |
| **Database** | Supabase Postgres + pgvector |
| **AI Integration** | OpenAI Embeddings API |
| **Visualization** | D3.js |
| **Auth** | Supabase OAuth (Google) |
| **State Management** | React Context API |
| **Deployment** | Vercel (Web) · Supabase (Functions) · Chrome Web Store (Extension) |

---

## ⚙️ Setup & Local Development

### 1️⃣ Clone Repository
```bash
git clone https://github.com/<your-username>/weblink.git
cd weblink
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Add Environment Variables
Create a `.env` in the repo root:
```bash
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
OPENAI_API_KEY="sk-your-openai-key"
```

### 4️⃣ Run the Web App
```bash
cd apps/web/weblink
npm run dev
```
Visit → http://localhost:3000  

### 5️⃣ Build and Load the Chrome Extension
```bash
cd apps/extension
npm run build
```
Then in Chrome:
1. Open `chrome://extensions`  
2. Enable Developer Mode  
3. Click **Load Unpacked** → select `apps/extension/dist`

---

## 🧠 API Endpoints

| Method | Endpoint | Description |
|:------:|:----------|:-------------|
| `GET` | `/api/nodes` | Fetch nodes |
| `GET` | `/api/links` | Fetch edges |
| `DELETE` | `/api/nodes/:id` | Delete node + links |
| `DELETE` | `/api/links/:sourceId/:targetId` | Delete connection |

**Edge Functions (Supabase):**

| Function | Method | Purpose |
|-----------|---------|----------|
| `addBookmark` | `POST` | Add bookmark + generate embedding |
| `getBookmarks` | `GET` | Return bookmarks for a user |
| `getTags` | `GET` | List user tags |
| `getLinks` | `GET` | Retrieve semantically related links |
| `getBookmarkTags` | `GET` | Tag ↔ bookmark mappings |
| `getBookmarksByTag` | `GET` | List bookmarks under a tag |

---

## ⚡ Workflow Summary

1. **User logs in** via Google → Supabase Auth  
2. **addBookmark()** adds the link + triggers embedding generation  
3. **Embedding** gets stored and compared to others via pgvector  
4. **Related links** (cosine ≥ 0.8) populate `bookmark_links`  
5. The **Web Dashboard** fetches:
   - `getBookmarks` → overview  
   - `getTags` → tag list  
   - `getBookmarksByTag` → contextual list  
   - Related nodes shown in the Graph view  

---

## 🧩 Example Request

```json
POST https://<project-ref>.supabase.co/functions/v1/addBookmark
{
  "user_id": "36e56756-a5b4-4123-88c0-7511fc798be2",
  "title": "Supabase Docs",
  "url": "https://supabase.com/docs",
  "description": "Official documentation",
  "favicon_url": "https://supabase.com/favicon.ico"
}
```

---

## 📁 Project Structure
```text
weblink/
├── apps/
│   ├── web/                # Frontend dashboard
│   └── extension/          # Chrome popup
│
├── server/                 # Supabase functions
├── packages/               # Shared configs / UI
├── tailwind.config.js
└── package.json
```

---

## 🌈 Design Philosophy
> **Sharp minimalism × soft glow.**  
> WebLink transforms bookmarking into a structured, visual, and aesthetic experience — balancing clarity, color, and calm.

---

## 💡 Future Enhancements
- 🔍 Searchable semantic graph (vector + text hybrid)  
- 🧠 AI‑generated tag suggestions  
- 🪄 Multi‑user collaboration + shared collections  
- 📸 Automatic bookmark previews (screenshots)  
- 🪶 Context‑menu integration (“Save to WebLink”)  

---

## 👥 Contributors
| Name | Role |
|------|------|
| **Daksh Shahani** | Lead Developer |
| **Ramika DeSilva** | Frontend Developer |
| **Jagathi Moturi** | Backend Developer |
| *Roberta Lee* | Designer |


---

## 📜 License
Licensed under the **MIT License**.  
See [LICENSE](LICENSE) for full details.  

---

### ✨ Acknowledgements
- [Supabase](https://supabase.com/) · Auth & Postgres DB  
- [OpenAI](https://openai.com/) · Embedding model  
- [D3.js](https://d3js.org/) · Visual graphs  
- [TailwindCSS](https://tailwindcss.com/) · Styling  
- [shadcn/ui](https://ui.shadcn.com/) · Component inspiration  

---
