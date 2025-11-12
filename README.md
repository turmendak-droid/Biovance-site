# Biovance Site

A modern React application for Biovance's AI × Nature × Discovery platform, built with Vite, Tailwind CSS, and Supabase.

## Features

- 🧬 **Admin Dashboard**: Complete content management system
- 📧 **Email Campaigns**: Automated blog post newsletters
- 👥 **Waitlist Management**: Real-time subscriber tracking
- 🖼️ **Media Gallery**: Cloud storage with Supabase
- 📊 **Analytics**: Real-time stats and insights

## Environment Variables

Create a `.env` file in the root directory with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
RESEND_API_KEY=your-resend-api-key
VITE_SUPABASE_WAITLIST_TABLE=waitlist
SITE_URL=https://biovance-site.pages.dev
```

## API Testing

### Test Blog Email Endpoint

To test the blog email endpoint locally (requires Wrangler dev server running):

```bash
curl -X POST http://localhost:8788/sendBlogEmail \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "🧬 Test Blog Post",
    "title": "Test Blog Post",
    "excerpt": "This is a test blog post excerpt...",
    "featuredImage": "https://example.com/image.jpg",
    "url": "https://biovance-site.pages.dev/updates"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Email sent successfully",
  "result": { ... }
}
```

### Local Development Setup

1. **Install Wrangler CLI** (for Cloudflare Functions):
   ```bash
   npm install -g wrangler
   ```

2. **Run local functions server** (Terminal 1):
   ```bash
   npm run functions:dev
   ```
   This runs: `wrangler pages dev . --port 8788`

3. **Run Vite dev server** (Terminal 2):
   ```bash
   npm run dev
   ```

4. **Test the API**:
   - Frontend calls: `fetch('/api/sendBlogEmail')` → proxied to `http://localhost:8788/sendBlogEmail`
   - Direct calls: `http://localhost:8788/sendBlogEmail`

### Production Deployment

The `functions/sendBlogEmail.js` is automatically deployed with Cloudflare Pages. No additional setup required.

## Development

```bash
npm install
npm run dev
```

## Deployment

This app is configured for Cloudflare Pages deployment with:
- Build command: `npm run build`
- Output directory: `dist`
- Functions directory: `functions/`
- Environment variables set in Cloudflare Pages dashboard:

### Required Environment Variables in Cloudflare Pages:
- `RESEND_API_KEY`: Your Resend API key (for email sending)
- `SITE_URL`: Your production domain (e.g., `https://biovance-site.pages.dev`)

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **Email**: Resend API
- **Deployment**: Cloudflare Pages
- **State Management**: React Hooks
- **Real-time**: Supabase subscriptions
