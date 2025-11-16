"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, BookOpen, Users, LogOut } from "lucide-react";
import { apiCall } from "@/lib/api-client";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [stats, setStats] = useState({
    exhibitions: 0,
    bookings: 0,
    users: 0,
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router, user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [exhibitionsData, bookingsData] = await Promise.all([
          apiCall("/exhibitions"),
          apiCall("/booking"),
        ]);
        setStats({
          exhibitions: exhibitionsData.count || 0,
          bookings: bookingsData.count || 0,
          users: 0,
        });
      } catch (error) {}
    };

    if (isAuthenticated && user?.role === "admin") {
      fetchStats();
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

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
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-text-secondary mt-1">Welcome, {user?.name}</p>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-2">
                  Total Exhibitions
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.exhibitions}
                </p>
              </div>
              <div className="p-3 bg-accent-light rounded-lg">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-text-secondary text-sm mb-2">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {stats.bookings}
                </p>
              </div>
              <div className="p-3 bg-accent-light rounded-lg">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/admin/exhibitions">
            <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <Calendar className="h-8 w-8 text-accent mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">
                Manage Exhibitions
              </h2>
              <p className="text-text-secondary">
                Create, edit, and delete exhibitions
              </p>
            </Card>
          </Link>

          <Link href="/admin/bookings">
            <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <BookOpen className="h-8 w-8 text-accent mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">
                View All Bookings
              </h2>
              <p className="text-text-secondary">
                Review and manage all booth bookings
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
