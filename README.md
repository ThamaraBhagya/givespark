This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# ⚡ GiveSpark

**Empowering Visions with AI-Driven Crowdfunding**

GiveSpark is a high-performance, full-stack crowdfunding platform designed to bridge the gap between ambitious creators and passionate backers. Built with a modern tech stack and a "dark-premium" aesthetic, it features an industry-first **AI Story Assistant** that helps creators overcome "blank page syndrome" by generating compelling, emotional campaign narratives in seconds.

---

## 🚀 Key Features

### 🧠 AI-Powered Campaign Creation
* **Spark AI Assistant:** Integrated with **Mistral-7B** (via Hugging Face/OpenRouter) to auto-generate structured, persuasive campaign stories based on a project's title and elevator pitch.
* **Narrative Optimization:** The AI is fine-tuned to focus on emotional hooks, problem-solution frameworks, and clear calls to action.

### 💳 Seamless Financial Ecosystem
* **Secure Payments:** Fully integrated with **Stripe** for real-time processing of donations.
* **Live Progress Tracking:** Dynamic progress bars and "Amount Raised" metrics update instantly upon successful payment.

### 👤 Role-Based Dashboards
* **Creator Dashboard:** A specialized interface for managing campaigns, tracking analytics, and viewing donor history.
* **User/Impact Dashboard:** A premium, dark-themed interface where users track total contributions, active "sparks," and personal impact metrics.

### 🎨 Premium User Experience
* **Modern UI/UX:** Built with **Tailwind CSS**, featuring glassmorphism, responsive navigation, and "dark-premium" decorative glows.
* **Real-time Auth:** Secure authentication using **NextAuth.js** with Google OAuth and specialized role-based redirection.

---

## 🛠️ Technical Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 15+ (App Router) |
| **Language** | TypeScript |
| **Database & ORM** | PostgreSQL (Neon) & Prisma |
| **Authentication** | NextAuth.js (Google Provider) |
| **AI / ML** | Mistral-7B-Instruct (OpenRouter) |
| **Payments** | Stripe API |
| **Styling** | Tailwind CSS & Lucide Icons |
| **File Storage** | Vercel Blob |
| **Deployment** | Vercel (CI/CD) |

---

## 🏗️ Project Structure & Database



The project uses a relational database model to ensure data integrity:
* **Users:** Supports `USER` and `CREATOR` roles.
* **Campaigns:** Stores project details, funding goals, and AI-generated stories.
* **Donations:** Tracks every transaction, linking donors to their chosen causes.

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
