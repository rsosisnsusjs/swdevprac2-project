"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { apiCall } from "@/lib/api-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Loader2, Trash2, ArrowLeft, Edit2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";

interface Booking {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  exhibition: {
    name: string;
    venue: string;
  };
  boothType: "small" | "big";
  amount: number;
  createdAt: string;
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading2, setIsLoading2] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router, user]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await apiCall("/booking");
        setBookings(data.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load bookings");
      } finally {
        setIsLoading2(false);
      }
    };

    if (isAuthenticated && user?.role === "admin") {
      fetchBookings();
    }
  }, [isAuthenticated, user]);

  const handleDelete = async (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    setDeletingId(bookingId);
    try {
      await apiCall(`/booking/${bookingId}`, { method: "DELETE" });
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err: any) {
      alert(err.message || "Failed to delete booking");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading || isLoading2) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">All Bookings</h1>
          <p className="text-text-secondary mt-1">
            View and manage all booth bookings
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-text-secondary">No bookings yet.</p>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Exhibition
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Booth Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Booked Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b border-border hover:bg-surface"
                  >
                    <td className="px-6 py-4 text-foreground">
                      <div>
                        <p className="font-medium">{booking.user.name}</p>
                        <p className="text-xs text-text-secondary">
                          {booking.user.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {booking.exhibition.name}
                    </td>
                    <td className="px-6 py-4 text-text-secondary capitalize">
                      {booking.boothType}
                    </td>
                    <td className="px-6 py-4 text-foreground font-medium">
                      {booking.amount}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {format(new Date(booking.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/bookings/${booking._id}/edit`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            disabled={deletingId === booking._id}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 border border-red-500"
                          onClick={() => handleDelete(booking._id)}
                          disabled={deletingId !== null}
                        >
                          {deletingId === booking._id && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                          <Trash2 className="h-4 w-4 stroke-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
