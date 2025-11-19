"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const [open, setOpen] = useState(false);

  const userName = useMemo(() => user?.name?.trim() ?? "", [user?.name]);
  const initial = useMemo(
    () => (userName ? userName.charAt(0).toUpperCase() : "U"),
    [userName]
  );

  useEffect(() => {
    console.log("NAVBAR: user role", user?.role, "isAuth", isAuthenticated);
  }, [user?.role, isAuthenticated]);

  const handleLogout = async () => {
    try {
      setOpen(false);
      await logout();
    } finally {
      router.push("/dashboard");
    }
  };

  return (
    <header className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Image
                  src="/logo2.png"
                  alt="App Logo"
                  width={200}
                  height={67}
                  className="object-contain"
                />
              </Link>
            </div>
          </div>

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
                <span className="font-medium text-sm text-foreground">
                  {userName}
                </span>

                <DropdownMenu open={open} onOpenChange={setOpen}>
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
                    key={user?.role ?? "anon"}
                    align="end"
                    className="min-w-40 p-1 bg-background border border-border shadow-md"
                  >
                    {/* Admin Panel — ONLY for admin */}
                    {user?.role === "admin" && (
                      <DropdownMenuItem
                        asChild
                        className="flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 bg-background font-semibold hover:bg-accent-light focus:bg-accent-light"
                      >
                        <Link href="/admin" className="flex items-center gap-2">
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {/* My Booking */}
                    {user?.role === "member" && (
                      <DropdownMenuItem
                        asChild
                        className="flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 bg-background font-semibold hover:bg-accent-light focus:bg-accent-light"
                      >
                        <Link
                          href="/exhibitions"
                          className="flex items-center gap-2"
                        >
                          Exhibitions
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {/* My Booking */}
                    {user?.role === "member" && (
                      <DropdownMenuItem
                        asChild
                        className="flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 bg-background font-semibold hover:bg-accent-light focus:bg-accent-light"
                      >
                        <Link
                          href="/bookings"
                          className="flex items-center gap-2"
                        >
                          My Bookings
                        </Link>
                      </DropdownMenuItem>
                    )}

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
