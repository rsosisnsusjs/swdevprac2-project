# BookYourBooth - Exhibition Booth Booking System

A modern, professional exhibition booth booking system built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Member Features
- User registration and authentication
- Browse and filter exhibitions
- View detailed exhibition information
- Multi-step booth booking process
- Manage personal bookings (view, edit, delete)
- Real-time booth availability

### Admin Features
- Complete exhibition management (create, read, update, delete)
- View all bookings with advanced filtering
- User management and role control
- Dashboard with statistics
- Booth quota management

### Design
- Modern minimal aesthetic with professional tech dashboard style
- Slate Navy primary color with Muted Teal accents
- Responsive mobile-first design
- Smooth animations and transitions
- Accessibility-first approach

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context API with custom hooks
- **Authentication**: Cookie-based with JWT tokens

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
# Update NEXT_PUBLIC_API_URL to your backend API
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Backend Setup

The frontend expects a backend API running at `http://localhost:5000/api/v1`. Update the `NEXT_PUBLIC_API_URL` environment variable if your backend is hosted elsewhere.

### Required API Endpoints

- **Authentication**: `/auth/register`, `/auth/login`, `/auth/me`, `/auth/logout`
- **Exhibitions**: GET `/exhibitions`, POST/PUT/DELETE `/exhibitions/{id}`
- **Bookings**: GET `/booking`, POST `/booking`, PUT/DELETE `/booking/{id}`
- **Users**: GET `/users`

## Project Structure

\`\`\`
app/
├── api/                    # API route handlers
├── auth/                   # Authentication pages
├── exhibitions/            # Exhibition pages
├── admin/                  # Admin pages
├── dashboard/              # Member dashboard
├── my-bookings/            # Booking management
└── layout.tsx             # Root layout

components/
├── navbar.tsx             # Top navigation
├── admin-sidebar.tsx      # Admin sidebar
├── toast-notification.tsx # Toast notifications
├── loading-spinner.tsx    # Loading state
├── empty-state.tsx        # Empty states
└── error-boundary.tsx     # Error handling

hooks/
├── use-auth.tsx          # Authentication context
└── use-mobile.ts         # Responsive utilities

lib/
└── api-client.ts         # API utilities
\`\`\`

## Key Features

### Authentication
- Secure JWT-based authentication
- httpOnly cookies for token storage
- Automatic token refresh
- Role-based access control

### Exhibitions
- Real-time booth availability tracking
- Advanced filtering by status and date
- Detailed exhibition information
- Image support for exhibition posters

### Bookings
- Multi-step booking process
- Booth type and quantity selection
- Booking confirmation and tracking
- Edit and delete functionality (with limits)
- Booking history and status tracking

### Admin Dashboard
- Real-time statistics
- Quick action shortcuts
- Responsive data tables
- Bulk operations support

## Styling

The application uses a custom color system defined in `globals.css`:

- **Primary**: Slate Navy (#1C2530)
- **Accent**: Muted Teal (#6AA8A2)
- **Surface**: Soft Gray (#F5F6F7)
- **Status Colors**: Green, Amber, Red, Blue (desaturated)

All colors are accessible and meet WCAG AA contrast requirements.

## Performance

- Server-side rendering for SEO
- Optimized bundle with code splitting
- Image optimization
- CSS-in-JS with Tailwind
- Efficient API calls with caching strategy

## Security

- HTTP-only cookies for authentication
- CSRF protection through Next.js
- Input validation on frontend
- API proxy through Next.js (prevents CORS issues)
- Role-based access control

## Future Enhancements

- Payment integration for booth booking
- Email notifications
- Advanced analytics and reporting
- Booth layout visualization
- Real-time notifications with WebSockets
- Multi-language support
- Dark mode toggle

## License

MIT
