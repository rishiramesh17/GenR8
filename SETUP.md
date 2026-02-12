# Setup Instructions

## What Was Changed

Your project has been successfully converted from using base44 backend to run locally on your Mac. Here's what was done:

### 1. **Created Local API Client**
   - Replaced base44 client with a local client (`src/api/localClient.js`)
   - All data now stored in browser localStorage
   - Maintains the same API interface, so no code changes were needed in your components

### 2. **Set Up React + Vite Project**
   - Created `package.json` with all necessary dependencies
   - Configured Vite as the build tool
   - Set up Tailwind CSS for styling
   - Created routing with React Router

### 3. **Organized Project Structure**
   - Moved all files to `src/` directory
   - Created proper directory structure
   - Set up path aliases (`@/` points to `src/`)

### 4. **Image Generation**
   - Currently uses placeholder images from picsum.photos
   - You can replace this with any image generation API (see README.md)

## Installation Steps

1. **Install Node.js** (if not already installed):
   ```bash
   # Check if Node.js is installed
   node --version
   
   # If not installed, download from https://nodejs.org/
   # Or use Homebrew:
   brew install node
   ```

2. **Install Dependencies**:
   ```bash
   cd /Users/seyyon/Desktop/projects/Genr8
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   - The terminal will show a URL (usually `http://localhost:5173`)
   - Open that URL in your browser

## What You Need to Install

### Required (if not already installed):
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### That's it! Everything else will be installed via `npm install`

## Features That Work Locally

✅ User authentication (default user created automatically)
✅ Credit system (starts with 1000 credits)
✅ Project creation and management
✅ Asset generation and storage
✅ Favorites and filtering
✅ Export functionality

## Data Storage

All data is stored in your browser's localStorage:
- Projects: `genr8_projects`
- Assets: `genr8_assets`
- Users: `genr8_users`

**Note:** Clearing browser data will delete all your projects and assets.

## Next Steps

1. Run `npm install` to install dependencies
2. Run `npm run dev` to start the app
3. (Optional) Replace placeholder images with real image generation API

## Troubleshooting

### Port Already in Use
If port 5173 is busy, Vite will automatically use the next available port.

### Module Not Found Errors
Run `npm install` again to ensure all dependencies are installed.

### localStorage Errors
Check your browser's localStorage quota. The app uses localStorage to store all data.

## Replacing Image Generation

To use real image generation instead of placeholders, edit `src/api/localClient.js` and replace the `generateImage` function with your API call. See README.md for examples.

