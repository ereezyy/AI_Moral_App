# Troubleshooting Guide

## Current Issue: Import Resolution Error

### Error Message
```
Failed to resolve import "@google/generative-ai" from "src/lib/services/gemini.service.ts"
```

### Root Cause
The dev server was started before the AI packages were added to package.json. The packages exist in the project but the dev server's cache needs to be refreshed.

### ✅ Confirmed Working
- ✅ Build passes successfully (`npm run build`)
- ✅ TypeScript compilation clean
- ✅ All packages in package.json and package-lock.json
- ✅ All packages installed in node_modules

### Solutions (Try in Order)

#### Solution 1: Let Auto-Install Complete
The system should automatically install packages and restart the dev server. Wait 30-60 seconds for this to complete.

#### Solution 2: Manual Restart
If you have access to restart the dev server:
```bash
# Stop the dev server (if running)
# Then:
npm install
npm run dev
```

#### Solution 3: Force Refresh
```bash
npm install --force
# Wait for HMR to reload
```

#### Solution 4: Clear Vite Cache
```bash
rm -rf node_modules/.vite
npm install
```

#### Solution 5: Clean Install
```bash
rm -rf node_modules package-lock.json
npm install
```

### Verification

After applying a solution, verify packages are installed:

```bash
# Check all AI packages
npm list @google/generative-ai @supabase/supabase-js @mediapipe/tasks-vision openai

# All should show:
# ├─ @google/generative-ai@0.21.0
# ├─ @supabase/supabase-js@2.45.7
# ├─ @mediapipe/tasks-vision@0.10.21
# └─ openai@4.104.0
```

### Build vs Dev Server

**Important:** This is a dev server issue only. The production build works perfectly:

```bash
npm run build  # ✅ Works perfectly
npm run preview # Test production build
```

If you need to use the app immediately, use the production build.

## Other Common Issues

### Issue: Microphone Not Working

**Solution:**
1. Check browser permissions
2. Use HTTPS or localhost (required for Web APIs)
3. Check browser console for permission errors

### Issue: Video Analysis Not Working

**Solution:**
1. Camera permissions required
2. Some browsers don't support Face Detection API
3. Falls back to basic analysis gracefully

### Issue: Gemini API Errors

**Solution:**
1. Verify `VITE_GEMINI_API_KEY` in `.env`
2. Check API key is valid and active
3. Ensure no rate limits exceeded

### Issue: Supabase Connection Errors

**Solution:**
1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
2. Check database tables exist (should auto-create)
3. Verify RLS policies are enabled

## Getting Help

If issues persist:

1. Check browser console for detailed errors
2. Run `npm run typecheck` to verify TypeScript
3. Run `npm run build` to verify production build
4. Review `AI_INTEGRATION_SUMMARY.md` for architecture details

## Performance Tips

If the app feels slow:

1. Disable video analysis if not needed (saves processing)
2. Use production build (`npm run build && npm run preview`)
3. Check network tab for slow API calls
4. Video analysis throttled to 100ms by default (configurable)

## Database Issues

If conversations aren't saving:

1. Check Supabase connection in browser console
2. Verify user is authenticated (or using anon key)
3. Check RLS policies: `SELECT * FROM conversations;`
4. Review migration status in Supabase dashboard

All database tables should exist:
- ✅ conversations
- ✅ messages
- ✅ moral_decisions
- ✅ user_profiles

Run this in Supabase SQL editor to verify:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```
