# Biovance Site

A modern React application for Biovance's AI × Nature × Discovery platform, built with Vite, Tailwind CSS, and Supabase.

## God-Mode Features

- 🧬 **Admin Dashboard**: Complete content management with system monitoring
- 📧 **Email Campaigns**: Automated blog post newsletters
- 👥 **Waitlist Management**: Real-time subscriber tracking with persistent state
- 🖼️ **Media Gallery**: Cloud storage with Supabase and automatic error recovery
- 📊 **Analytics**: Real-time stats and insights
- 🛡️ **Zero-Error Database**: Enterprise-grade resilience with silent auto-recovery
- 💾 **Persistent State**: Admin panel remembers filters and pagination
- 🔄 **Self-Healing Schema**: Automatic table/RPC creation and schema synchronization
- 📈 **Schema Versioning**: Automatic migrations and version tracking
- 🔐 **Auto-Policy Management**: RLS verification and policy auto-creation
- 📋 **Internal Observability**: Silent metric tracking without external dependencies
- 🎛️ **System Status Dashboard**: Real-time validation and sync monitoring
- 📊 **Recovery Visualization**: Animated progress bars and stage indicators during system recovery
- ⚡ **Instant API Cache Sync**: Automatic Supabase REST API schema cache refresh after changes


## God-Mode Enterprise Supabase Integration

This project features a **god-mode, self-healing Supabase integration** with enterprise-grade resilience, schema versioning, and internal observability.

### Zero-Error Operations

**Console Output Philosophy:**
- ✅ **Silent recoveries** - Expected operations (table creation, RPC setup) produce no console noise
- ✅ **Filtered logging** - Only true unexpected errors are logged
- ✅ **Clean monitoring** - Production-ready console output

### Advanced Features

#### 1. Schema Versioning & Migrations
- **Version tracking** in `_meta` table
- **Automatic migrations** when schema changes
- **Future-proof** - Easy to add new schema versions

#### 2. Auto-Policy Management
- **RLS verification** on startup
- **Policy auto-creation** for authenticated users
- **Security enforcement** without manual intervention

#### 3. Silent Metric Tracking
- **Internal `_logs` table** for observability
- **Event tracking**: `table_created`, `schema_upgraded`, `migration_applied`
- **Performance metrics** without external dependencies

#### 4. Web Dashboard Monitoring
- **System status widget** in admin panel
- **Real-time validation**: Schema validated ✅, Cache synced ✅
- **Last sync timestamps** for monitoring

### Lightweight Health Checks

**No `information_schema` dependencies:**
- Uses fast `.select('count').limit(1)` queries
- Works with restricted database permissions
- Instant response times

### Automatic Lifecycle

1. **Schema Version Check** → Run migrations if needed
2. **Table Auto-Creation** → Silent background setup
3. **Policy Verification** → Security enforcement
4. **Cache Synchronization** → Immediate availability
5. **Metric Logging** → Internal observability

### Database Initialization

God-mode initialization with full telemetry:

```bash
npm run db:init  # Includes all advanced features
```

**Initialization Sequence:**
- `_meta` table creation (schema versioning)
- Version check & migrations
- All required tables + `_logs` table
- RLS policy verification
- Schema cache refresh
- Telemetry logging

### Production Monitoring Dashboard

The admin panel now includes a **System Status** widget showing:

```
✅ Schema validated
✅ Cache synced
🕒 Last sync: 2025-11-12 14:32:15
```

### Enterprise Observability

**Internal Metrics Tracked:**
- Table creation events
- Schema upgrades
- Migration applications
- Database initialization
- Error recoveries

The system includes a dedicated `refresh_supabase()` RPC function that forces Supabase to refresh its REST API schema cache instantly.

**Automatic Triggers:**
- ✅ **After every schema change** (table creation, RPC setup, policy creation)
- ✅ **On app startup** to ensure cache consistency
- ✅ **Manual refresh** via admin dashboard "⚡ Sync API Cache" button

**Benefits:**
- ✅ **Immediate availability** of new tables/RPCs
- ✅ **No manual cache refreshes** required
- ✅ **Prevents 404 errors** after schema changes
- ✅ **Production-safe** with automatic fallback



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

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Supabase (Database, Auth, Storage) with zero-error resilience
- **Email**: Resend API
- **Deployment**: Cloudflare Pages with Functions
- **State Management**: React Hooks with localStorage persistence
- **Real-time**: Supabase subscriptions with automatic reconnection
- **Database**: PostgreSQL with self-healing schema and RPC management
- **Error Handling**: Silent auto-recovery with filtered logging
- **Resilience**: Lightweight health checks and automatic table creation
