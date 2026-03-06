# 🚀 GiveSpark - AI-Powered Crowdfunding Platform

**Empowering Creators & Backers Through Intelligent Fundraising**

GiveSpark is a production-grade, full-stack crowdfunding platform that combines modern web technologies with AI-driven storytelling to help creators launch compelling campaigns and backers discover impactful projects. Built with a focus on performance, security, and user experience.

---

## ✨ Core Features

###  AI-Powered Campaign Story Generation
- **OpenRouter AI Integration:** Leverages state-of-the-art LLM (Meta Llama 3.2) to auto-generate emotionally-compelling, persuasive campaign narratives
- **Smart Prompt Engineering:** Custom system prompts optimize for engagement metrics (urgency, emotional hooks, CTAs)
- **Fallback Handling:** 60-second timeout with graceful error recovery for production reliability
- **Content Guardrails:** Structured output validation and sanitization to prevent injection attacks

###  Enterprise-Grade Payment System
- **Stripe API Integration:** Complete payment workflow with PaymentIntent verification
- **Security-First Architecture:** Server-side amount verification prevents client-side manipulation
- **Atomic Transactions:** Prisma transactional operations ensure data consistency across Donation, Campaign, and Wallet updates
- **Creator Wallet System:** Virtual wallet with deposit/withdrawal tracking and transaction history
- **Real-Time Payment Confirmation:** Instant donation confirmation with webhook-ready foundation

###  Advanced Authentication & Authorization
- **NextAuth.js v4:** Multi-provider support (Credentials + OAuth extensible)
- **JWT Session Strategy:** Stateless authentication with custom claims (role, id, image, stripeAccountId)
- **Password Security:** bcryptjs hashing with salt rounds (10) for credential users
- **Role-Based Access Control (RBAC):** USER and CREATOR roles with specialized endpoint guards
- **Type-Safe Session Extension:** Augmented NextAuth types via TypeScript declaration merging

###  Multi-Role Dashboard Architecture
- **Creator Dashboard:** Campaign management, analytics, wallet balance, transaction history
- **Backer Dashboard:** Contribution tracking, impact metrics, testimonial management
- **Protected Routes:** Role-based route protection at both API and component levels
- **Server-Side Session Verification:** Secure authorization checks on sensitive endpoints

###  Modern, Performant UX
- **Dark-Premium Aesthetic:** Glassmorphism effects with Tailwind CSS v4 and custom gradients
- **Responsive Design:** Mobile-first approach with Tailwind's responsive breakpoints
- **Icon System:** Lucide React for optimized, tree-shakeable SVG icons
- **Real-Time UI Updates:** React state management for instant feedback loops
- **Accessibility First:** ARIA labels and keyboard navigation support

---

##  Comprehensive Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend Framework** | Next.js 16.0.7 (App Router, Server Components) |
| **Language** | TypeScript 5+ (strict mode enabled) |
| **Styling & Design** | Tailwind CSS 4, PostCSS, Lucide React Icons |
| **State & Fetching** | Next.js Server Components, react-hooks (useSession, useRouter) |
| **Database** | PostgreSQL (Neon) with Prisma ORM v6 |
| **Authentication** | NextAuth.js 4.24.13 with PrismaAdapter |
| **Security** | bcryptjs for password hashing |
| **AI/LLM** | Meta Llama 3.2 via OpenRouter API |
| **Payments** | Stripe (API v20.0.0, React integration) |
| **File Storage** | Vercel Blob Storage (remote images whitelisted) |
| **Date Handling** | date-fns 4.1.0 |
| **CI/CD & Deployment** | Vercel (serverless functions, edge logic) |
| **Code Quality** | ESLint 9, TypeScript compiler with strict checks |
| **HTTP** | Next.js built-in fetch with custom headers (CORS-aware) |

---

##  Software Architecture & Design Patterns

### 1. **Next.js App Router Architecture**
```
app/
├── page.tsx                     # Home/landing page (SSG)
├── layout.tsx                   # Root layout (global providers)
├── api/                         # API Route Handlers (Route Handlers)
│   ├── auth/                    # Authentication endpoints
│   ├── campaign/                # Campaign CRUD operations
│   ├── donation/                # Payment intent & confirmation
│   ├── ai/                      # LLM integration endpoints
│   ├── wallet/                  # Financial endpoints
│   ├── upload/                  # File upload handlers
│   └── stats/                   # Aggregation queries
└── dashboard/                   # Protected dashboard routes
```
- **Server Components by Default:** Reduces JavaScript bundle size
- **API Routes as Microservices:** Each domain (campaign, donation, wallet) isolated
- **Serverless Deployment:** Functions scale independently on Vercel

### 2. **Authentication Pattern (NextAuth.js)**
- **Adapter Pattern:** PrismaAdapter automates session/account storage
- **JWT Encoding:** Custom claims extended via callbacks (jwt, session)
- **Credential + OAuth:** Supports traditional auth + social provider extensibility
- **Type Safety:** Declaration merging in `next-auth.d.ts` for TypeScript completion

### 3. **Data Integrity Pattern (Prisma Transactions)**
```typescript
await prisma.$transaction([
  prisma.donation.create({ ... }),        // Create donation record
  prisma.campaign.update({ ... }),        // Increment campaign amount
  prisma.wallet.update({ ... })           // Update creator wallet & transactions
])
```
- **ACID Compliance:** All-or-nothing database writes
- **Prevents Race Conditions:** Donation + wallet credit atomicity

### 4. **Security Patterns**
- **Server-Side Validation:** Amount verification from Stripe (not client input)
- **Stripe PaymentIntent Verification:** Confirms payment succeeded before DB commit
- **Environment Variable Isolation:** Secrets never exposed in client JavaScript
- **Role-Based Endpoint Guards:** `session?.user?.role === 'CREATOR'` checks before logic
- **Input Sanitization:** Request validation on all POST/PUT endpoints

### 5. **Error Handling & Logging**
- **Try-Catch Boundaries:** Each API route wrapped with error handlers
- **Structured Logging:** `console.error()` with context before generic error response
- **HTTP Status Codes:** Proper status codes (400, 403, 404, 409, 500)
- **User-Friendly Messages:** Generic errors to clients, detailed logs to server

### 6. **Component Architecture**
- **"use client" Boundary:** Interactive components marked for hydration
- **Server/Client Split:** Data fetching on server, interactivity on client
- **React Hooks:** useState, useCallback, useEffect for local state
- **Session Provider Wrapper:** Centralized NextAuth session context

---

##  Database Schema & Relationships

### Entity-Relationship Diagram (Logical)
```
User (id, email, password, role: CREATOR|USER, stripeAccountId?)
├── 1:N → Campaign (creator relationship)
├── 1:N → Donation (as donor)
├── 1:N → Testimonial (author relationship)
├── 1:1 → Wallet (creator only)
└── 1:N → Account, Session (NextAuth adapter)

Campaign (id, title, description, goalAmount, currentAmount, deadline, category)
└── 1:N → Donation

Donation (id, amount, message, anonymous, stripePaymentIntentId)
├── N:1 → Campaign
└── N:1 → User (donor)

Wallet (userId, balance, totalReceived, withdrawnAmount)
└── 1:N → WalletTransaction

WalletTransaction (id, amount, type: DEPOSIT|WITHDRAW, sourceId, sourceType)
└── N:1 → Wallet

Testimonial (id, content, rating 1-5, authorId)
└── N:1 → User
```

### Advanced Schema Features
- **Cascading Deletes:** `onDelete: Cascade` on foreign keys prevents orphan records
- **Unique Constraints:** `@unique` on email, stripePaymentIntentId for idempotency
- **Composite Keys:** Provider + account ID uniqueness for OAuth accounts
- **Enum Types:** `Role`, `Category`, `TransactionType` for type-safe enums
- **DateTime Defaults:** `createdAt`, `updatedAt`, `expires` for audit trails

### Database Migrations
- **Version Control:** Prisma migrations tracked in `prisma/migrations/`
- **Migration History:** 6+ migrations including auth adapter setup, Stripe fields, testimonials
- **Schema Evolution:** Safe forward/backward compatibility with shadow database

---

##  Security & Best Practices Implementation

### Authentication Security
```typescript
// Password hashing with salt rounds
const hashedPassword = await bcrypt.hash(password, 10);
await bcrypt.compare(credentials.password, user.password);
```

### Payment Security
```typescript
// Server-side amount verification (CRITICAL)
const paymentIntent = await stripe.paymentIntents.retrieve(intentId);
const verifiedAmount = paymentIntent.amount / 100; // Use Stripe's verified amount
```

### Authorization Checks
```typescript
// Role-based endpoint guards
if (session.user.role !== 'CREATOR') {
  return NextResponse.json({ error: "Access denied. Creator role required." }, { status: 403 });
}
```

### Data Isolation
- Anonymous donations supported (donorId can be null)
- Creator cannot donate to own campaigns (business rule)
- User data never exposed in client responses (email hidden)

### Environment Safety
- All API keys in `.env.local` (never committed)
- `STRIPE_SECRET_KEY` server-only
- `NEXT_PUBLIC_STRIPE_PK` safe for client
- `OPENROUTER_API_KEY` server-only

---

##  API Endpoints & Features

### Authentication Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | User registration (hash password, create wallet if CREATOR) |
| POST | `/api/auth/[...nextauth]` | NextAuth handler (sign-in, callbacks, JWT) |
| GET | `/api/user/update` | Fetch current user session |

### Campaign Management
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/campaign/featured` | Fetch 6 most recent campaigns (optimized select) |
| GET | `/api/campaign/list` | Fetch all campaigns with category filtering |
| GET | `/api/campaign/my` | Fetch authenticated creator's campaigns |
| POST | `/api/campaign/create` | Create new campaign (creator-only) |

### Payment Processing
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/donation/create-intent` | Create Stripe PaymentIntent (amount validation, fee calculation)  |
| POST | `/api/donation/confirm-payment` | Confirm payment + atomic DB transaction (donation, campaign, wallet update)  |

### AI Story Generation
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/ai/generate-story` | Generate campaign story via OpenRouter LLM |

### Creator Finance
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/wallet/balance` | Fetch wallet (balance, totalReceived, transactions) |
| POST | `/api/wallet/withdraw` | Initiate withdrawal to Stripe Connect account |

### Platform Analytics
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/stats` | Fetch platform metrics (campaigns, funds, backers) - aggregation query |

### File Upload
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/upload/image` | Upload image to Vercel Blob (5MB limit, content-type validation) |

### Community
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/testimonials` | Submit campaign testimonial with rating |
| GET | `/api/testimonials` | Fetch testimonials (public) |

---

##  Component Architecture

### Layout Components
- **`navbar.tsx`:** Responsive navigation with session-aware auth buttons
- **`SessionProviderWrapper.tsx`:** NextAuth context provider wrapper
- **`ThemeProvider.tsx`:** Dark mode theme persistence

### Feature Components
- **`FeaturedCampaigns.tsx`:** Campaign showcase grid with filtering
- **`CampaignCard.tsx`:** Reusable campaign card component with progress bar
- **`DonationModal.tsx`:** Stripe Elements payment form with error handling
- **`CampaignStoryAI.tsx`:** AI story generator with loading states
- **`LeaveTestimonial.tsx`:** Rating + text submission form
- **`TestimonialsSection.tsx`:** Testimonials carousel/grid

### Dashboard Components
- **`DashboardClient.tsx`:** Creator dashboard with analytics
- **`Sidebar.tsx`:** Navigation drawer for protected routes
- **`settings.tsx`:** User profile & preference management

### UI Utilities
- **`ui/button.tsx`:** Reusable button component with variants

---

##  Advanced Techniques Showcase

### 1. **Type-Safe Environment Variables**
```typescript
// next.config.ts uses process.env.NEXT_PUBLIC_* exclusively on client
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK as string);
```

### 2. **API Route Error Handling**
```typescript
try {
  // Business logic
} catch (error) {
  console.error("Stripe Intent Creation Error:", error);
  return NextResponse.json({ error: "Failed to create payment intent." }, { status: 500 });
}
```

### 3. **Prisma Aggregation Queries (Stats)**
```typescript
const aggregateFunds = await prisma.campaign.aggregate({
  _sum: { currentAmount: true },
});
```

### 4. **NextAuth Custom Callbacks**
```typescript
async jwt({ token, user, trigger, session }) {
  if (trigger === "update" && session) {
    token.name = session.name; // JWT update on session refresh
  }
  if (user) {
    token.role = user.role;
    token.id = user.id;
  }
  return token;
}
```

### 5. **Atomic Transactions for Data Consistency**
```typescript
const [donation, updatedCampaign, updatedWallet] = await prisma.$transaction([
  // All succeed or all fail
]);
```

### 6. **LLM Integration with Timeout & Error Recovery**
```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 60000);
// Fetch with abort controller for production reliability
```

### 7. **Image Optimization via Remote Patterns**
```typescript
// next.config.ts: Vercel Blob storage whitelisted for Next.js Image component
remotePatterns: [
  { protocol: 'https', hostname: '**.public.blob.vercel-storage.com', pathname: '/**' }
]
```

### 8. **Role-Based Route Protection**
```typescript
// Client-side redirects
if (session?.user?.role !== 'CREATOR') {
  router.push('/dashboard/user');
}

// Server-side API guards
if (session.user.role !== 'CREATOR') {
  return NextResponse.json({ error: "Access denied" }, { status: 403 });
}
```

### 9. **Password Hashing Best Practices**
```typescript
const hashedPassword = await bcrypt.hash(password, 10);  // Salt rounds = 10
const isValid = await bcrypt.compare(credentials.password, user.password);
```

### 10. **Stripe Payment Verification (Security)**
```typescript
// NEVER trust client amount; verify with Stripe's source of truth
const paymentIntent = await stripe.paymentIntents.retrieve(intentId);
if (paymentIntent.status !== 'succeeded') {
  return NextResponse.json({ error: "Payment not succeeded" }, { status: 400 });
}
const verifiedAmount = paymentIntent.amount / 100; // Use verified amount
```

---

##  Getting Started

### Prerequisites
- Node.js 18+ & npm/yarn
- PostgreSQL database (Neon recommended)
- Stripe account (free tier OK)
- OpenRouter API key (for AI features)
- Vercel account (optional, for deployment)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd givespark
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create `.env.local`:
```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/givespark

# NextAuth
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=http://localhost:3000

# Authentication (Optional OAuth)
GOOGLE_CLIENT_ID=<your-google-oauth-id>
GOOGLE_CLIENT_SECRET=<your-google-oauth-secret>

# Payment Processing
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PK=pk_test_...

# AI Story Generation
OPENROUTER_API_KEY=<your-openrouter-api-key>

# File Storage
BLOB_READ_WRITE_TOKEN=<vercel-blob-token>
```

4. **Setup database**
```bash
npx prisma migrate deploy
npx prisma generate
```

5. **Run development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm start
```

---

##  Development Workflow

### Code Organization
- **API Routes:** Function-based handlers with Route Handlers pattern
- **Components:** React functional components with hooks
- **Database:** Prisma Client for type-safe queries
- **Type Safety:** TypeScript strict mode enabled
- **Linting:** ESLint with Next.js config

### Best Practices Implemented
✅ **Server Components First:** Reduces JS bundle  
✅ **Environment Variables:** Secrets in `.env.local`  
✅ **Error Boundaries:** Try-catch on all async operations  
✅ **Input Validation:** Schema validation on POST/PUT  
✅ **Atomic Operations:** Transactions for multi-step writes  
✅ **Role-Based Access:** Both API & client-side guards  
✅ **Logging:** Structured error logs for debugging  
✅ **Type Safety:** Full TypeScript coverage  
✅ **Performance:** Image optimization, lazy loading  
✅ **Security:** No secrets in client JS, HTTPS-only  

---

##  Key Learnings 

1. **Full-Stack TypeScript:** End-to-end type safety from database to UI
2. **Microservice Architecture:** API routes as domain-driven endpoints
3. **Payment Integration:** Complex Stripe workflows with security best practices
4. **AI/LLM Integration:** Prompt engineering, timeouts, error recovery
5. **Database Design:** Relational schema with Prisma, migrations, transactions
6. **Authentication:** NextAuth.js with custom callbacks and role-based authorization
7. **Security:** Password hashing, server-side validation, environment isolation
8. **Performance:** Server Components, image optimization, query optimization
9. **Scalability:** Serverless architecture on Vercel, database indexes for queries
10. **DevOps:** CI/CD with Vercel, git-based deployments

---



---

