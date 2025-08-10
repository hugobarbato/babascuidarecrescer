# Overview

This project is a responsive website for "Cuidar & Crescer," a Brazilian childcare service company. The application serves as a business website that presents childcare services, generates instant quotes, and captures leads through contact forms. Built as a full-stack web application, it features a React frontend with a modern UI using shadcn/ui components and an Express.js backend for handling quote calculations and email communications.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using **React 18** with **TypeScript** and follows a component-based architecture:

- **UI Framework**: Uses shadcn/ui components with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom CSS variables for brand colors (coral, sage, soft-blue, etc.)
- **State Management**: React Query (TanStack Query) for server state and React hooks for local state
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture

The backend uses **Express.js** with TypeScript in a REST API pattern:

- **API Design**: RESTful endpoints for quote processing and contact form submissions
- **Validation**: Zod schemas for request validation shared between frontend and backend
- **Quote Calculation**: Client-side calculation with server-side email processing
- **Error Handling**: Centralized error handling middleware
- **Development**: Hot reload with Vite integration for seamless development

## Data Storage Solutions

The application currently uses **in-memory storage** for development:

- **Quote Data**: Not persisted (calculated on-demand and emailed)
- **Contact Forms**: Processed and emailed without database storage
- **Session Management**: Basic in-memory user storage implementation
- **Database Ready**: Drizzle ORM configured for PostgreSQL when needed

## Key Design Patterns

- **Shared Schema**: Common TypeScript types and Zod validation schemas between frontend and backend
- **Quote Calculator**: Pure functions for pricing calculations based on service type, hours, and additional factors
- **Modal-Based UX**: Quote requests and results displayed in modal dialogs
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints
- **Component Composition**: Reusable UI components with consistent styling

## Business Logic

The application implements complex pricing rules for different childcare services:

- **Hourly Services**: Different rates for weekdays vs weekends, with first-hour premiums
- **Specialized Services**: Premium pricing for development-focused care
- **Travel Services**: Daily rates with per-child additions
- **Night Services**: Fixed pricing for evening care
- **Monthly Plans**: Custom quote generation for recurring services

# External Dependencies

## Core Framework Dependencies

- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight client-side routing
- **react-hook-form**: Form state management and validation
- **@hookform/resolvers**: Integration between React Hook Form and Zod

## UI and Styling

- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant styling
- **cmdk**: Command palette component

## Validation and Type Safety

- **zod**: Runtime type validation and schema definition
- **drizzle-zod**: Integration between Drizzle ORM and Zod schemas
- **typescript**: Static type checking

## Database and ORM

- **drizzle-orm**: Type-safe SQL ORM
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-kit**: Database migration and introspection tools

## Development Tools

- **vite**: Fast build tool and development server
- **@replit/vite-plugin-runtime-error-modal**: Error overlay for development
- **@replit/vite-plugin-cartographer**: Replit-specific development enhancements

## Utility Libraries

- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utility
- **nanoid**: Unique ID generation
- **embla-carousel-react**: Carousel component for testimonials/gallery

## Font and Icon Integration

- **Google Fonts**: Inter font family for typography
- **Font Awesome**: Icon library for UI elements