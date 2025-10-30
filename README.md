# TennisMeet

A modern platform for tennis players to find partners and schedule matches based on location and skill level.

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **Icons:** Lucide React
- **Form Management:** React Hook Form + Zod validation
- **State Management:** React Query (@tanstack/react-query)
- **Date Handling:** date-fns

### Backend
- **API:** Next.js API Routes
- **Database:** PostgreSQL
- **ORM:** Prisma (to be configured)
- **Authentication:** NextAuth.js (to be configured)

### Development Tools
- **Code Quality:** ESLint, TypeScript strict mode
- **Styling:** PostCSS, Autoprefixer
- **Package Manager:** npm

## Project Structure

```
TennisMeet/
├── app/                    # Next.js app router pages and layouts
├── components/            # Reusable React components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and helpers
├── services/             # API client services and data fetching
├── types/                # TypeScript type definitions
├── public/               # Static assets (images, fonts, etc.)
├── .env.local.example    # Environment variables template
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL 14.x or higher (for Phase 2)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd TennisMeet
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` with your actual values.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run type-check` - Run TypeScript type checking

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `development` - Integration branch for features
- `feature/*` - Feature branches (e.g., `feature/user-authentication`)
- `bugfix/*` - Bug fix branches

### Commit Guidelines

- Use clear, descriptive commit messages
- Follow conventional commits format when possible
- Keep commits atomic and focused

### Code Quality

This project enforces strict TypeScript settings:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `noUncheckedIndexedAccess: true`

Always run type-checking before committing:
```bash
npm run type-check
```

## Environment Variables

See `.env.local.example` for all required environment variables. Key variables include:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - Secret for NextAuth.js
- `NEXT_PUBLIC_APP_URL` - Public-facing app URL

## Team

- **Mark** - Project Manager & Tech Lead
- **David** - Full Stack Developer (Backend + Frontend Integration)
- **Bob** - Frontend Developer (UI Components)
- **Jamie** - QA Engineer (Testing)

## Development Phases

### Phase 1: Project Setup (Current)
- [x] GitHub repository initialization
- [x] Next.js 14 project setup with TypeScript
- [x] Tailwind CSS and shadcn/ui configuration
- [x] Directory structure creation
- [x] Core dependencies installation

### Phase 2: Database & Authentication (Coming Next)
- [ ] Prisma setup and database schema
- [ ] NextAuth.js configuration
- [ ] User authentication flow
- [ ] Database migrations

### Phase 3: Core Features
- [ ] User registration and profile management
- [ ] Match creation and listing
- [ ] Location-based search
- [ ] Skill level filtering

### Phase 4: Advanced Features
- [ ] Real-time notifications
- [ ] Match scheduling
- [ ] User ratings and reviews

## Contributing

1. Create a feature branch from `development`
2. Make your changes
3. Run tests and type-checking
4. Submit a pull request to `development`

## License

Private - All rights reserved

## Support

For questions or issues, contact the development team.
