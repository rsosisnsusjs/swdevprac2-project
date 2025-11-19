"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { apiCall } from "@/lib/api-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  Loader2,
  Trash2,
  Edit2,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";

interface Exhibition {
  _id: string;
  name: string;
  description: string;
  venue: string;
  startDate: string;
  durationDay: number;
  smallBoothQuota: number;
  bigBoothQuota: number;
}

export default function AdminExhibitionsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isLoading2, setIsLoading2] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router, user]);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const data = await apiCall("/exhibitions");
        setExhibitions(data.data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load exhibitions");
      } finally {
        setIsLoading2(false);
      }
    };

    if (isAuthenticated && user?.role === "admin") {
      fetchExhibitions();
    }
  }, [isAuthenticated, user]);

  const handleDelete = async (exhibitionId: string) => {
    if (!confirm("Are you sure you want to delete this exhibition?")) return;

    setDeletingId(exhibitionId);
    try {
      await apiCall(`/exhibitions/${exhibitionId}`, { method: "DELETE" });
      setExhibitions((prev) => prev.filter((ex) => ex._id !== exhibitionId));
    } catch (err: any) {
      alert(err.message || "Failed to delete exhibition");
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Manage Exhibitions
              </h1>
              <p className="text-text-secondary mt-1">
                Create, edit, and delete exhibitions
              </p>
            </div>
            <Link href="/admin/exhibitions/create">
              <Button className="bg-accent hover:bg-accent-hover gap-2">
                <Plus className="h-4 w-4" />
                Create Exhibition
              </Button>
            </Link>
          </div>
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

        {exhibitions.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-text-secondary mb-6">No exhibitions yet.</p>
            <Link href="/admin/exhibitions/create">
              <Button className="bg-accent hover:bg-accent-hover gap-2">
                <Plus className="h-4 w-4" />
                Create First Exhibition
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Venue
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Booths
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {exhibitions.map((exhibition) => (
                  <tr
                    key={exhibition._id}
                    className="border-b border-border hover:bg-surface"
                  >
                    <td className="px-6 py-4 text-foreground font-medium">
                      {exhibition.name}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {exhibition.venue}
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {format(new Date(exhibition.startDate), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-text-secondary text-sm">
                      S: {exhibition.smallBoothQuota}, B:{" "}
                      {exhibition.bigBoothQuota}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/exhibitions/${exhibition._id}/edit`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            disabled={deletingId === exhibition._id}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 border border-red-500"
                          onClick={() => handleDelete(exhibition._id)}
                          disabled={deletingId !== null}
                        >
                          {deletingId === exhibition._id && (
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
