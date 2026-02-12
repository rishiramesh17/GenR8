# Environment Variable Setup

## Setting Up Your DeepAI API Key

1. **Create a `.env` file** in the root of your project (same directory as `package.json`)

2. **Add your API key**:
   ```
   VITE_DEEP_API_KEY=your_actual_api_key_here
   ```

3. **Important Notes**:
   - In Vite, environment variables must be prefixed with `VITE_` to be accessible in the browser
   - Never commit your `.env` file to git (it's already in `.gitignore`)
   - The `.env.example` file shows the format without your actual key

4. **Get your API key**:
   - Sign up at https://deepai.org/
   - Get your API key from your account dashboard
   - Free tier includes limited requests

5. **Restart your dev server** after creating/updating the `.env` file:
   ```bash
   npm run dev
   ```

## File Structure

```
Genr8/
├── .env              # Your actual API key (DO NOT COMMIT)
├── .env.example      # Template file (safe to commit)
└── ...
```

## Troubleshooting

- **"API key not configured" error**: Make sure your `.env` file exists and has `VITE_DEEP_API_KEY=your_key`
- **API errors**: Check that your API key is valid and you haven't exceeded rate limits
- **Not working after adding .env**: Restart your dev server (`npm run dev`)

