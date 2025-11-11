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
VITE_RESEND_API_KEY=your-resend-api-key
VITE_SUPABASE_WAITLIST_TABLE=waitlist
```

## API Testing

### Test Blog Email Endpoint

To test the blog email endpoint locally:

```bash
curl -X POST http://localhost:3001/api/sendBlogEmail \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Blog Post",
    "content": "<p>This is a test blog post content.</p>",
    "author": "Test Author",
    "featuredImage": "https://example.com/image.jpg",
    "subscriberEmails": ["test@example.com"]
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Email sent to 1 subscribers",
  "stats": {
    "successful": 1,
    "failed": 0,
    "total": 1
  }
}
```

## Developmen

```bash
npm install
npm run dev
```

## Deployment

This app is configured for Cloudflare Pages deployment with:
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables set in Cloudflare Pages dashboard

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **Email**: Resend API
- **Deployment**: Cloudflare Pages
- **State Management**: React Hooks
- **Real-time**: Supabase subscriptions
