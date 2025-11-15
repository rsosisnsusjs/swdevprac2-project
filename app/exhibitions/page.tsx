'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { apiCall } from '@/lib/api-client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AlertCircle, Loader2, ArrowRight } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format } from 'date-fns'

interface Exhibition {
  _id: string
  name: string
  description: string
  venue: string
  startDate: string
  durationDay: number
  smallBoothQuota: number
  bigBoothQuota: number
  posterPicture?: string
}

export default function ExhibitionsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [filteredExhibitions, setFilteredExhibitions] = useState<Exhibition[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading2, setIsLoading2] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const data = await apiCall('/exhibitions')
        setExhibitions(data.data || [])
        setFilteredExhibitions(data.data || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load exhibitions')
      } finally {
        setIsLoading2(false)
      }
    }

    if (isAuthenticated) {
      fetchExhibitions()
    }
  }, [isAuthenticated])

  useEffect(() => {
    const filtered = exhibitions.filter(
      (ex) =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.venue.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredExhibitions(filtered)
  }, [searchTerm, exhibitions])

  if (isLoading || isLoading2) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-foreground">Exhibitions</h1>
          <p className="text-text-secondary mt-1">Browse and book exhibition booths</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search */}
        <div className="mb-8">
          <Input
            type="search"
            placeholder="Search exhibitions by name or venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {filteredExhibitions.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-text-secondary">
              {searchTerm ? 'No exhibitions found matching your search.' : 'No exhibitions available.'}
            </p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExhibitions.map((exhibition) => (
              <Card
                key={exhibition._id}
                className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                {exhibition.posterPicture && (
                  <img
                    src={exhibition.posterPicture || "/placeholder.svg"}
                    alt={exhibition.name}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-foreground mb-2">{exhibition.name}</h3>
                  <p className="text-text-secondary text-sm mb-4 flex-1">
                    {exhibition.description}
                  </p>

                  <div className="space-y-2 mb-6 text-sm">
                    <p className="text-text-secondary">
                      <span className="font-medium text-foreground">Venue:</span> {exhibition.venue}
                    </p>
                    <p className="text-text-secondary">
                      <span className="font-medium text-foreground">Dates:</span>{' '}
                      {format(new Date(exhibition.startDate), 'MMM dd, yyyy')} -{' '}
                      {format(
                        new Date(
                          new Date(exhibition.startDate).getTime() +
                            exhibition.durationDay * 24 * 60 * 60 * 1000
                        ),
                        'MMM dd, yyyy'
                      )}
                    </p>
                    <p className="text-text-secondary">
                      <span className="font-medium text-foreground">Booths Available:</span> Small:{' '}
                      {exhibition.smallBoothQuota}, Big: {exhibition.bigBoothQuota}
                    </p>
                  </div>

                  <Link href={`/exhibitions/${exhibition._id}`}>
                    <Button className="w-full bg-accent hover:bg-accent-hover gap-2">
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
