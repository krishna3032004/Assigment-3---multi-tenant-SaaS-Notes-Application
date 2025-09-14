# SaaS Multi-Tenant Notes Application

This project is a complete **multi-tenant SaaS (Software as a Service) Notes Application** built with a modern tech stack including **Next.js, Prisma, and Tailwind CSS**. It provides a secure and isolated environment for multiple companies to manage their notes and users.

---

## 🚀 Features

- **Multi-Tenancy**: Securely serves multiple tenants with complete data isolation using a shared schema architecture.
- **Authentication**: Implemented using a secure, JWT-based login system.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Authorized to manage subscriptions.
  - **Member**: Can perform CRUD operations on notes.
- **Subscription Plans**:
  - **Free Plan**: Tenants are limited to a maximum of 3 notes.
  - **Pro Plan**: Tenants have no restrictions on the number of notes.
- **Modern Frontend**: A minimal and responsive UI built with **Next.js** and styled with **Tailwind CSS**, featuring loading states and smooth animations.

---

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/krishna3032004/Assigment-3---multi-tenant-SaaS-Notes-Application.git
cd saas-notes-ap
```
### 2. Install dependencies

```bash
npm install
```
### 3. Create a .env file


# Example for Supabase/PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# A long, random string for signing JWTs
JWT_SECRET="your-super-secret-and-random-key"

### 4. Set up the database


# Apply the schema to your database
npx prisma migrate dev

# Seed the database with test accounts
npm run db:seed

### 5. Run the development server

```bash
npm run dev
```



# All test accounts have password: password

Email: admin@acme.test     | Role: Admin   | Tenant: Acme
Email: user@acme.test      | Role: Member  | Tenant: Acme
Email: admin@globex.test   | Role: Admin   | Tenant: Globex
Email: user@globex.test    | Role: Member  | Tenant: Globex






This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
