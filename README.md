# AutoMarket AI

AutoMarket AI is a modern, premium web application for buying and selling cars, supercharged with cutting-edge Artificial Intelligence. The platform offers a sleek, responsive user interface and seamless user experience, while leveraging AI to automate and enhance the listing creation and vehicle comparison processes.

## 📝 Project Description

AutoMarket AI serves as a next-generation car marketplace. 
- **Guests** can browse listings, view detailed car pages, and use the smart search functionality.
- **Registered Users** can create, edit, and delete their own car listings. They can upload multiple images, manage their profiles (including avatars), and save favorite cars to their personal watchlist.
- **Administrators** have access to a dedicated Admin Control Center where they can view platform statistics, manage all users (activate, deactivate, delete, change roles), and manage any listing on the platform.

### ✨ Emphasized AI Functionalities
The core unique selling point of this platform is the deep integration of Artificial Intelligence via a centralized, rate-limited, and cached AI Service layer:
1. **AI Specifications Extractor**: Users can paste a raw, unstructured block of text (e.g., from another website) and the AI will automatically parse and fill out the structured form fields (Brand, Model, Year, Price, etc.).
2. **AI Title Generator**: Automatically suggests a highly optimized, click-worthy title based on the entered car specifications.
3. **AI Description Generator & Improver**: Generates professional, sales-optimized automotive copy from scratch, or improves the grammar and tone of an existing user-written description.
4. **AI Auto-Keywords**: Behind the scenes, the AI automatically analyzes the listing on save and generates exactly 10 highly relevant SEO search tags.
5. **AI Vehicle Comparison**: Users can select two cars from the browse page or homepage and ask the AI to compare them. The AI generates a detailed, side-by-side technical and practical comparison directly injected into the UI as formatted HTML.

---

## 🏗️ Architecture & Technologies

The project is built as a Single Page Application (SPA) using modern, lightweight technologies without heavy frontend frameworks.

**Frontend:**
- **Core**: Vanilla JavaScript (ESModules), HTML5, CSS3.
- **Routing**: Custom hash-based router (`#/`, `#/login`, `#/profile`, etc.).
- **Styling**: Bootstrap 5 (via CDN) for grid and base components, heavily customized with a centralized CSS design system (`index.css`) featuring CSS variables, gradients, and micro-animations.
- **Build Tool**: Vite (for local development server and optimized production builds).

**Backend & Database (BaaS):**
- **Platform**: Supabase
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth (Email/Password)
- **Storage**: Supabase Storage Buckets (`car-images`, `avatars`)

**AI Provider:**
- Native integration with OpenAI API (or Gemini), routed through a custom `aiService.js` that implements advanced prompt engineering, request deduplication, in-memory caching, and rate limiting.

---

## 🗄️ Database Schema Design

The application relies on a relational PostgreSQL database hosted on Supabase.

### 1. `profiles` Table
Stores extended user data linked to the Supabase Auth system.
- `id` (UUID, Primary Key, References `auth.users`)
- `username` (Text, Unique)
- `full_name` (Text)
- `email` (Text)
- `phone` (Text)
- `city` (Text)
- `avatar_url` (Text)
- `role` (Text, default: 'user', can be 'admin')
- `status` (Text, default: 'active')
- `created_at` (Timestamp)

### 2. `listings` Table
Stores all vehicle listings.
- `id` (UUID, Primary Key)
- `seller_id` (UUID, Foreign Key -> `profiles.id`)
- `make` (Text)
- `model` (Text)
- `year` (Integer)
- `price` (Numeric)
- `mileage` (Integer)
- `fuel_type` (Text)
- `transmission` (Text)
- `engine` (Text)
- `horsepower` (Integer)
- `color` (Text)
- `location` (Text)
- `description` (Text)
- `search_keywords` (Text)
- `created_at` (Timestamp)

### 3. `favorites` Table
Junction table for the many-to-many relationship between users and their favorite listings.
- `user_id` (UUID, Foreign Key -> `profiles.id`)
- `listing_id` (UUID, Foreign Key -> `listings.id`)
- *Composite Primary Key (`user_id`, `listing_id`)*

### Relationships Visualized:
\`\`\`mermaid
erDiagram
    PROFILES ||--o{ LISTINGS : "creates"
    PROFILES ||--o{ FAVORITES : "saves"
    LISTINGS ||--o{ FAVORITES : "is saved as"
    
    PROFILES {
        uuid id PK
        string role
        string status
    }
    LISTINGS {
        uuid id PK
        uuid seller_id FK
        string make
        numeric price
    }
    FAVORITES {
        uuid user_id FK
        uuid listing_id FK
    }
\`\`\`

---

## 🚀 Local Development Setup Guide

1. **Clone the repository** (if applicable) and navigate to the root directory.
2. **Install Node.js dependencies**:
   \`\`\`bash
   npm install
   \`\`\`
3. **Environment Variables**:
   Create a `.env` file in the root directory and provide your keys:
   \`\`\`env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_AI_API_KEY=your_openai_or_gemini_api_key
   VITE_AI_API_URL=https://api.openai.com/v1/chat/completions
   VITE_AI_MODEL=gpt-3.5-turbo
   \`\`\`
4. **Start the Development Server**:
   \`\`\`bash
   npm run dev
   \`\`\`
5. Open your browser and navigate to the `localhost` URL provided by Vite (usually `http://localhost:5173`).

---

## 📁 Key Folders and Files & Their Purpose

\`\`\`text
auto-market/
├── public/                 # Static assets (images, icons) served directly at the root path.
├── src/
│   ├── components/         # Reusable UI components.
│   │   ├── compareBar/     # The floating global AI Comparison toolbar.
│   │   ├── footer/         # Global footer component.
│   │   ├── listingCard/    # The standard car card component used across multiple pages.
│   │   └── navbar/         # Global navigation bar component.
│   ├── pages/              # Logic and templates for specific route views.
│   │   ├── admin/          # Admin Dashboard (Stats, User & Listing management).
│   │   ├── browse/         # Search, filter, and pagination logic for all cars.
│   │   ├── create/         # Create listing form + AI spec extraction & title gen.
│   │   ├── details/        # Single car view with image gallery.
│   │   ├── edit/           # Edit listing form (mirrors create page).
│   │   ├── favorites/      # User's saved watchlist.
│   │   ├── home/           # Landing page with hero section and featured cars.
│   │   ├── login/          # Auth logic (Login / Register).
│   │   └── profile/        # User dashboard, avatar upload, and "My Listings".
│   ├── services/           # Data layer for communicating with external APIs.
│   │   ├── adminService.js # Admin-specific Supabase queries.
│   │   ├── aiService.js    # Centralized AI API logic (caching, deduplication, rate limits).
│   │   ├── authService.js  # Supabase authentication wrapper.
│   │   ├── listingService.js # CRUD operations for listings and favorites.
│   │   ├── profileService.js # User profile and metadata operations.
│   │   └── storageService.js # Supabase Storage wrapper for image uploads.
│   ├── styles/             # Global CSS stylesheets (index.css contains the design system).
│   ├── utils/              # Helper functions.
│   │   ├── animations.js   # IntersectionObserver for scroll animations.
│   │   ├── authState.js    # Global state manager for current user and admin checks.
│   │   ├── modalService.js # Reusable Bootstrap modal generator (Confirmations).
│   │   ├── router.js       # Hash-based SPA routing engine.
│   │   └── toastService.js # Reusable toast notification generator.
│   └── main.js             # Application entry point; initializes router and global state.
├── index.html              # The single HTML shell for the SPA.
├── package.json            # Project metadata and npm scripts.
└── README.md               # You are here!
\`\`\`