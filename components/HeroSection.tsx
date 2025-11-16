"use client"

export function HeroSection({ user }: { user: any }) {
  return (
    <div className="bg-gradient-to-br from-accent via-accent-hover to-accent-light text-white shadow-inner">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <h1 className="text-3xl md:text-4xl font-extrabold drop-shadow-sm">
          {user ? `Welcome back, ${user.name}!` : "Welcome to BookYourBooth"}
        </h1>

        <p className="text-white/90 text-lg mt-2">
          {user
            ? user.role === "admin"
              ? "Manage exhibitions and oversee all bookings"
              : "Discover exhibitions and book your booth"
            : "Explore exhibitions and book the perfect booth today"}
        </p>
      </div>
    </div>
  )
}
