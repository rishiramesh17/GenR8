# Genr8 - AI Asset Generator

A local React application for generating AI-powered logos, avatars, and visual assets. This project has been converted from using base44 backend to run entirely locally on your machine using localStorage for data persistence.

## Features

- 🎨 **Logo Generator** - Create professional brand logos with guided controls
- 👤 **Avatar Creator** - Design unique characters and avatars in various art styles
- 📁 **Project Management** - Organize your generated assets into projects
- 💾 **Local Storage** - All data is stored locally in your browser
- 🎯 **Credit System** - Track your generations with a credit system

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## Project Structure

```
Genr8/
├── src/
│   ├── api/
│   │   ├── localClient.js      # Local API client (replaces base44)
│   │   └── base44Client.js   # Compatibility layer
│   ├── Components/
│   │   ├── generators/         # Generator forms and galleries
│   │   └── ui/                 # UI components
│   ├── Pages/                  # Main page components
│   ├── Entities/               # Data schemas
│   ├── lib/                    # Utility functions
│   ├── utils/                  # Helper functions
│   ├── App.jsx                 # Main app component with routing
│   └── main.jsx                # Entry point
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## How It Works

### Local API Client

The project uses a local API client (`src/api/localClient.js`) that mimics the base44 interface but stores all data in localStorage. This includes:

- **User Management** - Default user with credits
- **Projects** - Stored locally in browser
- **Generated Assets** - All images and metadata saved locally
- **Image Generation** - Uses placeholder images (can be replaced with real API)

### Data Persistence

All data is stored in your browser's localStorage with the following keys:
- `genr8_users` - User data
- `genr8_projects` - Project data
- `genr8_assets` - Generated asset data

### Image Generation

Currently, the app uses placeholder images from `picsum.photos`. To use real image generation:

1. Replace the `generateImage` function in `src/api/localClient.js`
2. Integrate with your preferred image generation API (OpenAI DALL-E, Stability AI, etc.)

Example:
```javascript
const generateImage = async ({ prompt }) => {
  const response = await fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  const data = await response.json();
  return { url: data.imageUrl, id: generateId() };
};
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icons

## Notes

- All data is stored locally in your browser - clearing browser data will remove all projects and assets
- Image generation currently uses placeholder images - replace with your preferred API
- The app works entirely offline (except for placeholder images)
- Default user starts with 1000 credits

## Troubleshooting

### Port already in use
If port 5173 is in use, Vite will automatically use the next available port.

### localStorage errors
If you see storage errors, check your browser's localStorage quota (usually 5-10MB).

### Missing dependencies
Run `npm install` again to ensure all packages are installed.

## Pushing to GitHub (Security)

Before you push this repo to GitHub:

1. **Never commit secrets**  
   Your `.env` file is in `.gitignore` and will not be committed. Do not remove it from `.gitignore` or force-add it.

2. **Use `.env.example` for setup**  
   New clones should copy `.env.example` to `.env` and add their own API key. See `ENV_SETUP.md`.

3. **Quick check before first push**  
   Run: `git status` and ensure `.env` does **not** appear. If it does, run `git reset HEAD .env` and do not add it.

4. **If you ever committed `.env` by mistake**  
   Rotate your API key immediately in the provider dashboard (e.g. DeepAI), then remove the file from history (e.g. `git filter-branch` or BFG Repo-Cleaner) before pushing again.

## License

This project is for local development use.

