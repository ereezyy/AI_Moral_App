# Setup Instructions - Fix Dev Server Error

## Issue
The dev server was started before the AI packages were added to package.json, causing import errors.

## Quick Fix (Choose One)

### Option 1: Restart Dev Server (Recommended)
The dev server should auto-restart and install packages. If it doesn't:

1. Stop the dev server (Ctrl+C if running manually)
2. Run: `npm install`
3. Start dev server again

### Option 2: Force Package Installation
If the dev server is managed by the system and can't be stopped:

```bash
npm install --force
```

Then wait for hot module reload to pick up the changes.

### Option 3: Clear Cache
If packages still don't load:

```bash
rm -rf node_modules/.vite
npm install
```

## Verify Installation

Check that these packages are installed:

```bash
npm list @google/generative-ai
npm list @supabase/supabase-js
npm list @mediapipe/tasks-vision
```

All should show version numbers without errors.

## What Was Installed

The following packages were added to enable real AI/ML functionality:

- `@google/generative-ai` - Gemini AI for conversations
- `@supabase/supabase-js` - Database integration
- `@mediapipe/tasks-vision` - Video analysis
- `openai` - Optional OpenAI integration

## Environment Variables

Make sure these are set in your `.env` file:

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## After Installation

The app will automatically:
1. Connect to Gemini AI for conversations
2. Use browser APIs for voice recognition
3. Store conversations in Supabase
4. Analyze sentiment in real-time
5. Build psychological profiles

## Testing

To verify everything works:

1. Open the app in your browser
2. Click the microphone button to enable voice chat
3. Say something and the AI should respond
4. Check the browser console for any errors

All functionality is now using real AI/ML APIs - no mock data!
