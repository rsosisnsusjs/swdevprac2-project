"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.push("/dashboard");
    }
  };

  const userName = user?.name?.trim() ?? "";
  const initial = userName ? userName.charAt(0).toUpperCase() : "U";

  return (
    <header className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            {/* Mobile menu icon */}
            <div className="sm:hidden">
              <button className="p-2" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
            </div>

            {/* App icon + name */}
            <div className="flex items-center gap-2">
              {/* <AppIcon className="h-6 w-6" />{" "} */}
              <span className="text-xl font-semibold text-foreground">
                AppName
              </span>
            </div>
          </div>

          {/* Right: auth controls */}
          <div className="flex items-center gap-3">
            {isLoading && (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            )}
            {!isLoading && !isAuthenticated && (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <Button
                    size="sm"
                    className="hover:bg-accent-light hover:text-accent-light-foreground transition-colors"
                  >
                    Sign In
                  </Button>
                </Link>

                <Link href="/auth/register">
                  <Button
                    size="sm"
                    className="hover:bg-accent-light hover:text-accent-light-foreground transition-colors"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {!isLoading && isAuthenticated && (
              <div className="flex items-center gap-2">
                {/* Username — not clickable */}
                <span className="font-medium text-sm text-foreground">
                  {userName}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      aria-label={`Open user menu for ${userName || "User"}`}
                      className="flex items-center justify-center w-8 h-8 p-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="h-8 w-8 rounded-full border border-foreground/30 bg-background flex items-center justify-center text-sm">
                          {initial}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="min-w-40 p-1 bg-background border border-border shadow-md"
                  >
                    {/* My Booking */}
                    <DropdownMenuItem
                      asChild
                      className="flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 bg-background font-semibold hover:bg-accent-light focus:bg-accent-light"
                    >
                      <Link
                        href="/bookings"
                        className="flex items-center gap-2"
                      >
                        {/* <Notebook className="h-4 w-4" /> */}
                        My Booking
                      </Link>
                    </DropdownMenuItem>

                    {/* Logout */}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 bg-background font-semibold hover:bg-accent-light focus:bg-accent-light"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
