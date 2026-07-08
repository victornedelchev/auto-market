# AutoMarket AI - Copilot Instructions

## Technologies
- HTML, CSS, Bootstrap 5
- Vanilla JavaScript (ES Modules, NO React/Vue/TypeScript)
- Vite
- Backend: Supabase (Auth, Database, Storage)

## Architecture
- Client-server architecture
- Multi-page application structure
- Clean modular architecture

## Rules
- **No business logic in UI components**. Keep components focused purely on presentation.
- Use Supabase SDK for all backend interactions. Keep all Supabase interaction inside the `src/services/` directory.
- Maintain responsive design via Bootstrap 5 and custom CSS.
- Ensure ES Modules are utilized properly. No bundling logic needed manually; rely on Vite.
- Always implement clean modular architecture ready for future development.
