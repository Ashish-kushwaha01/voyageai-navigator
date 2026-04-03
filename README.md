# VoyageAI - AI-Powered Travel Discovery

Discover 10,000+ destinations with AI-powered insights and smart trip planning.

## Live Demo

🌐 **[https://voyageai-navigator.vercel.app/](https://voyageai-navigator.vercel.app/)**

## Features

- **Virtual Tours** - Explore places through immersive videos and street views
- **AI Travel Guide** - Get instant AI-powered insights about any destination
- **Smart Picks** - Personalized recommendations based on your preferences
- **Trip Planner** - Plan multi-day itineraries with premium tools
- **Bookmark System** - Save your favorite destinations for later
- **Travel History** - Track all the places you've explored
- **Credit System** - Manage usage with a built-in credit tracking system
- **Authentication** - Secure sign up and login with Supabase
- **Responsive Design** - Fully responsive across all devices

## Tech Stack

- **Frontend:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **Animations:** Framer Motion
- **Routing:** React Router v6
- **Authentication & Database:** Supabase
- **State Management:** TanStack Query (React Query)
- **Form Handling:** React Hook Form + Zod
- **Notifications:** Sonner (Toast)
- **Testing:** Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase project (for authentication and database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voyageai-navigator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory with the following variables:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run typecheck` | Run TypeScript type checking |

## Project Structure

```
voyageai-navigator/
├── public/              # Static assets (favicon, images)
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React context providers (Auth, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and API calls
│   ├── pages/           # Page components (Dashboard, Explore, etc.)
│   ├── App.tsx          # Main app component with routing
│   └── main.tsx         # Entry point
├── index.html           # HTML template
├── vercel.json          # Vercel deployment configuration
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies and scripts
```

## Deployment

This project is deployed on **Vercel**. The `vercel.json` configuration ensures that all routes are properly handled by React Router for client-side navigation.

### Deploying to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Vercel will automatically build and deploy your app

## License

This project is proprietary software. All rights reserved.
