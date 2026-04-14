# Vice Vault (GTA 6 Fan Companion PWA)

A premium, mobile-first web application for GTA 6 fans, featuring an interactive map, social feed aggregator, and community hype tools.

## 🚀 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Icons**: Lucide React
- **Backend**: Supabase (Auth, PostgreSQL, Realtime, Edge Functions)
- **Map**: Leaflet + react-leaflet
- **State**: Zustand
- **PWA**: Serwist (Service Workers & Offline Caching)

## 🛠️ Setup Instructions

### 1. Supabase Configuration
1. Create a new project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** and paste the contents of `supabase/migrations/20240410_init.sql`.
3. **Enable Realtime**: Run the following SQL in the dashboard:
   ```sql
   -- This allows the 'user_pins' table to broadcast changes to the frontend
   ALTER PUBLICATION supabase_realtime ADD TABLE user_pins;
   ```
4. **Deploy the Edge Function**:
   - Install the Supabase CLI: `npm install supabase --save-dev`
   - Login: `npx supabase login`
   - Link project: `npx supabase link --project-ref <your-project-ref>`
   - *Note*: Your **Project Reference** is the unique ID in your Supabase project URL (e.g., `abcde-fghij-klmno`). You can find it in your Project Settings > General.
   - Deploy: 
     ```bash
     npx supabase functions deploy x-proxy --no-verify-jwt
     ```
   - *Note*: Use `--no-verify-jwt` if you want the feed to be publicly accessible, or remove it to require a valid Supabase Auth token.
5. **Set Secrets**:
   ```bash
   npx supabase secrets set X_BEARER_TOKEN=your_token_here
   ```

### 2. Environment Variables
Create a `.env.local` file based on `.env.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
X_BEARER_TOKEN=your_token_for_local_testing
```

### 3. Local Development
```bash
npm install
npm run dev
```

### 4. PWA Features
To test PWA features locally, you should run a production build:
```bash
npm run build
npm run start
```

## 🗺️ Interactive Map
The map uses a fallback OpenStreetMap layer with a custom "Vice City" CSS filter. To add a custom community map (like YANIS V12):
1. Update `components/map/MapContainer.tsx`.
2. Replace the `TileLayer` URL with the specific tile server URL.

## 📱 PWA Support
- Offline caching for social feed and map assets.
- Installable on iOS (via Share sheet) and Android (via prompt).
- Theme color: `#ff00ff` (Neon Pink).

## 📄 License
Fan-made project. All GTA assets belong to Rockstar Games.
