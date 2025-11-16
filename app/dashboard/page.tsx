"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, BookOpen, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     router.push("/auth/login");
  //   }
  // }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  // if (!isAuthenticated) {
  //   return null;
  // }

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {/* <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name}</h1>
            <p className="text-text-secondary mt-1">Member since {new Date().getFullYear()}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div> */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Browse Exhibitions Card */}
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Browse Exhibitions
                </h2>
                <p className="text-text-secondary mt-2">
                  Discover and book booths at upcoming exhibitions
                </p>
              </div>
              <div className="p-3 bg-accent-light rounded-lg">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
            </div>
            <Link href="/exhibitions">
              <Button className="w-full bg-accent hover:bg-accent-hover">
                View Exhibitions
              </Button>
            </Link>
          </Card>

          {/* My Bookings Card */}
          <Card className="p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  My Bookings
                </h2>
                <p className="text-text-secondary mt-2">
                  Manage your booth reservations and bookings
                </p>
              </div>
              <div className="p-3 bg-accent-light rounded-lg">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
            </div>
            <Link href="/bookings">
              <Button className="w-full bg-accent hover:bg-accent-hover">
                View Bookings
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
