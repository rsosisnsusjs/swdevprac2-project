"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { apiCall } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Loader2, Trash2, Edit2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import Link from "next/link";

interface Booking {
  _id: string;
  exhibition: {
    _id: string;
    name: string;
    venue: string;
    startDate: string;
    durationDay: number;
  };
  boothType: "small" | "big";
  amount: number;
  createdAt: string;
}

export default function BookingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading2, setIsLoading2] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

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

    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

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
          <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
          <p className="text-text-secondary mt-1">
            Manage your booth reservations
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
            <p className="text-text-secondary mb-6">No bookings yet.</p>
            <Link href="/exhibitions">
              <Button className="bg-accent hover:bg-accent-hover">
                Browse Exhibitions
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card
                key={booking._id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      {booking.exhibition.name}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-text-secondary mb-4">
                      <p>
                        <span className="font-medium text-foreground">
                          Venue:
                        </span>{" "}
                        {booking.exhibition.venue}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">
                          Booth Type:
                        </span>{" "}
                        <span className="capitalize">{booking.boothType}</span>
                      </p>
                      <p>
                        <span className="font-medium text-foreground">
                          Quantity:
                        </span>{" "}
                        {booking.amount}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">
                          Booked:
                        </span>{" "}
                        {format(new Date(booking.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
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
                      <Trash2 className="h-4 w-4 stroke-red-500 " />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
